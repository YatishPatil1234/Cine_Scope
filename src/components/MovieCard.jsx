"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

function PosterImage({ movie }) {
  const [broken, setBroken] = useState(false);
  const src = movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : null;

  if (!src || broken) {
    return (
      <div
        className="w-full bg-card flex items-center justify-center text-muted-foreground aspect-[2/3] rounded-t-xl"
        style={{ aspectRatio: "2/3" }}
      >
        <span className="text-4xl opacity-60">🎬</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={movie?.title ?? "Movie"}
      width={350}
      height={525}
      className="w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-[1.03]"
      style={{ aspectRatio: "2/3" }}
      onError={() => setBroken(true)}
      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
    />
  );
}

export default function MovieCard({ movie }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="block cursor-pointer group w-full min-w-0"
    >
      <Card
        className="
          border border-slate-800
          hover:border-indigo-500/40
          shadow-sm shadow-black/20
          hover:shadow-xl hover:shadow-indigo-500/15
          rounded-xl
          bg-card
          transition-all duration-300
          hover:-translate-y-2
          h-full flex flex-col py-0 gap-0
        "
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "2/3" }}
        >
          <PosterImage movie={movie} />
        </div>

        <CardContent className="p-2 sm:p-3 flex-1 flex flex-col justify-center min-h-0 min-w-0">
          <h3 className="font-semibold truncate text-sm md:text-base group-hover:text-indigo-400 transition-colors min-w-0">
            {movie.title}
          </h3>

          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            {movie?.vote_average?.toFixed(1) ?? "—"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
