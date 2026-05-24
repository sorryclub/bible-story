"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CharacterAvatar from "@/components/CharacterAvatar";

// 텍스트 내 인물 이름을 형광펜 처리
function HighlightedText({ text, highlightName }) {
  if (!highlightName || !text.includes(highlightName)) {
    return <>{text}</>;
  }
  const parts = text.split(new RegExp(`(${highlightName})`, "g"));
  return (
    <>
      {parts.map((part, i) =>
        part === highlightName ? (
          <mark
            key={i}
            className="bg-yellow-200/70 text-stone-900 px-0.5 rounded-sm"
            style={{ textDecoration: "none" }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ChapterList({ chapters, bookColor, characters }) {
  const [activeChapter, setActiveChapter] = useState(null);
  const searchParams = useSearchParams();
  const fromCharId = searchParams.get("from");

  // from 인물의 이름
  const fromCharName = useMemo(() => {
    if (!fromCharId || !characters) return null;
    const c = characters.find(ch => ch.id === fromCharId);
    return c ? c.name : null;
  }, [fromCharId, characters]);

  const charMap = {};
  if (characters) {
    characters.forEach(c => { charMap[c.id] = c; });
  }

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#ch")) {
      const num = parseInt(hash.replace("#ch", ""));
      if (!isNaN(num)) {
        setActiveChapter(num);
        setTimeout(() => {
          const el = document.getElementById(hash.slice(1));
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }

    function onHash() {
      const h = window.location.hash;
      if (h && h.startsWith("#ch")) {
        const n = parseInt(h.replace("#ch", ""));
        if (!isNaN(n)) setActiveChapter(n);
      }
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="space-y-2">
      {chapters.map((ch) => {
        const isActive = activeChapter === ch.chapter;
        const chChars = (ch.characterIds || [])
          .map(id => charMap[id])
          .filter(Boolean);

        return (
          <div
            key={ch.chapter}
            id={`ch${ch.chapter}`}
            className={`relative rounded-lg scroll-mt-24 transition-all duration-700 overflow-hidden ${
              isActive
                ? "bg-white py-4 px-4"
                : "bg-stone-50 hover:bg-stone-100 p-3"
            }`}
            style={isActive ? { boxShadow: `0 0 0 1px ${bookColor}30, 0 4px 20px ${bookColor}15` } : {}}
          >
            {isActive && (
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${bookColor}, transparent 70%)` }}
              />
            )}

            <div className="relative flex items-start gap-3">
              <span
                className={`shrink-0 rounded-lg flex items-center justify-center font-bold text-white transition-all duration-500 ${
                  isActive ? "w-10 h-10 text-lg" : "w-8 h-8 text-base"
                }`}
                style={{ backgroundColor: bookColor }}
              >
                {ch.chapter}
              </span>

              <div className="flex-1 min-w-0">
                <p className={`text-base transition-all duration-500 ${
                  isActive ? "text-stone-900 font-medium" : "text-stone-700"
                }`}>
                  <HighlightedText text={ch.summary} highlightName={fromCharName} />
                </p>

                {chChars.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {chChars.map(c => {
                      const isFromChar = fromCharId === c.id;
                      return (
                        <Link
                          key={c.id}
                          href={`/characters/${c.id}`}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                            isFromChar
                              ? "bg-blue-50 ring-1 ring-blue-200"
                              : "bg-stone-100 hover:bg-stone-200"
                          }`}
                        >
                          <CharacterAvatar character={c} size={32} />
                          <span className={`text-base font-medium ${
                            isFromChar ? "text-stone-900" : "text-stone-700"
                          }`}>
                            {c.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
