"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapPin, Route, Info, X } from "lucide-react";

const BibleMap = dynamic(() => import("@/components/BibleMap"), { ssr: false });

export default function MapClient({ locations, journeys }) {
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
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedJourney(null)}
            className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
              !selectedJourney
                ? "bg-stone-800 text-white"
                : "border border-stone-200 text-stone-500 hover:bg-stone-50"
            }`}
          >
            전체
          </button>
          {journeys.map((j) => (
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
                  {activeJourney.era}
                </span>
              </p>
              <p className="text-base text-stone-600 mt-1">
                {activeJourney.description}
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

                <div className="px-5 py-4 space-y-3 max-h-[50vh] overflow-y-auto">
                  {selectedLoc.events.map((ev, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-stone-50 border border-stone-100"
                    >
                      <span
                        className={`text-base font-medium px-2 py-0.5 rounded ${
                          ev.era === "구약"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {ev.era}
                      </span>
                      <h3 className="text-base font-semibold text-stone-800 mt-2">
                        {ev.title}
                      </h3>
                      <p className="text-base text-stone-400 mt-1">
                        {ev.verse}
                      </p>
                    </div>
                  ))}
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
                  지도의 장소를 클릭하여
                  <br />
                  자세한 정보를 확인하세요
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
