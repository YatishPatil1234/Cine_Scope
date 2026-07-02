"use client";

import Link from "next/link";
import { useState } from "react";

const BASE = "https://image.tmdb.org/t/p/w185";

const PLACEHOLDER_COLORS = [
  ["#1e1b4b", "#6366f1"],
  ["#1a1a2e", "#818cf8"],
  ["#0f172a", "#38bdf8"],
  ["#0d1f2d", "#34d399"],
  ["#1c0a2d", "#a78bfa"],
  ["#1f1120", "#f472b6"],
];

function getColor(name = "") {
  const idx = (name.charCodeAt(0) ?? 0) % PLACEHOLDER_COLORS.length;
  return PLACEHOLDER_COLORS[idx];
}

export default function CastCard({ actor }) {
  const [broken, setBroken] = useState(false);
  const src = actor.profile_path ? `${BASE}${actor.profile_path}` : null;
  const hasImage = src && !broken;
  const initials = (actor.name ?? "?")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
  const [bg, fg] = getColor(actor.name);

  return (
    <Link href={`/person/${actor.id}`} className="block group shrink-0 w-[120px] sm:w-[130px]">
      <div
        className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/[0.06] group-hover:border-indigo-500/35 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-indigo-950/30"
        style={{ background: bg }}
      >
        {hasImage ? (
          <img
            src={src}
            alt={actor.name}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-extrabold select-none" style={{ color: fg }}>
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
          {actor.name}
        </p>
        {actor.character && (
          <p className="text-xs text-zinc-500 truncate mt-0.5">{actor.character}</p>
        )}
      </div>
    </Link>
  );
}
