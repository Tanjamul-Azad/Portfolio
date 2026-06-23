import path from "node:path";
import { promises as fs } from "node:fs";

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

export async function readContent(type: ContentType): Promise<unknown> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, `${type}.json`), "utf8");
  return JSON.parse(raw);
}

/** Atomic write: stage to a temp file then rename, so a crash can't truncate. */
export async function writeContent(type: ContentType, data: unknown): Promise<void> {
  const file = path.join(CONTENT_DIR, `${type}.json`);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}
