import SectionLink from "@/components/SectionLink";
import Link from "next/link";

const GENRE_ICONS = {
  28: "⚔️",   // Action
  35: "😂",   // Comedy
  18: "🎭",   // Drama
  27: "👻",   // Horror
  878: "🚀",  // Sci-Fi
  53: "🔪",   // Thriller
  10749: "💕", // Romance
  16: "🎨",   // Animation
  99: "🎬",   // Documentary
};

const POPULAR_GENRE_IDS = [28, 35, 18, 27, 878, 53, 10749, 16, 99];

export default function GenreStrip({ genres }) {
  const list = (genres ?? []).filter((g) => POPULAR_GENRE_IDS.includes(g.id));
  if (list.length === 0) return null;

  return (
    <section className="page-container py-5 sm:py-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Browse by genre
        </p>
        <SectionLink href="/genres" size="sm">All genres</SectionLink>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {list.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="group shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-200"
            style={{ background: "#1a1a1a", border: "1.5px solid #2e2e2e" }}
          >
            <span className="text-sm leading-none">{GENRE_ICONS[genre.id] ?? "🎞️"}</span>
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
