"use client";

import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { getLanguageFromDocument } from "@/lib/language";
import { searchMovies } from "@/lib/tmdb";
import { useEffect, useRef, useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce search
  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      if (query.length > 2) {
        fetchResults(controller);
      } else {
        setMovies([]);
        setSearched(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  async function fetchResults(controller) {
    setLoading(true);
    setSearched(true);

    try {
      const lang = getLanguageFromDocument();
      const data = await searchMovies(query, lang);
      setMovies(data.results || []);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
      setMovies([]);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-[75vh] max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-16 overflow-x-hidden w-full">
      {/* HEADER */}
      <div className="mb-8 sm:mb-14">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
          Search movies
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Discover trending, popular, and classic films instantly.
        </p>
      </div>

      {/* SEARCH INPUT */}
      <div className="relative mb-8 sm:mb-14">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          🔍
        </span>

        <input
          ref={inputRef}
          type="search"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 sm:h-14 pl-12 pr-12 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm"
        />

        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white hover:bg-slate-800 rounded-full p-1.5 transition cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="animate-in fade-in duration-200">
          <p className="text-sm text-muted-foreground mb-4">Searching...</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {!loading && searched && movies.length > 0 && (
        <div className="animate-in fade-in duration-300">
          <p className="text-muted-foreground text-sm mb-6">
            {movies.length} result{movies.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && searched && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-200">
          <span className="text-5xl sm:text-6xl mb-4 opacity-60">🎬</span>
          <p className="text-foreground font-medium mb-2">No results found</p>
          <p className="text-muted-foreground text-sm max-w-sm">
            Try a different title or check the spelling.
          </p>
        </div>
      )}

      {/* INITIAL STATE */}
      {!loading && !searched && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl sm:text-6xl mb-4 opacity-60">🔍</span>
          <p className="text-foreground font-medium mb-2">Start searching</p>
          <p className="text-muted-foreground text-sm max-w-sm">
            Type at least 3 characters to find movies.
          </p>
        </div>
      )}
    </main>
  );
}
