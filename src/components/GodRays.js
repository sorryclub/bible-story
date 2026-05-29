"use client";

import { useEffect, useRef } from "react";

// 히어로 배경 — 위에서 은은하게 내려오는 따뜻한 빛줄기.
// 마우스 위치에 따라 빛이 살짝 따라오는 패럴랙스(차분/저비용).
// prefers-reduced-motion이면 정적 표시(애니메이션·패럴랙스 없음).
const BEAMS = [
  { a: -30, op: 0.16, delay: 0, dur: 7.5 },
  { a: -17, op: 0.12, delay: 1.4, dur: 8.6 },
  { a: -7, op: 0.2, delay: 0.6, dur: 7.9 },
  { a: 4, op: 0.13, delay: 2.1, dur: 9.1 },
  { a: 15, op: 0.17, delay: 1.0, dur: 8.2 },
  { a: 27, op: 0.11, delay: 2.6, dur: 8.8 },
];

export default function GodRays() {
  const raysRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = raysRef.current;
    if (!el) return;

    let frame = 0;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2; // [-1, 1]
        el.style.setProperty("--parallax", `${nx * 16}px`);
        el.style.setProperty("--tilt", `${nx * 1.6}deg`);
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* 광원 글로우 */}
      <div
        className="hero-glow-warm absolute -top-40 left-1/2 -translate-x-1/2 w-[120%] h-[640px]"
        style={{ background: "radial-gradient(50% 70% at 50% 0%, rgba(224,180,110,0.22), transparent 70%)" }}
      />
      {/* 빛줄기 */}
      <div ref={raysRef} className="godrays absolute inset-0">
        {BEAMS.map((b, i) => (
          <span
            key={i}
            className="godray"
            style={{ "--angle": `${b.a}deg`, "--op": b.op, "--delay": `${b.delay}s`, "--dur": `${b.dur}s` }}
          />
        ))}
      </div>
    </div>
  );
}
