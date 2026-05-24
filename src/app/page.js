"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Clock, Users, ArrowRight, MessageCircle,
  Sparkles, ScrollText, GitCompare, Map,
  BookMarked, Music, Megaphone, Cross, Mail,
} from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";
import { characters } from "@/data/characters";
import { timelineEvents } from "@/data/timeline";

const featuredCharacters = characters.filter((c) =>
  ["abraham", "moses", "david", "jesus", "paul"].includes(c.id)
);

const keyMoments = timelineEvents.filter((e) =>
  [1, 3, 9, 19, 21].includes(e.id)
);

const otCategories = [
  { name: "율법서", count: 5, Icon: ScrollText, color: "#2D7A4F", desc: "모세 오경" },
  { name: "역사서", count: 12, Icon: BookMarked, color: "#2B5EA7", desc: "이스라엘의 역사" },
  { name: "시가서", count: 5, Icon: Music, color: "#B5436A", desc: "시, 지혜, 노래" },
  { name: "선지서", count: 17, Icon: Megaphone, color: "#B07830", desc: "예언과 경고" },
];

const ntCategories = [
  { name: "복음서", count: 4, Icon: Cross, color: "#1A7A5A", desc: "예수님의 생애" },
  { name: "역사서", count: 1, Icon: BookMarked, color: "#2B5EA7", desc: "초대 교회" },
  { name: "서신서", count: 21, Icon: Mail, color: "#5E4CA0", desc: "사도들의 편지" },
  { name: "예언서", count: 1, Icon: Sparkles, color: "#A03040", desc: "요한계시록" },
];

const exploreItems = [
  { href: "/parables", Icon: MessageCircle, title: "예수님의 비유", desc: "하나님 나라를 가르치신 20가지 비유", color: "#2B5EA7" },
  { href: "/miracles", Icon: Sparkles, title: "예수님의 기적", desc: "복음서에 기록된 20가지 기적", color: "#1A7A5A" },
  { href: "/prophecies", Icon: ScrollText, title: "메시아 예언", desc: "구약 예언과 신약 성취의 연결", color: "#B07830" },
  { href: "/gospels", Icon: GitCompare, title: "4복음서 비교", desc: "같은 예수님, 네 가지 시선", color: "#5E4CA0" },
  { href: "/map", Icon: Map, title: "성경 지도", desc: "고대 근동의 성경 무대를 탐험", color: "#A03040" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-stone-900 tracking-tight mb-6"
          >
            하나님의 이야기
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="text-xl text-stone-500 max-w-lg mx-auto mb-12 leading-relaxed"
          >
            창세기부터 요한계시록까지,
            <br />
            성경 속 구원의 이야기를 만나보세요
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
            >
              <Clock size={18} />
              타임라인
            </Link>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-stone-800 border border-stone-300 rounded-lg font-medium hover:bg-stone-50 transition-colors"
            >
              <Users size={18} />
              인물 {characters.length}명
            </Link>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-stone-800 border border-stone-300 rounded-lg font-medium hover:bg-stone-50 transition-colors"
            >
              <BookOpen size={18} />
              성경 66권
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 성경 한눈에 보기 */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-4">
            성경 한눈에 보기
          </h2>
          <p className="text-lg text-stone-500 text-center mb-14">
            66권의 책, 하나의 이야기
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 구약 */}
            <Link href="/books?tab=old" className="block group">
              <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900">구약성경</h3>
                    <p className="text-base text-stone-500 mt-1">창조부터 메시아 대망까지</p>
                  </div>
                  <span className="text-3xl font-bold text-stone-400">39</span>
                </div>
                <div className="space-y-3">
                  {otCategories.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <cat.Icon size={16} style={{ color: cat.color }} strokeWidth={2} />
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

            {/* 신약 */}
            <Link href="/books?tab=new" className="block group">
              <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900">신약성경</h3>
                    <p className="text-base text-stone-500 mt-1">예수 그리스도와 교회의 시작</p>
                  </div>
                  <span className="text-3xl font-bold text-stone-400">27</span>
                </div>
                <div className="space-y-3">
                  {ntCategories.map((cat) => (
                    <div key={cat.name + cat.desc} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <cat.Icon size={16} style={{ color: cat.color }} strokeWidth={2} />
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
          </div>
        </div>
      </section>

      {/* 주요 인물 */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-4">
            주요 인물
          </h2>
          <p className="text-lg text-stone-500 text-center mb-14">
            하나님의 역사에 쓰임 받은 사람들
          </p>

          <div className="space-y-4">
            {featuredCharacters.map((char) => (
              <Link key={char.id} href={`/characters/${char.id}`} className="block group">
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex items-center gap-5 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">
                  <CharacterAvatar character={char} size={72} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-stone-900">{char.name}</h3>
                      <span className="text-base text-stone-500">{char.nameEn}</span>
                    </div>
                    <p className="text-base font-medium text-stone-700 mt-0.5">{char.role}</p>
                    <p className="text-base text-stone-500 mt-1 line-clamp-1">{char.shortDesc}</p>
                  </div>
                  <ArrowRight size={18} className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
            >
              전체 {characters.length}명 보기
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 핵심 사건 */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-4">
            성경의 핵심 사건
          </h2>
          <p className="text-lg text-stone-500 text-center mb-14">
            역사를 바꾼 하나님의 다섯 장면
          </p>

          {/* 타임라인 스타일 */}
          <div className="relative">
            {/* 세로 연결선 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-stone-200" />

            <div className="space-y-6">
              {keyMoments.map((event, i) => (
                <div key={event.id} className="relative pl-16">
                  {/* 도트 */}
                  <div
                    className="absolute left-[15px] top-6 w-5 h-5 rounded-full border-[3px] border-white shadow-sm"
                    style={{ backgroundColor: event.color }}
                  />

                  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <p className="text-base font-semibold mb-1" style={{ color: event.color }}>
                      {event.era} · {event.year}
                    </p>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-base text-stone-700 leading-relaxed">
                      {event.description}
                    </p>
                    <p className="text-base text-stone-500 mt-2">{event.verse}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
            >
              전체 타임라인 보기
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 더 깊이 알아보기 */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-4">
            더 깊이 알아보기
          </h2>
          <p className="text-lg text-stone-500 text-center mb-14">
            성경을 다양한 시각으로 탐구하세요
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {exploreItems.map(({ href, Icon, title, desc, color }) => (
              <Link key={href} href={href} className="block group">
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg h-full">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${color}12` }}
                  >
                    <Icon size={20} style={{ color }} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">{title}</h3>
                  <p className="text-base text-stone-500 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 성경 구절 */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-14">
          <div>
            <blockquote className="text-2xl md:text-3xl text-stone-800 leading-relaxed mb-5 italic">
              "태초에 하나님이 천지를 창조하시니라"
            </blockquote>
            <p className="text-base text-stone-500 font-medium">창세기 1:1</p>
          </div>

          <div className="w-16 h-px bg-stone-300 mx-auto" />

          <div>
            <blockquote className="text-2xl md:text-3xl text-stone-800 leading-relaxed mb-5 italic">
              "하나님이 세상을 이처럼 사랑하사
              독생자를 주셨으니 이는 그를 믿는 자마다
              멸망하지 않고 영생을 얻게 하려 하심이라"
            </blockquote>
            <p className="text-base text-stone-500 font-medium">요한복음 3:16</p>
          </div>
        </div>
      </section>
    </div>
  );
}
