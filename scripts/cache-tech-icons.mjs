// Explicit refresh command; production builds use the committed assets offline.
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = await fs.readFile(path.join(root, "src/components/sections/tech-stack.tsx"), "utf8");
const icons = [...source.matchAll(/slug: "([^"]+)", color: "(#[0-9a-fA-F]+)"/g)];
const aliases = { jwt: "jsonwebtokens", mobilenetssd: "tensorflow", dht11: "arduino", mq2: "arduino", pulsesensor: "raspberrypi", flamesensor: "raspberrypi" };
const directory = path.join(root, "public/images/tech-icons");
await fs.mkdir(directory, { recursive: true });
const readJson = async filename => JSON.parse(await fs.readFile(filename, "utf8").catch(() => "{}"));
const manifest = await readJson(path.join(root, "src/generated/tech-icons.json"));
const provenance = await readJson(path.join(directory, "sources.json"));
for (let i = 0; i < icons.length; i += 5) {
  await Promise.all(icons.slice(i, i + 5).map(async ([, slug, color]) => {
    const url = slug === "java" ? "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" : `https://cdn.simpleicons.org/${aliases[slug] || slug}/${color.slice(1)}`;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const svg = await response.text();
      if (!svg.includes("<svg") || /<script|<foreignObject|onload\s*=/i.test(svg) || svg.length > 131072) throw new Error("Unexpected SVG");
      const hash = createHash("sha256").update(svg).digest("hex").slice(0, 12);
      const filename = `${slug}-${hash}.svg`;
      await fs.writeFile(path.join(directory, filename), svg);
      manifest[slug] = `/images/tech-icons/${filename}`;
      provenance[slug] = url;
    } catch (error) { console.log(`${slug}: retaining the local initial fallback (${error.message})`); }
  }));
}
const sorted = object => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
await fs.mkdir(path.join(root, "src/generated"), { recursive: true });
await fs.writeFile(path.join(root, "src/generated/tech-icons.json"), JSON.stringify(sorted(manifest), null, 2) + "\n");
await fs.writeFile(path.join(directory, "sources.json"), JSON.stringify(sorted(provenance), null, 2) + "\n");
console.log(`${Object.keys(manifest).length}/${icons.length} SVG icons cached locally.`);
