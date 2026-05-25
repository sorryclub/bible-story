// Android(PWA) / 모바일 홈화면용 웹 매니페스트
export default function manifest() {
  return {
    name: "진리 — 성경 이야기",
    short_name: "진리",
    description:
      "성경의 이야기를 시각적으로 알기 쉽게. 인물·타임라인·지도·66권을 한눈에.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#1E3A8A",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
