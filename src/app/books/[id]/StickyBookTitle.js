"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";

/**
 * 상세 페이지에서 히어로 제목(#book-hero-title)이 상단 네비게이션 아래로
 * 스크롤되어 사라지면, 네비 바로 아래에 현재 책 이름 + 읽기 진행률을 고정 표시.
 */
export default function StickyBookTitle({ name, nameEn, color, category }) {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  // 제목이 화면(네비 아래)에서 사라졌는지 관찰
  useEffect(() => {
    const target = document.getElementById("book-hero-title");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  // 페이지 읽기 진행률
  useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
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
          className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm"
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
          {/* 읽기 진행률 */}
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-stone-100">
            <div
              className="h-full"
              style={{ width: `${progress * 100}%`, backgroundColor: color || "#57534E" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
