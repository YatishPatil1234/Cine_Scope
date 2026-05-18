"use client";

import MovieCard from "@/components/MovieCard";
import TVCard from "@/components/TVCard";
import { useEffect, useRef, useState } from "react";

export default function LazyRecommendations({ mediaType, id, title = "Recommended for you" }) {
  const ref = useRef(null);
  const fetched = useRef(false);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fetched.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fetched.current) return;
        fetched.current = true;
        setLoading(true);

        fetch(`/api/${mediaType}/${id}/recommendations`)
          .then((r) => (r.ok ? r.json() : { results: [] }))
          .then((d) => setItems(d.results ?? []))
          .finally(() => setLoading(false));
      },
      { rootMargin: "160px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mediaType, id]);

  const list = items ?? [];
  if (!loading && items && list.length === 0) return null;

  return (
    <section ref={ref} className="mt-12 sm:mt-14 min-h-[1px]">
      <h2 className="section-title mb-4">{title}</h2>
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-white/[0.05] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {list.slice(0, 12).map((item) =>
            mediaType === "tv" ? (
              <TVCard key={item.id} show={item} />
            ) : (
              <MovieCard key={item.id} movie={item} />
            ),
          )}
        </div>
      )}
    </section>
  );
}
