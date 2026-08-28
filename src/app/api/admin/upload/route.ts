import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { promises as fs } from "node:fs";
import { isAdminEnabled, isRequestAuthed } from "@/lib/admin/auth";
import { commitFile, getGitHubConfig } from "@/lib/admin/github";

export const runtime = "nodejs";

const ALLOWED = /\.(png|jpe?g|webp|gif|svg|avif|mp4|webm)$/i;
const FOLDERS = new Set(["projects", "profile", "blog", "achievements", "misc"]);
const MAX_BYTES = 50 * 1024 * 1024; // 50MB (covers the profile video)

export async function POST(req: NextRequest) {
  if (!isAdminEnabled()) return new NextResponse(null, { status: 404 });
  if (!isRequestAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  const folderRaw = String(form.get("folder") || "misc");
  const folder = FOLDERS.has(folderRaw) ? folderRaw : "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.test(file.name)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 50MB)." }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const base =
    path
      .basename(file.name, ext)
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "file";
  const name = `${base}-${Date.now()}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicPath = `/images/${folder}/${name}`;

  // Same split as content: on the deployed site the filesystem is read-only and
  // per-invocation, so the upload has to be committed to survive.
  const cfg = process.env.NODE_ENV === "production" ? getGitHubConfig() : null;
  if (cfg) {
    try {
      await commitFile(cfg, {
        path: `public/images/${folder}/${name}`,
        contentBase64: buffer.toString("base64"),
        message: `content: upload ${name} via admin editor`,
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : "Could not save the file.";
      console.error("[admin] upload failed:", error);
      return NextResponse.json({ error: message }, { status: 500 });
    }
    return NextResponse.json({ path: publicPath, pendingDeploy: true });
  }

  const destDir = path.join(process.cwd(), "public", "images", folder);
  try {
    await fs.mkdir(destDir, { recursive: true });
    await fs.writeFile(path.join(destDir, name), buffer);
  } catch {
    return NextResponse.json({ error: "Could not save the file." }, { status: 500 });
  }

  return NextResponse.json({ path: publicPath, pendingDeploy: false });
}
