"use client";

import { getRecentlyWatched } from "@/lib/recentlyWatched";
import Link from "next/link";
import { useEffect, useState } from "react";

const BASE = "https://image.tmdb.org/t/p/w185";

export default function RecentlyWatched() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getRecentlyWatched());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="page-container py-8 sm:py-10">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="section-title">Continue Browsing</h2>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("cs_recently_watched");
            setItems([]);
          }}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
        {items.slice(0, 14).map((item) => (
          <RecentCard key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}

function RecentCard({ item }) {
  const [broken, setBroken] = useState(false);
  const src = item.poster_path ? `${BASE}${item.poster_path}` : null;
  const href = `/${item.mediaType}/${item.id}`;
  const badge = item.mediaType === "tv" ? "TV" : null;

  return (
    <Link
      href={href}
      className="block group shrink-0 w-[110px] sm:w-[126px] snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
    >
      <div
        className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/[0.06] group-hover:border-indigo-500/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-indigo-950/40"
        style={{ background: "#141414" }}
      >
        {src && !broken ? (
          <img
            src={src}
            alt={item.title}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-20">🎬</div>
        )}

        {/* Watched indicator — subtle top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-500/70 rounded-t-xl" />

        {badge && (
          <span className="absolute bottom-1.5 right-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-black/70 text-sky-400 uppercase tracking-wider">
            {badge}
          </span>
        )}

        {item.vote_average >= 0.1 && (
          <div
            className="absolute top-1.5 left-1.5 text-[11px] font-bold text-yellow-300 px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(0,0,0,0.72)" }}
          >
            ★ {item.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-sm font-semibold text-zinc-300 truncate group-hover:text-white transition-colors leading-snug">
          {item.title}
        </p>
        <p className="text-xs text-zinc-600 mt-0.5">{item.release_date?.slice(0, 4)}</p>
      </div>
    </Link>
  );
}
