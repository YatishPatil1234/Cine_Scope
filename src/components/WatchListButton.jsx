"use client";

import { Button } from "@/components/ui/button";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";
import { useEffect, useState } from "react";

export default function WatchlistButton({ movie }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(movie.id));
  }, [movie.id]);

  function handleClick() {
    toggleWatchlist(movie);
    setSaved(!saved);
  }

  return (
    <Button
      onClick={handleClick}
      className="cursor-pointer bg-indigo-500/95 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-0 backdrop-blur-sm w-full sm:w-auto min-w-0 sm:min-w-[180px] text-sm"
    >
      {saved ? "Remove from Watchlist" : "Add to Watchlist"}
    </Button>
  );
}
