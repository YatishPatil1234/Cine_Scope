"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

export default function CastCard({ actor }) {
  const [broken, setBroken] = useState(false);
  const src = actor.profile_path ? `${PROFILE_BASE}${actor.profile_path}` : null;
  const showPlaceholder = !src || broken;
  const initials = actor.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/person/${actor.id}`}
      className="block group shrink-0 w-[120px] sm:w-[130px]"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0f0f0f] border border-white/[0.06] group-hover:border-indigo-500/35 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-indigo-950/30">
        {showPlaceholder ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-xl font-bold">
            {initials || "?"}
          </div>
        ) : (
          <Image
            src={src}
            alt={actor.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="130px"
            onError={() => setBroken(true)}
          />
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
