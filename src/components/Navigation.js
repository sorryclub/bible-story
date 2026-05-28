"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  BookOpen, Clock, Users, Home, Menu, X, Map,
  MessageCircle, Sparkles, ScrollText, GitCompare, ChevronDown, Network, Library, Tags,
} from "lucide-react";

const mainNav = [
  { href: "/", label: "홈", Icon: Home },
  { href: "/timeline", label: "타임라인", Icon: Clock },
  { href: "/characters", label: "인물", Icon: Users },
  { href: "/books", label: "성경", Icon: BookOpen },
  { href: "/map", label: "지도", Icon: Map },
];

const moreNav = [
  { href: "/genealogy", label: "인물 관계도", Icon: Network },
  { href: "/glossary", label: "성경 사전", Icon: Library },
  { href: "/topics", label: "주제별 성경", Icon: Tags },
  { href: "/parables", label: "예수님의 비유", Icon: MessageCircle },
  { href: "/miracles", label: "예수님의 기적", Icon: Sparkles },
  { href: "/prophecies", label: "메시아 예언", Icon: ScrollText },
  { href: "/gospels", label: "4복음서 비교", Icon: GitCompare },
];

const allNav = [...mainNav, ...moreNav];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isMoreActive = moreNav.some(
    (item) => pathname.startsWith(item.href)
  );

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-200">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-2xl font-black tracking-tight text-stone-900">
            진리
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mt-0.5">
            bible
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {mainNav.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-1.5
                  ${active ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"}`}
              >
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`px-4 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-1
                ${isMoreActive ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"}`}
            >
              더보기
              <ChevronDown size={15} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-lg py-2 z-50">
                {moreNav.map(({ href, label, Icon }) => {
                  const active = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors
                        ${active ? "bg-stone-50 text-stone-900" : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"}`}
                    >
                      <Icon size={15} strokeWidth={1.8} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1.5 rounded-md hover:bg-stone-100 text-stone-600"
          aria-label="메뉴"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-2 max-h-[70vh] overflow-y-auto">
          <div className="py-1">
            <p className="px-3 py-2 text-sm font-medium text-stone-400 uppercase tracking-wider">
              메인
            </p>
            {mainNav.map(({ href, label, Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium
                    ${active ? "bg-stone-100 text-stone-900" : "text-stone-500"}`}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  {label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-stone-100 mt-1 pt-1">
            <p className="px-3 py-2 text-sm font-medium text-stone-400 uppercase tracking-wider">
              더 알아보기
            </p>
            {moreNav.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium
                    ${active ? "bg-stone-100 text-stone-900" : "text-stone-500"}`}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
