"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Filter, Crown, Hand, HeartHandshake,
  Coins, Heart, Scale, Sprout, Cross,
} from "lucide-react";
import { parseVerseRef } from "@/lib/verseLink";

const gospelNames = {
  matthew: "마태",
  mark: "마가",
  luke: "누가",
  john: "요한",
};

// 주제별 색상
const THEME_COLORS = {
  "하나님 나라": "#2563EB",
  "기도": "#0D9488",
  "용서": "#DB2777",
  "재물": "#CA8A04",
  "이웃 사랑": "#E11D48",
  "심판": "#57534E",
  "믿음": "#15803D",
  "구원": "#7C3AED",
};

// 주제별 아이콘
const THEME_ICONS = {
  "하나님 나라": Crown,
  "기도": Hand,
  "용서": HeartHandshake,
  "재물": Coins,
  "이웃 사랑": Heart,
  "심판": Scale,
  "믿음": Sprout,
  "구원": Cross,
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
              {parableThemes.map((theme) => {
                const tc = THEME_COLORS[theme] || "#57534E";
                const Icon = THEME_ICONS[theme];
                const active = selectedTheme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className="px-4 py-1.5 rounded-lg text-base font-medium transition-colors flex items-center gap-2 border hover:bg-stone-50"
                    style={
                      active
                        ? { backgroundColor: tc, color: "#fff", borderColor: tc }
                        : { borderColor: "#e7e5e4", color: "#78716c" }
                    }
                  >
                    {Icon && (
                      <Icon
                        size={17}
                        strokeWidth={2}
                        color={active ? "#ffffff" : tc}
                        className="shrink-0"
                      />
                    )}
                    {theme}
                  </button>
                );
              })}
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
          selectedGospel === "john" ? (
            <div className="text-center py-16 max-w-xl mx-auto">
              <BookOpen size={32} className="text-stone-300 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-lg font-semibold text-stone-700 mb-2">
                요한복음에는 서사형 비유가 없습니다
              </p>
              <p className="text-base text-stone-500 leading-relaxed">
                예수님의 비유는 공관복음(마태·마가·누가)에 기록되어 있습니다.
                요한복음은 대신 “나는 선한 목자”(요한복음 10장), “나는 참포도나무”(요한복음 15장)
                같은 확장된 은유로 진리를 가르칩니다.
              </p>
            </div>
          ) : (
            <p className="text-center text-stone-400 py-16">
              해당 조건의 비유가 없습니다
            </p>
          )
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
                  {(() => {
                    const Icon = THEME_ICONS[p.theme];
                    const c = THEME_COLORS[p.theme] || "#57534E";
                    return (
                      <span
                        className="inline-flex items-center gap-1.5 text-base font-medium px-2.5 py-1 rounded-md shrink-0"
                        style={{ backgroundColor: `${c}1a`, color: c }}
                      >
                        {Icon && <Icon size={15} strokeWidth={2} />}
                        {p.theme}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-base text-stone-600 leading-relaxed mb-4">
                  {p.summary}
                </p>
                <div className="flex items-center justify-between">
                  {(() => {
                    const link = parseVerseRef(p.verse);
                    return link ? (
                      <Link
                        href={link.href}
                        className="text-base text-stone-400 hover:text-stone-700 hover:underline transition-colors"
                      >
                        {p.verse}
                      </Link>
                    ) : (
                      <span className="text-base text-stone-400">{p.verse}</span>
                    );
                  })()}
                  {p.gospels.length > 1 && (
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
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
