"use client";

// 본문 텍스트 속 성경 사전 용어를 찾아 점선 밑줄 + 뜻풀이 팝오버로 표시.
// - 한글 부분일치 오탐을 줄이기 위해 모호·단음절 용어는 자동 링크에서 제외
// - 긴 용어 우선 매칭(예: '언약궤'가 '언약'보다 먼저), 본문당 용어별 첫 등장만, 최대 개수 제한
// - 팝오버는 position:fixed + body 포털로 띄우고 좌표를 화면 안으로 클램프
//   → 조상의 overflow 클리핑/모바일 우측 잘림 방지

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { glossaryCategories, glossaryTerms } from "@/data/glossary";

// 자동 링크에서 제외할 용어(다른 단어에 흔히 포함되거나 뜻이 모호)
const EXCLUDE = new Set(["복", "죄", "말씀", "인자", "어린 양"]);
const MAX_PER_TEXT = 6;

const catMap = Object.fromEntries(glossaryCategories.map((c) => [c.id, c]));
const termByName = Object.fromEntries(glossaryTerms.map((t) => [t.term, t]));

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 긴 용어 우선(좌측 우선 매칭) → 정렬 후 정규식 구성
const LINKABLE = glossaryTerms
  .map((t) => t.term)
  .filter((term) => !EXCLUDE.has(term))
  .sort((a, b) => b.length - a.length);
const TERM_PATTERN = "(" + LINKABLE.map(escapeRegExp).join("|") + ")";

function TermPopover({ t }) {
  const cat = catMap[t.cat] || {};
  const color = cat.color || "#57534E";
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState(null); // { left, top, width, above }
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const timer = useRef(null);

  const place = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(300, vw - 24);
    const left = Math.max(12, Math.min(r.left, vw - width - 12));
    const spaceBelow = vh - r.bottom;
    const above = spaceBelow < 180 && r.top > spaceBelow;
    const top = above ? r.top - 8 : r.bottom + 8;
    setBox({ left, top, width, above });
  }, []);

  const show = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    place();
    setOpen(true);
  }, [place]);

  const hideSoon = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const hideNow = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setOpen(false);
  }, []);

  // 열린 동안: 바깥 탭/스크롤/리사이즈 시 닫기
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (btnRef.current?.contains(e.target) || popRef.current?.contains(e.target)) return;
      hideNow();
    };
    const onMove = () => hideNow();
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, hideNow]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={show}
        onMouseEnter={show}
        onMouseLeave={hideSoon}
        className="text-stone-800 border-b border-dotted hover:text-stone-950 focus:outline-none cursor-help"
        style={{ borderColor: `${color}99` }}
      >
        {t.term}
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popRef}
            onMouseEnter={show}
            onMouseLeave={hideSoon}
            style={{
              position: "fixed",
              left: box?.left ?? 0,
              top: box?.top ?? 0,
              width: box?.width ?? 280,
              transform: box?.above ? "translateY(-100%)" : "none",
            }}
            className="z-[60] bg-white border border-stone-200 rounded-lg shadow-xl p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm font-bold" style={{ color }}>
                {t.term}
              </span>
              {cat.name && (
                <span
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}14`, color }}
                >
                  {cat.name}
                </span>
              )}
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">{t.def}</p>
            <Link
              href={`/glossary?term=${encodeURIComponent(t.term)}`}
              onClick={hideNow}
              className="block mt-2 text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              성경 사전에서 보기 →
            </Link>
          </div>,
          document.body
        )}
    </>
  );
}

export default function GlossaryText({ text }) {
  if (!text) return null;
  const out = [];
  const seen = new Set();
  let last = 0;
  let count = 0;
  const re = new RegExp(TERM_PATTERN, "g");
  for (const m of text.matchAll(re)) {
    const name = m[1];
    if (seen.has(name) || count >= MAX_PER_TEXT) continue;
    seen.add(name);
    count += 1;
    const start = m.index;
    if (start > last) out.push(text.slice(last, start));
    out.push(<TermPopover key={start} t={termByName[name]} />);
    last = start + name.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
