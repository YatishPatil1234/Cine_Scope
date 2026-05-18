import { getAllGenres } from "@/lib/tmdb";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export const metadata = {
  title: "Browse Genres — CineScope",
  description: "Explore movies by genre and find stories that match your mood.",
};

const GENRE_ICONS = {
  28: "⚔️",
  12: "🗺️",
  16: "🎨",
  35: "😂",
  80: "🔫",
  99: "📽️",
  18: "🎭",
  10751: "👨‍👩‍👧",
  14: "🧙",
  36: "🏛️",
  27: "👻",
  10402: "🎵",
  9648: "🔍",
  10749: "💕",
  878: "🚀",
  10770: "📺",
  53: "🔪",
  10752: "🪖",
  37: "🤠",
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

      <div className="page-container mb-8">
        <div className="divider" />
      </div>

      <section className="page-container pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
              className="group"
            >
              <div className="relative rounded-xl bg-white/[0.03] border border-white/[0.07] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/35 hover:bg-indigo-500/[0.06] hover:shadow-lg hover:shadow-indigo-950/30">
                <span className="text-2xl mb-3 block">{GENRE_ICONS[genre.id] ?? "🎞️"}</span>
                <h2 className="text-[15px] sm:text-base font-bold text-zinc-200 group-hover:text-white transition-colors">
                  {genre.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
