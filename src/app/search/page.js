"use client";

import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import PersonCard from "@/components/PersonCard";
import TVCard from "@/components/TVCard";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TABS = [
  { id: "movie",  label: "Movies",   icon: "🎬" },
  { id: "tv",     label: "TV Shows", icon: "📺" },
  { id: "person", label: "People",   icon: "👤" },
];

const PLACEHOLDERS = {
  movie:  "Search for a movie…",
  tv:     "Search TV shows…",
  person: "Search actors & directors…",
};

const SUGGESTIONS = [
  { label: "Oppenheimer",       type: "movie"  },
  { label: "Breaking Bad",      type: "tv"     },
  { label: "Inception",         type: "movie"  },
  { label: "Christopher Nolan", type: "person" },
  { label: "The Bear",          type: "tv"     },
];

export default function SearchPage() {
  const [query, setQuery]       = useState("");
  const [type, setType]         = useState("movie");
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      if (query.length > 2) doSearch(controller);
      else { setResults([]); setSearched(false); }
    }, 600);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [query, type]);

  async function doSearch(controller) {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}`,
        { signal: controller.signal },
      );
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (e) {
      if (e.name !== "AbortError") setResults([]);
    }
    setLoading(false);
  }

  function pickSuggestion(s) { setType(s.type); setQuery(s.label); }

  const hasResults = !loading && searched && results.length > 0;
  const noResults  = !loading && searched && results.length === 0;

  return (
    <main className="min-h-screen w-full overflow-x-hidden">

      {/* ── Search hero — full width ──────────────────────────── */}
      <section className="relative pt-10 pb-8 sm:pt-14 sm:pb-10 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)" }}
        />

        <div className="page-container relative">

          {/* Heading */}
          <h1 className="page-heading text-center mb-1">Search</h1>
          <p className="text-center text-zinc-400 text-base mb-7">
            Find movies, TV shows, and people.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 justify-center flex-wrap mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setType(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[15px] font-semibold transition-all duration-200 ${
                  type === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/50"
                    : "text-zinc-300 hover:text-white"
                }`}
                style={
                  type === tab.id
                    ? {}
                    : { background: "#1e1e1e", border: "1.5px solid #333" }
                }
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search input — FULL WIDTH */}
          <div className="relative w-full">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="search"
              autoComplete="off"
              spellCheck="false"
              placeholder={PLACEHOLDERS[type]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-4 pl-13 pr-14 rounded-2xl text-white text-lg font-medium placeholder-zinc-500 transition-all duration-200"
              style={{
                background: "#1c1c1c",
                border: "2px solid #383838",
                outline: "none",
                fontSize: "17px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#6366f1";
                e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#383838";
                e.target.style.boxShadow = "none";
              }}
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────── */}
      <div className="page-container pb-20">

        {/* Loading skeletons */}
        {loading && (
          type === "person" ? (
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[100px] sm:w-[112px] animate-pulse">
                  <div className="aspect-[2/3] rounded-xl bg-white/[0.06]" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)}
            </div>
          )
        )}

        {/* Result count */}
        {hasResults && (
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-5">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}

        {/* Movie / TV grid */}
        {hasResults && (type === "movie" || type === "tv") && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {results.map((item) =>
              type === "tv"
                ? <TVCard key={item.id} show={item} />
                : <MovieCard key={item.id} movie={item} />
            )}
          </div>
        )}

        {/* People grid */}
        {hasResults && type === "person" && (
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {results.map((p) => <PersonCard key={p.id} person={p} />)}
          </div>
        )}

        {/* No results */}
        {noResults && (
          <EmptyState
            icon={type === "person" ? "👤" : type === "tv" ? "📺" : "🎬"}
            title="No results found"
            subtitle={`Nothing matched "${query}". Try a different term.`}
          />
        )}

        {/* Idle */}
        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "#1c1c1c", border: "2px solid #333" }}
            >
              <Search size={26} className="text-zinc-400" />
            </div>
            <p className="text-zinc-100 font-bold text-xl mb-1">What are you looking for?</p>
            <p className="text-zinc-500 text-base mb-8">
              Type at least 3 characters to search.
            </p>

            {/* Quick suggestion chips */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => pickSuggestion(s)}
                  className="px-4 py-2 rounded-full text-[15px] font-medium text-zinc-300 hover:text-white transition-all"
                  style={{ background: "#1e1e1e", border: "1.5px solid #333" }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4 opacity-20">{icon}</span>
      <p className="text-zinc-100 font-bold text-xl mb-2">{title}</p>
      <p className="text-zinc-500 text-base max-w-sm">{subtitle}</p>
    </div>
  );
}
