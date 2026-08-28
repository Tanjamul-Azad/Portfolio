import path from "node:path";
import { promises as fs } from "node:fs";
import { commitFile, getGitHubConfig, readFileFromGitHub } from "./github";

/** Every editable content area. Each maps to src/content/<type>.json. */
export const CONTENT_TYPES = [
  "site",
  "hero",
  "about",
  "now",
  "sections",
  "tech-stack",
  "projects",
  "experiences",
  "achievements",
  "testimonials",
  "blog",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export function isContentType(value: string): value is ContentType {
  return (CONTENT_TYPES as readonly string[]).includes(value);
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

/** Repository-relative path, which is what the GitHub contents API wants. */
function repoPath(type: ContentType): string {
  return `src/content/${type}.json`;
}

/**
 * Local dev writes to disk; the deployed site commits to GitHub.
 *
 * On Vercel the filesystem is read-only and per-invocation, and the content JSON
 * is imported at build time — so a runtime write could neither persist nor
 * change what renders. Committing puts the change where it actually takes
 * effect and lets the deploy hook rebuild.
 */
function shouldCommitToGitHub(): boolean {
  return process.env.NODE_ENV === "production" && getGitHubConfig() !== null;
}

export async function readContent(type: ContentType): Promise<unknown> {
  if (shouldCommitToGitHub()) {
    const cfg = getGitHubConfig()!;
    // Read through GitHub too, so the editor shows the branch's current state
    // rather than whatever was bundled at the last build.
    const raw = await readFileFromGitHub(cfg, repoPath(type));
    if (raw !== null) return JSON.parse(raw);
  }
  const raw = await fs.readFile(path.join(CONTENT_DIR, `${type}.json`), "utf8");
  return JSON.parse(raw);
}

export interface WriteResult {
  /** Set when the change was committed and a rebuild is pending. */
  commitUrl?: string | null;
  pendingDeploy: boolean;
}

export async function writeContent(type: ContentType, data: unknown): Promise<WriteResult> {
  const serialised = JSON.stringify(data, null, 2) + "\n";

  if (shouldCommitToGitHub()) {
    const cfg = getGitHubConfig()!;
    const { commitUrl } = await commitFile(cfg, {
      path: repoPath(type),
      contentBase64: Buffer.from(serialised, "utf8").toString("base64"),
      message: `content: update ${type} via admin editor`,
    });
    return { commitUrl, pendingDeploy: true };
  }

  // Atomic write: stage to a temp file then rename, so a crash can't truncate.
  const file = path.join(CONTENT_DIR, `${type}.json`);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, serialised, "utf8");
  await fs.rename(tmp, file);
  return { pendingDeploy: false };
}
