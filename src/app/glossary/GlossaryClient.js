"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Library } from "lucide-react";
import { glossaryCategories, glossaryTerms } from "@/data/glossary";
import { parseVerseRef } from "@/lib/verseLink";

/* ── 한글 초성 검색 ───────────────────────────────────── */
const CHOSUNG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];
const CONSONANTS = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

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

function isChosungOnly(q) {
  const stripped = q.replace(/\s/g, "");
  return stripped.length > 0 && [...stripped].every((c) => CONSONANTS.includes(c));
}

function termMatches(t, query) {
  const q = query.trim();
  if (!q) return true;
  const stripped = q.replace(/\s/g, "");
  if (isChosungOnly(q)) {
    return toChosung(t.term).replace(/\s/g, "").includes(stripped);
  }
  const lower = q.toLowerCase();
  return (
    t.term.includes(q) ||
    (t.aka && t.aka.toLowerCase().includes(lower)) ||
    (t.def && t.def.includes(q))
  );
}

const catMap = Object.fromEntries(glossaryCategories.map((c) => [c.id, c]));

/* ── 용어 카드 ────────────────────────────────────────── */
function TermCard({ t }) {
  const cat = catMap[t.cat] || {};
  const link = parseVerseRef(t.verse);
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 hover:-translate-y-0.5 transition-all p-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-bold" style={{ color: cat.color || "#1C1917" }}>
            {t.term}
          </h3>
          {t.aka && <p className="text-sm text-stone-400 mt-0.5">{t.aka}</p>}
        </div>
        {cat.name && (
          <span
            className="text-sm font-medium px-2.5 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: `${cat.color}14`, color: cat.color }}
          >
            {cat.name}
          </span>
        )}
      </div>

      <p className="text-base text-stone-600 leading-relaxed mt-2.5 flex-1">{t.def}</p>

      <div className="mt-3 pt-3 border-t border-stone-100">
        {link ? (
          <Link
            href={link.href}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            <BookOpen size={13} />
            {t.verse}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm text-stone-400">
            <BookOpen size={13} />
            {t.verse}
          </span>
        )}
      </div>
    </div>
  );
}

export default function GlossaryClient() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const trimmed = query.trim();
  const searching = trimmed.length > 0;

  // 검색 결과(분류 무시) / 분류별 그룹
  const searchResults = useMemo(
    () => (searching ? glossaryTerms.filter((t) => termMatches(t, trimmed)) : []),
    [searching, trimmed]
  );

  const groups = useMemo(() => {
    const cats =
      activeCat === "all"
        ? glossaryCategories
        : glossaryCategories.filter((c) => c.id === activeCat);
    return cats
      .map((c) => ({ cat: c, items: glossaryTerms.filter((t) => t.cat === c.id) }))
      .filter((g) => g.items.length > 0);
  }, [activeCat]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Library size={22} className="text-stone-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900">성경 사전</h1>
        </div>
        <p className="text-lg text-stone-500 mb-8">
          성경을 이해하는 데 꼭 필요한 핵심 용어 {glossaryTerms.length}개를 쉽게 풀이했어요
        </p>

        {/* 검색 */}
        <div className="relative max-w-md mx-auto mb-7">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="용어·초성·뜻 검색"
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

        {/* 분류 필터 (검색 중엔 숨김) */}
        {!searching && (
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCat("all")}
              className={`px-3.5 py-1.5 rounded-full text-base font-medium border transition-colors ${
                activeCat === "all"
                  ? "bg-stone-800 text-white border-stone-800"
                  : "border-stone-200 text-stone-500 hover:bg-stone-50"
              }`}
            >
              전체
            </button>
            {glossaryCategories.map((c) => {
              const active = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-base font-medium border transition-colors ${
                    active ? "text-white" : "text-stone-500 hover:bg-stone-50 border-stone-200"
                  }`}
                  style={active ? { backgroundColor: c.color, borderColor: c.color } : {}}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 본문 */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        {searching ? (
          searchResults.length > 0 ? (
            <>
              <p className="text-base text-stone-500 mb-5">
                검색 결과 <span className="font-semibold text-stone-700">{searchResults.length}개</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((t) => (
                  <TermCard key={t.term} t={t} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <Search size={36} className="mx-auto text-stone-300 mb-4" />
              <p className="text-lg text-stone-500">
                &lsquo;{trimmed}&rsquo; 에 대한 용어가 없어요
              </p>
              <p className="text-base text-stone-400 mt-1">
                다른 용어나 초성(예: ㅇㅇ)으로 검색해 보세요
              </p>
            </div>
          )
        ) : (
          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.cat.id}>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: g.cat.color }}
                  />
                  <h2 className="text-xl font-bold" style={{ color: g.cat.color }}>
                    {g.cat.name}
                  </h2>
                  <span className="text-base text-stone-400">{g.items.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {g.items.map((t) => (
                    <TermCard key={t.term} t={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
