"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Search, ArrowUpDown, X, Network } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";

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

// 인물이 검색어와 매칭되는지 판단
function characterMatches(c, query) {
  const q = query.trim();
  if (!q) return true;

  // 초성만 입력한 경우 → 이름 초성이 그 초성으로 "시작"하는 인물만 (ㄱ → 가인, 갈렙…)
  if (isChosungOnly(q)) {
    return toChosung(c.name).replace(/\s/g, "").startsWith(q.replace(/\s/g, ""));
  }

  // 그 외 → 한글명/영문명/역할 부분 일치
  const lower = q.toLowerCase();
  return (
    c.name.includes(q) ||
    (c.nameEn && c.nameEn.toLowerCase().includes(lower)) ||
    (c.role && c.role.includes(q))
  );
}

const PERIOD_COLORS = {
  "창조 시대": { bg: "bg-[#2D7A4F]", text: "text-white" },
  "홍수 시대": { bg: "bg-[#2B5EA7]", text: "text-white" },
  "족장 시대": { bg: "bg-[#B07830]", text: "text-white" },
  "출애굽 시대": { bg: "bg-[#A03040]", text: "text-white" },
  "정복 시대": { bg: "bg-[#1A7A5A]", text: "text-white" },
  "사사 시대": { bg: "bg-[#5E4CA0]", text: "text-white" },
  "왕국 시대": { bg: "bg-[#2B5EA7]", text: "text-white" },
  "분열 왕국 시대": { bg: "bg-[#B5436A]", text: "text-white" },
  "포로 시대": { bg: "bg-[#546E7A]", text: "text-white" },
  "신약 시대": { bg: "bg-[#1A7A5A]", text: "text-white" },
};

const PERIOD_ORDER = [
  "창조 시대", "홍수 시대", "족장 시대", "출애굽 시대", "정복 시대",
  "사사 시대", "왕국 시대", "분열 왕국 시대", "포로 시대", "신약 시대",
];

const SCROLL_KEY = "characters-scroll";

export default function CharactersClient({ characters, periods }) {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("bible"); // "bible" | "name"

  const trimmed = searchQuery.trim();
  const searching = trimmed.length > 0;

  // 스크롤 위치 실시간 저장 (클라이언트 네비게이션에서도 동작)
  useEffect(() => {
    let timer;
    const save = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      }, 100);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", save);
    };
  }, []);

  // 스크롤 위치 복원
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      const y = parseInt(saved, 10);
      // 이미지 로드 후 높이가 바뀔 수 있으므로 약간 지연
      const t1 = setTimeout(() => window.scrollTo(0, y), 0);
      const t2 = setTimeout(() => window.scrollTo(0, y), 100);
      const t3 = setTimeout(() => window.scrollTo(0, y), 300);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, []);

  const filteredCharacters = useMemo(() => {
    // 검색 중엔 시대 필터와 무관하게 전체 인물에서 매칭
    let result = characters.filter((c) =>
      searching
        ? characterMatches(c, trimmed)
        : selectedPeriod === "all" || c.period === selectedPeriod
    );

    if (sortMode === "bible") {
      result = [...result].sort((a, b) => (a.bibleOrder || 999) - (b.bibleOrder || 999));
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }

    return result;
  }, [characters, selectedPeriod, searching, trimmed, sortMode]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 text-center mb-3">
          성경 인물
        </h1>
        <p className="text-lg text-stone-500 text-center mb-5">
          하나님의 역사에 쓰임 받은 사람들 ({characters.length}명)
        </p>

        <div className="flex justify-center mb-10">
          <Link
            href="/genealogy"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-200 text-base font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <Network size={16} className="text-stone-400" />
            성경 인물 계보 보기
          </Link>
        </div>

        {/* 검색 */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="인물 이름·초성 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 text-base text-stone-700 placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="검색어 지우기"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* 정렬 + 시대 필터 (검색 중엔 숨김) */}
        {!searching && (
          <>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setSortMode("bible")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-base font-medium transition-colors ${
                    sortMode === "bible"
                      ? "bg-stone-800 text-white"
                      : "text-stone-400 hover:bg-stone-50"
                  }`}
                >
                  성경 순서
                </button>
                <button
                  onClick={() => setSortMode("name")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-base font-medium transition-colors ${
                    sortMode === "name"
                      ? "bg-stone-800 text-white"
                      : "text-stone-400 hover:bg-stone-50"
                  }`}
                >
                  가나다순
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedPeriod("all")}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                  selectedPeriod === "all"
                    ? "bg-stone-800 text-white"
                    : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                }`}
              >
                전체 ({characters.length})
              </button>
              {periods.map((period) => {
                const count = characters.filter((c) => c.period === period).length;
                if (count === 0) return null;
                const colors = PERIOD_COLORS[period] || {};
                return (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-base font-medium transition-all ${
                      selectedPeriod === period
                        ? `${colors.bg || "bg-stone-800"} ${colors.text || "text-white"}`
                        : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {period} ({count})
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* 인물 그리드 */}
      <section className="max-w-5xl mx-auto px-6 py-8 pb-20">
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-16">
            <Search size={32} className="text-stone-300 mx-auto mb-4" />
            <p className="text-lg text-stone-500">
              &lsquo;{trimmed}&rsquo; 에 대한 검색 결과가 없어요
            </p>
            <p className="text-base text-stone-400 mt-1">
              이름이나 초성(예: ㄱ)으로 검색해 보세요
            </p>
          </div>
        ) : (
          <>
            {searching && (
              <p className="text-base text-stone-500 mb-5">
                검색 결과 <span className="font-semibold text-stone-700">{filteredCharacters.length}명</span>
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredCharacters.map((char, i) => (
              <Link key={char.id} href={`/characters/${char.id}`} className="block group">
                <div className="bg-white rounded-xl p-4 text-center border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col">
                  <div className="flex justify-center mb-3">
                    <CharacterAvatar character={char} size={140} priority={i < 10} />
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg">{char.name}</h3>
                  <p className="text-base text-stone-500 mt-0.5 break-words">{char.nameEn}</p>
                  <p className="text-base text-stone-600 mt-1 font-medium line-clamp-2">{char.role}</p>
                  <div className="mt-auto pt-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-base font-medium ${PERIOD_COLORS[char.period]?.bg || "bg-stone-200"} ${PERIOD_COLORS[char.period]?.text || "text-stone-600"}`}>
                      {char.period}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
