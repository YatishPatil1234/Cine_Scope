"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TVCard from "./TVCard";

export default function HorizontalTVSection({ title, shows, seeAllHref, eyebrow, accentColor = "#22d3ee" }) {
  const list = shows ?? [];
  const ref  = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const sync = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    sync();
    const el = ref.current;
    el?.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      el?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [list.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollBy = (d) => ref.current?.scrollBy({ left: d, behavior: "smooth" });

  if (!list.length) return null;

  return (
    <section className="page-container py-8 sm:py-10">
      {/* ─ Header ───────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-1 h-5 rounded-full shrink-0" style={{ background: accentColor }} />
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] mb-0.5" style={{ color: accentColor }}>
                {eyebrow}
              </p>
            )}
            <h2 className="section-title truncate">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scrollBy(-500)}
            disabled={!canLeft}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.14] text-zinc-300 hover:bg-white/[0.12] hover:text-white hover:border-white/[0.3] transition-all disabled:opacity-25 disabled:cursor-default text-[18px] leading-none"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(500)}
            disabled={!canRight}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/[0.14] text-zinc-300 hover:bg-white/[0.12] hover:text-white hover:border-white/[0.3] transition-all disabled:opacity-25 disabled:cursor-default text-[18px] leading-none"
          >
            ›
          </button>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="ml-1 inline-flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              See all <span className="text-sm">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* ─ Scroll strip ─────────────────────────── */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-3 w-16 z-10 pointer-events-none transition-opacity duration-300"
          style={{ background: "linear-gradient(to right, #080808 30%, transparent)", opacity: canLeft ? 1 : 0 }}
        />
        <div
          className="absolute right-0 top-0 bottom-3 w-20 z-10 pointer-events-none transition-opacity duration-300"
          style={{ background: "linear-gradient(to left, #080808 30%, transparent)", opacity: canRight ? 1 : 0 }}
        />

        <div
          ref={ref}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory"
        >
          {list.slice(0, 16).map((show) => (
            <div key={show.id} className="w-[142px] sm:w-[160px] shrink-0 snap-start">
              <TVCard show={show} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
