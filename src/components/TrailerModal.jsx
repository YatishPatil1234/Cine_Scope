"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TrailerModal({ videos }) {
  const [open, setOpen] = useState(false);

  const trailer = videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  );

  if (!trailer) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="mt-0 bg-indigo-500 hover:bg-indigo-400 text-white"
      >
        ▶ Watch Trailer
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              className="w-full h-full"
              allowFullScreen
            />

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-white text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
