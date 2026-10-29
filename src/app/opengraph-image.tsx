import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "@/config";

export const alt = `Tanzamul Azad — ${siteConfig.author.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

// The hero portrait, with its golden backdrop, so the link card matches the site.
const PORTRAIT = { width: 496, height: 620 };
const ACCENT = "#fbbf24";

export default async function OpenGraphImage() {
  const portrait = await readFile(path.join(process.cwd(), "public/images/og-portrait.jpg"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#070707", color: "#f4f4f5", justifyContent: "space-between", borderBottom: `10px solid ${ACCENT}` }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "704px", padding: "0 0 0 72px" }}>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 2, color: ACCENT, marginBottom: 30 }}>PORTFOLIO · RESEARCH · ENGINEERING</div>
        <div style={{ display: "flex", fontSize: 78, fontWeight: 700, lineHeight: 1.04, whiteSpace: "nowrap" }}>Tanzamul Azad</div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 25, lineHeight: 1.4, color: "#d4d4d8", marginTop: 30 }}>{siteConfig.author.role}</div>
        <div style={{ display: "flex", fontSize: 26, marginTop: 52, color: ACCENT }}>{new URL(siteConfig.url).hostname}</div>
      </div>
      <img src={`data:image/jpeg;base64,${portrait.toString("base64")}`} alt="" width={PORTRAIT.width} height={PORTRAIT.height} style={{ objectFit: "cover" }} />
    </div>, size,
  );
}
