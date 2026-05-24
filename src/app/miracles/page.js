"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Filter, BookOpen } from "lucide-react";
import { miracles, miracleCategories } from "@/data/miracles";

const gospelNames = {
  matthew: "마태",
  mark: "마가",
  luke: "누가",
  john: "요한",
};

const categoryColors = {
  치유: "#2E7D32",
  자연: "#1565C0",
  귀신: "#6A1B9A",
  부활: "#C62828",
};

export default function MiraclesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGospel, setSelectedGospel] = useState("all");

  const filtered = miracles.filter((m) => {
    const catMatch =
      selectedCategory === "all" || m.category === selectedCategory;
    const gospelMatch =
      selectedGospel === "all" || m.gospels.includes(selectedGospel);
    return catMatch && gospelMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 text-center mb-3">
          예수님의 기적
        </h1>
        <p className="text-lg text-stone-500 text-center mb-10 max-w-xl mx-auto">
          복음서에 기록된 예수님의 능력과 표적들
        </p>

        {/* 필터 */}
        <div className="space-y-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter size={14} className="text-stone-400" />
              <span className="text-base font-medium text-stone-400 uppercase tracking-wider">
                유형별
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
              {miracleCategories.map((cat) => (
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

          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-stone-400" />
              <span className="text-base font-medium text-stone-400 uppercase tracking-wider">
                복음서별
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGospel("all")}
                className={`px-3.5 py-1.5 rounded-lg text-base font-medium transition-colors ${
                  selectedGospel === "all"
                    ? "bg-stone-800 text-white"
                    : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                }`}
              >
                전체
              </button>
              {["matthew", "mark", "luke", "john"].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGospel(g)}
                  className={`px-3.5 py-1.5 rounded-lg text-base font-medium transition-colors ${
                    selectedGospel === g
                      ? "bg-stone-800 text-white"
                      : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  {gospelNames[g]}복음
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        {filtered.length === 0 ? (
          <p className="text-center text-stone-400 py-16">
            해당 조건의 기적이 없습니다
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="bg-white border border-stone-200 rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-bold text-stone-900">
                    {m.title}
                  </h3>
                  <span
                    className="text-base font-medium px-2.5 py-1 rounded-md shrink-0"
                    style={{
                      backgroundColor: `${categoryColors[m.category]}12`,
                      color: categoryColors[m.category],
                    }}
                  >
                    {m.category}
                  </span>
                </div>
                <p className="text-base text-stone-600 leading-relaxed mb-4">
                  {m.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-base text-stone-400">{m.verse}</span>
                  <div className="flex gap-1.5">
                    {m.gospels.map((g) => (
                      <span
                        key={g}
                        className="text-base font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded"
                      >
                        {gospelNames[g]}
                      </span>
                    ))}
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
