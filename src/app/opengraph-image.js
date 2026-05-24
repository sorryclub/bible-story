import { ImageResponse } from "next/og";

// 공유 미리보기(카카오톡/페이스북/슬랙 등) 이미지
export const alt = "진리 — 성경 이야기";
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
  const [bold, regular] = await Promise.all([
    loadGoogleFont("Noto+Sans+KR:wght@700", "진리"),
    loadGoogleFont("Noto+Sans+KR:wght@400", "성경 이야기"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 로고 마크: 어두운 둥근 사각형 + 펼친 책 아이콘 */}
        <div
          style={{
            display: "flex",
            width: 240,
            height: 240,
            borderRadius: 56,
            background: "#1c1917",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 24px 60px rgba(28,25,23,0.18)",
          }}
        >
          <svg
            width="132"
            height="132"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>

        {/* 워드마크 */}
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 132,
            fontWeight: 700,
            color: "#1c1917",
            fontFamily: "Noto Sans KR",
          }}
        >
          진리
        </div>

        {/* 부제 */}
        <div
          style={{
            display: "flex",
            marginTop: 4,
            fontSize: 40,
            fontWeight: 400,
            color: "#a8a29e",
            fontFamily: "Noto Sans KR",
          }}
        >
          성경 이야기
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Noto Sans KR", data: bold, style: "normal", weight: 700 },
        { name: "Noto Sans KR", data: regular, style: "normal", weight: 400 },
      ],
    }
  );
}
