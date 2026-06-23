import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminEnabled } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST() {
  if (!isAdminEnabled()) return new NextResponse(null, { status: 404 });

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
