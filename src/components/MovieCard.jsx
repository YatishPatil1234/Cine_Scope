"use client";

import Link from "next/link";
import { useState } from "react";

const BASE = "https://image.tmdb.org/t/p/w342";

export default function MovieCard({ movie, rank }) {
  const [broken, setBroken] = useState(false);
  const src    = movie.poster_path ? `${BASE}${movie.poster_path}` : null;
  const year   = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average >= 0.1 ? movie.vote_average.toFixed(1) : null;
  const ratingNum = movie.vote_average ?? 0;

  // Score color
  const scoreColor =
    ratingNum >= 7.5 ? "#4ade80" :
    ratingNum >= 6   ? "#facc15" :
    ratingNum >= 4   ? "#fb923c" : "#f87171";

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="block group w-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
    >
      <div
        className="relative overflow-hidden rounded-2xl aspect-[2/3] border transition-all duration-300 group-hover:border-indigo-500/40 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)] group-hover:-translate-y-1.5"
        style={{ background: "#111", borderColor: "rgba(255,255,255,0.07)" }}
      >
        {/* Poster */}
        {src && !broken ? (
          <img
            src={src}
            alt={movie?.title ?? "Movie poster"}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-15 bg-zinc-900">🎬</div>
        )}

        {/* Always-on subtle bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)" }}
        />
        {/* Hover overlay (darker) */}
        <div
          className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 80%)" }}
        />

        {/* Top-left: rank badge OR rating badge */}
        {rank ? (
          <div
            className="absolute top-2 left-2 min-w-[22px] h-[22px] px-1.5 rounded-full text-[10px] font-extrabold text-white flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "1px solid rgba(139,92,246,0.4)" }}
          >
            {rank}
          </div>
        ) : null}

        {/* Top-right: rating badge */}
        {rating && (
          <div
            className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-extrabold backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.75)", color: scoreColor, border: `1px solid ${scoreColor}30` }}
          >
            ★ {rating}
          </div>
        )}

        {/* Play button (hover) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 border border-white/25"
            style={{ background: "rgba(99,102,241,0.7)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 2.5a.5.5 0 0 1 .765-.424l10 5a.5.5 0 0 1 0 .848l-10 5A.5.5 0 0 1 3 12.5v-10z"/>
            </svg>
          </div>
        </div>

        {/* Bottom: title info (hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-[12px] font-bold leading-snug line-clamp-2 drop-shadow">{movie.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {year && <p className="text-white/50 text-[10px]">{year}</p>}
          </div>
        </div>
      </div>

      {/* Below card */}
      <div className="mt-2 px-0.5">
        <h3 className="text-[13px] sm:text-sm font-semibold text-zinc-300 truncate group-hover:text-white transition-colors leading-snug">
          {movie.title}
        </h3>
        {year && <p className="text-[11px] text-zinc-600 mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}
