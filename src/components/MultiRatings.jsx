"use client";

import { cachedFetchJSON, TTL } from "@/lib/clientCache";
import { useEffect, useState } from "react";

function RatingPill({ label, value, color, bg, border, sub }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <span className="text-[11px] font-extrabold uppercase tracking-widest shrink-0" style={{ color }}>
        {label}
      </span>
      <span className="text-white font-bold text-sm">
        {value}
        {sub && <span className="text-zinc-500 text-[11px] ml-0.5">{sub}</span>}
      </span>
    </div>
  );
}

function getRtColor(val) {
  const n = parseInt(val);
  if (n >= 75) return { color: "#4ade80", bg: "rgba(74,222,128,0.07)", border: "rgba(74,222,128,0.2)" };
  if (n >= 60) return { color: "#facc15", bg: "rgba(250,204,21,0.07)", border: "rgba(250,204,21,0.2)" };
  return { color: "#f87171", bg: "rgba(248,113,113,0.07)", border: "rgba(248,113,113,0.2)" };
}

function getMetaColor(val) {
  const n = parseInt(val);
  if (n >= 61) return { color: "#4ade80", bg: "rgba(74,222,128,0.07)", border: "rgba(74,222,128,0.2)" };
  if (n >= 40) return { color: "#facc15", bg: "rgba(250,204,21,0.07)", border: "rgba(250,204,21,0.2)" };
  return { color: "#f87171", bg: "rgba(248,113,113,0.07)", border: "rgba(248,113,113,0.2)" };
}

export default function MultiRatings({ imdbId }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imdbId) { setLoading(false); return; }
    cachedFetchJSON(`/api/omdb?id=${imdbId}`, { ttl: TTL.WEEK, cacheKey: `omdb:${imdbId}` })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [imdbId]);

  if (loading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {[80, 64, 72].map((w) => (
          <div key={w} className="skeleton rounded-xl h-9" style={{ width: w }} />
        ))}
      </div>
    );
  }

  if (!data || data.Response === "False" || data.error) return null;

  const imdbRating = data.imdbRating !== "N/A" ? data.imdbRating : null;
  const imdbVotes  = data.imdbVotes  !== "N/A" ? data.imdbVotes  : null;
  const ratings    = data.Ratings ?? [];
  const rt         = ratings.find((r) => r.Source === "Rotten Tomatoes")?.Value;
  const meta       = data.Metascore !== "N/A" ? data.Metascore : null;
  const awards     = data.Awards    !== "N/A" ? data.Awards    : null;
  const boxOffice  = data.BoxOffice !== "N/A" ? data.BoxOffice : null;
  const director   = data.Director  !== "N/A" ? data.Director  : null;

  const hasRatings = imdbRating || rt || meta;
  if (!hasRatings && !awards) return null;

  const rtColors   = rt   ? getRtColor(rt) : null;
  const metaColors = meta ? getMetaColor(meta) : null;

  return (
    <div className="space-y-3">
      {/* Ratings row */}
      {hasRatings && (
        <div className="flex flex-wrap gap-2">
          {imdbRating && (
            <RatingPill
              label="IMDb"
              value={imdbRating}
              sub="/10"
              color="#F5C518"
              bg="rgba(245,197,24,0.07)"
              border="rgba(245,197,24,0.2)"
            />
          )}
          {rt && rtColors && (
            <RatingPill
              label={parseInt(rt) >= 60 ? "🍅" : "💔"}
              value={rt}
              color={rtColors.color}
              bg={rtColors.bg}
              border={rtColors.border}
            />
          )}
          {meta && metaColors && (
            <RatingPill
              label="Meta"
              value={meta}
              sub="/100"
              color={metaColors.color}
              bg={metaColors.bg}
              border={metaColors.border}
            />
          )}
        </div>
      )}

      {/* Extra info row */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-500">
        {imdbVotes && (
          <span>👥 {imdbVotes} votes</span>
        )}
        {boxOffice && (
          <span>💰 {boxOffice} box office</span>
        )}
        {director && director !== "N/A" && (
          <span>🎬 {director}</span>
        )}
      </div>

      {/* Awards */}
      {awards && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-yellow-400/5 border border-yellow-400/15">
          <span className="text-yellow-400 shrink-0 mt-0.5">🏆</span>
          <p className="text-xs text-zinc-400 leading-relaxed">{awards}</p>
        </div>
      )}
    </div>
  );
}
