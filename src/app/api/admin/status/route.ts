import { NextResponse } from "next/server";
import { isAdminEnabled } from "@/lib/admin/auth";

export const runtime = "nodejs";

/**
 * Whether the editor is reachable at all — not whether the caller is logged in.
 *
 * Exists so client components (the navbar, rendered on every page) can decide
 * whether to show the edit icon without importing `isAdminEnabled()` directly,
 * which reads server-only env vars via node:crypto and would break the client
 * bundle if pulled in through a shared import path.
 *
 * Unauthenticated on purpose: this reveals only whether /admin exists, and
 * hitting /admin directly already reveals that via its 307/404 status, so
 * there is nothing here an anonymous visitor could not already learn.
 */
export async function GET() {
  return NextResponse.json(
    { enabled: isAdminEnabled() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
