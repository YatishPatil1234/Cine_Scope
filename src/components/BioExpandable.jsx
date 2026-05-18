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
        <p className="text-sm sm:text-[15px] leading-relaxed text-zinc-400">
          {text}
        </p>
      </div>

      {!expanded && (
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      )}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-border bg-white/[0.04] text-zinc-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/15 transition-all duration-200"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
