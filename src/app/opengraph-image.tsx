export const dynamic = "force-static";

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #141414 0%, #0a0a0a 100%)",
          color: "#fdfaf5",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(217,199,163,0.28)",
            filter: "blur(80px)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={logoSrc} alt="" width={340} height={150} />
          </div>
          <div style={{ marginTop: 50, fontSize: 56, lineHeight: 1.1, maxWidth: 900 }}>Barınızın lezzet ortağı.</div>
          <div style={{ marginTop: 24, fontSize: 28, color: "#efe3d2", fontFamily: "sans-serif" }}>
            Şurup · Sos · Püre · Kahve · Sıcak Çikolata · Bitki Çayı · Bar Ürünleri
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
