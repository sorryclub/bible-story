"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

/** 모바일 공유 시트(navigator.share) 우선, 미지원 시 링크 복사 */
export default function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        /* 사용자가 취소 */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 클립보드 미지원 */
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="공유하기"
      className="inline-flex items-center gap-1.5 text-base px-3 py-1.5 rounded-full font-medium border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "복사됨" : "공유"}
    </button>
  );
}
