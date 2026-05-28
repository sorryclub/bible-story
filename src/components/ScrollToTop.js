"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

/** 스크롤을 어느 정도 내리면 우하단에 나타나는 "맨 위로" 버튼 (전역) */
export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      setShow(window.scrollY > 500);
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.18 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="맨 위로"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white border border-stone-200 shadow-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:shadow-xl transition-shadow"
        >
          <ArrowUp size={20} strokeWidth={2.2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
