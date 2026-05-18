"use client";

import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function WatchlistButton({ movie }) {
  const [saved, setSaved]   = useState(false);
  const [toast, setToast]   = useState(null); // "added" | "removed" | null
  const timerRef = useRef(null);

  useEffect(() => {
    setSaved(isInWatchlist(movie.id));
  }, [movie.id]);

  function handleClick() {
    const next = !saved;
    toggleWatchlist(movie);
    setSaved(next);

    // Clear any existing timer
    clearTimeout(timerRef.current);
    setToast(next ? "added" : "removed");
    timerRef.current = setTimeout(() => setToast(null), 2500);
  }

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="relative inline-flex flex-col items-start sm:items-center gap-0">
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg cursor-pointer ${
          saved
            ? "bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30"
            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50"
        }`}
      >
        {saved
          ? <BookmarkCheck size={16} strokeWidth={2.2} />
          : <Bookmark size={16} strokeWidth={2.2} />
        }
        {saved ? "Saved to Watchlist" : "Add to Watchlist"}
      </button>

      {/* Inline toast */}
      <div
        className={`absolute -bottom-8 left-0 whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-lg transition-all duration-300 pointer-events-none ${
          toast
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1"
        } ${
          toast === "added"
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
            : "bg-red-500/15 text-red-400 border border-red-500/25"
        }`}
      >
        {toast === "added" ? "✓ Added to watchlist" : "Removed from watchlist"}
      </div>
    </div>
  );
}
