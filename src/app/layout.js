import { Noto_Sans_KR, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import PageTracker from "@/components/PageTracker";
import ScrollToTop from "@/components/ScrollToTop";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

// 로고·제목용 명조(세리프) 폰트
const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nanum-myeongjo",
});

const SITE_URL = "https://xn--oy2b970a.com"; // 진리.com
const SITE_DESC =
  "인물·타임라인·지도·성경 66권으로 따라가는 성경 이야기. 창세기부터 요한계시록까지 한눈에.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "진리",
    template: "%s — 진리",
  },
  description: SITE_DESC,
  openGraph: {
    title: "진리 — 성경 이야기를 한눈에",
    description: SITE_DESC,
    url: SITE_URL,
    siteName: "진리",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "진리 — 성경 이야기를 한눈에",
    description: SITE_DESC,
  },
  verification: {
    google: "ydinXmdTlr0q-ZeAMl4qK8bQ6jdSzMpy9pV-0vf9NcI",
    other: {
      "naver-site-verification": "4625f39d8d9e7a6fbb0ed8a7ec33d9a6d56dd2c4",
    },
  },
  // iOS 홈화면 웹앱
  appleWebApp: {
    capable: true,
    title: "진리",
    statusBarStyle: "default",
  },
};

// 모바일 브라우저 chrome(주소창) 색상
export const viewport = {
  themeColor: "#1E3A8A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${nanumMyeongjo.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF7] antialiased">
        <Navigation />
        <PageTracker />
        <ScrollToTop />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 mt-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* 서비스 소개 */}
              <div>
                <h3 className="text-2xl font-black tracking-tight text-stone-900 mb-3">
                  진리 <span className="text-sm font-semibold tracking-widest text-stone-400 uppercase">bible</span>
                </h3>
                <p className="text-base text-stone-500 leading-relaxed">
                  성경의 이야기를 시각적으로 쉽게 이해할 수 있도록 만든 서비스입니다. 모든 콘텐츠는 성경 본문에 기반합니다.
                </p>
              </div>

              {/* 둘러보기 */}
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">둘러보기</h3>
                <ul className="space-y-2">
                  <li><a href="/timeline" className="text-base text-stone-500 hover:text-stone-800 transition-colors">타임라인</a></li>
                  <li><a href="/characters" className="text-base text-stone-500 hover:text-stone-800 transition-colors">성경 인물</a></li>
                  <li><a href="/genealogy" className="text-base text-stone-500 hover:text-stone-800 transition-colors">인물 계보</a></li>
                  <li><a href="/books" className="text-base text-stone-500 hover:text-stone-800 transition-colors">성경 66권</a></li>
                  <li><a href="/map" className="text-base text-stone-500 hover:text-stone-800 transition-colors">성경 지도</a></li>
                </ul>
              </div>

              {/* 더 알아보기 */}
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">더 알아보기</h3>
                <ul className="space-y-2">
                  <li><a href="/parables" className="text-base text-stone-500 hover:text-stone-800 transition-colors">예수님의 비유</a></li>
                  <li><a href="/miracles" className="text-base text-stone-500 hover:text-stone-800 transition-colors">예수님의 기적</a></li>
                  <li><a href="/prophecies" className="text-base text-stone-500 hover:text-stone-800 transition-colors">메시아 예언</a></li>
                  <li><a href="/gospels" className="text-base text-stone-500 hover:text-stone-800 transition-colors">4복음서 비교</a></li>
                  <li><a href="/glossary" className="text-base text-stone-500 hover:text-stone-800 transition-colors">성경 사전</a></li>
                  <li><a href="/topics" className="text-base text-stone-500 hover:text-stone-800 transition-colors">주제별 성경</a></li>
                </ul>
              </div>
            </div>

            {/* 하단 구분선 + 저작권 */}
            <div className="border-t border-stone-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-base text-stone-400">
                © 2026 진리. 성경 내용을 기반으로 제작되었습니다.
              </p>
              <p className="text-base text-stone-400">
                문의: <a href="mailto:cwstwin11@gmail.com" className="text-stone-600 hover:text-stone-800 transition-colors">cwstwin11@gmail.com</a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
