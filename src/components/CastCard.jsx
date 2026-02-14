"use client";

import Image from "next/image";
import { useState } from "react";

const PROFILE_BASE = "https://image.tmdb.org/t/p/w200";

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
    <div className="min-w-[100px] sm:min-w-[120px] snap-start shrink-0">
      <div
        className="relative w-full rounded-lg overflow-hidden bg-card border border-border aspect-[3/4]"
        style={{ aspectRatio: "3/4" }}
      >
        {showPlaceholder ? (
          <div
            className="absolute inset-0 flex items-center justify-center text-muted-foreground text-2xl sm:text-3xl font-medium bg-card"
            aria-hidden
          >
            {initials || "?"}
          </div>
        ) : (
          <Image
            src={src}
            alt={actor.name}
            fill
            className="object-cover"
            sizes="120px"
            onError={() => setBroken(true)}
          />
        )}
      </div>
      <p className="text-sm mt-2 truncate text-foreground">{actor.name}</p>
      {actor.character && (
        <p className="text-xs text-muted-foreground truncate mt-0.5" title={actor.character}>
          {actor.character}
        </p>
      )}
    </div>
  );
}
