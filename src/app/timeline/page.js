"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Filter, BookOpen, ChevronRight } from "lucide-react";
import { timelineEvents, eras } from "@/data/timeline";
import { getCharacter } from "@/data/characters";
import CharacterAvatar from "@/components/CharacterAvatar";

export default function TimelinePage() {
  const [selectedEra, setSelectedEra] = useState("all");

  const filteredEvents =
    selectedEra === "all"
      ? timelineEvents
      : timelineEvents.filter((e) => e.era === selectedEra);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-16 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-stone-400 text-base mb-4">
            <Clock size={16} />
            <span>Bible Timeline</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            성경 타임라인
          </h1>
          <p className="text-stone-500 text-base leading-relaxed max-w-xl">
            창조부터 초대교회까지, 하나님의 역사를 시간 순으로 따라가 보세요
          </p>

          {/* Era Filter */}
          <div className="mt-8 flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-stone-400 mr-1" />
            <button
              onClick={() => setSelectedEra("all")}
              className={`px-4 py-1.5 rounded-full text-base font-medium transition-colors ${
                selectedEra === "all"
                  ? "bg-stone-800 text-white"
                  : "border border-stone-200 text-stone-500 hover:bg-stone-50"
              }`}
            >
              전체
            </button>
            {eras.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era.name)}
                className={`px-4 py-1.5 rounded-full text-base font-medium transition-colors ${
                  selectedEra === era.name
                    ? "bg-stone-800 text-white"
                    : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                }`}
              >
                {era.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <div className="relative">
          {/* Vertical line */}
          <div className="timeline-line" />

          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, i) => {
              const isLeft = i % 2 === 0;
              const eventCharacters = event.characters
                .map(getCharacter)
                .filter(Boolean);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className={`relative mb-10 md:mb-14 pl-12 md:pl-0 ${
                    isLeft ? "md:pr-[52%]" : "md:pl-[52%]"
                  }`}
                >
                  {/* Dot on timeline */}
                  <div
                    className="absolute left-[22px] md:left-1/2 md:-translate-x-1/2 top-5 w-3 h-3 rounded-full z-10 border-2 border-white"
                    style={{ backgroundColor: event.color }}
                  />

                  {/* Card */}
                  <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
                    {/* Era tag & year */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-base font-medium"
                        style={{
                          backgroundColor: `${event.color}12`,
                          color: event.color,
                        }}
                      >
                        {event.era}
                      </span>
                      <span className="text-base text-stone-400">
                        {event.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-stone-900 mb-1.5">
                      {event.title}
                    </h3>
                    <p className="text-base text-stone-600 leading-relaxed mb-3">
                      {event.description}
                    </p>

                    {/* Verse reference */}
                    <div className="flex items-center gap-1.5 text-base text-stone-400 mb-4">
                      <BookOpen size={12} />
                      <span>{event.verse}</span>
                    </div>

                    {/* Related characters */}
                    {eventCharacters.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100">
                        {eventCharacters.map((char) => (
                          <Link
                            key={char.id}
                            href={`/characters/${char.id}`}
                            className="flex items-center gap-1.5 group"
                          >
                            <CharacterAvatar character={char} size={28} />
                            <span className="text-base text-stone-500 group-hover:text-stone-800 transition-colors">
                              {char.name}
                            </span>
                            <ChevronRight
                              size={10}
                              className="text-stone-300 group-hover:text-stone-500 transition-colors"
                            />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
