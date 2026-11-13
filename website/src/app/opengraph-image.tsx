import { ImageResponse } from "next/og";

export const alt = "DriverScan for Windows";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(900px 480px at 85% 15%, rgba(11,127,134,0.18), transparent 55%), linear-gradient(145deg, #eef2f6 0%, #e2e8f0 55%, #dce7ec 100%)",
          color: "#10151c",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            color: "#0b7f86",
            textTransform: "uppercase",
          }}
        >
          Opuskiln
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 0.95 }}>
            DriverScan
          </div>
          <div style={{ fontSize: 34, color: "#5c6b7a", maxWidth: 780 }}>
            Scan, initiate, and update Windows drivers — including OEM and GPU vendors.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#0b7f86" }}>driverscan.opuskiln.com</div>
      </div>
    ),
    { ...size },
  );
}
