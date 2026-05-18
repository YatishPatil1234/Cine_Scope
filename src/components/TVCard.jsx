"use client";

import { posterCardUrl } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function TVCard({ show }) {
  const [broken, setBroken] = useState(false);
  const src    = posterCardUrl(show.poster_path);
  const year   = show.first_air_date?.slice(0, 4);
  const rating = show.vote_average >= 0.1 ? show.vote_average.toFixed(1) : null;

  return (
    <Link
      href={`/tv/${show.id}`}
      className="block group w-full min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
    >
      {/* Poster */}
      <div
        className="relative overflow-hidden rounded-xl aspect-[2/3] border border-white/[0.07] group-hover:border-indigo-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-950/40 group-hover:-translate-y-1"
        style={{ background: "#141414" }}
      >
        {src && !broken ? (
          <Image
            src={src}
            alt={show?.name ?? "TV show poster"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={() => setBroken(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 18vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">
            📺
          </div>
        )}

        <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {rating && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold text-yellow-300"
            style={{ background: "rgba(0,0,0,0.72)", border: "1px solid rgba(250,204,21,0.25)" }}>
            ★ {rating}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{show.name}</p>
          {year && <p className="text-white/50 text-[10px] mt-0.5">{year}</p>}
        </div>
      </div>

      {/* Below-card info */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors leading-snug">
          {show.name}
        </h3>
        {year && (
          <p className="text-xs text-zinc-500 mt-0.5">{year}</p>
        )}
      </div>
    </Link>
  );
}
