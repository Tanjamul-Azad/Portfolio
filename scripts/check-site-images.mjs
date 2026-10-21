import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const assets = JSON.parse(await fs.readFile(path.join(root, "src/generated/image-manifest.json"), "utf8"));
let variants = 0;
for (const [src, asset] of Object.entries(assets)) {
  const original = await sharp(path.join(root, "public", src)).metadata();
  const hasTransparency = original.hasAlpha && !(await sharp(path.join(root, "public", src)).stats()).isOpaque;
  assert.equal(asset.width, original.autoOrient?.width || original.width, src);
  assert.equal(asset.height, original.autoOrient?.height || original.height, src);
  let previousWidth = 0;
  for (const variant of asset.variants) {
    const file = path.join(root, "public", variant.src);
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.format, "webp", variant.src);
    assert.equal(metadata.width, variant.width, variant.src);
    assert.ok(variant.width > previousWidth && variant.width <= asset.width, variant.src);
    assert.ok(Math.abs(metadata.height - asset.height * metadata.width / asset.width) <= 1, variant.src);
    assert.equal((await fs.stat(file)).size, variant.bytes, variant.src);
    if (hasTransparency) assert.ok(metadata.hasAlpha, variant.src);
    previousWidth = variant.width;
    variants++;
  }
}
console.log(`Validated ${Object.keys(assets).length} original images and ${variants} WebP variants: dimensions, aspect ratios, alpha channels, files and byte counts.`);
