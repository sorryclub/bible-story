"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";

/**
 * 상세 페이지에서 히어로 제목(#book-hero-title)이 상단 네비게이션 아래로
 * 스크롤되어 사라지면, 네비 바로 아래에 현재 책 이름을 고정으로 표시한다.
 */
export default function StickyBookTitle({ name, nameEn, color, category }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("book-hero-title");
    if (!target) return;
    // 네비게이션 높이(64px)만큼 상단을 줄인 영역 기준으로 관찰
    const obs = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sticky-book-title"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm"
        >
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-2 py-2.5">
              <BookOpen size={16} strokeWidth={2} style={{ color: color || "#57534E" }} />
              <span className="text-base font-semibold text-stone-800">{name}</span>
              {nameEn && <span className="text-sm text-stone-400">{nameEn}</span>}
              {category && (
                <span className="ml-auto text-sm text-stone-400">{category}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
