"use client";

import { useState } from "react";
import Image from "next/image";

export default function CharacterAvatar({ character, size = 120, priority = false, className = "" }) {
  const [error, setError] = useState(false);
  const r2 = process.env.NEXT_PUBLIC_R2_URL || "";
  const src = r2 ? `${r2}/characters/${character.id}.jpg` : `/characters/${character.id}.jpg`;

  // className이 주어지면 크기를 className(반응형 가능)으로 제어하고, 없으면 기존처럼 인라인 size 사용
  const sizeStyle = className ? {} : { width: size, height: size };

  if (error) {
    return (
      <div
        className={`rounded-2xl flex items-center justify-center shrink-0 ${className}`}
        style={{ ...sizeStyle, backgroundColor: `${character.color}20` }}
      >
        <span className="font-bold" style={{ fontSize: size * 0.3, color: character.color }}>
          {character.name[0]}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{ ...sizeStyle, backgroundColor: `${character.color}08` }}
    >
      <Image
        src={src}
        alt={character.name}
        width={size}
        height={size}
        priority={priority}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
