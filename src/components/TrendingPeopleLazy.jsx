"use client";

import PersonCard from "@/components/PersonCard";
import { useEffect, useRef, useState } from "react";

export default function TrendingPeopleLazy({ title = "Trending People" }) {
  const ref = useRef(null);
  const fetched = useRef(false);
  const [people, setPeople] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fetched.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fetched.current) return;
        fetched.current = true;
        setLoading(true);
        fetch("/api/trending/people")
          .then((r) => (r.ok ? r.json() : { results: [] }))
          .then((d) => setPeople(d.results ?? []))
          .finally(() => setLoading(false));
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const list = people ?? [];
  if (!loading && people && list.length === 0) return null;

  return (
    <section ref={ref} className="page-container py-8 sm:py-10 min-h-[160px]">
      <h2 className="section-title mb-5">{title}</h2>
      {loading ? (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-[108px] sm:w-[126px] shrink-0 animate-pulse"
            >
              <div className="aspect-[2/3] rounded-xl bg-white/[0.05]" />
              <div className="mt-2 h-3 w-3/4 rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {list.slice(0, 16).map((person) => (
            <div key={person.id} className="snap-start shrink-0">
              <PersonCard person={person} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
