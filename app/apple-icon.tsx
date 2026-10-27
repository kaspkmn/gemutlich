import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505" }}>
        <svg width="130" height="130" viewBox="0 0 64 64">
          <path d="M32 8 52 16v15c0 11.5-8.3 20.3-20 23.5C20.3 51.3 12 42.5 12 31V16l20-8Z" fill="#e3233a" />
          <path d="m23 28 9 9 9-9" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size
  );
}
