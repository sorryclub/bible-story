"use client";

import { useState } from "react";

export default function CharacterAvatar({ character, size = 120 }) {
  const [error, setError] = useState(false);
  const src = `/characters/${character.id}.jpg`;

  if (error) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{ width: size, height: size, backgroundColor: `${character.color}20` }}
      >
        <span className="font-bold" style={{ fontSize: size * 0.3, color: character.color }}>
          {character.name[0]}
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ width: size, height: size, backgroundColor: `${character.color}08` }}
    >
      <img
        src={src}
        alt={character.name}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
