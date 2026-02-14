"use client";

import MovieCard from "@/components/MovieCard";
import { getWatchlist } from "@/lib/watchlist";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WatchlistPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(getWatchlist());
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-14 overflow-x-hidden w-full">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
          Your Watchlist
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Movies you&apos;ve saved. Remove from any movie page.
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
          <span className="text-5xl sm:text-6xl mb-4 opacity-60">📽️</span>
          <p className="text-foreground font-medium mb-1">No movies yet</p>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Add films from the home page or search to see them here.
          </p>
          <Link
            href="/search"
            className="cursor-pointer text-indigo-400 hover:text-indigo-300 font-medium text-sm underline underline-offset-2"
          >
            Search movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}
