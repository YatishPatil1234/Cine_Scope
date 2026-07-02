"use client";

import Link from "next/link";
import { useState } from "react";

const BASE = "https://image.tmdb.org/t/p/w342";

export default function TVCard({ show }) {
  const [broken, setBroken] = useState(false);
  const src      = show.poster_path ? `${BASE}${show.poster_path}` : null;
  const year     = show.first_air_date?.slice(0, 4);
  const rating   = show.vote_average >= 0.1 ? show.vote_average.toFixed(1) : null;
  const ratingN  = show.vote_average ?? 0;

  const scoreColor =
    ratingN >= 7.5 ? "#4ade80" :
    ratingN >= 6   ? "#facc15" :
    ratingN >= 4   ? "#fb923c" : "#f87171";

  return (
    <Link
      href={`/tv/${show.id}`}
      className="block group w-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-2xl"
    >
      <div
        className="relative overflow-hidden rounded-2xl aspect-[2/3] border transition-all duration-300 group-hover:border-cyan-500/40 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)] group-hover:-translate-y-1.5"
        style={{ background: "#111", borderColor: "rgba(255,255,255,0.07)" }}
      >
        {/* Poster */}
        {src && !broken ? (
          <img
            src={src}
            alt={show?.name ?? "TV show poster"}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-15 bg-zinc-900">📺</div>
        )}

        {/* Always-on subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)" }}
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 80%)" }}
        />

        {/* TV badge — top left */}
        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(34,211,238,0.2)" }}>
          TV
        </div>

        {/* Rating — top right */}
        {rating && (
          <div
            className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-extrabold backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.75)", color: scoreColor, border: `1px solid ${scoreColor}30` }}
          >
            ★ {rating}
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 border border-white/25"
            style={{ background: "rgba(34,211,238,0.65)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 2.5a.5.5 0 0 1 .765-.424l10 5a.5.5 0 0 1 0 .848l-10 5A.5.5 0 0 1 3 12.5v-10z"/>
            </svg>
          </div>
        </div>

        {/* Bottom title (hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-[12px] font-bold leading-snug line-clamp-2 drop-shadow">{show.name}</p>
          {year && <p className="text-white/50 text-[10px] mt-0.5">{year}</p>}
        </div>
      </div>

      {/* Below card */}
      <div className="mt-2 px-0.5">
        <h3 className="text-[13px] sm:text-sm font-semibold text-zinc-300 truncate group-hover:text-white transition-colors leading-snug">
          {show.name}
        </h3>
        {year && <p className="text-[11px] text-zinc-600 mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}
