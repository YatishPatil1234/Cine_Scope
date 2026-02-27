"use client";

import MovieCard from "@/components/MovieCard";
import { getWatchlist } from "@/lib/watchlist";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WatchlistPage() {
  const [movies, setMovies] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMovies(getWatchlist());
    setMounted(true);
  }, []);

  function clearWatchlist() {
    const confirmClear = confirm(
      "Are you sure you want to clear your entire watchlist?",
    );
    if (!confirmClear) return;

    localStorage.removeItem("watchlist");
    setMovies([]);
  }

  if (!mounted) return null; // Prevent hydration flicker

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-16 overflow-x-hidden w-full">
      {/* HEADER */}
      <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-1">
            Your Watchlist
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base">
            {movies.length > 0
              ? `${movies.length} saved movie${movies.length !== 1 ? "s" : ""}`
              : "Movies you save will appear here."}
          </p>
        </div>

        {movies.length > 0 && (
          <button
            onClick={clearWatchlist}
            className="cursor-pointer px-4 py-2 rounded-lg border border-border bg-card hover:bg-slate-800 transition text-sm font-medium text-foreground shadow-sm hover:shadow-md"
          >
            Clear Watchlist
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center animate-in fade-in duration-300">
          <span className="text-5xl sm:text-6xl mb-4 opacity-60">📽️</span>

          <p className="text-foreground font-medium mb-2">No movies yet</p>

          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Start exploring movies and add your favorites to build your personal
            watchlist.
          </p>

          <Link
            href="/search"
            className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition shadow-lg shadow-indigo-500/20"
          >
            Search Movies
          </Link>
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 animate-in fade-in duration-300">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}
