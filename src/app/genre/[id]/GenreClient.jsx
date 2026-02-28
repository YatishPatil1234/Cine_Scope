"use client";

import MovieCard from "@/components/MovieCard";
import { getMoviesByGenre } from "@/lib/tmdb";
import { useState } from "react";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity.desc" },
  { label: "Rating", value: "vote_average.desc" },
  { label: "Release Date", value: "primary_release_date.desc" },
];

export default function GenreClient({ genreId, genreName, initialData, lang }) {
  const [movies, setMovies] = useState(initialData.results || []);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [loading, setLoading] = useState(false);
  const totalPages = initialData.total_pages;

  async function loadMore() {
    if (loading || page >= totalPages) return;

    setLoading(true);
    const nextPage = page + 1;

    const data = await getMoviesByGenre(genreId, lang, nextPage, sortBy);

    setMovies((prev) => [...prev, ...data.results]);
    setPage(nextPage);
    setLoading(false);
  }

  async function handleSort(newSort) {
    setSortBy(newSort);
    setLoading(true);

    const data = await getMoviesByGenre(genreId, lang, 1, newSort);

    setMovies(data.results || []);
    setPage(1);
    setLoading(false);
  }

  return (
    <main className="pb-24 overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-24">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            {genreName}
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover curated {genreName.toLowerCase()} films.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-60 mb-16" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Modern Control Bar */}
        <div className="mb-10 bg-card/60 backdrop-blur-md border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {movies.length} movies
          </p>

          <div className="flex gap-2 flex-wrap">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  sortBy === option.value
                    ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400"
                    : "border-slate-800 bg-card/60 hover:border-indigo-500/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* MOVIE GRID */}
        {movies.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No movies found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-card/70 border border-slate-800 hover:border-indigo-500/40 transition shadow-md hover:shadow-lg"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
