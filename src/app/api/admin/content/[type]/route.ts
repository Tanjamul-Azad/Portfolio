import { NextRequest, NextResponse } from "next/server";
import { isAdminEnabled, isRequestAuthed } from "@/lib/admin/auth";
import { isContentType, readContent, writeContent } from "@/lib/admin/content";
import { schemas } from "@/lib/admin/schemas";

export const runtime = "nodejs";

function guard(req: NextRequest): NextResponse | null {
  if (!isAdminEnabled()) return new NextResponse(null, { status: 404 });
  if (!isRequestAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ type: string }> }) {
  const blocked = guard(req);
  if (blocked) return blocked;

  const { type } = await ctx.params;
  if (!isContentType(type)) {
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  }

  try {
    return NextResponse.json({ data: await readContent(type) });
  } catch {
    return NextResponse.json({ error: "Could not read content." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ type: string }> }) {
  const blocked = guard(req);
  if (blocked) return blocked;

  const { type } = await ctx.params;
  if (!isContentType(type)) {
    return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = schemas[type].safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed. Some fields are missing or malformed.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const result = await writeContent(type, parsed.data);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    // GitHub failures carry an actionable message (stale file, bad token); keep
    // it, since the person seeing it is the one who can fix it.
    const message =
      error instanceof Error && error.message ? error.message : "Could not save content.";
    console.error("[admin] save failed:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
