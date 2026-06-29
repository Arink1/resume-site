import { ImageResponse } from "next/og";

export const alt =
  "Arin Karabulut, Software/AI Developer & Insurance Broker building production software for sales teams.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #050816 0%, #0b0f24 50%, #1a1130 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#a78bfa",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          arinkarabulut.com
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Arin Karabulut
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 44,
            fontWeight: 600,
            color: "#cbd5e1",
            marginBottom: 32,
          }}
        >
          Software/AI Developer & Insurance Broker
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: 1000,
          }}
        >
          Building production software for sales teams. Calling and dialer
          platforms tuned for higher pickup rates and conversions.
        </div>
      </div>
    ),
    { ...size }
  );
}
