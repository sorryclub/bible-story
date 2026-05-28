"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { List, ChevronDown } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";
import GlossaryText from "@/components/GlossaryText";

// 읽기 글자 크기 단계 (장 요약 본문에 적용)
const SIZES = ["text-sm", "text-base", "text-lg", "text-xl"];
const DEFAULT_SIZE = 1;
const SIZE_KEY = "bibleReadSize";

// 텍스트 내 인물 이름을 형광펜 처리
function HighlightedText({ text, highlightName }) {
  if (!highlightName || !text.includes(highlightName)) {
    return <GlossaryText text={text} />;
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
          <GlossaryText key={i} text={part} />
        )
      )}
    </>
  );
}

export default function ChapterList({ chapters, bookColor, characters }) {
  const [activeChapter, setActiveChapter] = useState(null);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [sizeIdx, setSizeIdx] = useState(DEFAULT_SIZE);
  const searchParams = useSearchParams();
  const fromCharId = searchParams.get("from");
  const chParam = searchParams.get("ch");

  // 저장된 글자 크기 불러오기 (effect 본문 동기 setState 회피 위해 다음 틱에)
  useEffect(() => {
    const saved = parseInt(localStorage.getItem(SIZE_KEY) ?? "", 10);
    if (!isNaN(saved) && saved >= 0 && saved < SIZES.length && saved !== DEFAULT_SIZE) {
      const t = setTimeout(() => setSizeIdx(saved), 0);
      return () => clearTimeout(t);
    }
  }, []);

  function changeSize(next) {
    const v = Math.min(SIZES.length - 1, Math.max(0, next));
    setSizeIdx(v);
    try {
      localStorage.setItem(SIZE_KEY, String(v));
    } catch {
      /* 저장 불가 시 무시 */
    }
  }

  // 특정 장으로 스크롤 이동 + 활성화
  function goToChapter(num) {
    setActiveChapter(num);
    const el = document.getElementById(`ch${num}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const summaryClass = SIZES[sizeIdx] || SIZES[DEFAULT_SIZE];

  // ?ch=N 쿼리로 들어온 장으로 이동 (라우터 캐시에도 반응형으로 동작)
  useEffect(() => {
    if (!chParam) return;
    const num = parseInt(chParam, 10);
    if (isNaN(num)) return;
    const t = setTimeout(() => {
      setActiveChapter(num);
      const el = document.getElementById(`ch${num}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => clearTimeout(t);
  }, [chParam]);

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
        setTimeout(() => {
          setActiveChapter(num);
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
    <div>
      {/* 컨트롤: 장 바로가기 + 글자 크기 */}
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setJumpOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 text-base font-medium text-stone-600 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          <List size={15} />
          장 바로가기
          <ChevronDown size={14} className={`transition-transform ${jumpOpen ? "rotate-180" : ""}`} />
        </button>
        <div className="flex items-center gap-1">
          <span className="text-sm text-stone-400 mr-1">글자 크기</span>
          <button
            type="button"
            onClick={() => changeSize(sizeIdx - 1)}
            disabled={sizeIdx === 0}
            aria-label="글자 작게"
            className="w-8 h-8 rounded-md border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent text-sm transition-colors"
          >
            가
          </button>
          <button
            type="button"
            onClick={() => changeSize(DEFAULT_SIZE)}
            aria-label="기본 글자 크기"
            className="w-8 h-8 rounded-md border border-stone-200 text-stone-500 hover:bg-stone-50 text-base transition-colors"
          >
            가
          </button>
          <button
            type="button"
            onClick={() => changeSize(sizeIdx + 1)}
            disabled={sizeIdx === SIZES.length - 1}
            aria-label="글자 크게"
            className="w-8 h-8 rounded-md border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent text-lg transition-colors"
          >
            가
          </button>
        </div>
      </div>

      {/* 장 번호 빠른 이동 그리드 */}
      {jumpOpen && (
        <div className="mb-5 grid grid-cols-8 sm:grid-cols-10 gap-1.5">
          {chapters.map((ch) => (
            <button
              key={ch.chapter}
              type="button"
              onClick={() => goToChapter(ch.chapter)}
              className={`w-full aspect-square rounded flex items-center justify-center text-sm font-medium transition-colors ${
                activeChapter === ch.chapter
                  ? "text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
              style={activeChapter === ch.chapter ? { backgroundColor: bookColor } : {}}
            >
              {ch.chapter}
            </button>
          ))}
        </div>
      )}

      {/* 장 목록 */}
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
            className={`relative rounded-lg scroll-mt-24 transition-all duration-700 ${
              isActive
                ? "bg-white py-4 px-4"
                : "bg-stone-50 hover:bg-stone-100 p-3"
            }`}
            style={isActive ? { boxShadow: `0 0 0 1px ${bookColor}30, 0 4px 20px ${bookColor}15` } : {}}
          >
            {isActive && (
              <div
                className="absolute inset-0 rounded-lg opacity-[0.04] pointer-events-none"
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
                <p className={`${summaryClass} transition-all duration-500 ${
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
    </div>
  );
}
