"use client";

import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import Pagination from "@/components/Pagination";
import { useCallback, useState } from "react";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most popular" },
  { value: "vote_average.desc", label: "Top rated" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "revenue.desc", label: "Highest revenue" },
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function DiscoverClient({
  initialMovies,
  initialTotalPages = 1,
  genres,
}) {
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("popularity.desc");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");

  const buildParams = useCallback(
    (pageNum) => {
      const params = new URLSearchParams({ sort, page: String(pageNum) });
      if (genre) params.set("genre", genre);
      if (year) params.set("year", year);
      if (minRating) params.set("minRating", minRating);
      return params;
    },
    [sort, genre, year, minRating],
  );

  const fetchPage = useCallback(
    async (pageNum, scrollTop = false) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/discover?${buildParams(pageNum)}`);
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
    [buildParams],
  );

  const applyFilters = () => fetchPage(1, true);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page || loading) return;
    fetchPage(nextPage, true);
  };

  return (
    <main className="pb-20 overflow-x-hidden w-full">
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="page-container relative">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
            Filter &amp; explore
          </p>
          <h1 className="page-heading mb-3">Discover Movies</h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-md">
            Filter by genre, year, and rating to find your next watch.
          </p>
        </div>
      </section>

      <section className="page-container py-6 sm:py-8">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <FilterSelect label="Sort by" value={sort} onChange={setSort}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Genre" value={genre} onChange={setGenre}>
              <option value="">All genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Year" value={year} onChange={setYear}>
              <option value="">Any year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Min rating" value={minRating} onChange={setMinRating}>
              <option value="">Any</option>
              <option value="6">6+</option>
              <option value="7">7+</option>
              <option value="8">8+</option>
            </FilterSelect>
          </div>

          <button
            type="button"
            onClick={applyFilters}
            disabled={loading}
            className="mt-4 w-full sm:w-auto px-6 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-50 transition-all duration-200"
          >
            {loading ? "Loading…" : "Apply filters"}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <p className="text-center text-zinc-500 py-16 text-sm">
            No movies match your filters.
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

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-9 rounded-lg bg-[#080808] border border-white/[0.09] px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/40 transition-colors"
      >
        {children}
      </select>
    </label>
  );
}
