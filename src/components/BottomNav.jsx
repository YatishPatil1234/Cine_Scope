"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/",         icon: HomeIcon,    label: "Home"     },
  { href: "/search",   icon: SearchIcon,  label: "Search"   },
  { href: "/discover", icon: CompassIcon, label: "Discover" },
  { href: "/lists",    icon: BookmarkIcon,label: "My Lists" },
  { href: "/stats",    icon: StatsIcon,   label: "Stats"    },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-white/[0.07] bg-zinc-950/95 backdrop-blur-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-14">
        {TABS.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/"
            ? pathname === "/"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-150 ${
                isActive ? "text-indigo-400" : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-indigo-500" />
              )}
              <Icon active={isActive} />
              <span className={`text-[10px] font-bold leading-none tracking-wide ${isActive ? "text-indigo-400" : "text-zinc-600"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      {!active && <path d="M9 21V12h6v9" />}
    </svg>
  );
}

function SearchIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" fill={active ? "currentColor" : "none"} opacity={active ? 0.2 : 1} />
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function CompassIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill={active ? "currentColor" : "none"} opacity={active ? 0.15 : 1} />
      <circle cx="12" cy="12" r="10" />
      <polygon fill={active ? "currentColor" : "none"} points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function BookmarkIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

function StatsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2"  y="13" width="4"  height="9" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="9"  y="8"  width="4"  height="14" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="16" y="2"  width="4"  height="20" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="2"  y="13" width="4"  height="9" rx="1" />
      <rect x="9"  y="8"  width="4"  height="14" rx="1" />
      <rect x="16" y="2"  width="4"  height="20" rx="1" />
    </svg>
  );
}
