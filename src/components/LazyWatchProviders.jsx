"use client";

import WatchProviders from "@/components/WatchProviders";
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

        fetch(`/api/${mediaType}/${id}/watch-providers`)
          .then((r) => (r.ok ? r.json() : null))
          .then(setData)
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
