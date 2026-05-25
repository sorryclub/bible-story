import { ImageResponse } from "next/og";

// 브라우저 탭 파비콘 — 네이비 타일 + 흰 파테 크로스
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1E3A8A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
        }}
      >
        <svg width="20" height="23" viewBox="3 1.5 18 21" fill="none">
          <path
            d="M9.5 2 L14.5 2 L13.4 8.1 L20.5 7 L20.5 12 L13.4 10.9 L14.5 22 L9.5 22 L10.6 10.9 L3.5 12 L3.5 7 L10.6 8.1 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
