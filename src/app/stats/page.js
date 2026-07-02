"use client";

import { DEFAULT_LISTS, getAllLists } from "@/lib/lists";
import { getRecentlyWatched } from "@/lib/recentlyWatched";
import Link from "next/link";
import { useEffect, useState } from "react";

const RATINGS_KEY = "cs_ratings";

function readRatings() {
  try { return JSON.parse(localStorage.getItem(RATINGS_KEY) || "{}"); }
  catch { return {}; }
}

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function StatsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const recent  = getRecentlyWatched();
    const ratings = readRatings();
    const lists   = getAllLists();

    const ratingValues  = Object.values(ratings).map((r) => r.rating);
    const avgRating     = ratingValues.length
      ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
      : null;

    const dist = [1,2,3,4,5].map((star) => ({
      star,
      count: ratingValues.filter((r) => r === star).length,
    }));
    const maxDist = Math.max(...dist.map((d) => d.count), 1);

    const movies = recent.filter((i) => i.mediaType === "movie").length;
    const tvs    = recent.filter((i) => i.mediaType === "tv").length;
    const total  = recent.length;

    const totalSaved = Object.values(lists).reduce((acc, l) => acc + (l.items?.length ?? 0), 0);

    const listBreakdown = DEFAULT_LISTS.map((l) => ({
      ...l,
      count: lists[l.id]?.items?.length ?? 0,
    }));

    setData({ recent, ratings, avgRating, dist, maxDist, movies, tvs, total, totalSaved, listBreakdown });
  }, []);

  if (!data) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
    </main>
  );

  const { recent, avgRating, dist, maxDist, movies, tvs, total, totalSaved, listBreakdown } = data;
  const ratingCount = Object.keys(data.ratings).length;

  return (
    <main className="pb-24 overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
        <div className="page-container relative text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Your Journey</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3">
            Cinema <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Stats</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            {total > 0
              ? `You've explored ${total} title${total !== 1 ? "s" : ""} on CineScope`
              : "Start browsing movies and TV shows to build your stats"}
          </p>
        </div>
      </section>

      <div className="page-container space-y-8">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Titles Browsed", value: total,       icon: "👁️",  color: "#6366f1" },
            { label: "Items Saved",    value: totalSaved,  icon: "🔖",  color: "#22d3ee" },
            { label: "Ratings Given",  value: ratingCount, icon: "⭐",  color: "#f59e0b" },
            { label: "Avg Rating",     value: avgRating ?? "—", icon: "🎯", color: "#4ade80" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
              <span className="text-2xl block mb-3">{s.icon}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Two-column: rating dist + media type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Rating distribution */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-5">Rating Distribution</h2>
            {ratingCount === 0 ? (
              <p className="text-sm text-zinc-600 italic py-4 text-center">Rate some movies to see your distribution</p>
            ) : (
              <div className="space-y-3">
                {[5,4,3,2,1].map((star) => {
                  const d = dist.find((x) => x.star === star);
                  if (!d) return null;
                  const pct = Math.round((d.count / maxDist) * 100);
                  return (
                    <div key={d.star} className="flex items-center gap-3">
                      <span className="text-yellow-400 text-sm font-bold w-4 shrink-0">{d.star}</span>
                      <span className="text-yellow-400 text-xs">★</span>
                      <div className="flex-1 h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: `hsl(${45 + d.star * 10}, 90%, 60%)` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-4 shrink-0 text-right">{d.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Movies vs TV */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-5">Content Mix</h2>
            {total === 0 ? (
              <p className="text-sm text-zinc-600 italic py-4 text-center">No browsing history yet</p>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center flex-1">
                    <p className="text-3xl font-extrabold text-indigo-400">{movies}</p>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-1">Movies</p>
                  </div>
                  <div className="w-px h-12 bg-white/[0.07]" />
                  <div className="text-center flex-1">
                    <p className="text-3xl font-extrabold text-sky-400">{tvs}</p>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-1">TV Shows</p>
                  </div>
                </div>
                {/* Split bar */}
                <div className="h-3 rounded-full overflow-hidden flex bg-white/[0.05]">
                  {movies > 0 && (
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${Math.round((movies / total) * 100)}%`, background: "#6366f1" }}
                    />
                  )}
                  {tvs > 0 && (
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${Math.round((tvs / total) * 100)}%`, background: "#38bdf8" }}
                    />
                  )}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-zinc-600">🟣 Movies {total > 0 ? Math.round((movies/total)*100) : 0}%</span>
                  <span className="text-[11px] text-zinc-600">🔵 TV {total > 0 ? Math.round((tvs/total)*100) : 0}%</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lists breakdown */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-5">My Lists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {listBreakdown.map((list) => (
              <Link key={list.id} href="/lists"
                className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all hover:-translate-y-0.5 group">
                <span className="text-xl leading-none">{list.icon}</span>
                <div className="min-w-0">
                  <p className="text-base font-extrabold text-white">{list.count}</p>
                  <p className="text-[11px] text-zinc-500 font-semibold truncate">{list.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        {recent.length > 0 && (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-5">Recent Activity</h2>
            <div className="space-y-1">
              {recent.slice(0, 10).map((item) => (
                <Link
                  key={`${item.mediaType}-${item.id}`}
                  href={`/${item.mediaType}/${item.id}`}
                  className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl hover:bg-white/[0.04] transition-all group"
                >
                  <div
                    className="w-8 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/[0.06]"
                  >
                    {item.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-200 group-hover:text-white truncate transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${item.mediaType === "tv" ? "text-sky-500" : "text-indigo-400"}`}>
                        {item.mediaType === "tv" ? "TV" : "Film"}
                      </span>
                      {item.vote_average > 0 && (
                        <span className="text-[10px] text-zinc-600">★ {item.vote_average.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-600 shrink-0">{timeAgo(item.visitedAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {total === 0 && ratingCount === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-6xl mb-4">🎬</span>
            <p className="text-zinc-300 font-bold text-xl mb-2">Your stats are empty</p>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm">
              Browse movies and TV shows to start building your personal cinema profile.
            </p>
            <Link href="/discover" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all">
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
