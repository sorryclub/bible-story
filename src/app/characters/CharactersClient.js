"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Users, Search, ArrowUpDown } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";

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

export default function CharactersClient({ characters, periods }) {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("bible"); // "bible" | "name"

  const filteredCharacters = useMemo(() => {
    let result = characters.filter((c) => {
      const matchesPeriod =
        selectedPeriod === "all" || c.period === selectedPeriod;
      const matchesSearch =
        c.name.includes(searchQuery) ||
        c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.includes(searchQuery);
      return matchesPeriod && matchesSearch;
    });

    if (sortMode === "bible") {
      result = [...result].sort((a, b) => (a.bibleOrder || 999) - (b.bibleOrder || 999));
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }

    return result;
  }, [characters, selectedPeriod, searchQuery, sortMode]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 text-center mb-3">
          성경 인물
        </h1>
        <p className="text-lg text-stone-500 text-center mb-10">
          하나님의 역사에 쓰임 받은 사람들 ({characters.length}명)
        </p>

        {/* 검색 */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="인물 이름으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 text-base text-stone-700 placeholder:text-stone-400"
          />
        </div>

        {/* 정렬 + 시대 필터 */}
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
      </section>

      {/* 인물 그리드 */}
      <section className="max-w-5xl mx-auto px-6 py-8 pb-20">
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-16">
            <Search size={32} className="text-stone-300 mx-auto mb-4" />
            <p className="text-base text-stone-500">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredCharacters.map((char, i) => (
              <Link key={char.id} href={`/characters/${char.id}`} className="block group">
                <div className="bg-white rounded-xl p-4 text-center border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col">
                  <div className="flex justify-center mb-3">
                    <CharacterAvatar character={char} size={140} />
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg">{char.name}</h3>
                  <p className="text-base text-stone-500 mt-0.5">{char.nameEn}</p>
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
        )}
      </section>
    </div>
  );
}
