import { mkdirSync, writeFileSync } from "node:fs";

// Explicit routing output: no app server, framework or portfolio copy is deployed.
const output = new URL("./.vercel/output/", import.meta.url);
mkdirSync(new URL("static/", output), { recursive: true });
writeFileSync(new URL("config.json", output), JSON.stringify({
  version: 3,
  routes: [{
    src: "/(.*)",
    status: 308,
    headers: { Location: "https://tanzamul.dev/$1" },
  }],
}, null, 2));
