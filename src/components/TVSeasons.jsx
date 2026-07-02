"use client";

import { useState } from "react";

export default function TVSeasons({ seasons }) {
  const [expanded, setExpanded] = useState(false);

  // Filter out "Specials" (season_number === 0) unless it's the only season
  const mainSeasons = seasons.filter((s) => s.season_number > 0);
  const specials    = seasons.filter((s) => s.season_number === 0);
  const allSeasons  = mainSeasons.length > 0 ? mainSeasons : seasons;

  const PREVIEW = 6;
  const visible  = expanded ? allSeasons : allSeasons.slice(0, PREVIEW);
  const hasMore  = allSeasons.length > PREVIEW;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Seasons</h2>
        {specials.length > 0 && !expanded && (
          <span className="text-xs text-zinc-500 font-medium">
            + {specials.length} special{specials.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {visible.map((season) => (
          <SeasonCard key={season.id} season={season} />
        ))}
        {expanded && specials.map((s) => (
          <SeasonCard key={s.id} season={s} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
        >
          {expanded
            ? "Show less ↑"
            : `Show all ${allSeasons.length} seasons ↓`}
        </button>
      )}
    </div>
  );
}

function SeasonCard({ season }) {
  const year  = season.air_date?.slice(0, 4) || null;
  const eps   = season.episode_count;
  const label = season.season_number === 0 ? "Specials" : season.name;

  return (
    <div className="group flex flex-col">
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.07] shadow-lg">
        {season.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w342${season.poster_path}`}
            alt={label}
            loading="lazy"
            decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl text-zinc-700">
            📺
          </div>
        )}
        {/* Episode count badge */}
        {eps != null && (
          <span className="absolute bottom-1.5 right-1.5 text-[11px] font-bold bg-black/70 text-zinc-200 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            {eps} ep{eps !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Labels */}
      <p className="mt-2 text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors leading-snug">
        {label}
      </p>
      {year && <p className="text-xs text-zinc-500 mt-0.5">{year}</p>}
    </div>
  );
}
