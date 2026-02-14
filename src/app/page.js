import { cookies } from "next/headers";
import Hero from "@/components/Hero";
import MovieSection from "@/components/MovieSection";
import { getLanguageFromCookie } from "@/lib/language";
import {
  getDiscoverMovies,
  getNowPlaying,
  getPopular,
  getTopRated,
  getTrending,
  getUpcoming,
} from "@/lib/tmdb";

function getDateString(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = getLanguageFromCookie(cookieStore);
  const isHindi = lang === "hi";

  let trending, popular, topRated, upcoming, nowPlaying;

  if (isHindi) {
    const today = getDateString();
    const weekAgo = getDateString(-7);
    const fiveMonthsAgo = getDateString(-150);
    [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
      getDiscoverMovies({
        withOriginalLanguage: "hi",
        sortBy: "popularity.desc",
        language: lang,
      }),
      getDiscoverMovies({
        withOriginalLanguage: "hi",
        sortBy: "popularity.desc",
        language: lang,
      }),
      getDiscoverMovies({
        withOriginalLanguage: "hi",
        sortBy: "vote_average.desc",
        language: lang,
      }),
      getDiscoverMovies({
        withOriginalLanguage: "hi",
        sortBy: "primary_release_date.asc",
        primaryReleaseDateGte: weekAgo,
        language: lang,
      }),
      getDiscoverMovies({
        withOriginalLanguage: "hi",
        sortBy: "popularity.desc",
        primaryReleaseDateLte: today,
        primaryReleaseDateGte: fiveMonthsAgo,
        language: lang,
      }),
    ]);
  } else {
    [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
      getTrending(lang),
      getPopular(lang),
      getTopRated(lang),
      getUpcoming(lang),
      getNowPlaying(lang),
    ]);
  }

  const featuredMovie =
    trending.results?.find((m) => m.backdrop_path) ?? trending.results?.[0];

  return (
    <main className="w-full overflow-x-hidden">
      <Hero featuredMovie={featuredMovie ?? null} />

      <MovieSection title="Trending This Week" movies={trending.results} />

      <MovieSection title="Now in Theaters" movies={nowPlaying.results} />

      <MovieSection title="Upcoming" movies={upcoming.results} />

      <MovieSection title="Popular Movies" movies={popular.results} />

      <MovieSection title="Top Rated" movies={topRated.results} />
    </main>
  );
}
