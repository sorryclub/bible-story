"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Cross, Mail, Scroll, Landmark, Feather, Flame, Crown,
  ChevronRight, List, LayoutGrid, Search, X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/* ── 한글 초성 검색 ───────────────────────────────────────── */
const CHOSUNG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];
const CONSONANTS = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

// 문자열을 초성 문자열로 변환 (완성형 한글만 변환, 그 외는 그대로)
function toChosung(str) {
  let out = "";
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      out += CHOSUNG[Math.floor((code - 0xac00) / 588)];
    } else {
      out += ch;
    }
  }
  return out;
}

// 쿼리가 순수 초성(자음)으로만 이루어졌는지
function isChosungOnly(q) {
  const stripped = q.replace(/\s/g, "");
  return stripped.length > 0 && [...stripped].every((c) => CONSONANTS.includes(c));
}

// 책이 검색어와 매칭되는지 판단
function bookMatches(book, query) {
  const q = query.trim();
  if (!q) return true;

  // 초성만 입력한 경우 → 초성으로 "시작"하는 책만 (ㄴ → 느헤미야, 나훔. 요나서 제외)
  if (isChosungOnly(q)) {
    return toChosung(book.name).replace(/\s/g, "").startsWith(q.replace(/\s/g, ""));
  }

  // 그 외 → 한글명/영문명 부분 일치
  const lower = q.toLowerCase();
  return (
    book.name.includes(q) ||
    (book.nameEn && book.nameEn.toLowerCase().includes(lower))
  );
}

const CATEGORY_INFO = {
  율법서: { Icon: Scroll, color: "#2D7A4F", desc: "모세 오경. 창조부터 이스라엘의 율법과 광야 여정까지", bg: "bg-white", border: "border-[#D4E4CF]", accent: "text-[#2D7A4F]", badge: "bg-[#2D7A4F] text-white" },
  역사서: { Icon: Landmark, color: "#2B5EA7", desc: "이스라엘의 가나안 정복, 왕국, 포로, 귀환의 역사", bg: "bg-white", border: "border-[#C8DAF0]", accent: "text-[#2B5EA7]", badge: "bg-[#2B5EA7] text-white" },
  시가서: { Icon: Feather, color: "#B5436A", desc: "시, 지혜, 노래. 삶의 의미와 하나님을 향한 찬양", bg: "bg-white", border: "border-[#EFCFD8]", accent: "text-[#B5436A]", badge: "bg-[#B5436A] text-white" },
  선지서: { Icon: Flame, color: "#B07830", desc: "하나님의 메시지를 전한 선지자들. 심판 경고와 구원 약속", bg: "bg-white", border: "border-[#EDDCC4]", accent: "text-[#B07830]", badge: "bg-[#B07830] text-white" },
  복음서: { Icon: Cross, color: "#1A7A5A", desc: "예수 그리스도의 생애, 가르침, 죽음과 부활", bg: "bg-white", border: "border-[#C5DED5]", accent: "text-[#1A7A5A]", badge: "bg-[#1A7A5A] text-white" },
  서신서: { Icon: Mail, color: "#5E4CA0", desc: "사도들이 교회와 개인에게 보낸 편지. 교리와 삶의 지침", bg: "bg-white", border: "border-[#D5CFF0]", accent: "text-[#5E4CA0]", badge: "bg-[#5E4CA0] text-white" },
  예언서: { Icon: Crown, color: "#A03040", desc: "예수 그리스도의 재림과 최후 심판, 새 하늘 새 땅", bg: "bg-white", border: "border-[#E8CDD0]", accent: "text-[#A03040]", badge: "bg-[#A03040] text-white" },
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
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const searching = trimmed.length > 0;

  // 검색 중에는 구약/신약 구분 없이 66권 전체에서 즉시 필터링
  const results = useMemo(() => {
    if (!searching) return [];
    return [...oldTestament, ...newTestament].filter((b) => bookMatches(b, trimmed));
  }, [searching, trimmed, oldTestament, newTestament]);

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
        <p className="text-lg text-stone-500 mb-8">
          구약 39권, 신약 27권
        </p>

        {/* 검색창: 초성(ㄴ)·한글·영문 즉시 검색 */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="성경 이름·초성 검색"
            autoComplete="off"
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-stone-200 bg-white text-base text-stone-800 placeholder:text-stone-400 shadow-sm focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* OT/NT 탭 + 보기 모드 토글 (검색 중엔 숨김) */}
        {/* 모바일: 세로로 쌓아 겹침 방지 / 데스크탑(md+): 가운데 탭 + 우측 절대배치 토글 */}
        {!searching && (
          <div className="flex flex-col items-center gap-4 md:relative md:flex-row md:justify-center md:gap-0">
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
            <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden md:absolute md:right-0">
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
        )}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 mt-4">
        {searching ? (
          /* ── 검색 결과 ── */
          results.length > 0 ? (
            <>
              <p className="text-base text-stone-500 mb-5">
                검색 결과 <span className="font-semibold text-stone-700">{results.length}권</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <Search size={36} className="mx-auto text-stone-300 mb-4" />
              <p className="text-lg text-stone-500">
                &lsquo;{trimmed}&rsquo; 에 대한 검색 결과가 없어요
              </p>
              <p className="text-base text-stone-400 mt-1">
                책 이름이나 초성(예: ㄴ)으로 검색해 보세요
              </p>
            </div>
          )
        ) : viewMode === "category" ? (
          /* ── 카테고리별 보기 ── */
          grouped.map((group, gi) => {
            const info = CATEGORY_INFO[group.category] || {};
            const Icon = info.Icon || BookOpen;
            const color = info.color || "#57534E";
            return (
              <motion.div
                key={group.category + activeTab + gi}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06, duration: 0.4 }}
                className="mb-12"
              >
                <div
                  className="rounded-2xl p-5 mb-5"
                  style={{ backgroundColor: `${color}12` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      <Icon size={22} color="#ffffff" strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color }}>
                        {group.category}
                        <span className="ml-2 text-base font-normal text-stone-400">
                          {group.books.length}권
                        </span>
                      </h2>
                      <p className="text-base text-stone-500 mt-0.5">{info.desc || ""}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          /* ── 성경 순서대로 보기 ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
