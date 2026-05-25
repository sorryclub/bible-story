"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageTracker() {
  const pathname = usePathname();
  const tracked = useRef("");

  useEffect(() => {
    if (tracked.current === pathname) return;
    tracked.current = pathname;

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
