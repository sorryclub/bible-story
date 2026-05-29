"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, Users, ArrowRight, MessageCircle,
  Sparkles, ScrollText, GitCompare, Map,
  Mail, Cross, Scroll, Landmark, Feather, Flame, Church, Crown,
  ChevronDown, ChevronLeft, ChevronRight, Quote,
} from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";
import GodRays from "@/components/GodRays";

const NAVY = "#1E3A8A";
const WARM = "#B07830";
const serif = { fontFamily: "var(--font-nanum-myeongjo), serif" };

// 스크롤 시 부드럽게 등장 (한 번만)
const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
});

// 섹션 제목 스태거 등장
const headContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const headItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// 브랜드 파테 크로스
function CrossMark({ size = 14, color = NAVY }) {
  return (
    <svg
      width={size}
      height={size * 1.16}
      viewBox="3 1.5 18 21"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.5 2 L14.5 2 L13.4 8.1 L20.5 7 L20.5 12 L13.4 10.9 L14.5 22 L9.5 22 L10.6 10.9 L3.5 12 L3.5 7 L10.6 8.1 Z"
        fill={color}
      />
    </svg>
  );
}

// 섹션 머리말 (eyebrow + 명조 제목 + 부제)
function SectionHead({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      className="text-center mb-14"
      variants={headContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {eyebrow && (
        <motion.p variants={headItem} className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: NAVY }}>
          {eyebrow}
        </motion.p>
      )}
      <motion.h2 variants={headItem} className="text-3xl md:text-4xl font-extrabold text-stone-900" style={serif}>
        {title}
      </motion.h2>
      {subtitle && <motion.p variants={headItem} className="text-lg text-stone-500 mt-3">{subtitle}</motion.p>}
    </motion.div>
  );
}

const otCategories = [
  { name: "율법서", count: 5, Icon: Scroll, color: "#2D7A4F", desc: "모세 오경" },
  { name: "역사서", count: 12, Icon: Landmark, color: "#2B5EA7", desc: "이스라엘의 역사" },
  { name: "시가서", count: 5, Icon: Feather, color: "#B5436A", desc: "시, 지혜, 노래" },
  { name: "선지서", count: 17, Icon: Flame, color: "#B07830", desc: "예언과 경고" },
];

const ntCategories = [
  { name: "복음서", count: 4, Icon: Cross, color: "#1A7A5A", desc: "예수님의 생애" },
  { name: "역사서", count: 1, Icon: Church, color: "#2B5EA7", desc: "초대 교회" },
  { name: "서신서", count: 21, Icon: Mail, color: "#5E4CA0", desc: "사도들의 편지" },
  { name: "예언서", count: 1, Icon: Crown, color: "#A03040", desc: "요한계시록" },
];

const exploreItems = [
  { href: "/parables", Icon: MessageCircle, title: "예수님의 비유", desc: "하나님 나라를 가르치신 20가지 비유", color: "#2B5EA7" },
  { href: "/miracles", Icon: Sparkles, title: "예수님의 기적", desc: "복음서에 기록된 20가지 기적", color: "#1A7A5A" },
  { href: "/prophecies", Icon: ScrollText, title: "메시아 예언", desc: "구약 예언과 신약 성취의 연결", color: "#B07830" },
  { href: "/gospels", Icon: GitCompare, title: "4복음서 비교", desc: "같은 예수님, 네 가지 시선", color: "#5E4CA0" },
  { href: "/map", Icon: Map, title: "성경 지도", desc: "고대 근동의 성경 무대를 탐험", color: "#A03040" },
];

const FEATURED_IDS = ["noah", "joseph", "ruth", "elijah", "daniel", "esther", "peter", "mary_magdalene"];

// 오늘의 인물 — 매일 시작 인물이 바뀌고, 좌우/점으로 탐색
function FeaturedSpotlight({ characters }) {
  const featured = FEATURED_IDS
    .map((id) => characters.find((c) => c.id === id))
    .filter(Boolean);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // 마운트 후(클라이언트 전용) 날짜 기반으로 시작 인물 선택 → 매일 신선함
  useEffect(() => {
    if (featured.length === 0) return;
    const day = Math.floor(Date.now() / 86400000);
    setIdx(day % featured.length);
  }, [featured.length]);

  useEffect(() => {
    if (paused || featured.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [paused, featured.length]);

  if (featured.length === 0) return null;

  const char = featured[idx];
  const verse = char.keyVerses?.[0];
  const go = (dir) => setIdx((i) => (i + dir + featured.length) % featured.length);

  return (
    <section className="bg-[#FAFAF7] py-24 border-t border-stone-100">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHead eyebrow="SPOTLIGHT" title="오늘의 인물" subtitle="하나님의 역사 속 한 사람을 만나보세요" />

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            {/* 인물 색 액센트 (상단 라인) */}
            <div
              className="absolute top-0 inset-x-0 h-1 pointer-events-none transition-colors duration-500"
              style={{ background: `linear-gradient(90deg, ${char.color}, ${char.color}55 55%, transparent)` }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-9 p-7 sm:p-10 items-center min-h-[280px]"
              >
                <div
                  className="relative mx-auto sm:mx-0 rounded-2xl"
                  style={{ boxShadow: `0 14px 32px -12px ${char.color}66, 0 0 0 1px ${char.color}24` }}
                >
                  <CharacterAvatar
                    character={char}
                    size={176}
                    className="w-36 h-36 sm:w-44 sm:h-44 shrink-0"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex items-baseline justify-center sm:justify-start flex-wrap gap-x-2.5">
                    <h3 className="text-3xl font-bold text-stone-900" style={serif}>{char.name}</h3>
                    <span className="text-base text-stone-400">{char.nameEn}</span>
                  </div>

                  <span
                    className="inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold"
                    style={{ color: char.color, backgroundColor: `${char.color}14` }}
                  >
                    {char.role}
                  </span>

                  <p className="mt-4 text-base text-stone-600 leading-relaxed">{char.shortDesc}</p>

                  {verse && (
                    <div className="mt-5 flex items-start gap-2.5 text-left">
                      <Quote size={16} className="shrink-0 mt-1" style={{ color: `${char.color}99` }} />
                      <p className="text-sm text-stone-500 leading-relaxed">
                        <span className="font-semibold text-stone-700">{verse.ref}</span>
                        {verse.summary ? ` — ${verse.summary}` : null}
                      </p>
                    </div>
                  )}

                  <Link
                    href={`/characters/${char.id}`}
                    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: NAVY }}
                  >
                    이야기 보기
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 좌우 화살표 */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전 인물"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-500 hover:text-stone-900 hover:shadow-md transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="다음 인물"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-500 hover:text-stone-900 hover:shadow-md transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 점 인디케이터 */}
        <div className="flex items-center justify-center gap-2.5 mt-7">
          {featured.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`${c.name} 보기`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 26 : 8,
                backgroundColor: i === idx ? NAVY : "#D6D3D1",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeClient({ characters, timelineEvents }) {
  const featuredCharacters = characters.filter((c) =>
    ["abraham", "moses", "david", "jesus", "paul"].includes(c.id)
  );

  const keyMoments = timelineEvents.filter((e) => [1, 3, 9, 19, 21].includes(e.id));

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FAFAF7] flex items-center min-h-[88vh]">
        {/* 빛줄기 (God rays, 마우스 패럴랙스) */}
        <GodRays />

        {/* 가독성 오버레이 + 다음 섹션으로의 페이드 */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: "radial-gradient(56% 50% at 50% 44%, rgba(250,250,247,0.5), transparent 74%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          aria-hidden="true"
          style={{ background: "linear-gradient(to bottom, transparent, #FAFAF7)" }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-7"
          >
            <span className="h-px w-10" style={{ background: `${WARM}59` }} />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500">
              The Story of God
            </span>
            <span className="h-px w-10" style={{ background: `${WARM}59` }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
            style={{
              ...serif,
              backgroundImage: `linear-gradient(180deg, #1C1917 0%, #2B2620 60%, ${NAVY} 130%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            하나님의 이야기
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-6 text-xl text-stone-500 max-w-xl mx-auto leading-relaxed"
          >
            창세기부터 요한계시록까지,
            <br className="hidden sm:block" />
            성경 속 구원의 이야기를 한눈에 만나보세요
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            className="mt-10 flex flex-col items-stretch sm:flex-row sm:flex-wrap sm:items-center justify-center gap-3"
          >
            <Link
              href="/timeline"
              className="flex w-full justify-center sm:inline-flex sm:w-auto items-center gap-2 px-7 py-3.5 text-white rounded-xl font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: NAVY }}
            >
              <Clock size={18} />
              타임라인 확인하기
            </Link>
            <Link
              href="/characters"
              className="flex w-full justify-center sm:inline-flex sm:w-auto items-center gap-2 px-7 py-3.5 bg-white/80 backdrop-blur text-stone-800 border border-stone-300 rounded-xl font-semibold transition-colors hover:bg-white"
            >
              <Users size={18} />
              성경 인물
            </Link>
            <Link
              href="/books"
              className="flex w-full justify-center sm:inline-flex sm:w-auto items-center gap-2 px-7 py-3.5 bg-white/80 backdrop-blur text-stone-800 border border-stone-300 rounded-xl font-semibold transition-colors hover:bg-white"
            >
              <BookOpen size={18} />
              성경 66권
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute z-10 bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
          aria-hidden="true"
        >
          <ChevronDown size={22} className="hero-cue text-stone-400" />
        </motion.div>
      </section>

      {/* ── 오늘의 인물 ── */}
      <FeaturedSpotlight characters={characters} />

      {/* ── 안내 (성경 기반 선언) ── */}
      <section className="bg-white py-16 sm:py-20 border-t border-stone-100">
        <motion.div {...reveal()} className="max-w-2xl mx-auto px-6 text-left sm:text-center">
          <div
            className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-5"
            style={{ backgroundColor: `${NAVY}0d`, boxShadow: `inset 0 0 0 1px ${NAVY}1f` }}
          >
            <CrossMark size={20} color={NAVY} />
          </div>
          <h3 className="text-2xl font-bold text-stone-900 mb-4 sm:mb-0" style={serif}>
            진리는 오직 성경에 기반합니다
          </h3>
          <div className="hidden sm:block w-12 h-px bg-stone-200 sm:mx-auto sm:my-5" />
          <p className="text-base sm:text-lg text-stone-500 leading-[1.9] text-left sm:text-justify">
            모든 콘텐츠는 성경 본문에 기록된 내용만을 다루며, 특정 교단이나 교파에 소속되지 않고
            어떠한 이단 단체와도 무관합니다. 추정·전승·외경의 내용은 포함하지 않으며,
            누구나 성경을 쉽고 정확하게 이해할 수 있도록 돕기 위해 만들어졌습니다.
          </p>
        </motion.div>
      </section>

      {/* ── 성경 한눈에 보기 ── */}
      <section className="bg-[#FAFAF7] py-24 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHead eyebrow="OVERVIEW" title="성경 한눈에 보기" subtitle="66권의 책, 하나의 이야기" />

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { href: "/books?tab=old", title: "구약성경", sub: "창조부터 메시아 대망까지", count: 39, cats: otCategories, accent: WARM },
              { href: "/books?tab=new", title: "신약성경", sub: "예수 그리스도와 교회의 시작", count: 27, cats: ntCategories, accent: NAVY },
            ].map((sec, i) => (
              <motion.div key={sec.href} {...reveal(i)}>
                <Link href={sec.href} className="block group h-full">
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl h-full">
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-stone-900" style={serif}>{sec.title}</h3>
                          <p className="text-base text-stone-500 mt-1">{sec.sub}</p>
                        </div>
                        <span className="text-4xl font-extrabold" style={{ ...serif, color: `${sec.accent}33` }}>{sec.count}</span>
                      </div>
                      <div className="space-y-3">
                        {sec.cats.map((cat) => (
                          <div key={cat.name + cat.desc} className="flex items-center gap-3.5">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${cat.color}26, ${cat.color}0f)`,
                                boxShadow: `inset 0 0 0 1px ${cat.color}2b`,
                              }}
                            >
                              <cat.Icon size={19} style={{ color: cat.color }} strokeWidth={1.9} />
                            </div>
                            <div className="flex-1 flex items-baseline justify-between">
                              <span className="text-base font-medium text-stone-800">{cat.name}</span>
                              <span className="text-base text-stone-500">{cat.count}권 · {cat.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 주요 인물 ── */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHead eyebrow="PEOPLE" title="주요 인물" subtitle="하나님의 역사에 쓰임 받은 사람들" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredCharacters.map((char, i) => (
              <motion.div key={char.id} {...reveal(i)} className="h-full">
                <Link href={`/characters/${char.id}`} className="block group h-full">
                  <div className="relative h-full flex flex-col bg-white rounded-2xl border border-stone-200 shadow-sm transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-xl">
                    <div className="flex-1 flex flex-col items-center px-5 pt-8 pb-7 text-center">
                      {/* 아바타 (흰 배경 + 은은한 그림자) */}
                      <div
                        className="rounded-2xl"
                        style={{ boxShadow: `0 14px 30px -16px rgba(28,25,23,0.25), 0 0 0 1px ${char.color}24` }}
                      >
                        <CharacterAvatar character={char} size={176} className="w-28 h-28 sm:w-32 sm:h-32" />
                      </div>
                      <h3 className="text-xl font-bold text-stone-900 mt-5" style={serif}>{char.name}</h3>
                      <p className="text-sm text-stone-400 mt-0.5">{char.nameEn}</p>
                      <span
                        className="inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold"
                        style={{ color: char.color, backgroundColor: `${char.color}14` }}
                      >
                        {char.role}
                      </span>
                      <p className="text-base text-stone-500 mt-3 leading-relaxed line-clamp-2">{char.shortDesc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...reveal()} className="text-center mt-12">
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: NAVY }}
            >
              성경 인물 더 보기
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 핵심 사건 ── */}
      <section className="bg-[#FAFAF7] py-24 border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHead eyebrow="TIMELINE" title="성경의 핵심 사건" subtitle="역사를 바꾼 하나님의 다섯 장면" />

          <div className="space-y-5">
            {keyMoments.map((event, i) => (
              <motion.div key={event.id} {...reveal(i)} className="flex gap-4 sm:gap-5">
                {/* 넘버 배지 + 연결선 */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(135deg, ${event.color}, ${event.color}cc)`,
                      boxShadow: `0 9px 20px -8px ${event.color}99`,
                    }}
                  >
                    <span className="text-xl sm:text-2xl font-extrabold" style={serif}>{i + 1}</span>
                  </div>
                  {i < keyMoments.length - 1 && (
                    <div
                      className="flex-1 w-0.5 mt-1.5 rounded-full"
                      style={{ background: `linear-gradient(${event.color}40, ${event.color}10)` }}
                    />
                  )}
                </div>

                {/* 카드 */}
                <div className="flex-1 mb-1 bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2.5"
                    style={{ color: event.color, backgroundColor: `${event.color}14` }}
                  >
                    {event.era}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mb-2" style={serif}>{event.title}</h3>
                  <p className="text-base text-stone-700 leading-relaxed">{event.description}</p>
                  <p className="text-sm text-stone-400 mt-2.5">{event.verse}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...reveal()} className="text-center mt-12">
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: NAVY }}
            >
              성경 타임라인 보기
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 더 깊이 알아보기 ── */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHead eyebrow="EXPLORE" title="더 깊이 알아보기" subtitle="성경을 다양한 시각으로 탐구하세요" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {exploreItems.map(({ href, Icon, title, desc, color }, i) => (
              <motion.div key={href} {...reveal(i)} className="h-full">
                <Link href={href} className="block group h-full">
                  <div className="relative h-full flex flex-col bg-white rounded-2xl p-6 border border-stone-200 shadow-sm overflow-hidden transition-all duration-200 group-hover:-translate-y-1.5 group-hover:shadow-xl">
                    {/* 호버 시 은은한 색 워시 */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `linear-gradient(160deg, ${color}0f, transparent 62%)` }}
                    />
                    <div
                      className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                        boxShadow: `0 9px 20px -8px ${color}99`,
                      }}
                    >
                      <Icon size={22} strokeWidth={1.9} />
                    </div>
                    <h3 className="relative text-lg font-bold text-stone-900 mb-2" style={serif}>{title}</h3>
                    <p className="relative flex-1 text-base text-stone-500 leading-relaxed">{desc}</p>
                    <span
                      className="relative inline-flex items-center gap-1 mt-4 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color }}
                    >
                      살펴보기 <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 말씀 ── */}
      <section className="relative overflow-hidden py-28 text-white" style={{ backgroundColor: NAVY }}>
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        >
          <CrossMark size={460} color="#ffffff" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center space-y-14">
          <motion.div {...reveal(0)}>
            <blockquote className="text-2xl md:text-3xl leading-relaxed mb-5" style={serif}>
              “태초에 하나님이 천지를 창조하시니라”
            </blockquote>
            <p className="text-base text-white/60 font-medium">창세기 1:1</p>
          </motion.div>
          <div className="w-16 h-px bg-white/25 mx-auto" />
          <motion.div {...reveal(1)}>
            <blockquote className="text-2xl md:text-3xl leading-relaxed mb-5" style={serif}>
              “하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니, 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라”
            </blockquote>
            <p className="text-base text-white/60 font-medium">요한복음 3:16</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
