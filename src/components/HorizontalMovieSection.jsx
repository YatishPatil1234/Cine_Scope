"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";

export default function HorizontalMovieSection({ title, movies, seeAllHref, eyebrow, accentColor = "#6366f1" }) {
  const list = movies ?? [];
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
    <section className="py-8 sm:py-10">
      {/* ─ Header ───────────────────────────────── */}
      <div className="page-container flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Accent pill */}
          <div className="w-1 h-5 rounded-full shrink-0" style={{ background: accentColor }} />
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-indigo-400 mb-0.5">
                {eyebrow}
              </p>
            )}
            <h2 className="section-title truncate">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Scroll arrows */}
          <button
            type="button"
            onClick={() => scrollBy(-500)}
            disabled={!canLeft}
            aria-label="Scroll left"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-white/[0.09] text-zinc-500 hover:text-white hover:border-white/[0.2] transition-all disabled:opacity-20 disabled:cursor-default text-[18px] leading-none"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(500)}
            disabled={!canRight}
            aria-label="Scroll right"
            className="w-7 h-7 rounded-full flex items-center justify-center border border-white/[0.09] text-zinc-500 hover:text-white hover:border-white/[0.2] transition-all disabled:opacity-20 disabled:cursor-default text-[18px] leading-none"
          >
            ›
          </button>

          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="ml-1 inline-flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors"
            >
              See all <span className="text-sm">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* ─ Scroll strip ─────────────────────────── */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-3 w-16 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to right, #080808 30%, transparent)",
            opacity: canLeft ? 1 : 0,
          }}
        />
        {/* Right fade — always hints there's more */}
        <div
          className="absolute right-0 top-0 bottom-3 w-20 z-10 pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(to left, #080808 30%, transparent)",
            opacity: canRight ? 1 : 0,
          }}
        />

        <div
          ref={ref}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory page-container"
        >
          {list.slice(0, 16).map((movie) => (
            <div key={movie.id} className="w-[142px] sm:w-[160px] shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
