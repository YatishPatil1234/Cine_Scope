"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PROFILE_BASE = "https://image.tmdb.org/t/p/w200";

export default function CastCard({ actor }) {
  const [broken, setBroken] = useState(false);
  const src = actor.profile_path
    ? `${PROFILE_BASE}${actor.profile_path}`
    : null;

  const showPlaceholder = !src || broken;

  const initials = actor.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/person/${actor.id}`} className="block">
      <div className="min-w-[140px] max-w-[140px] shrink-0 group">
        {/* Image Container */}
        <div
          className="
          relative 
          aspect-[3/4] 
          rounded-xl 
          overflow-hidden 
          bg-card 
          border border-slate-800
          shadow-md shadow-black/20
          transition-all duration-300
          group-hover:border-indigo-500/40
          group-hover:shadow-lg group-hover:shadow-black/30
        "
        >
          {showPlaceholder ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-2xl font-medium">
              {initials || "?"}
            </div>
          ) : (
            <Image
              src={src}
              alt={actor.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="140px"
              onError={() => setBroken(true)}
            />
          )}
        </div>

        {/* Text Section (Fixed Height for Alignment) */}
        {/* Text Section */}
        <div className="mt-3 space-y-1">
          <p className="text-sm font-semibold tracking-tight text-foreground leading-tight truncate">
            {actor.name}
          </p>

          <p
            className="text-[11px] text-muted-foreground/80 truncate leading-tight"
            title={actor.character}
          >
            {actor.character || ""}
          </p>
        </div>
      </div>
    </Link>
  );
}
