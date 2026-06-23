import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000;

/**
 * The editor is intentionally local-only: it is fully disabled in production so
 * nothing editable is ever exposed on the deployed (Vercel) site. Edits happen
 * during `npm run dev`, then get published via `git push`.
 */
export function isAdminEnabled(): boolean {
  // Enabled only during local development (`next dev`). Every production build or
  // runtime — including Vercel — reports "production", so all admin routes 404.
  return process.env.NODE_ENV === "development";
}

export function isPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "insecure-dev-secret-change-me"
  );
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })).toString(
    "base64url"
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** Constant-time password check (hashes equalise length before comparison). */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const ha = crypto.createHash("sha256").update(String(input)).digest();
  const hb = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** For route handlers — reads the cookie off the incoming request. */
export function isRequestAuthed(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}
