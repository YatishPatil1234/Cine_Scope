"use client";

import { addRecentlyWatched } from "@/lib/recentlyWatched";
import { useEffect } from "react";

export default function TrackView({ id, title, poster_path, vote_average, release_date, mediaType }) {
  useEffect(() => {
    if (!id || !title) return;
    addRecentlyWatched({ id, title, poster_path, vote_average, release_date, mediaType });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
