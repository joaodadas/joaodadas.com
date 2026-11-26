import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#070605",
          color: "#e9e3db",
        }}
      >
        <div style={{ fontSize: 76, letterSpacing: -2 }}>João Vitor Dadas</div>
        <div
          style={{
            width: 64,
            height: 1,
            backgroundColor: "#3d362f",
            marginTop: 36,
            marginBottom: 36,
          }}
        />
        <div style={{ fontSize: 30, color: "#8a8178", letterSpacing: 6 }}>
          FOUNDER &amp; TECH LEAD
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 24,
            color: "#5c554d",
          }}
        >
          joaodadas.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
