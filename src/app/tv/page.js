import HorizontalTVSection from "@/components/HorizontalTVSection";
import TVCard from "@/components/TVCard";
import {
  getAiringTodayTV,
  getOnTheAirTV,
  getPopularTV,
  getTopRatedTV,
  getTrendingTV,
} from "@/lib/tmdb";

export const metadata = {
  title: "TV Shows — CineScope",
  description: "Trending series, fan favorites, and top-rated shows.",
};

export const revalidate = 43200; // 12h

export default async function TVPage() {
  const [trending, popular, topRated, airingToday, onTheAir] = await Promise.all([
    getTrendingTV(),
    getPopularTV(),
    getTopRatedTV(),
    getAiringTodayTV(),
    getOnTheAirTV(),
  ]);

  return (
    <main className="pb-20 overflow-x-hidden">
      {/* Header */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/15 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-cyan-600/5 rounded-full blur-[100px]" />
        <div className="page-container relative">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Browse
          </p>
          <h1 className="page-heading mb-3">TV Shows</h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-md">
            Trending series, fan favorites, and top-rated shows.
          </p>
        </div>
      </section>

      <HorizontalTVSection
        title="Trending This Week"
        eyebrow="🔥 Hot right now"
        shows={trending.results}
        accentColor="#22d3ee"
      />

      <HorizontalTVSection
        title="Airing Today"
        eyebrow="📅 Fresh episodes"
        shows={airingToday.results}
        accentColor="#4ade80"
      />

      <HorizontalTVSection
        title="Currently On Air"
        eyebrow="📡 Ongoing series"
        shows={onTheAir.results}
        accentColor="#f59e0b"
      />

      <HorizontalTVSection
        title="Popular on TV"
        eyebrow="📈 Fan favorites"
        shows={popular.results}
        accentColor="#a78bfa"
      />

      <div className="page-container">
        <div className="divider" />
      </div>

      <section className="page-container py-8 sm:py-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full shrink-0" style={{ background: "#facc15" }} />
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-yellow-500 mb-0.5">
              ⭐ All-time greats
            </p>
            <h2 className="section-title">Top Rated Series</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {(topRated.results ?? []).slice(0, 18).map((show) => (
            <TVCard key={show.id} show={show} />
          ))}
        </div>
      </section>
    </main>
  );
}
