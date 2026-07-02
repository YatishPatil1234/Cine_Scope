"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SurpriseMe({ className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const surprise = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res  = await fetch("/api/surprise");
      const data = await res.json();
      if (data?.id) {
        router.push(`/movie/${data.id}`);
        return;
      }
    } catch {}
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={surprise}
      disabled={loading}
      className={`inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 ${className}`}
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
        boxShadow: "0 8px 28px rgba(124,58,237,0.35)",
      }}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          Finding…
        </>
      ) : (
        <>🎲 Surprise Me</>
      )}
    </button>
  );
}
