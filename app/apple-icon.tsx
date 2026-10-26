import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#3a2a22" }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path d="M14 22h28v12c0 7-5 12-12 12h-4c-7 0-12-5-12-12V22Z" fill="#d9a13b" />
          <path d="M42 26h3a6 6 0 0 1 0 12h-3" fill="none" stroke="#d9a13b" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 14c-2-2 2-4 0-6M30 14c-2-2 2-4 0-6" fill="none" stroke="#fbf3e4" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size
  );
}
