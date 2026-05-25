"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Filter, BookOpen, Star, Footprints, Cross, Sunrise } from "lucide-react";
import { parseVerseRef } from "@/lib/verseLink";

const categoryColors = {
  "탄생": "#B07830",
  "사역": "#2E7D32",
  "수난": "#C62828",
  "부활/승천": "#1565C0",
};

const categoryIcons = {
  "탄생": Star,
  "사역": Footprints,
  "수난": Cross,
  "부활/승천": Sunrise,
};

export default function PropheciesClient({ prophecies, prophecyCategories }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered =
    selectedCategory === "all"
      ? prophecies
      : prophecies.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 text-center mb-3">
          메시아 예언과 성취
        </h1>
        <p className="text-lg text-stone-500 text-center mb-10 max-w-2xl mx-auto">
          구약성경에 기록된 메시아 예언이 신약성경에서 예수 그리스도를 통해
          어떻게 성취되었는지 살펴봅니다
        </p>

        {/* 카테고리 필터 */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={14} className="text-stone-400" />
            <span className="text-base font-medium text-stone-400 uppercase tracking-wider">
              분류별
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-lg text-base font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-stone-800 text-white"
                  : "border border-stone-200 text-stone-500 hover:bg-stone-50"
              }`}
            >
              전체
            </button>
            {prophecyCategories.map((cat) => {
              const cc = categoryColors[cat] || "#57534E";
              const Icon = categoryIcons[cat];
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-1.5 rounded-lg text-base font-medium transition-colors flex items-center gap-2 border hover:bg-stone-50"
                  style={
                    active
                      ? { backgroundColor: cc, color: "#fff", borderColor: cc }
                      : { borderColor: "#e7e5e4", color: "#78716c" }
                  }
                >
                  {Icon && (
                    <Icon
                      size={17}
                      strokeWidth={2}
                      color={active ? "#ffffff" : cc}
                      className="shrink-0"
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        {filtered.length === 0 ? (
          <p className="text-center text-stone-400 py-16">
            해당 조건의 예언이 없습니다
          </p>
        ) : (
          <div className="space-y-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="bg-white border border-stone-200 rounded-xl p-6"
              >
                {/* 카드 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-stone-900">
                    {p.title}
                  </h3>
                  {(() => {
                    const Icon = categoryIcons[p.category];
                    const c = categoryColors[p.category] || "#57534E";
                    return (
                      <span
                        className="inline-flex items-center gap-1.5 text-base font-medium px-2.5 py-1 rounded-md shrink-0"
                        style={{ backgroundColor: `${c}1a`, color: c }}
                      >
                        {Icon && <Icon size={15} strokeWidth={2} />}
                        {p.category}
                      </span>
                    );
                  })()}
                </div>

                {/* 예언 → 성취 (세로 흐름) */}
                <div className="flex flex-col gap-5">
                  {/* 구약 예언 */}
                  <div className="py-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={18} className="text-amber-500" />
                      <span className="text-base font-semibold text-amber-600 uppercase tracking-wide">
                        예언
                      </span>
                    </div>
                    <p className="text-base font-medium text-stone-700 mb-1">
                      {(() => {
                        const link = parseVerseRef(p.otVerse);
                        return link ? (
                          <Link href={link.href} className="hover:text-amber-700 hover:underline transition-colors">
                            {p.otVerse}
                          </Link>
                        ) : (
                          p.otVerse
                        );
                      })()}
                    </p>
                    <p className="text-base text-stone-500 leading-relaxed">
                      {p.otText}
                    </p>
                  </div>

                  {/* 예언에서 성취로 (아래 방향) */}
                  <div className="flex justify-center">
                    <span className="w-9 h-9 rounded-full bg-stone-100 ring-1 ring-stone-200 flex items-center justify-center text-stone-500 shadow-sm">
                      <ArrowDown size={18} strokeWidth={2.4} />
                    </span>
                  </div>

                  {/* 신약 성취 */}
                  <div className="py-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={18} className="text-blue-500" />
                      <span className="text-base font-semibold text-blue-600 uppercase tracking-wide">
                        성취
                      </span>
                    </div>
                    <p className="text-base font-medium text-stone-700 mb-1">
                      {(() => {
                        const link = parseVerseRef(p.ntVerse);
                        return link ? (
                          <Link href={link.href} className="hover:text-blue-700 hover:underline transition-colors">
                            {p.ntVerse}
                          </Link>
                        ) : (
                          p.ntVerse
                        );
                      })()}
                    </p>
                    <p className="text-base text-stone-500 leading-relaxed">
                      {p.ntText}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
