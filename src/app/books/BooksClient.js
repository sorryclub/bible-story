"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, ScrollText, BookMarked, Music, Megaphone,
  Cross, Mail, Sparkles, ChevronRight, List, LayoutGrid,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CATEGORY_INFO = {
  율법서: { Icon: ScrollText, desc: "모세 오경. 창조부터 이스라엘의 율법과 광야 여정까지", bg: "bg-white", border: "border-[#D4E4CF]", accent: "text-[#2D7A4F]", iconBg: "bg-[#E9F5E5]", badge: "bg-[#2D7A4F] text-white" },
  역사서: { Icon: BookMarked, desc: "이스라엘의 가나안 정복, 왕국, 포로, 귀환의 역사", bg: "bg-white", border: "border-[#C8DAF0]", accent: "text-[#2B5EA7]", iconBg: "bg-[#E3EEFA]", badge: "bg-[#2B5EA7] text-white" },
  시가서: { Icon: Music, desc: "시, 지혜, 노래. 삶의 의미와 하나님을 향한 찬양", bg: "bg-white", border: "border-[#EFCFD8]", accent: "text-[#B5436A]", iconBg: "bg-[#FBEAEF]", badge: "bg-[#B5436A] text-white" },
  선지서: { Icon: Megaphone, desc: "하나님의 메시지를 전한 선지자들. 심판 경고와 구원 약속", bg: "bg-white", border: "border-[#EDDCC4]", accent: "text-[#B07830]", iconBg: "bg-[#FBF2E5]", badge: "bg-[#B07830] text-white" },
  복음서: { Icon: Cross, desc: "예수 그리스도의 생애, 가르침, 죽음과 부활", bg: "bg-white", border: "border-[#C5DED5]", accent: "text-[#1A7A5A]", iconBg: "bg-[#E2F3EC]", badge: "bg-[#1A7A5A] text-white" },
  서신서: { Icon: Mail, desc: "사도들이 교회와 개인에게 보낸 편지. 교리와 삶의 지침", bg: "bg-white", border: "border-[#D5CFF0]", accent: "text-[#5E4CA0]", iconBg: "bg-[#EDEAFC]", badge: "bg-[#5E4CA0] text-white" },
  예언서: { Icon: Sparkles, desc: "예수 그리스도의 재림과 최후 심판, 새 하늘 새 땅", bg: "bg-white", border: "border-[#E8CDD0]", accent: "text-[#A03040]", iconBg: "bg-[#FAEAEC]", badge: "bg-[#A03040] text-white" },
};

// 공통 카드 컴포넌트
function BookCard({ book, index }) {
  const info = CATEGORY_INFO[book.category] || {};
  return (
    <Link href={`/books/${book.id}`} className="block group">
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              {index != null && (
                <span className="text-base font-bold text-stone-500">{index}.</span>
              )}
              <h3 className="text-lg font-semibold text-stone-900">{book.name}</h3>
            </div>
            <p className="text-base text-stone-400 truncate">{book.nameEn}</p>
          </div>
          <span className="text-base px-2.5 py-0.5 rounded-full font-medium bg-stone-100 text-stone-500 shrink-0">
            {book.chapters}장
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-base font-medium px-2.5 py-0.5 rounded-md ${info.badge || "bg-stone-700 text-white"}`}>
            {info.Icon && <info.Icon size={13} strokeWidth={2} />}
            {book.category}
          </span>
          <span className="text-base text-stone-500">{book.keyTheme}</span>
        </div>

        <p className="text-base text-stone-600 leading-relaxed line-clamp-3 min-h-[4.8em]">{book.summary}</p>

        <div className="pt-3 mt-auto border-t border-stone-50 flex items-center justify-between h-[40px] overflow-hidden">
          <div className="flex gap-1.5 items-center overflow-hidden">
            {book.highlights && book.highlights.slice(0, 3).map((h, j) => (
              <span key={j} className="text-base px-2 py-0.5 bg-stone-50 rounded text-stone-500 whitespace-nowrap shrink-0">
                {h.title}
              </span>
            ))}
            {book.highlights && book.highlights.length > 3 && (
              <span className="text-base text-stone-300 shrink-0">+{book.highlights.length - 3}</span>
            )}
          </div>
          <ChevronRight size={16} className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0 ml-2" />
        </div>
      </div>
    </Link>
  );
}

function BooksContent({ oldTestament, newTestament }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam === "new" ? "new" : "old");
  const [viewMode, setViewMode] = useState("category"); // "category" | "order"

  const currentBooks = activeTab === "old" ? oldTestament : newTestament;

  // 카테고리별 그룹핑
  const grouped = [];
  let lastCat = null;
  currentBooks.forEach((book) => {
    if (book.category !== lastCat) {
      grouped.push({ category: book.category, books: [book] });
      lastCat = book.category;
    } else {
      grouped[grouped.length - 1].books.push(book);
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
          성경 66권
        </h1>
        <p className="text-lg text-stone-500 mb-10">
          구약 39권, 신약 27권
        </p>

        {/* OT/NT 탭 + 보기 모드 토글 */}
        <div className="relative flex items-center justify-center">
          {/* 가운데: 구약/신약 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("old")}
              className={`px-6 py-2.5 rounded-lg text-base font-medium transition-all ${
                activeTab === "old"
                  ? "bg-stone-800 text-white"
                  : "border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              구약 {oldTestament.length}권
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-6 py-2.5 rounded-lg text-base font-medium transition-all ${
                activeTab === "new"
                  ? "bg-stone-800 text-white"
                  : "border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              신약 {newTestament.length}권
            </button>
          </div>

          {/* 우측 끝: 보기 모드 */}
          <div className="absolute right-0 flex items-center border border-stone-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("order")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-base font-medium transition-colors ${
                viewMode === "order"
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:bg-stone-50"
              }`}
            >
              <List size={16} />
              순서
            </button>
            <button
              onClick={() => setViewMode("category")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-base font-medium transition-colors ${
                viewMode === "category"
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:bg-stone-50"
              }`}
            >
              <LayoutGrid size={16} />
              분류
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 mt-4">
        {viewMode === "category" ? (
          /* ── 카테고리별 보기 ── */
          grouped.map((group, gi) => {
            const info = CATEGORY_INFO[group.category] || {};
            const Icon = info.Icon || BookOpen;
            return (
              <motion.div
                key={group.category + activeTab + gi}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06, duration: 0.4 }}
                className="mb-12"
              >
                <div className={`rounded-xl p-5 mb-5 ${info.bg || "bg-stone-50"} ${info.border || "border-stone-200"} border`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${info.iconBg || "bg-stone-100"} flex items-center justify-center shrink-0`}>
                      <Icon size={22} className={info.accent || "text-stone-600"} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${info.accent || "text-stone-800"}`}>
                        {group.category}
                        <span className="ml-2 text-base font-normal text-stone-400">
                          {group.books.length}권
                        </span>
                      </h2>
                      <p className="text-base text-stone-500 mt-0.5">{info.desc || ""}</p>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          /* ── 성경 순서대로 보기 ── */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
              >
                <BookCard book={book} index={i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function BooksClient({ oldTestament, newTestament }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-stone-400 text-base">불러오는 중...</p>
        </div>
      }
    >
      <BooksContent oldTestament={oldTestament} newTestament={newTestament} />
    </Suspense>
  );
}
