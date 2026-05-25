"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, Route, Info, X } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";
import { parseVerseRef, tokenizeVerses } from "@/lib/verseLink";

const BibleMap = dynamic(() => import("@/components/BibleMap"), { ssr: false });

// 문장 속 성구를 링크로 렌더링 (여정 설명 등)
function VerseRichText({ text }) {
  return tokenizeVerses(text).map((t, i) =>
    t.href ? (
      <Link
        key={i}
        href={t.href}
        className="text-stone-700 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-600 transition-colors"
      >
        {t.text}
      </Link>
    ) : (
      <span key={i}>{t.text}</span>
    )
  );
}

export default function MapClient({ locations, journeys, characters = [] }) {
  const characterMap = useMemo(() => {
    const m = {};
    characters.forEach((c) => { m[c.id] = c; });
    return m;
  }, [characters]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const activeJourney = useMemo(
    () => journeys.find((j) => j.id === selectedJourney) || null,
    [selectedJourney, journeys]
  );

  const selectedLoc = useMemo(
    () => locations.find((l) => l.id === selectedLocation) || null,
    [selectedLocation, locations]
  );

  // 여정을 시대(period)별로 묶기 (연대순 정렬된 journeys 기준, 타임라인식 구조)
  const journeyGroups = useMemo(() => {
    const groups = [];
    let cur = null;
    for (const j of journeys) {
      if (!cur || cur.period !== j.period) {
        cur = { period: j.period || "기타", items: [] };
        groups.push(cur);
      }
      cur.items.push(j);
    }
    return groups;
  }, [journeys]);

  // 여정 경로의 정류장(중복 제거, 지도의 번호 마커와 동일 순서)
  const journeyStops = useMemo(() => {
    if (!activeJourney) return [];
    const seen = new Set();
    const stops = [];
    for (const id of activeJourney.path || []) {
      if (seen.has(id)) continue;
      seen.add(id);
      const loc = locations.find((l) => l.id === id);
      if (loc) stops.push(loc);
    }
    return stops;
  }, [activeJourney, locations]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
          성경 지도
        </h1>
        <p className="text-lg text-stone-500">
          성경의 무대가 된 고대 근동과 지중해 세계를 자유롭게 탐험하세요
        </p>
      </section>

      {/* 여정 선택 */}
      <section className="max-w-6xl mx-auto px-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Route size={16} className="text-stone-400" />
          <span className="text-base font-medium text-stone-500">여정 경로</span>
        </div>
        <div className="mb-3">
          <button
            onClick={() => setSelectedJourney(null)}
            className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
              !selectedJourney
                ? "bg-stone-800 text-white"
                : "border border-stone-200 text-stone-500 hover:bg-stone-50"
            }`}
          >
            전체 보기
          </button>
        </div>

        {/* 시대별 여정 (연대순) */}
        <div className="flex flex-col gap-3">
          {journeyGroups.map((g) => (
            <div
              key={g.period}
              className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3"
            >
              <span className="text-sm font-semibold text-stone-400 sm:w-24 sm:shrink-0 sm:pt-2">
                {g.period}
              </span>
              <div className="flex flex-wrap gap-2">
                {g.items.map((j) => (
                  <button
                    key={j.id}
                    onClick={() =>
                      setSelectedJourney(j.id === selectedJourney ? null : j.id)
                    }
                    className={`px-4 py-2 rounded-lg text-base font-medium transition-colors flex items-center gap-2 ${
                      selectedJourney === j.id
                        ? "bg-stone-800 text-white"
                        : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: j.color }}
                    />
                    {j.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 여정 설명 */}
      {activeJourney && (
        <section className="max-w-6xl mx-auto px-6 pb-4">
          <div
            className="rounded-xl p-4 border flex items-start gap-3"
            style={{
              borderColor: `${activeJourney.color}30`,
              backgroundColor: `${activeJourney.color}08`,
            }}
          >
            <Info size={18} className="text-stone-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-base font-bold text-stone-800">
                {activeJourney.name}
                <span className="ml-2 text-base font-normal text-stone-400">
                  {activeJourney.period}
                </span>
              </p>
              <p className="text-base text-stone-600 mt-1">
                <VerseRichText text={activeJourney.description} />
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 지도 + 디테일 */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <BibleMap
              locations={locations}
              journeys={journeys}
              selectedJourney={selectedJourney}
              selectedLocation={selectedLocation}
              onSelectLocation={(id) =>
                setSelectedLocation(id === selectedLocation ? null : id)
              }
            />
          </div>

          <div className="w-full lg:w-80 shrink-0">
            {selectedLoc ? (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden sticky top-20">
                <div className="px-5 py-4 border-b border-stone-100 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      {selectedLoc.name}
                    </h2>
                    <p className="text-base text-stone-400 mt-0.5">
                      {selectedLoc.nameEn} · {selectedLoc.region}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="p-1 rounded-md hover:bg-stone-100 text-stone-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="px-5 py-4 space-y-3 max-h-[55vh] overflow-y-auto">
                  {/* 지역 설명 */}
                  {selectedLoc.description && (
                    <p className="text-base text-stone-600 leading-relaxed pb-1">
                      {selectedLoc.description}
                    </p>
                  )}

                  {/* 관련 인물 */}
                  {(() => {
                    const chars = (selectedLoc.characters || [])
                      .map((id) => characterMap[id])
                      .filter(Boolean);
                    if (!chars.length) return null;
                    return (
                      <div className="pb-4 border-b border-stone-100">
                        <p className="text-sm font-medium text-stone-400 mb-3">
                          관련 인물
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-4">
                          {chars.map((c) => (
                            <Link
                              key={c.id}
                              href={`/characters/${c.id}`}
                              className="flex items-center gap-2 group"
                            >
                              <CharacterAvatar character={c} size={44} />
                              <span className="text-base text-stone-600 group-hover:text-stone-900 transition-colors">
                                {c.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {selectedLoc.events.map((ev, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-stone-50 border border-stone-100"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-base font-medium px-2 py-0.5 rounded ${
                            ev.era === "구약"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ev.era}
                        </span>
                        {(() => {
                          const link = parseVerseRef(ev.verse);
                          return link ? (
                            <Link
                              href={link.href}
                              className="text-sm text-stone-400 hover:text-stone-700 hover:underline transition-colors"
                            >
                              {ev.verse}
                            </Link>
                          ) : (
                            <span className="text-sm text-stone-400">
                              {ev.verse}
                            </span>
                          );
                        })()}
                      </div>
                      <h3 className="text-base font-semibold text-stone-800 mt-2">
                        {ev.title}
                      </h3>
                      {ev.summary && (
                        <p className="text-base text-stone-600 leading-relaxed mt-1">
                          {ev.summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : activeJourney ? (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden sticky top-20">
                <div className="px-5 py-4 border-b border-stone-100 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: activeJourney.color }}
                      />
                      <h2 className="text-xl font-bold text-stone-900">
                        {activeJourney.name}
                      </h2>
                    </div>
                    <p className="text-base text-stone-400 mt-0.5">
                      {activeJourney.period} · 경유 {journeyStops.length}곳
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedJourney(null)}
                    className="p-1 rounded-md hover:bg-stone-100 text-stone-400"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="px-5 py-4 max-h-[55vh] overflow-y-auto">
                  {activeJourney.description && (
                    <p className="text-base text-stone-600 leading-relaxed pb-4 mb-4 border-b border-stone-100">
                      <VerseRichText text={activeJourney.description} />
                    </p>
                  )}
                  <ol className="relative">
                    {journeyStops.map((loc, i) => (
                      <li key={loc.id + i} className="relative pl-9 pb-6 last:pb-0">
                        {i < journeyStops.length - 1 && (
                          <span
                            className="absolute left-[11px] top-7 bottom-0 w-px"
                            style={{ backgroundColor: `${activeJourney.color}40` }}
                          />
                        )}
                        <span
                          className="absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: activeJourney.color }}
                        >
                          {i + 1}
                        </span>
                        <button
                          onClick={() => setSelectedLocation(loc.id)}
                          className="text-left group block"
                        >
                          <span className="text-base font-semibold text-stone-800 group-hover:text-stone-950 transition-colors">
                            {loc.name}
                            <span className="ml-1.5 text-sm font-normal text-stone-400">
                              {loc.nameEn}
                            </span>
                          </span>
                        </button>
                        {loc.description && (
                          <p className="text-base text-stone-500 leading-relaxed mt-1">
                            {loc.description}
                          </p>
                        )}
                        {(() => {
                          const chars = (loc.characters || [])
                            .map((id) => characterMap[id])
                            .filter(Boolean);
                          if (!chars.length) return null;
                          return (
                            <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                              {chars.map((c) => (
                                <Link
                                  key={c.id}
                                  href={`/characters/${c.id}`}
                                  className="flex items-center gap-1.5 group"
                                >
                                  <CharacterAvatar character={c} size={30} />
                                  <span className="text-sm text-stone-500 group-hover:text-stone-800 transition-colors">
                                    {c.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          );
                        })()}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-xl border border-stone-100 p-8 text-center sticky top-20">
                <MapPin
                  size={32}
                  className="text-stone-300 mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-base text-stone-400 leading-relaxed">
                  여정을 선택하거나 지도의 장소를 클릭하여 자세한 정보를 확인하세요
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
