import GenreStrip from "@/components/GenreStrip";
import Hero from "@/components/Hero";
import RecentlyWatched from "@/components/RecentlyWatched";
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

export const revalidate = 86400;

export default async function HomePage() {
  const [trending, nowPlaying, genresData, trendingTV] = await Promise.all([
    getTrending(),
    getNowPlaying(),
    getAllGenres(),
    getTrendingTV(),
  ]);

  const [popular, topRated] = await Promise.all([
    getPopular(),
    getTopRated(),
  ]);

  const heroMovies = (trending.results ?? [])
    .filter((m) => m.backdrop_path && m.poster_path)
    .slice(0, 5);

  return (
    <main className="w-full overflow-x-hidden">
      <Hero movies={heroMovies} />

      <RecentlyWatched />

      <GenreStrip genres={genresData?.genres} />

      <HorizontalMovieSection
        title="Trending This Week"
        eyebrow="🔥 Hot right now"
        movies={trending.results}
        seeAllHref="/discover"
        accentColor="#6366f1"
      />

      <div className="page-container">
        <div className="divider" />
      </div>

      <MovieSection
        title="Now in Theaters"
        eyebrow="🎬 In cinemas"
        movies={nowPlaying.results?.slice(0, 12)}
        accentColor="#f59e0b"
      />

      <HorizontalTVSection
        title="Trending TV Shows"
        eyebrow="📺 Binge-worthy"
        shows={trendingTV.results}
        seeAllHref="/tv"
        accentColor="#22d3ee"
      />

      <div className="page-container">
        <div className="divider" />
      </div>

      <MovieSection
        title="Popular Movies"
        eyebrow="📈 Everyone's watching"
        movies={popular.results?.slice(0, 12)}
        seeAllHref="/discover"
        accentColor="#34d399"
      />

      <MovieSection
        title="Top Rated"
        eyebrow="⭐ Critics' choice"
        movies={topRated.results?.slice(0, 12)}
        seeAllHref="/discover?sort=vote_average.desc"
        showRanks
        accentColor="#f59e0b"
      />

      <TrendingPeopleLazy />
    </main>
  );
}
