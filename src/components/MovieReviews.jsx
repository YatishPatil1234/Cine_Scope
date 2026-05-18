"use client";

import SectionLink from "@/components/SectionLink";
import { useEffect, useRef, useState } from "react";

export default function MovieReviews({ movieId }) {
  const sectionRef = useRef(null);
  const fetchedRef = useRef(false);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || fetchedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fetchedRef.current) return;
        fetchedRef.current = true;
        setLoading(true);

        fetch(`/api/movie/${movieId}/reviews`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed");
            return res.json();
          })
          .then((data) => setReviews(data))
          .catch(() => setError(true))
          .finally(() => setLoading(false));
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [movieId]);

  const list = reviews?.results ?? [];
  const count = list.length;

  return (
    <section ref={sectionRef} className="mt-20 sm:mt-28">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-8 sm:mb-10" />

      <div className="flex items-center justify-between mb-8">
        <h2 className="section-title">Reviews</h2>
        {reviews && (
          <p className="text-sm text-muted-foreground">
            {count} review{count !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-muted-foreground py-12 text-sm">
          Could not load reviews.
        </p>
      )}

      {!loading && !error && reviews && count === 0 && (
        <div className="text-center py-16 rounded-xl bg-card border border-border">
          <p className="text-muted-foreground text-sm">
            No reviews available for this movie.
          </p>
        </div>
      )}

      {!loading && !error && count > 0 && (
        <div className="space-y-6">
          {list.slice(0, 5).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
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
            <p className="font-semibold text-sm text-zinc-100 truncate">
              {review.author}
            </p>
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
      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-5">
        {review.content}
      </p>
      {review.url && (
        <SectionLink href={review.url} external size="sm" className="mt-4">
          Read full review
        </SectionLink>
      )}
    </article>
  );
}
