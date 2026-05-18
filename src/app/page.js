import GenreStrip from "@/components/GenreStrip";
import Hero from "@/components/Hero";
import HorizontalMovieSection from "@/components/HorizontalMovieSection";
import HorizontalTVSection from "@/components/HorizontalTVSection";
import MovieSection from "@/components/MovieSection";
import TrendingPeopleLazy from "@/components/TrendingPeopleLazy";
import {
  getAllGenres,
  getNowPlaying,
  getPopular,
  getTopRated,
  getTrending,
  getTrendingTV,
} from "@/lib/tmdb";

export const revalidate = 86400; // 24h ISR

export default async function HomePage() {
  // Fetch only above-fold critical data in parallel; upcoming is non-critical so skip here
  const [trending, nowPlaying, genresData, trendingTV] = await Promise.all([
    getTrending(),
    getNowPlaying(),
    getAllGenres(),
    getTrendingTV(),
  ]);

  // These are below-fold; fetch them after the first group completes to keep TTFB low
  const [popular, topRated] = await Promise.all([
    getPopular(),
    getTopRated(),
  ]);

  const featuredMovie =
    trending.results?.find((m) => m.backdrop_path) ?? trending.results?.[0];

  return (
    <main className="w-full overflow-x-hidden">
      <Hero featuredMovie={featuredMovie ?? null} />

      <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <GenreStrip genres={genresData?.genres} />
      </div>

      <HorizontalMovieSection
        title="Trending This Week"
        movies={trending.results}
        seeAllHref="/discover"
      />

      <div className="page-container">
        <div className="divider" />
      </div>

      <MovieSection
        title="Now in Theaters"
        movies={nowPlaying.results?.slice(0, 12)}
      />

      <HorizontalTVSection
        title="Trending TV"
        shows={trendingTV.results}
        seeAllHref="/tv"
      />

      <div className="page-container">
        <div className="divider" />
      </div>

      <MovieSection
        title="Popular Movies"
        movies={popular.results?.slice(0, 12)}
        seeAllHref="/discover"
      />

      <MovieSection
        title="Top Rated"
        movies={topRated.results?.slice(0, 12)}
      />

      <TrendingPeopleLazy />
    </main>
  );
}
