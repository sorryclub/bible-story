import { ImageResponse } from "next/og";

// 공유 미리보기(카카오톡/페이스북/슬랙 등) 이미지
export const alt = "진리 BIBLE — 성경 이야기를 한눈에";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family, text) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
  );
  if (resource) {
    const res = await fetch(resource[1]);
    if (res.status === 200) return res.arrayBuffer();
  }
  throw new Error("폰트 로드 실패");
}

export default async function Image() {
  const font = await loadGoogleFont("Noto+Sans+KR:wght@900", "진리성경이야기를한눈에");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1E3A8A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Noto Sans KR",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 120, fontWeight: 900, color: "#ffffff", letterSpacing: -2 }}>
            진리
          </span>
          <span style={{ fontSize: 36, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: 8, textTransform: "uppercase" }}>
            BIBLE
          </span>
        </div>
        <p style={{ fontSize: 30, color: "rgba(255,255,255,0.55)", marginTop: 24, fontWeight: 500 }}>
          성경 이야기를 한눈에
        </p>
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
