import Link from "next/link";
import MovieCard from "./MovieCard";

export default function MovieSection({ title, movies, seeAllHref, showRanks = false, eyebrow, accentColor = "#6366f1" }) {
  const list = movies ?? [];
  if (list.length === 0) return null;

  return (
    <section className="page-container py-8 sm:py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-1 h-5 rounded-full shrink-0" style={{ background: accentColor }} />
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-indigo-400 mb-0.5">
                {eyebrow}
              </p>
            )}
            <h2 className="section-title truncate">{title}</h2>
          </div>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors"
          >
            See all <span className="text-sm">→</span>
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {list.slice(0, 12).map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} rank={showRanks ? i + 1 : undefined} />
        ))}
      </div>
    </section>
  );
}
