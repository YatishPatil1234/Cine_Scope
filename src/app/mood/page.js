"use client";

import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { cachedFetchJSON, TTL } from "@/lib/clientCache";
import { useCallback, useState } from "react";

const MOODS = [
  { id: "laugh",     emoji: "😂", label: "Make me laugh",   sub: "Comedies & feel-good",    color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
  { id: "cry",       emoji: "😭", label: "Make me feel",    sub: "Emotional dramas",         color: "#60a5fa", bg: "rgba(96,165,250,0.08)"  },
  { id: "scared",    emoji: "😱", label: "Scare me",        sub: "Horror films",             color: "#ef4444", bg: "rgba(239,68,68,0.08)"   },
  { id: "thrilled",  emoji: "🔪", label: "Keep me on edge", sub: "Thrillers & suspense",     color: "#f97316", bg: "rgba(249,115,22,0.08)"  },
  { id: "mindblown", emoji: "🤯", label: "Blow my mind",    sub: "Sci-Fi & mind-benders",    color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
  { id: "romance",   emoji: "🥰", label: "Give me love",    sub: "Romance & warmth",         color: "#f472b6", bg: "rgba(244,114,182,0.08)" },
  { id: "action",    emoji: "💥", label: "Pump me up",      sub: "Action & explosions",      color: "#f97316", bg: "rgba(249,115,22,0.08)"  },
  { id: "chill",     emoji: "🧘", label: "Something chill", sub: "Light & easy watching",    color: "#34d399", bg: "rgba(52,211,153,0.08)"  },
  { id: "epic",      emoji: "⚔️", label: "Epic adventure",  sub: "Fantasy & adventure",      color: "#fbbf24", bg: "rgba(251,191,36,0.08)"  },
  { id: "animated",  emoji: "🎨", label: "Fun animation",   sub: "Animated masterpieces",    color: "#c084fc", bg: "rgba(192,132,252,0.08)" },
];

export default function MoodPage() {
  const [selected, setSelected] = useState(null);
  const [movies,   setMovies]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [page,     setPage]     = useState(1);

  const pick = useCallback(async (mood, pg = 1) => {
    setSelected(mood);
    setLoading(true);
    try {
      const data = await cachedFetchJSON(`/api/mood?mood=${mood.id}&page=${pg}`, {
        ttl: TTL.HOUR,
        cacheKey: `mood:${mood.id}:${pg}`,
      });
      setMovies(data.results ?? []);
      setPage(pg);
    } catch {
      setMovies([]);
    }
    setLoading(false);
  }, []);

  const shuffle = () => {
    if (!selected) return;
    const nextPage = (page % 5) + 1;
    pick(selected, nextPage);
  };

  const moodMeta = MOODS.find((m) => m.id === selected?.id);

  return (
    <main className="pb-24 overflow-x-hidden">
      {/* Header */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            background: moodMeta
              ? `radial-gradient(ellipse at 50% 0%, ${moodMeta.color}22 0%, transparent 70%)`
              : "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="page-container relative text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Discover</p>
          <h1 className="page-heading mb-3">
            {selected ? (
              <span style={{ color: moodMeta?.color }}>{selected.emoji} {selected.label}</span>
            ) : (
              "What should I watch?"
            )}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-md mx-auto">
            {selected
              ? moodMeta?.sub
              : "Pick your mood and we'll find the perfect movie."}
          </p>
        </div>
      </section>

      <div className="page-container">
        {/* Mood grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
          {MOODS.map((mood) => {
            const isActive = selected?.id === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => pick(mood)}
                className={`group relative flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  isActive ? "shadow-lg" : "border-white/[0.07]"
                }`}
                style={{
                  background: isActive ? mood.bg : "rgba(255,255,255,0.02)",
                  borderColor: isActive ? mood.color + "60" : undefined,
                  boxShadow: isActive ? `0 8px 32px ${mood.color}20` : undefined,
                }}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${mood.color}50` }}
                  />
                )}
                <span className="text-3xl leading-none">{mood.emoji}</span>
                <span
                  className="text-[13px] font-bold leading-tight text-center"
                  style={{ color: isActive ? mood.color : "#a1a1aa" }}
                >
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        {(loading || movies.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">
                {loading ? "Finding movies…" : `${movies.length} picks for you`}
              </h2>
              {!loading && movies.length > 0 && (
                <button
                  type="button"
                  onClick={shuffle}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white transition-all border border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]"
                >
                  🔀 Shuffle
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {movies.slice(0, 18).map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            )}
          </div>
        )}

        {/* Idle state */}
        {!selected && !loading && (
          <div className="flex flex-col items-center py-10 text-center">
            <span className="text-6xl mb-4 opacity-40">🎬</span>
            <p className="text-zinc-500 text-base">Choose a mood above to get started</p>
          </div>
        )}
      </div>
    </main>
  );
}
