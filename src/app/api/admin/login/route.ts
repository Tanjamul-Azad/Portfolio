import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isAdminEnabled,
  isPasswordConfigured,
  isProductionRuntime,
  verifyPassword,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

// ── Brute-force protection ────────────────────────────────────────────────
// A single password is the only thing in front of the editor now that it is
// reachable on the deployed site, so unlimited guesses are not acceptable.
// Attempts are tracked per IP and the window extends on every failure, so
// sustained guessing locks out for longer rather than resetting on a timer.
const attempts = new Map<string, { count: number; until: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_ENTRIES = 500;

function prune(now: number) {
  if (attempts.size < MAX_ENTRIES) return;
  for (const [key, value] of attempts) {
    if (value.until < now) attempts.delete(key);
  }
}

function isLockedOut(ip: string): boolean {
  const record = attempts.get(ip);
  if (!record) return false;
  if (Date.now() > record.until) {
    attempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const now = Date.now();
  prune(now);
  const record = attempts.get(ip);
  attempts.set(ip, {
    count: (record && now <= record.until ? record.count : 0) + 1,
    until: now + WINDOW_MS,
  });
}

export async function POST(req: NextRequest) {
  if (!isAdminEnabled()) return new NextResponse(null, { status: 404 });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isLockedOut(ip)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  if (!isPasswordConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set. Add it to .env.local and restart `npm run dev`." },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.password || !verifyPassword(body.password)) {
    recordFailure(ip);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(ip);

  const res = NextResponse.json({ success: true });
  const secure = isProductionRuntime();
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    // Deployed over HTTPS the cookie must never travel in the clear; locally the
    // editor runs on plain http://localhost, where `secure` would drop it.
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
