"use client";

import SurpriseMe from "@/components/SurpriseMe";
import { backdropUrl } from "@/lib/images";
import { isInList, toggleListItem } from "@/lib/lists";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

const INTERVAL = 7000;
const SWIPE_THRESHOLD = 50;

export default function Hero({ movies = [] }) {
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  const [saved, setSaved]   = useState(false);
  const timerRef   = useRef(null);
  const touchX     = useRef(null);
  const sectionRef = useRef(null);

  const movie = movies[idx];

  const goTo = useCallback((next) => {
    setIdx(((next % movies.length) + movies.length) % movies.length);
  }, [movies.length]);

  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);

  // Single clean autoplay timer — pauses on hover/focus, resets on manual nav.
  useEffect(() => {
    if (movies.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % movies.length);
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [movies.length, paused, idx]);

  // Preload the next slide's backdrop so switching to it never flashes/pops.
  useEffect(() => {
    if (movies.length <= 1) return;
    const nextMovie = movies[(idx + 1) % movies.length];
    const src = backdropUrl(nextMovie?.backdrop_path, "original");
    if (!src) return;
    const img = new Image();
    img.src = src;
  }, [idx, movies]);

  // Sync watchlist state for the currently shown movie
  useEffect(() => {
    if (!movie) return;
    setSaved(isInList("watchlist", movie.id, "movie"));
  }, [movie]);

  // Keyboard navigation while the hero is in view
  useEffect(() => {
    if (movies.length <= 1) return;
    function onKey(e) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [movies.length, prev, next]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (delta > SWIPE_THRESHOLD) prev();
    else if (delta < -SWIPE_THRESHOLD) next();
    touchX.current = null;
  };

  const toggleSave = () => {
    if (!movie) return;
    const { added } = toggleListItem("watchlist", {
      id: movie.id,
      mediaType: "movie",
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    });
    setSaved(added);
  };

  if (!movies.length) return <HeroFallback />;

  const backdrop = backdropUrl(movie?.backdrop_path, "original");
  const poster   = movie?.poster_path ? `${POSTER_BASE}${movie.poster_path}` : null;
  const year     = movie?.release_date?.slice(0, 4);
  const rating   = movie?.vote_average > 0 ? movie.vote_average.toFixed(1) : null;
  const genres   = (movie?.genre_ids ?? []).slice(0, 3).map((id) => GENRE_MAP[id]).filter(Boolean);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[90vw] sm:min-h-[66vh] md:min-h-[75vh] max-h-[860px] overflow-hidden flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background layers */}
      {backdrop ? (
        <img
          key={`bg-${idx}`}
          src={backdrop}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="hero-bg-enter"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#080808]" />
      )}

      {/* Cinematic gradient layers */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.85) 40%, rgba(8,8,8,0.3) 70%, rgba(8,8,8,0) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.5) 30%, rgba(8,8,8,0) 70%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.6) 0%, transparent 25%)" }} />

      {/* Content — fills remaining space above the bottom controls, never overlaps them */}
      <div className="relative flex-1 min-h-0 flex items-end sm:items-center">
      <div className="w-full page-container pb-6 sm:pb-8 pt-16 sm:pt-20 flex items-center justify-between gap-6 sm:gap-10">

        {/* Left — info */}
        <div key={`info-${idx}`} className="flex-1 min-w-0 max-w-[560px] hero-content-enter">
          {/* Trending badge + counter */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-indigo-300 bg-indigo-500/12 border border-indigo-500/25 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Trending Now
            </span>
            {movies.length > 1 && (
              <span className="text-[11px] font-bold text-zinc-600">
                {idx + 1}&thinsp;/&thinsp;{movies.length}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-[2rem] sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3.2rem] font-extrabold tracking-tight leading-[1.04] text-white mb-3 sm:mb-4">
            {movie.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-2 mb-3 sm:mb-4">
            {rating && (
              <span className="inline-flex items-center gap-1 text-yellow-400 text-[13px] font-extrabold bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/20">
                ★ {rating}
              </span>
            )}
            {year && <span className="text-zinc-400 text-sm font-medium">{year}</span>}
            {movie.runtime && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-zinc-400 text-sm">{movie.runtime} min</span>
              </>
            )}
          </div>

          {/* Genre chips */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
              {genres.map((g) => (
                <span key={g} className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full border border-white/[0.12] text-zinc-400 bg-white/[0.04]">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {movie.overview && (
            <p className="text-zinc-300 text-[15px] sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 mb-5 sm:mb-7 max-w-[500px]">
              {movie.overview}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/movie/${movie.id}`}>
              <span className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-bold h-11 px-6 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-950/60 hover:shadow-indigo-600/25">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2.5a.5.5 0 0 1 .765-.424l10 5a.5.5 0 0 1 0 .848l-10 5A.5.5 0 0 1 3 12.5v-10z"/></svg>
                View Details
              </span>
            </Link>
            <Link href="/discover">
              <span className="inline-flex items-center h-11 px-5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.1] hover:border-white/[0.2] transition-all duration-200">
                Explore All
              </span>
            </Link>
            <SurpriseMe />
            <button
              type="button"
              onClick={toggleSave}
              aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
              aria-pressed={saved}
              className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 ${
                saved
                  ? "bg-indigo-600 border-indigo-400/40 text-white"
                  : "bg-white/[0.06] border-white/[0.1] text-zinc-300 hover:text-white hover:bg-white/[0.11] hover:border-white/[0.2]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right — floating poster (desktop only) */}
        {poster && (
          <div key={`poster-${idx}`} className="hidden sm:block flex-shrink-0 hero-poster-enter">
            <div
              className="relative rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-white/[0.1]"
              style={{
                width: "clamp(140px, 14vw, 220px)",
                aspectRatio: "2/3",
                transform: "perspective(1000px) rotateY(-6deg) rotateX(2deg)",
                transformOrigin: "center center",
              }}
            >
              <img
                src={poster}
                alt={movie.title}
                decoding="async"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
              {rating && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-extrabold text-yellow-300 border border-yellow-400/30 backdrop-blur-md" style={{ background: "rgba(0,0,0,0.7)" }}>
                  ★ {rating}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Bottom controls — normal flow, always gets its own reserved space */}
      {movies.length > 1 && (
        <div className="relative w-full page-container pb-4 sm:pb-5 pt-1 shrink-0 flex items-center gap-3">
          {/* Auto-progress bar */}
          <div className="w-8 sm:w-10 shrink-0 h-[2px] rounded-full bg-white/[0.08] overflow-hidden">
            <div
              key={`progress-${idx}-${paused}`}
              className="h-full rounded-full bg-indigo-400"
              style={{
                animation: paused ? "none" : `hero-progress ${INTERVAL}ms linear both`,
                width: paused ? "0%" : undefined,
              }}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {movies.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === idx ? "w-5 h-1.5 bg-indigo-400" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={prev}
              className="w-8 h-8 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.1] text-white text-sm flex items-center justify-center transition-all hover:scale-105"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="w-8 h-8 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.1] text-white text-sm flex items-center justify-center transition-all hover:scale-105"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function HeroFallback() {
  return (
    <section className="relative w-full min-h-[400px] sm:min-h-[500px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute top-0 left-0 w-[700px] h-[500px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="relative page-container py-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-400 mb-4">Your movie companion</p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.03] mb-5">
          <span className="text-white">Discover</span>
          <br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)" }}>
            Cinema
          </span>
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-md mb-7">
          Trending, top-rated, and upcoming — curated for you.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/discover">
            <span className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold h-11 px-6 rounded-xl transition-all shadow-xl shadow-indigo-950/50">
              🎬 Explore Movies
            </span>
          </Link>
          <Link href="/tv">
            <span className="inline-flex items-center h-11 px-5 rounded-xl text-sm font-semibold text-zinc-300 bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.1] transition-all">
              📺 TV Shows
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
