"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Filter, BookOpen } from "lucide-react";

const categoryColors = {
  "탄생": "bg-amber-50 text-amber-700",
  "사역": "bg-emerald-50 text-emerald-700",
  "수난": "bg-red-50 text-red-700",
  "부활/승천": "bg-sky-50 text-sky-700",
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
            {prophecyCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-base font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-stone-800 text-white"
                    : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                }`}
              >
                {cat}
              </button>
            ))}
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
                  <span
                    className={`text-base font-medium px-2.5 py-1 rounded-md shrink-0 ${
                      categoryColors[p.category] || "bg-stone-50 text-stone-500"
                    }`}
                  >
                    {p.category}
                  </span>
                </div>

                {/* 예언 / 성취 두 열 */}
                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-start">
                  {/* 구약 예언 */}
                  <div className="border-l-[3px] border-amber-300 pl-4 py-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BookOpen size={13} className="text-amber-500" />
                      <span className="text-base font-semibold text-amber-600 uppercase tracking-wide">
                        예언
                      </span>
                    </div>
                    <p className="text-base font-medium text-stone-700 mb-1">
                      {p.otVerse}
                    </p>
                    <p className="text-base text-stone-500 leading-relaxed">
                      {p.otText}
                    </p>
                  </div>

                  {/* 화살표 */}
                  <div className="hidden md:flex items-center justify-center pt-6">
                    <ArrowRight size={20} className="text-stone-300" />
                  </div>
                  <div className="flex md:hidden items-center justify-center">
                    <ArrowRight
                      size={16}
                      className="text-stone-300 rotate-90"
                    />
                  </div>

                  {/* 신약 성취 */}
                  <div className="border-l-[3px] border-blue-300 pl-4 py-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <BookOpen size={13} className="text-blue-500" />
                      <span className="text-base font-semibold text-blue-600 uppercase tracking-wide">
                        성취
                      </span>
                    </div>
                    <p className="text-base font-medium text-stone-700 mb-1">
                      {p.ntVerse}
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
