"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SENT_KEY = "pv-sent-date";

// 방문은 하루 1번, 처음 들어온 페이지로만 보낸다.
// 서버도 같은 IP 를 하루 1번만 기록하므로, 페이지를 옮길 때마다 보내던 호출은 기록 없이 서버만 깨웠다.
export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;

    const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD (브라우저 시간대)
    try {
      if (localStorage.getItem(SENT_KEY) === today) return;
      localStorage.setItem(SENT_KEY, today);
    } catch {
      // 저장소를 못 쓰는 브라우저(사생활 보호 모드 등)는 그대로 보낸다 — 서버가 IP 로 걸러낸다.
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
