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
    <main className="min-h-screen pb-20">
      {/* Header */}
      <section className="page-container pt-10 pb-8 sm:pt-14 sm:pb-10">
        <p className="eyebrow text-indigo-400 mb-2">Coming Soon</p>
        <h1 className="page-heading mb-3">Upcoming Movies</h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-lg">
          Movies heading to theaters — sorted by release date.
        </p>
      </section>

      <div className="page-container">
        {months.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Calendar size={40} className="text-zinc-700 mb-4" />
            <p className="text-zinc-400 text-lg font-semibold">No upcoming movies found.</p>
          </div>
        )}

        {months.map((month) => (
          <section key={month} className="mb-12">
            {/* Month divider */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-base font-bold text-zinc-300">{month}</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs font-semibold text-zinc-600">
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

function UpcomingCard({ movie }) {
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="relative group">
      <MovieCard movie={movie} />
      {releaseDate && (
        <div className="mt-1 flex items-center gap-1 text-xs text-indigo-400 font-semibold">
          <Calendar size={11} />
          {releaseDate}
        </div>
      )}
    </div>
  );
}
