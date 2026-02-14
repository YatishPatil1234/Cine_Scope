"use client";

import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { getLanguageFromDocument } from "@/lib/language";
import { searchMovies } from "@/lib/tmdb";
import { useEffect, useState, useRef } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 2) {
        fetchResults();
      } else {
        setMovies([]);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  async function fetchResults() {
    setLoading(true);
    try {
      const lang = getLanguageFromDocument();
      const data = await searchMovies(query, lang);
      setMovies(data.results);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-[70vh] max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-14 overflow-x-hidden w-full">
      <div className="mb-6 sm:mb-14">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
          Search movies
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Find any film by title. Start typing to see results.
        </p>
      </div>

      <div className="relative mb-6 sm:mb-12">
        <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-10 sm:pr-4 rounded-xl sm:rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          autoComplete="off"
          aria-label="Search movies"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-cardHover"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && query.length > 2 && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
          <span className="text-5xl sm:text-6xl mb-4 opacity-60">🎬</span>
          <p className="text-foreground font-medium mb-1">No results found</p>
          <p className="text-muted-foreground text-sm max-w-sm">
            Try a different title or check the spelling.
          </p>
        </div>
      )}

      {!loading && query.length <= 2 && query.length > 0 && (
        <p className="text-muted-foreground text-sm">Type at least 3 characters to search.</p>
      )}

      {!loading && movies.length > 0 && (
        <div className="mb-4">
          <p className="text-muted-foreground text-sm">
            {movies.length} result{movies.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!loading && query.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
          <span className="text-5xl sm:text-6xl mb-4 opacity-60">🔍</span>
          <p className="text-foreground font-medium mb-1">Start searching</p>
          <p className="text-muted-foreground text-sm max-w-sm">
            Enter a movie title above to discover films.
          </p>
        </div>
      )}
    </main>
  );
}
