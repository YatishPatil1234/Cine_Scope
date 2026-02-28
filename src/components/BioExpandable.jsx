"use client";

import { useState } from "react";

export default function BioExpandable({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative max-w-3xl">
      <div
        className={`transition-all duration-500 ease-in-out ${
          expanded ? "max-h-[1000px]" : "max-h-[140px]"
        } overflow-hidden`}
      >
        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
          {text}
        </p>
      </div>

      {!expanded && (
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
