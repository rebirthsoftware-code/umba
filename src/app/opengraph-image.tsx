import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #2b1b12 0%, #160d08 100%)",
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
            background: "rgba(226,168,75,0.28)",
            filter: "blur(80px)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 90,
                borderRadius: 9999,
                background: "linear-gradient(135deg,#e2a84b,#b4761f)",
                transform: "rotate(-32deg)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>umba</span>
              <span style={{ fontSize: 22, letterSpacing: 10, color: "#e2a84b", fontFamily: "sans-serif" }}>COFFEE</span>
            </div>
          </div>
          <div style={{ marginTop: 50, fontSize: 56, lineHeight: 1.1, maxWidth: 900 }}>Barınızın lezzet ortağı.</div>
          <div style={{ marginTop: 24, fontSize: 28, color: "#efe3d2", fontFamily: "sans-serif" }}>
            Şurup · Sos · Püre · Kahve · Sıcak Çikolata · Bar Ürünleri
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
