"use client";

import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import Pagination from "@/components/Pagination";
import { useCallback, useState } from "react";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity.desc" },
  { label: "Rating", value: "vote_average.desc" },
  { label: "Release Date", value: "primary_release_date.desc" },
];

export default function GenreClient({ genreId, genreName, initialData }) {
  const [movies, setMovies] = useState(initialData.results || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.min(initialData.total_pages ?? 1, 500),
  );
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(
    async (pageNum, sort, scrollTop = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          genreId: String(genreId),
          page: String(pageNum),
          sort,
        });
        const res = await fetch(`/api/genre?${params}`);
        const data = await res.json();
        setMovies(data.results ?? []);
        setPage(pageNum);
        setTotalPages(Math.min(data.total_pages ?? 1, 500));
        if (scrollTop) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch {
        setMovies([]);
      }
      setLoading(false);
    },
    [genreId],
  );

  const handleSort = (newSort) => {
    if (newSort === sortBy) return;
    setSortBy(newSort);
    fetchPage(1, newSort, true);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page || loading) return;
    fetchPage(nextPage, sortBy, true);
  };

  return (
    <main className="pb-24 overflow-x-hidden">
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="page-container relative">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
            Genre
          </p>
          <h1 className="page-heading mb-2">{genreName}</h1>
          <p className="text-zinc-400 text-sm max-w-md">
            Discover curated {genreName.toLowerCase()} films.
          </p>
        </div>
      </section>

      <div className="page-container mb-6">
        <div className="divider" />
      </div>

      <section className="page-container pb-16">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-zinc-500 font-medium">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSort(option.value)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 disabled:opacity-50 ${
                  sortBy === option.value
                    ? "border-indigo-500/50 bg-indigo-600/20 text-indigo-300"
                    : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.16]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <p className="text-center text-zinc-500 py-20 text-sm">
            No movies found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-10"
            />
          </>
        )}
      </section>
    </main>
  );
}
