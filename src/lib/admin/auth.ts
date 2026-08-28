import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000;

/**
 * The editor runs locally always, and on the deployed site only when it is fully
 * configured to do so.
 *
 * Exposing an editor publicly turns it into an attack surface, so production
 * requires every piece to be present and deliberate: a password, a session
 * secret that is not derived from that password, and a GitHub token (without
 * which a save could not persist anyway). Missing any one of them and the admin
 * routes 404 exactly as before — the safe state is the default, not something
 * you have to remember to switch on.
 */
export function isAdminEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return true;

  return Boolean(
    process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_SESSION_SECRET &&
      process.env.GITHUB_TOKEN
  );
}

/** True when running on the deployed site rather than `next dev`. */
export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function getSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit) return explicit;

  // Falling back to the password would make one leak compromise both the login
  // and every existing session, so production requires a separate secret.
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set when the editor is enabled in production.");
  }
  return process.env.ADMIN_PASSWORD || "insecure-dev-secret-change-me";
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
