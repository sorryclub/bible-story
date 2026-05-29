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
    <div className="text-center mb-14">
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: NAVY }}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900" style={serif}>
        {title}
      </h2>
      {subtitle && <p className="text-lg text-stone-500 mt-3">{subtitle}</p>}
    </div>
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

      {/* ── 안내 ── */}
      <section className="bg-white py-10 border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-stone-50 rounded-2xl px-4 py-5 sm:px-6 sm:py-8 border border-stone-200">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-stone-200">
                <BookOpen size={18} className="text-stone-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">진리는 오직 성경에 기반합니다</h3>
                <p className="text-base text-stone-600 leading-[1.8] text-justify">
                  모든 콘텐츠는 성경 본문에 기록된 내용만을 다루며, 특정 교단이나 교파에 소속되지 않고 어떠한 이단 단체와도 무관합니다. 추정, 전승, 외경의 내용은 포함하지 않으며, 누구나 성경을 쉽고 정확하게 이해할 수 있도록 돕기 위해 만들어졌습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 성경 한눈에 보기 ── */}
      <section className="bg-[#FAFAF7] py-24 border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHead eyebrow="OVERVIEW" title="성경 한눈에 보기" subtitle="66권의 책, 하나의 이야기" />

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { href: "/books?tab=old", title: "구약성경", sub: "창조부터 메시아 대망까지", count: 39, cats: otCategories },
              { href: "/books?tab=new", title: "신약성경", sub: "예수 그리스도와 교회의 시작", count: 27, cats: ntCategories },
            ].map((sec) => (
              <Link key={sec.href} href={sec.href} className="block group">
                <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-900" style={serif}>{sec.title}</h3>
                      <p className="text-base text-stone-500 mt-1">{sec.sub}</p>
                    </div>
                    <span className="text-4xl font-extrabold" style={{ ...serif, color: `${NAVY}33` }}>{sec.count}</span>
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 주요 인물 ── */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHead eyebrow="PEOPLE" title="주요 인물" subtitle="하나님의 역사에 쓰임 받은 사람들" />

          <div className="space-y-4">
            {featuredCharacters.map((char) => (
              <Link key={char.id} href={`/characters/${char.id}`} className="block group">
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 flex items-center gap-4 sm:gap-5 transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-1">
                  <CharacterAvatar character={char} size={96} className="w-16 h-16 sm:w-24 sm:h-24 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline flex-wrap gap-x-2">
                      <h3 className="text-lg sm:text-xl font-bold text-stone-900">{char.name}</h3>
                      <span className="text-sm sm:text-base text-stone-500">{char.nameEn}</span>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-stone-700 mt-0.5 line-clamp-1">{char.role}</p>
                    <p className="text-sm sm:text-base text-stone-500 mt-0.5 line-clamp-2 sm:line-clamp-1">{char.shortDesc}</p>
                  </div>
                  <ArrowRight size={18} className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: NAVY }}
            >
              성경 인물 더 보기
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 핵심 사건 ── */}
      <section className="bg-[#FAFAF7] py-24 border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHead eyebrow="TIMELINE" title="성경의 핵심 사건" subtitle="역사를 바꾼 하나님의 다섯 장면" />

          <div className="relative">
            <div className="absolute left-4 sm:left-6 top-2 bottom-2 w-0.5 bg-stone-200" />
            <div className="space-y-6">
              {keyMoments.map((event) => (
                <div key={event.id} className="relative pl-10 sm:pl-16">
                  <div
                    className="absolute left-[6px] sm:left-[15px] top-6 w-5 h-5 rounded-full border-[3px] border-white shadow-sm"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 transition-all hover:shadow-lg">
                    <p className="text-base font-semibold mb-1" style={{ color: event.color }}>
                      {event.era}
                    </p>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">{event.title}</h3>
                    <p className="text-base text-stone-700 leading-relaxed">{event.description}</p>
                    <p className="text-base text-stone-400 mt-2">{event.verse}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: NAVY }}
            >
              성경 타임라인 보기
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 더 깊이 알아보기 ── */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHead eyebrow="EXPLORE" title="더 깊이 알아보기" subtitle="성경을 다양한 시각으로 탐구하세요" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {exploreItems.map(({ href, Icon, title, desc, color }) => (
              <Link key={href} href={href} className="block group">
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl h-full">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${color}26, ${color}0f)`,
                      boxShadow: `inset 0 0 0 1px ${color}2b`,
                    }}
                  >
                    <Icon size={22} style={{ color }} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">{title}</h3>
                  <p className="text-base text-stone-500 leading-relaxed">{desc}</p>
                </div>
              </Link>
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
          <div>
            <blockquote className="text-2xl md:text-3xl leading-relaxed mb-5" style={serif}>
              “태초에 하나님이 천지를 창조하시니라”
            </blockquote>
            <p className="text-base text-white/60 font-medium">창세기 1:1</p>
          </div>
          <div className="w-16 h-px bg-white/25 mx-auto" />
          <div>
            <blockquote className="text-2xl md:text-3xl leading-relaxed mb-5" style={serif}>
              “하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니, 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라”
            </blockquote>
            <p className="text-base text-white/60 font-medium">요한복음 3:16</p>
          </div>
        </div>
      </section>
    </div>
  );
}
