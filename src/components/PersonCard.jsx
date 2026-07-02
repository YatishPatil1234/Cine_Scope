"use client";

import Link from "next/link";
import { useState } from "react";

const BASE = "https://image.tmdb.org/t/p/w185";

const PLACEHOLDER_COLORS = [
  ["#1e1b4b", "#6366f1"], // indigo
  ["#1a1a2e", "#818cf8"], // violet
  ["#0f172a", "#38bdf8"], // sky
  ["#0d1f2d", "#34d399"], // emerald
  ["#1c0a2d", "#a78bfa"], // purple
  ["#1f1120", "#f472b6"], // pink
];

function getColor(name = "") {
  const idx = (name.charCodeAt(0) ?? 0) % PLACEHOLDER_COLORS.length;
  return PLACEHOLDER_COLORS[idx];
}

export default function PersonCard({ person }) {
  const [broken, setBroken] = useState(false);
  const src = person.profile_path ? `${BASE}${person.profile_path}` : null;
  const hasImage = src && !broken;
  const initials = (person.name ?? "?")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
  const [bg, fg] = getColor(person.name);

  return (
    <Link
      href={`/person/${person.id}`}
      className="block group shrink-0 w-[108px] sm:w-[126px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
    >
      <div
        className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/[0.06] group-hover:border-indigo-500/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-indigo-950/40"
        style={{ background: bg }}
      >
        {hasImage ? (
          <img
            src={src}
            alt={person.name}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold select-none" style={{ color: fg }}>
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors leading-snug">
          {person.name}
        </p>
        {person.known_for_department && (
          <p className="text-xs text-zinc-500 truncate mt-0.5">{person.known_for_department}</p>
        )}
      </div>
    </Link>
  );
}
