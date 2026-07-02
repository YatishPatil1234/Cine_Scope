"use client";

import MovieCard from "@/components/MovieCard";
import SectionLink from "@/components/SectionLink";
import TVCard from "@/components/TVCard";
import { cachedFetchJSON, TTL } from "@/lib/clientCache";
import { useEffect, useRef, useState } from "react";

/**
 * Combines "Recommendations" + "Reviews" (movie only) into a single
 * lazy, cached fetch — one Vercel Function call instead of two, and
 * zero additional calls on repeat visits within the cache window.
 */
export default function MediaExtras({ mediaType, id, title = "Recommended for you" }) {
  const ref       = useRef(null);
  const fetched   = useRef(false);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fetched.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fetched.current) return;
        fetched.current = true;
        setLoading(true);

        cachedFetchJSON(`/api/${mediaType}/${id}/extras`, {
          ttl: TTL.DAY,
          cacheKey: `extras:${mediaType}:${id}`,
        })
          .then(setData)
          .catch(() => setData({ recommendations: { results: [] }, reviews: { results: [] } }))
          .finally(() => setLoading(false));
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mediaType, id]);

  const recs    = data?.recommendations?.results ?? [];
  const reviews = data?.reviews?.results ?? [];

  return (
    <div ref={ref} className="min-h-[1px]">
      {/* ── Recommendations ─────────────────────────────── */}
      {(loading || recs.length > 0) && (
        <section className="mt-12 sm:mt-14">
          <h2 className="section-title mb-4">{title}</h2>
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {recs.slice(0, 12).map((item) =>
                mediaType === "tv" ? (
                  <TVCard key={item.id} show={item} />
                ) : (
                  <MovieCard key={item.id} movie={item} />
                ),
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Reviews (movie only) ─────────────────────────── */}
      {mediaType === "movie" && data && (
        <section className="mt-20 sm:mt-28">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-8 sm:mb-10" />
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Reviews</h2>
            <p className="text-sm text-muted-foreground">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground text-sm">No reviews available yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.slice(0, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ReviewCard({ review }) {
  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="group relative p-5 sm:p-6 rounded-xl transition hover:border-indigo-500/30" style={{ background: "#111", border: "1.5px solid #2a2a2a" }}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold shrink-0 text-sm">
            {review.author?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-zinc-100 truncate">{review.author}</p>
            <p className="text-xs text-zinc-500">
              TMDB User
              {formattedDate && ` · ${formattedDate}`}
            </p>
          </div>
        </div>
        {review.author_details?.rating && (
          <span className="shrink-0 px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold border border-yellow-400/20">
            ★ {review.author_details.rating}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-5">{review.content}</p>
      {review.url && (
        <SectionLink href={review.url} external size="sm" className="mt-4">
          Read full review
        </SectionLink>
      )}
    </article>
  );
}
