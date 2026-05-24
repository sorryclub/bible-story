"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Filter } from "lucide-react";

const gospelNames = {
  matthew: "마태",
  mark: "마가",
  luke: "누가",
  john: "요한",
};

export default function ParablesClient({ parables, parableThemes }) {
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedGospel, setSelectedGospel] = useState("all");

  const filtered = parables.filter((p) => {
    const themeMatch = selectedTheme === "all" || p.theme === selectedTheme;
    const gospelMatch =
      selectedGospel === "all" || p.gospels.includes(selectedGospel);
    return themeMatch && gospelMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 text-center mb-3">
          예수님의 비유
        </h1>
        <p className="text-lg text-stone-500 text-center mb-10 max-w-xl mx-auto">
          예수님이 하나님 나라를 가르치시기 위해 들려주신 이야기들
        </p>

        {/* 필터 */}
        <div className="space-y-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter size={14} className="text-stone-400" />
              <span className="text-base font-medium text-stone-400 uppercase tracking-wider">
                주제별
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTheme("all")}
                className={`px-3.5 py-1.5 rounded-lg text-base font-medium transition-colors ${
                  selectedTheme === "all"
                    ? "bg-stone-800 text-white"
                    : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                }`}
              >
                전체
              </button>
              {parableThemes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3.5 py-1.5 rounded-lg text-base font-medium transition-colors ${
                    selectedTheme === theme
                      ? "bg-stone-800 text-white"
                      : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  {theme}
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
            해당 조건의 비유가 없습니다
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="bg-white border border-stone-200 rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-bold text-stone-900">
                    {p.title}
                  </h3>
                  <span className="text-base font-medium text-stone-400 bg-stone-50 px-2.5 py-1 rounded-md shrink-0">
                    {p.theme}
                  </span>
                </div>
                <p className="text-base text-stone-600 leading-relaxed mb-4">
                  {p.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-base text-stone-400">{p.verse}</span>
                  <div className="flex gap-1.5">
                    {p.gospels.map((g) => (
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
