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
            "radial-gradient(800px 420px at 90% 10%, rgba(15,108,189,0.22), transparent 55%), linear-gradient(145deg, #f3f5f8 0%, #e7ecf2 100%)",
          color: "#0e151b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 6, color: "#0f6cbd", textTransform: "uppercase" }}>
          Opuskiln
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 0.92 }}>
            DriverScan
          </div>
          <div style={{ fontSize: 32, color: "#5d6b78", maxWidth: 760 }}>
            Scan, initiate, and update Windows drivers — including OEM and GPU vendors.
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#0f6cbd" }}>driverscan.opuskiln.com</div>
      </div>
    ),
    { ...size },
  );
}
