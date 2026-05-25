import { ImageResponse } from "next/og";

// 공유 미리보기(카카오톡/페이스북/슬랙 등) 이미지
export const alt = "진리";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Google Fonts에서 필요한 글자만 서브셋으로 받아온다(한글 렌더링용).
// Node fetch UA에는 truetype(ttf)으로 응답하므로 Satori가 처리 가능.
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
  const font = await loadGoogleFont("Nanum+Myeongjo:wght@800", "진리");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <svg width="170" height="230" viewBox="3 1.5 18 21" fill="none">
          <path
            d="M9.5 2 L14.5 2 L13.4 8.1 L20.5 7 L20.5 12 L13.4 10.9 L14.5 22 L9.5 22 L10.6 10.9 L3.5 12 L3.5 7 L10.6 8.1 Z"
            fill="#1E3A8A"
          />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 270,
            fontWeight: 800,
            color: "#1E3A8A",
            fontFamily: "Nanum Myeongjo",
            letterSpacing: -2,
          }}
        >
          진리
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Nanum Myeongjo", data: font, style: "normal", weight: 800 },
      ],
    }
  );
}
