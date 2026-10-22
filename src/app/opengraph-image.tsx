import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "@/config";

export const alt = `Tanzamul Azad — ${siteConfig.author.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function OpenGraphImage() {
  const portrait = await readFile(path.join(process.cwd(), "public/images/profile.jpg"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#090b0e", color: "#f4f4f5", padding: "70px", alignItems: "center", justifyContent: "space-between", borderBottom: "10px solid #14b8a6" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "710px" }}>
        <div style={{ display: "flex", fontSize: 24, color: "#5eead4", marginBottom: 28 }}>PORTFOLIO · RESEARCH · ENGINEERING</div>
        <div style={{ display: "flex", fontSize: 82, fontWeight: 700, lineHeight: 1.05 }}>Tanzamul Azad</div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 28, lineHeight: 1.4, color: "#d4d4d8", marginTop: 30 }}>{siteConfig.author.role}</div>
        <div style={{ display: "flex", fontSize: 25, marginTop: 48, color: "#5eead4" }}>{new URL(siteConfig.url).hostname}</div>
      </div>
      <img src={`data:image/jpeg;base64,${portrait.toString("base64")}`} alt="" width={250} height={300} style={{ objectFit: "cover", borderRadius: 28 }} />
    </div>, size,
  );
}
