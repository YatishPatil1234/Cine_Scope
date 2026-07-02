"use client";

import WatchProviders from "@/components/WatchProviders";
import { cachedFetchJSON, TTL } from "@/lib/clientCache";
import { useEffect, useRef, useState } from "react";

export default function LazyWatchProviders({ mediaType, id }) {
  const ref = useRef(null);
  const fetched = useRef(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fetched.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fetched.current) return;
        fetched.current = true;
        setLoading(true);

        cachedFetchJSON(`/api/${mediaType}/${id}/watch-providers`, {
          ttl: TTL.DAY,
          cacheKey: `wp:${mediaType}:${id}`,
        })
          .then(setData)
          .catch(() => setData(null))
          .finally(() => setLoading(false));
      },
      { rootMargin: "120px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mediaType, id]);

  return (
    <div ref={ref} className="min-h-[1px]">
      {loading && (
        <div className="mt-10 h-24 rounded-xl bg-card border border-border animate-pulse" />
      )}
      {data && <WatchProviders providersData={data} />}
    </div>
  );
}
