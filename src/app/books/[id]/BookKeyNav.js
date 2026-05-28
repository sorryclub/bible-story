"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** 키보드 ← → 로 이전/다음 책 상세로 이동 */
export default function BookKeyNav({ prevId, nextId }) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const el = e.target;
      const tag = (el?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || el?.isContentEditable) return;
      if (e.key === "ArrowLeft" && prevId) {
        router.push(`/books/${prevId}`);
      } else if (e.key === "ArrowRight" && nextId) {
        router.push(`/books/${nextId}`);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevId, nextId, router]);

  return null;
}
