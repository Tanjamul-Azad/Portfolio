import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isAdminEnabled,
  isPasswordConfigured,
  verifyPassword,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAdminEnabled()) return new NextResponse(null, { status: 404 });

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
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // local-only editor; always runs on http://localhost
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
