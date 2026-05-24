"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";

// 장면 이미지 컴포넌트 (이미지 없으면 숨김)
function StoryImage({ src, index }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="mb-4 rounded-xl overflow-hidden bg-stone-100">
      <img
        src={src}
        alt={`장면 ${index + 1}`}
        className="w-full h-auto object-cover max-h-[300px]"
        onError={() => setVisible(false)}
        loading="lazy"
      />
    </div>
  );
}

// 구절 참조를 기준으로 단락을 나누고, 구절은 뱃지로 표시, 장면 이미지 삽입
export function StyledDescription({ text, characterId }) {
  const versePattern = /(\([^)]*\d+[:\d\-,\s장]*[^)]*\))/g;
  const normalized = text.replace(/(\([^)]*\d+[:\d\-,\s장]*[^)]*\))\.\s*/g, "$1\n");
  const paragraphs = normalized.split("\n").filter(p => p.trim());

  return (
    <div className="space-y-6">
      {paragraphs.map((para, pi) => {
        const parts = para.split(versePattern);
        const r2 = process.env.NEXT_PUBLIC_R2_URL || "";
        const imgSrc = r2 ? `${r2}/stories/${characterId}_${pi}.jpg` : `/stories/${characterId}_${pi}.jpg`;

        return (
          <div key={pi}>
            {/* 장면 이미지 */}
            <StoryImage src={imgSrc} index={pi} />

            {/* 텍스트 */}
            <p className="text-stone-700 text-lg leading-[2]">
              {parts.map((part, i) => {
                if (versePattern.test(part)) {
                  versePattern.lastIndex = 0;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center ml-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[13px] font-medium whitespace-nowrap align-middle"
                    >
                      {part.slice(1, -1)}
                    </span>
                  );
                }
                const cleaned = part.replace(/^\.\s*/, "").replace(/\s+$/, "");
                if (!cleaned) return null;
                return <span key={i}>{cleaned}</span>;
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// 이미지 모달 + 클릭 가능한 아바타 영역
export function CharacterHeroAvatar({ character }) {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="cursor-pointer"
        onClick={() => setImageOpen(true)}
      >
        <CharacterAvatar character={character} size={160} />
      </motion.div>

      {/* 이미지 모달 */}
      <AnimatePresence>
        {imageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setImageOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <CharacterAvatar character={character} size={400} />
              <button
                onClick={() => setImageOpen(false)}
                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="text-center mt-4">
                <p className="text-white text-xl font-bold">{character.name}</p>
                <p className="text-white/70 text-base">{character.role}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
