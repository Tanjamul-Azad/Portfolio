import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = path.join(root, "public");
const outputDir = path.join(publicDir, "images/optimized");
const sources = new Set();
const bitmap = /^\/images\/.*\.(?:png|jpe?g|webp|avif)$/i;
function collect(value) {
  if (typeof value === "string" && bitmap.test(value) && !value.startsWith("/images/activities/") && !value.startsWith("/images/optimized/")) sources.add(value);
  else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === "object") Object.values(value).forEach(collect);
}
for (const file of await fs.readdir(path.join(root, "src/content"))) {
  if (file.endsWith(".json")) collect(JSON.parse(await fs.readFile(path.join(root, "src/content", file), "utf8")));
}
collect("/images/profile.jpg");
await fs.mkdir(outputDir, { recursive: true });
const manifest = {};
let sourceBytes = 0;
let cardBytes = 0;
for (const src of [...sources].sort()) {
  const sourcePath = path.resolve(publicDir, decodeURIComponent(src.slice(1)));
  if (!sourcePath.startsWith(publicDir + path.sep)) throw new Error(`Image outside public directory: ${src}`);
  const input = await fs.readFile(sourcePath);
  const metadata = await sharp(input).metadata();
  if (metadata.pages > 1) continue;
  const width = metadata.autoOrient?.width || metadata.width;
  const height = metadata.autoOrient?.height || metadata.height;
  if (!width || !height) throw new Error(`No image dimensions: ${src}`);
  const recipe = JSON.stringify({ version: 1, quality: 90, sharp: sharp.versions.sharp, webp: sharp.versions.webp, vips: sharp.versions.vips });
  const hash = createHash("sha256").update(input).update(recipe).digest("hex").slice(0, 20);
  const widths = [...new Set([96, 320, 640, 960, 1440, 1920, Math.min(width, 2560)].filter(w => w <= width && w <= 2560))].sort((a, b) => a - b);
  const variants = [];
  for (const size of widths) {
    const filename = `${hash}-${size}.webp`;
    const destination = path.join(outputDir, filename);
    try { await fs.access(destination); }
    catch {
      const temporary = `${destination}.tmp`;
      if (metadata.format === "webp" && size === width && metadata.orientation === undefined) await fs.writeFile(temporary, input);
      else await sharp(input).rotate().resize({ width: size, withoutEnlargement: true }).webp({ quality: 90, smartSubsample: true }).toFile(temporary);
      await fs.rename(temporary, destination);
    }
    variants.push({ width: size, src: `/images/optimized/${filename}`, bytes: (await fs.stat(destination)).size });
  }
  const blur = await sharp(input).rotate().resize({ width: 12 }).webp({ quality: 35 }).toBuffer();
  manifest[src] = { width, height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`, variants };
  sourceBytes += input.length;
  cardBytes += (variants.find(v => v.width >= 640) || variants.at(-1)).bytes;
}
await fs.mkdir(path.join(root, "src/generated"), { recursive: true });
const manifestPath = path.join(root, "src/generated/image-manifest.json");
await fs.writeFile(`${manifestPath}.tmp`, JSON.stringify(manifest, null, 2) + "\n");
await fs.rename(`${manifestPath}.tmp`, manifestPath);
console.log(`Images: ${Object.keys(manifest).length} sources; ${(sourceBytes / 1048576).toFixed(2)} MiB originals; ${(cardBytes / 1048576).toFixed(2)} MiB at card size. Originals retained.`);
