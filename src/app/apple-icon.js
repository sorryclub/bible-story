import { ImageResponse } from "next/og";

// iOS 홈화면 아이콘 — 네이비 타일 + 흰 "진" 글자
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

async function loadGoogleFont(family, text) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (resource) {
    const res = await fetch(resource[1]);
    if (res.status === 200) return res.arrayBuffer();
  }
  throw new Error("폰트 로드 실패");
}

export default async function AppleIcon() {
  const font = await loadGoogleFont("Noto+Sans+KR:wght@900", "진");

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
          fontFamily: "Noto Sans KR",
        }}
      >
        <span style={{ fontSize: 110, fontWeight: 900, color: "#ffffff" }}>
          진
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Noto Sans KR", data: font, style: "normal", weight: 900 },
      ],
    }
  );
}
