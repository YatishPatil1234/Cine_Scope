import { getAllGenres } from "@/lib/tmdb";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export const metadata = {
  title: "Browse Genres — CineScope",
  description: "Explore movies by genre and find stories that match your mood.",
};

const GENRE_META = {
  28:    { icon: "⚔️",  color: "#ef4444" },
  12:    { icon: "🗺️",  color: "#fb923c" },
  16:    { icon: "🎨",  color: "#34d399" },
  35:    { icon: "😂",  color: "#f59e0b" },
  80:    { icon: "🔫",  color: "#94a3b8" },
  99:    { icon: "📽️",  color: "#a78bfa" },
  18:    { icon: "🎭",  color: "#6366f1" },
  10751: { icon: "👨‍👩‍👧", color: "#4ade80" },
  14:    { icon: "🧙",  color: "#818cf8" },
  36:    { icon: "🏛️",  color: "#d4a373" },
  27:    { icon: "👻",  color: "#ec4899" },
  10402: { icon: "🎵",  color: "#f472b6" },
  9648:  { icon: "🔍",  color: "#38bdf8" },
  10749: { icon: "💕",  color: "#e879f9" },
  878:   { icon: "🚀",  color: "#22d3ee" },
  10770: { icon: "📺",  color: "#60a5fa" },
  53:    { icon: "🔪",  color: "#f97316" },
  10752: { icon: "🪖",  color: "#84cc16" },
  37:    { icon: "🤠",  color: "#eab308" },
};

export default async function GenresPage() {
  const data = await getAllGenres();
  const genres = data?.genres || [];

  if (!genres.length) notFound();

  return (
    <main className="pb-24 overflow-x-hidden">
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-indigo-600/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="page-container relative">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
            Browse
          </p>
          <h1 className="page-heading mb-3">All Genres</h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-md">
            Explore movies by genre and discover stories that match your mood.
          </p>
        </div>
      </section>

      <section className="page-container pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {genres.map((genre) => {
            const meta  = GENRE_META[genre.id] ?? { icon: "🎞️", color: "#6366f1" };
            return (
              <Link
                key={genre.id}
                href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                className="group"
              >
                <div
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border flex flex-col items-center justify-center text-center"
                  style={{
                    background: `linear-gradient(135deg, ${meta.color}12 0%, rgba(255,255,255,0.015) 65%)`,
                    borderColor: `${meta.color}22`,
                  }}
                >
                  {/* Corner glow on hover */}
                  <div
                    className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ background: meta.color }}
                  />
                  <span className="text-[26px] mb-3 block leading-none">{meta.icon}</span>
                  <h2
                    className="text-[15px] sm:text-base font-bold text-zinc-200 group-hover:text-white transition-colors"
                  >
                    {genre.name}
                  </h2>
                  <span
                    className="mt-1.5 inline-block text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                    style={{ color: meta.color }}
                  >
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
