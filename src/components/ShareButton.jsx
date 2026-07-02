"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.1] hover:border-white/[0.2] transition-all duration-200"
      aria-label="Share"
    >
      {copied ? (
        <>
          <Check size={15} className="text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={15} />
          Share
        </>
      )}
    </button>
  );
}
