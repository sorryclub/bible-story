"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Star,
  Users,
  ChevronRight,
  X,
} from "lucide-react";
import { characters, getCharacter } from "@/data/characters";
import { getBook } from "@/data/books";
import { timelineEvents } from "@/data/timeline";
import CharacterAvatar from "@/components/CharacterAvatar";

// 구절 참조를 기준으로 단락을 나누고, 구절은 뱃지로 표시, 장면 이미지 삽입
function StyledDescription({ text, characterId }) {
  const versePattern = /(\([^)]*\d+[:\d\-,\s장]*[^)]*\))/g;
  const normalized = text.replace(/(\([^)]*\d+[:\d\-,\s장]*[^)]*\))\.\s*/g, "$1\n");
  const paragraphs = normalized.split("\n").filter(p => p.trim());

  return (
    <div className="space-y-6">
      {paragraphs.map((para, pi) => {
        const parts = para.split(versePattern);
        const imgSrc = `/stories/${characterId}_${pi}.jpg`;

        return (
          <div key={pi}>
            {/* 장면 이미지 */}
            <StoryImage src={imgSrc} index={pi} />

            {/* 텍스트 */}
            <p className="text-stone-700 text-lg leading-[2]">
              {parts.map((part, i) => {
                if (versePattern.test(part)) {
                  versePattern.lastIndex = 0;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center ml-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[13px] font-medium whitespace-nowrap align-middle"
                    >
                      {part.slice(1, -1)}
                    </span>
                  );
                }
                const cleaned = part.replace(/^\.\s*/, "").replace(/\s+$/, "");
                if (!cleaned) return null;
                return <span key={i}>{cleaned}</span>;
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// 장면 이미지 컴포넌트 (이미지 없으면 숨김)
function StoryImage({ src, index }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="mb-4 rounded-xl overflow-hidden bg-stone-100">
      <img
        src={src}
        alt={`장면 ${index + 1}`}
        className="w-full h-auto object-cover max-h-[300px]"
        onError={() => setVisible(false)}
        loading="lazy"
      />
    </div>
  );
}

// 주요 사건의 (창세기 2:7) 참조를 분리하여 표시
function StyledEvent({ text }) {
  const match = text.match(/^(.*?)\s*(\([^)]*\d+[:\d\-,\s장]*[^)]*\))$/);
  if (match) {
    return (
      <div>
        <p className="text-stone-700 text-base">{match[1]}</p>
        <p className="text-stone-500 text-[14px] mt-0.5">{match[2].slice(1, -1)}</p>
      </div>
    );
  }
  return <p className="text-stone-700 text-base">{text}</p>;
}

export default function CharacterDetailPage({ params }) {
  const { id } = use(params);
  const character = getCharacter(id);
  const [imageOpen, setImageOpen] = useState(false);

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-stone-300" />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            인물을 찾을 수 없습니다
          </h1>
          <p className="text-stone-500 text-base mb-6">
            요청하신 인물 정보가 존재하지 않습니다
          </p>
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            인물 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const relatedCharacters = character.relatedCharacters
    .map(getCharacter)
    .filter(Boolean);

  const relatedBooks = character.books.map(getBook).filter(Boolean);

  const relatedEvents = timelineEvents.filter((e) =>
    e.characters.includes(character.id)
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-stone-100 to-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 text-base mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            인물 목록
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer"
              onClick={() => setImageOpen(true)}
            >
              <CharacterAvatar character={character} size={160} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-1">
                {character.name}
              </h1>
              <p className="text-stone-400 mb-2">{character.nameEn}</p>
              <p className="text-lg font-medium text-stone-600 mb-3">
                {character.role}
              </p>
              <div className="inline-block px-3 py-1 rounded-full text-base bg-stone-800 text-white mb-4">
                {character.period}
              </div>
              <p className="text-stone-500 leading-relaxed max-w-lg">
                {character.shortDesc}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content - 2/3 */}
          <div className="md:col-span-2 space-y-8">
            {/* Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-stone-500" />
                이야기
              </h2>
              <StyledDescription text={character.description} characterId={character.id} />
            </motion.div>

            {/* Key Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-stone-500" />
                주요 사건
              </h2>
              <div className="space-y-4">
                {character.keyEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-stone-50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-800 text-white text-base font-bold shrink-0">
                      {i + 1}
                    </div>
                    <StyledEvent text={event} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Timeline Events */}
            {relatedEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 border border-stone-200"
              >
                <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-stone-600" />
                  타임라인 속 사건
                </h2>
                <div className="space-y-4">
                  {relatedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100"
                    >
                      <Clock className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-stone-900 text-base">
                          {event.title}
                        </h4>
                        <p className="text-base text-stone-400 mt-0.5">
                          {event.year}
                        </p>
                        <p className="text-base text-stone-500 mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-6">
            {/* Key Verses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-stone-50 rounded-xl p-5 border border-stone-200"
            >
              <h3 className="font-bold text-stone-900 mb-3 text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-stone-600" />
                핵심 성경 구절
              </h3>
              <div className="space-y-2">
                {character.keyVerses.map((verse, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 bg-white rounded-lg text-base text-stone-700 border border-stone-100"
                  >
                    {verse}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Related Books */}
            {relatedBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-5 border border-stone-200"
              >
                <h3 className="font-bold text-stone-900 mb-3 text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-stone-600" />
                  관련 성경
                </h3>
                <div className="space-y-1">
                  {relatedBooks.map((book) => (
                    <Link
                      key={book.id}
                      href={`/books/${book.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
                      <span className="text-base text-stone-700">
                        {book.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related Characters */}
            {relatedCharacters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl p-5 border border-stone-200"
              >
                <h3 className="font-bold text-stone-900 mb-3 text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-stone-600" />
                  관련 인물
                </h3>
                <div className="space-y-3">
                  {relatedCharacters.map((char) => (
                    <Link
                      key={char.id}
                      href={`/characters/${char.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
                      <CharacterAvatar character={char} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-stone-900">
                          {char.name}
                        </p>
                        <p className="text-base text-stone-500">{char.role}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 이미지 모달 */}
      <AnimatePresence>
        {imageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setImageOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <CharacterAvatar character={character} size={400} />
              <button
                onClick={() => setImageOpen(false)}
                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="text-center mt-4">
                <p className="text-white text-xl font-bold">{character.name}</p>
                <p className="text-white/70 text-base">{character.role}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
