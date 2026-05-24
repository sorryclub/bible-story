import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata = {
  title: "진리 — 성경 이야기",
  description:
    "성경의 이야기를 시각적으로 알기 쉽게 보여주는 사이트. 인물, 타임라인, 챕터별로 하나님의 이야기를 살펴보세요.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF7] antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 mt-20">
          <div className="max-w-5xl mx-auto px-6 py-10 text-center">
            <p className="text-base text-stone-400 tracking-wide">
              진리 — 성경 내용을 기반으로 제작되었습니다
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
