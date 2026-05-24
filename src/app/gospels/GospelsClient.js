"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users, Eye, ChevronRight } from "lucide-react";

const gospelIds = ["matthew", "mark", "luke", "john"];

const gospelMeta = {
  matthew: {
    author: "세리 마태",
    audience: "유대인",
    portrait: "왕이신 메시아",
    keyword: "이루어지리라",
    chapters: 28,
  },
  mark: {
    author: "베드로의 통역 마가",
    audience: "로마인",
    portrait: "종이신 그리스도",
    keyword: "곧 (즉시)",
    chapters: 16,
  },
  luke: {
    author: "의사 누가",
    audience: "이방인",
    portrait: "인자이신 예수",
    keyword: "인자",
    chapters: 24,
  },
  john: {
    author: "사도 요한",
    audience: "모든 사람",
    portrait: "하나님의 아들",
    keyword: "믿다/영생",
    chapters: 21,
  },
};

const uniqueStories = {
  matthew: [
    "동방박사",
    "이집트 피난",
    "베드로의 물 위 걷기",
    "달란트 비유",
  ],
  mark: [
    "씨가 자라는 비유 (4:26-29)",
    "벳새다 소경 (8:22-26)",
  ],
  luke: [
    "선한 사마리아인",
    "탕자",
    "삭개오",
    "엠마오 도상",
  ],
  john: [
    "가나 혼인잔치",
    "니고데모",
    "사마리아 여인",
    "나사로 부활",
    "세족식",
  ],
};

const gospelNameMap = {
  matthew: "마태",
  mark: "마가",
  luke: "누가",
  john: "요한",
};

const tableRows = [
  { label: "저자", key: "author" },
  { label: "대상", key: "audience" },
  { label: "예수님의 모습", key: "portrait" },
  { label: "핵심 단어", key: "keyword" },
  { label: "장수", key: "chapters" },
];

export default function GospelsClient({ gospelBooks, parables, miracles }) {
  const parableCounts = {};
  const miracleCounts = {};
  gospelIds.forEach((id) => {
    parableCounts[id] = parables.filter((p) => p.gospels.includes(id)).length;
    miracleCounts[id] = miracles.filter((m) => m.gospels.includes(id)).length;
  });

  const maxParables = Math.max(...Object.values(parableCounts));
  const maxMiracles = Math.max(...Object.values(miracleCounts));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-stone-900 mb-3"
        >
          4복음서 비교
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg text-stone-500"
        >
          같은 예수님, 네 가지 시선
        </motion.p>
      </section>

      {/* Overview Comparison Table */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {/* Desktop table */}
          <div className="hidden md:block border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-base font-medium text-stone-400 px-6 py-4 bg-stone-50 w-36" />
                  {gospelBooks.map((book) => (
                    <th key={book.id} className="px-4 py-4 bg-stone-50">
                      <Link
                        href={`/books/${book.id}`}
                        className="inline-flex items-center gap-1.5 group"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: book.color }}
                        />
                        <span className="text-base font-bold text-stone-800 group-hover:text-stone-600 transition-colors">
                          {book.name}
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr
                    key={row.key}
                    className="border-t border-stone-100"
                  >
                    <td className="px-6 py-4 text-base font-medium text-stone-500">
                      {row.label}
                    </td>
                    {gospelIds.map((id) => (
                      <td key={id} className="px-4 py-4 text-base text-stone-700 text-center">
                        {gospelMeta[id][row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {gospelBooks.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="block border border-stone-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: book.color }}
                  />
                  <span className="text-base font-bold text-stone-800">
                    {book.name}
                  </span>
                </div>
                <div className="space-y-2 text-base text-stone-600">
                  {tableRows.map((row) => (
                    <div key={row.key}>
                      <span className="text-stone-400">{row.label}: </span>
                      {gospelMeta[book.id][row.key]}
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Unique Perspective Cards */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Eye size={18} className="text-stone-400" />
            <h2 className="text-2xl font-bold text-stone-900">
              네 가지 시선
            </h2>
          </div>
          <p className="text-base text-stone-500 text-center mb-10">
            각 복음서가 바라본 예수님
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {gospelBooks.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className="bg-white border border-stone-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: book.color }}
                  />
                  <h3 className="font-bold text-stone-900">{book.name}</h3>
                </div>
                <p className="text-base font-medium text-stone-400 mb-3">
                  {book.keyTheme}
                </p>
                <p className="text-base text-stone-600 leading-relaxed">
                  {book.uniquePerspective}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Comparison */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 justify-center mb-2">
          <BookOpen size={18} className="text-stone-400" />
          <h2 className="text-2xl font-bold text-stone-900">콘텐츠 비교</h2>
        </div>
        <p className="text-base text-stone-500 text-center mb-10">
          각 복음서에 기록된 비유와 기적의 수
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Parables */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="border border-stone-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-stone-900 mb-1">비유</h3>
            <p className="text-base text-stone-400 mb-6">Parables</p>
            <div className="space-y-4">
              {gospelIds.map((id) => {
                const count = parableCounts[id];
                const pct = maxParables > 0 ? (count / maxParables) * 100 : 0;
                const book = gospelBooks.find((b) => b.id === id);
                return (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base font-medium text-stone-700">
                        {gospelNameMap[id]}복음
                      </span>
                      <span className="text-base font-bold text-stone-900">
                        {count}개
                      </span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: book.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Miracles */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="border border-stone-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-stone-900 mb-1">기적</h3>
            <p className="text-base text-stone-400 mb-6">Miracles</p>
            <div className="space-y-4">
              {gospelIds.map((id) => {
                const count = miracleCounts[id];
                const pct = maxMiracles > 0 ? (count / maxMiracles) * 100 : 0;
                const book = gospelBooks.find((b) => b.id === id);
                return (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base font-medium text-stone-700">
                        {gospelNameMap[id]}복음
                      </span>
                      <span className="text-base font-bold text-stone-900">
                        {count}개
                      </span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: book.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gospel-only Stories */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Users size={18} className="text-stone-400" />
            <h2 className="text-2xl font-bold text-stone-900">
              각 복음서만의 이야기
            </h2>
          </div>
          <p className="text-base text-stone-500 text-center mb-10">
            다른 복음서에는 없는, 그 복음서만의 고유한 기록
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {gospelIds.map((id, i) => {
              const book = gospelBooks.find((b) => b.id === id);
              const stories = uniqueStories[id];
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="bg-white border border-stone-200 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: book.color }}
                      />
                      <h3 className="font-bold text-stone-900">
                        {gospelNameMap[id]}만의 기록
                      </h3>
                    </div>
                    <Link
                      href={`/books/${id}`}
                      className="text-base text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-0.5"
                    >
                      {book.name}
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                  <ul className="space-y-2">
                    {stories.map((story) => (
                      <li
                        key={story}
                        className="flex items-center gap-2.5 text-base text-stone-600"
                      >
                        <span
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: book.color }}
                        />
                        {story}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-stone-500 mb-6">
          각 복음서를 더 깊이 탐구해 보세요
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {gospelBooks.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-200 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: book.color }}
              />
              {book.name}
              <ChevronRight size={14} className="text-stone-400" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
