"use client";

import { DEFAULT_LISTS, getAllLists, toggleListItem } from "@/lib/lists";
import { getRating } from "@/lib/ratings";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ListsPageClient() {
  const [lists,       setLists]     = useState({});
  const [activeList,  setActiveList] = useState("watchlist");
  const [mounted,     setMounted]   = useState(false);

  useEffect(() => {
    setLists(getAllLists());
    setMounted(true);
  }, []);

  const refresh = () => setLists(getAllLists());

  if (!mounted) return null;

  const current = lists[activeList];
  const items   = current?.items ?? [];

  return (
    <main className="page-container py-10 sm:py-16 pb-24 overflow-x-hidden">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Collections</p>
        <h1 className="page-heading mb-2">My Lists</h1>
        <p className="text-zinc-400 text-base">Your personal movie &amp; TV show collections.</p>
      </div>

      {/* List tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {DEFAULT_LISTS.map((list) => {
          const count = lists[list.id]?.items.length ?? 0;
          const active = activeList === list.id;
          return (
            <button
              key={list.id}
              type="button"
              onClick={() => setActiveList(list.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                active
                  ? "text-white shadow-lg"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              style={
                active
                  ? { background: list.color, boxShadow: `0 4px 20px ${list.color}40` }
                  : { background: "#1a1a1a", border: "1.5px solid #2e2e2e" }
              }
            >
              <span className="text-base leading-none">{list.icon}</span>
              {list.name}
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-extrabold"
                style={active ? { background: "rgba(0,0,0,0.25)" } : { background: "#2a2a2a", color: "#888" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items grid */}
      {items.length === 0 ? (
        <EmptyState list={DEFAULT_LISTS.find((l) => l.id === activeList)} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item) => (
            <ListCard
              key={`${item.mediaType}-${item.id}`}
              item={item}
              listId={activeList}
              listColor={DEFAULT_LISTS.find((l) => l.id === activeList)?.color}
              onRemove={refresh}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function ListCard({ item, listId, listColor, onRemove }) {
  const [broken, setBroken] = useState(false);
  const [rating, setRating] = useState(null);
  const src  = item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : null;
  const href = `/${item.mediaType}/${item.id}`;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);

  useEffect(() => {
    setRating(getRating(item.id, item.mediaType));
  }, [item.id, item.mediaType]);

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleListItem(listId, item);
    onRemove();
  };

  return (
    <div className="relative group">
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
      >
        <div
          className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/[0.06] group-hover:border-indigo-500/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
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
            <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">🎬</div>
          )}

          {/* Remove button — top right */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
            style={{ background: "rgba(0,0,0,0.7)" }}
            aria-label="Remove from list"
          >
            ✕
          </button>

          {/* TV badge */}
          {item.mediaType === "tv" && (
            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-black/70 text-sky-400 uppercase tracking-wider">
              TV
            </span>
          )}

          {/* Personal rating */}
          {rating && (
            <div
              className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold"
              style={{ background: "rgba(0,0,0,0.75)", color: listColor ?? "#facc15" }}
            >
              ★ {rating.rating}
            </div>
          )}
        </div>
      </Link>

      <div className="mt-2 px-0.5">
        <p className="text-sm font-semibold text-zinc-200 truncate leading-snug">{item.title}</p>
        {year && <p className="text-xs text-zinc-600 mt-0.5">{year}</p>}
      </div>
    </div>
  );
}

function EmptyState({ list }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl mb-4 opacity-30">{list?.icon ?? "📋"}</span>
      <p className="text-zinc-300 font-bold text-lg mb-2">
        {list?.name ?? "This list"} is empty
      </p>
      <p className="text-zinc-500 text-sm mb-6 max-w-xs">
        Browse movies and shows, then use the &ldquo;Add to list&rdquo; button to save them here.
      </p>
      <Link
        href="/discover"
        className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
      >
        Discover Movies
      </Link>
    </div>
  );
}
