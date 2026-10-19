import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../public/images/activities/", import.meta.url));
const posters = ["nasa-space-apps-2026.png", "hsil-official-2026.png", "ibm-bob-2026.jpg", "infinity-ai-buildfest-2026.jpg"];
for (const file of posters) {
  const stem = file.replace(/\.[^.]+$/, "");
  const result = await sharp(join(root, file)).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(root, `${stem}-card-v1.webp`));
  console.log(`${stem}: ${result.size} bytes (card)`);
}
for (const file of [...posters, "hsil-selection-2026.png", "hsil-team-2026.png"]) {
  const stem = file.replace(/\.[^.]+$/, "");
  const result = await sharp(join(root, file)).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 88 }).toFile(join(root, `${stem}-preview-v1.webp`));
  console.log(`${stem}: ${result.size} bytes (gallery)`);
}
