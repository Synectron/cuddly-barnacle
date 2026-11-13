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
            "radial-gradient(900px 500px at 80% 20%, rgba(47,214,162,0.28), transparent 55%), linear-gradient(145deg, #061018 0%, #0c1c28 55%, #07131c 100%)",
          color: "#d7e6ef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#2fd6a2", textTransform: "uppercase" }}>
          SoftCoe
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 0.95 }}>
            DriverScan
          </div>
          <div style={{ fontSize: 34, color: "#8aa3b5", maxWidth: 780 }}>
            Scan, initiate, and update Windows drivers — including OEM and GPU vendors.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#2fd6a2" }}>driverscan.softcoe.com</div>
      </div>
    ),
    { ...size },
  );
}
