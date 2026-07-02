import MovieCard from "@/components/MovieCard";
import { getUpcoming } from "@/lib/tmdb";
import { Calendar } from "lucide-react";

export const revalidate = 43200; // 12h

export const metadata = {
  title: "Upcoming Movies",
  description: "Discover movies coming soon to theaters.",
};

function groupByMonth(movies) {
  const groups = {};
  for (const movie of movies) {
    if (!movie.release_date) continue;
    const d = new Date(movie.release_date);
    const key = d.toLocaleString("en-US", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(movie);
  }
  return groups;
}

export default async function UpcomingPage() {
  let movies = [];
  try {
    const [p1, p2] = await Promise.all([
      getUpcoming(),
      fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=2`,
        { next: { revalidate: 43200 } },
      ).then((r) => (r.ok ? r.json() : { results: [] })),
    ]);
    movies = [
      ...(p1.results ?? []),
      ...(p2.results ?? []),
    ]
      .filter((m) => m.release_date >= new Date().toISOString().slice(0, 10))
      .sort((a, b) => (a.release_date < b.release_date ? -1 : 1));
  } catch {
    movies = [];
  }

  const grouped = groupByMonth(movies);
  const months  = Object.keys(grouped);

  return (
    <main className="min-h-screen pb-20 overflow-x-hidden">
      {/* Header */}
      <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="page-container relative">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Coming Soon</p>
          <h1 className="page-heading mb-3">Upcoming Movies</h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-lg">
            Movies heading to theaters — sorted by release date.
          </p>
        </div>
      </section>

      <div className="page-container">
        {months.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Calendar size={40} className="text-zinc-700 mb-4" />
            <p className="text-zinc-400 text-lg font-semibold">No upcoming movies found.</p>
          </div>
        )}

        {months.map((month, mi) => (
          <section key={month} className="mb-12">
            {/* Month divider */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-extrabold text-amber-300 border border-amber-400/20"
                style={{ background: "rgba(245,158,11,0.07)" }}
              >
                <Calendar size={13} />
                {month}
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs font-bold text-zinc-600">
                {grouped[month].length} film{grouped[month].length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {grouped[month].map((movie) => (
                <UpcomingCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function UpcomingCard({ movie }) {
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    : null;
  const days = movie.release_date ? daysUntil(movie.release_date) : null;

  return (
    <div className="relative group">
      <MovieCard movie={movie} />
      {releaseDate && (
        <div className="mt-1 flex items-center justify-between gap-1">
          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
            <Calendar size={10} />
            {releaseDate}
          </span>
          {days != null && days <= 30 && days > 0 && (
            <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wide">
              in {days}d
            </span>
          )}
        </div>
      )}
    </div>
  );
}
