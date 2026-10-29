import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";

// Explicit routing output: no app server, framework or portfolio copy is deployed.
// Only the Search Console verification files are served, so the old hostname
// can be verified for Change of Address; every other path redirects.
const output = new URL("./.vercel/output/", import.meta.url);
const portfolioPublic = new URL("../../public/", import.meta.url);
mkdirSync(new URL("static/", output), { recursive: true });
for (const file of readdirSync(portfolioPublic).filter((name) => /^google[0-9a-f]+\.html$/.test(name))) {
  copyFileSync(new URL(file, portfolioPublic), new URL(`static/${file}`, output));
}
writeFileSync(new URL("config.json", output), JSON.stringify({
  version: 3,
  routes: [
    // Verification still works with noindex; this keeps the files out of search results.
    { src: "/google[0-9a-f]+\\.html", headers: { "X-Robots-Tag": "noindex" }, continue: true },
    { handle: "filesystem" },
    {
      src: "/(.*)",
      status: 308,
      headers: { Location: "https://tanzamul.dev/$1" },
    },
  ],
}, null, 2));
