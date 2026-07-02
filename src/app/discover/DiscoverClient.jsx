"use client";

import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

// Session cache: avoids re-hitting the edge function when a user scrolls
// back up then down again, or navigates back/forward through history.
const sessionMemo = new Map();

function readSession(key) {
  if (sessionMemo.has(key)) return sessionMemo.get(key);
  try {
    const raw = sessionStorage.getItem(`cs_discover:${key}`);
    if (!raw) return null;
    const val = JSON.parse(raw);
    sessionMemo.set(key, val);
    return val;
  } catch {
    return null;
  }
}

function writeSession(key, val) {
  sessionMemo.set(key, val);
  try { sessionStorage.setItem(`cs_discover:${key}`, JSON.stringify(val)); } catch {}
}

// Auto-load this many pages via scroll before requiring a manual click —
// prevents a single aggressive scroll session from firing dozens of
// unique (uncached) edge function calls back-to-back.
const AUTO_LOAD_LIMIT = 4;

const SORT_OPTIONS = [
  { value: "popularity.desc",           label: "Most popular"    },
  { value: "vote_average.desc",         label: "Top rated"       },
  { value: "primary_release_date.desc", label: "Newest first"    },
  { value: "primary_release_date.asc",  label: "Oldest first"    },
  { value: "revenue.desc",              label: "Highest revenue" },
];

const YEARS    = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i);
const RATING_OPTIONS = [
  { value: "",  label: "Any rating" },
  { value: "6", label: "6+ ★"       },
  { value: "7", label: "7+ ★"       },
  { value: "8", label: "8+ ★"       },
  { value: "9", label: "9+ ★"       },
];

const DECADE_OPTIONS = [
  { label: "Any era",  value: "" },
  { label: "2020s",    value: "2020-01-01|2029-12-31" },
  { label: "2010s",    value: "2010-01-01|2019-12-31" },
  { label: "2000s",    value: "2000-01-01|2009-12-31" },
  { label: "1990s",    value: "1990-01-01|1999-12-31" },
  { label: "1980s",    value: "1980-01-01|1989-12-31" },
  { label: "1970s",    value: "1970-01-01|1979-12-31" },
  { label: "1960s",    value: "1960-01-01|1969-12-31" },
];

export default function DiscoverClient({
  initialMovies,
  initialTotalPages,
  genres,
  initialSort      = "popularity.desc",
  initialGenre     = "",
  initialYear      = "",
  initialMinRating = "",
  initialPage      = 1,
  initialDateFrom  = "",
  initialDateTo    = "",
}) {
  const router   = useRouter();
  const pathname = usePathname();

  const [movies,     setMovies]    = useState(initialMovies);
  const [totalPages, setTotalPages]= useState(initialTotalPages);
  const [page,       setPage]      = useState(initialPage);
  const [sort,       setSort]      = useState(initialSort);
  const [genre,      setGenre]     = useState(initialGenre);
  const [year,       setYear]      = useState(initialYear);
  const [minRating,  setMinRating] = useState(initialMinRating);
  const [dateFrom,   setDateFrom]  = useState(initialDateFrom);
  const [dateTo,     setDateTo]    = useState(initialDateTo);
  const [loading,    startTransition] = useTransition();
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore]       = useState(initialPage < initialTotalPages);
  const [autoLoadCount, setAutoLoadCount] = useState(0);

  const isFirstMount = useRef(true);
  const sentinelRef  = useRef(null);
  const abortRef     = useRef(null);

  // Derive decade value from dateFrom/dateTo for the select
  const decadeValue = dateFrom && dateTo ? `${dateFrom}|${dateTo}` : "";

  const buildParams = useCallback((overrides = {}) => {
    const s = { sort, genre, year, minRating, dateFrom, dateTo, page: String(page), ...overrides };
    const p = new URLSearchParams();
    if (s.sort && s.sort !== "popularity.desc") p.set("sort", s.sort);
    if (s.genre)     p.set("genre",     s.genre);
    if (s.year)      p.set("year",      s.year);
    if (s.minRating) p.set("minRating", s.minRating);
    if (s.dateFrom)  p.set("dateFrom",  s.dateFrom);
    if (s.dateTo)    p.set("dateTo",    s.dateTo);
    if (parseInt(s.page) > 1) p.set("page", s.page);
    return p;
  }, [sort, genre, year, minRating, dateFrom, dateTo, page]);

  const pushURL = useCallback((overrides = {}) => {
    const qs = buildParams(overrides).toString();
    router.replace(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
  }, [buildParams, pathname, router]);

  // Reset and load page 1 (for filter changes)
  const fetchFresh = useCallback((overrides = {}) => {
    const s = { sort, genre, year, minRating, dateFrom, dateTo, ...overrides };
    const p = new URLSearchParams({ page: "1", sort: s.sort });
    if (s.genre)    p.set("genre",     s.genre);
    if (s.year)     p.set("year",      s.year);
    if (s.minRating)p.set("minRating", s.minRating);
    if (s.dateFrom) p.set("dateFrom",  s.dateFrom);
    if (s.dateTo)   p.set("dateTo",    s.dateTo);

    startTransition(async () => {
      try {
        const key = p.toString();
        let data = readSession(key);
        if (!data) {
          const res = await fetch(`/api/discover?${p}`);
          data = await res.json();
          writeSession(key, data);
        }
        const tp = Math.min(data.total_pages ?? 1, 500);
        setMovies(data.results ?? []);
        setTotalPages(tp);
        setPage(1);
        setHasMore(1 < tp);
        setAutoLoadCount(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch { setMovies([]); }
    });
  }, [sort, genre, year, minRating, dateFrom, dateTo]);

  // Load next page (infinite scroll — APPENDS)
  const fetchMore = useCallback(async (nextPage) => {
    if (loadingMore) return;
    setLoadingMore(true);
    const p   = buildParams({ page: String(nextPage) });
    const key = p.toString();
    try {
      let data = readSession(key);
      if (!data) {
        if (abortRef.current) abortRef.current.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const res = await fetch(`/api/discover?${p}`, { signal: ctrl.signal });
        data = await res.json();
        writeSession(key, data);
      }
      const tp = Math.min(data.total_pages ?? 1, 500);
      setMovies((prev) => [...prev, ...(data.results ?? [])]);
      setPage(nextPage);
      setTotalPages(tp);
      setHasMore(nextPage < tp);
    } catch (e) {
      if (e.name !== "AbortError") setHasMore(false);
    }
    setLoadingMore(false);
  }, [buildParams, loadingMore]);

  // IntersectionObserver for infinite scroll — capped to AUTO_LOAD_LIMIT
  // pages per filter session, after which a manual "Load more" click is
  // required. This stops a single fast-scroll session from generating
  // an unbounded number of edge function calls.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && !loadingMore && autoLoadCount < AUTO_LOAD_LIMIT) {
          setAutoLoadCount((c) => c + 1);
          fetchMore(page + 1);
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, fetchMore, autoLoadCount]);

  // Auto-fetch on filter change
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    pushURL({ page: "1" });
    fetchFresh();
  }, [sort, genre, year, minRating, dateFrom, dateTo]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDecadeChange = (val) => {
    if (!val) { setDateFrom(""); setDateTo(""); return; }
    const [from, to] = val.split("|");
    setDateFrom(from);
    setDateTo(to);
    // Clear year filter when decade is set
    setYear("");
  };

  const resetFilters = () => {
    setSort("popularity.desc"); setGenre(""); setYear("");
    setMinRating(""); setDateFrom(""); setDateTo("");
  };

  const activeCount = [
    sort !== "popularity.desc", genre !== "", year !== "",
    minRating !== "", dateFrom !== "",
  ].filter(Boolean).length;

  const genreName = genres.find((g) => String(g.id) === genre)?.name;
  const decadeLabel = DECADE_OPTIONS.find((d) => d.value === decadeValue)?.label;

  return (
    <main className="pb-24 overflow-x-hidden w-full">
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="page-container relative">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Filter &amp; explore</p>
          <h1 className="page-heading mb-2">Discover Movies</h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-md">
            Filter by genre, decade, year, and rating to find your next watch.
          </p>
        </div>
      </section>

      <section className="page-container pb-20">
        {/* Filter panel */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-zinc-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Filters</span>
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </div>
            {activeCount > 0 && (
              <button type="button" onClick={resetFilters} className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
                <X size={12} /> Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <FilterSelect label="Sort by" value={sort} onChange={setSort}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </FilterSelect>
            <FilterSelect label="Genre" value={genre} onChange={setGenre}>
              <option value="">All genres</option>
              {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </FilterSelect>
            <FilterSelect label="Decade" value={decadeValue} onChange={handleDecadeChange}>
              {DECADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </FilterSelect>
            <FilterSelect label="Year" value={year} onChange={setYear} disabled={!!dateFrom}>
              <option value="">Any year</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </FilterSelect>
            <FilterSelect label="Min rating" value={minRating} onChange={setMinRating}>
              {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </FilterSelect>
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {sort !== "popularity.desc" && <FilterChip label={SORT_OPTIONS.find(o => o.value === sort)?.label} onRemove={() => setSort("popularity.desc")} />}
            {genreName && <FilterChip label={genreName} onRemove={() => setGenre("")} />}
            {decadeLabel && decadeLabel !== "Any era" && <FilterChip label={decadeLabel} onRemove={() => { setDateFrom(""); setDateTo(""); }} />}
            {year && !dateFrom && <FilterChip label={year} onRemove={() => setYear("")} />}
            {minRating && <FilterChip label={`${minRating}+ ★`} onRemove={() => setMinRating("")} />}
          </div>
        )}

        {/* Grid */}
        {loading && movies.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 20 }).map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <span className="text-5xl mb-4 opacity-20">🎬</span>
            <p className="text-zinc-300 font-bold text-lg mb-2">No movies found</p>
            <p className="text-zinc-500 text-sm mb-4">Try different filters.</p>
            <button type="button" onClick={resetFilters} className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">Reset filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {movies.map((movie, i) => <MovieCard key={`${movie.id}-${i}`} movie={movie} />)}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="mt-8 flex justify-center">
              {loadingMore && (
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <span className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  Loading more…
                </div>
              )}
              {!loadingMore && hasMore && autoLoadCount >= AUTO_LOAD_LIMIT && (
                <button
                  type="button"
                  onClick={() => { setAutoLoadCount(0); fetchMore(page + 1); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.1] hover:border-white/[0.2] transition-all"
                >
                  Load more movies
                </button>
              )}
              {!hasMore && movies.length > 0 && (
                <p className="text-zinc-700 text-sm py-4">You've reached the end</p>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function FilterSelect({ label, value, onChange, disabled, children }) {
  return (
    <label className="block">
      <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1.5 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-9 rounded-lg bg-[#0d0d0d] border border-white/[0.09] px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors disabled:opacity-40"
      >
        {children}
      </select>
    </label>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/15 border border-indigo-500/25 text-indigo-300">
      {label}
      <button type="button" onClick={onRemove} className="text-indigo-400 hover:text-white transition-colors"><X size={11} /></button>
    </span>
  );
}
