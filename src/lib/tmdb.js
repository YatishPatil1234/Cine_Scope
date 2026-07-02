import { cache } from "react";

/** Prefer server-only key on Vercel — never expose in client bundles */
const API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const DEFAULT_LANGUAGE = "en-US";

/**
 * Cache durations (seconds).
 * Long durations = fewer TMDB calls = fewer Function Invocations on Vercel.
 * stale-while-revalidate means Vercel serves stale content instantly while
 * revalidating in the background — users never wait on a cache miss.
 */
export const CACHE = {
  LIST:     60 * 60 * 24 * 2,  // 48h  — trending/popular lists
  DISCOVER: 60 * 60 * 24 * 2,  // 48h  — discover / genre pages
  MOVIE:    60 * 60 * 24 * 7,  // 7d   — detail pages (rarely change)
  GENRE:    60 * 60 * 24 * 30, // 30d  — genre list (almost never changes)
  SEARCH:   60 * 60 * 6,       // 6h   — search results
};

async function fetchFromTMDB(
  endpoint,
  language = DEFAULT_LANGUAGE,
  revalidate = CACHE.LIST,
) {
  if (!API_KEY) {
    throw new Error("TMDB API key is not configured");
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&language=${encodeURIComponent(language)}`;

  const res = await fetch(url, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status}`);
  }

  return res.json();
}

export const getTrending = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/trending/movie/week", language, CACHE.LIST),
);

export const getPopular = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/movie/popular", language, CACHE.LIST),
);

export const getTopRated = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/movie/top_rated", language, CACHE.LIST),
);

export const getUpcoming = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/movie/upcoming", language, CACHE.LIST),
);

export const getNowPlaying = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/movie/now_playing", language, CACHE.LIST),
);

export const getMovieDetails = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/movie/${id}`, language, CACHE.MOVIE),
);

export const getMovieCredits = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/movie/${id}/credits`, language, CACHE.MOVIE),
);

export const getSimilarMovies = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/movie/${id}/similar`, language, CACHE.MOVIE),
);

export const getMovieVideos = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/movie/${id}/videos`, language, CACHE.MOVIE),
);

export const getMovieReviews = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/movie/${id}/reviews`, language, CACHE.MOVIE),
);

export const getPersonDetails = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/person/${id}`, language, CACHE.MOVIE),
);

export const getPersonMovieCredits = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/person/${id}/movie_credits`, language, CACHE.MOVIE),
);

export const getAllGenres = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/genre/movie/list", language, CACHE.GENRE),
);

export const getMoviesByGenre = cache(
  (genreId, language = DEFAULT_LANGUAGE, page = 1, sortBy = "popularity.desc") =>
    fetchFromTMDB(
      `/discover/movie?with_genres=${genreId}&page=${page}&sort_by=${sortBy}`,
      language,
      CACHE.DISCOVER,
    ),
);

export const searchMovies = cache(async (query, language = DEFAULT_LANGUAGE) => {
  if (!API_KEY) throw new Error("TMDB API key is not configured");

  const params = new URLSearchParams({
    api_key: API_KEY,
    language,
    query: query.trim(),
  });

  const res = await fetch(`${BASE_URL}/search/movie?${params}`, {
    next: { revalidate: CACHE.SEARCH },
  });

  if (!res.ok) throw new Error("Search failed");

  return res.json();
});

export const getDiscoverMovies = cache(async (options = {}) => {
  const {
    withOriginalLanguage,
    withGenres,
    sortBy = "popularity.desc",
    page = 1,
    language = DEFAULT_LANGUAGE,
    primaryReleaseDateGte,
    primaryReleaseDateLte,
    primaryReleaseYear,
    voteAverageGte,
    voteCountGte = 50,
  } = options;

  const params = new URLSearchParams({
    api_key: API_KEY,
    language,
    sort_by: sortBy,
    page: String(page),
    "vote_count.gte": String(voteCountGte),
  });

  if (withOriginalLanguage) params.set("with_original_language", withOriginalLanguage);
  if (withGenres)            params.set("with_genres", String(withGenres));
  if (primaryReleaseDateGte) params.set("primary_release_date.gte", primaryReleaseDateGte);
  if (primaryReleaseDateLte) params.set("primary_release_date.lte", primaryReleaseDateLte);
  if (primaryReleaseYear)    params.set("primary_release_year", String(primaryReleaseYear));
  if (voteAverageGte != null) params.set("vote_average.gte", String(voteAverageGte));

  const res = await fetch(`${BASE_URL}/discover/movie?${params}`, {
    next: { revalidate: CACHE.DISCOVER },
  });

  if (!res.ok) throw new Error("Failed to fetch discover movies");

  return res.json();
});

export const getMovieWatchProviders = cache((id) =>
  fetchFromTMDB(`/movie/${id}/watch/providers`, DEFAULT_LANGUAGE, CACHE.MOVIE),
);

export const getMovieCollection = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/collection/${id}`, language, CACHE.MOVIE),
);

export const getMovieRecommendations = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/movie/${id}/recommendations`, language, CACHE.MOVIE),
);

export const getTrendingPeople = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/trending/person/week", language, CACHE.LIST),
);

export const searchPeople = cache(async (query, language = DEFAULT_LANGUAGE) => {
  if (!API_KEY) throw new Error("TMDB API key is not configured");

  const params = new URLSearchParams({
    api_key: API_KEY,
    language,
    query: query.trim(),
  });

  const res = await fetch(`${BASE_URL}/search/person?${params}`, {
    next: { revalidate: CACHE.SEARCH },
  });

  if (!res.ok) throw new Error("Person search failed");

  return res.json();
});

// ——— TV ———

export const getTrendingTV = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/trending/tv/week", language, CACHE.LIST),
);

export const getAiringTodayTV = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/tv/airing_today", language, CACHE.LIST),
);

export const getOnTheAirTV = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/tv/on_the_air", language, CACHE.LIST),
);

export const getPopularTV = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/tv/popular", language, CACHE.LIST),
);

export const getTopRatedTV = cache((language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB("/tv/top_rated", language, CACHE.LIST),
);

export const getTVDetails = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/tv/${id}`, language, CACHE.MOVIE),
);

export const getTVCredits = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/tv/${id}/credits`, language, CACHE.MOVIE),
);

export const getSimilarTV = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/tv/${id}/similar`, language, CACHE.MOVIE),
);

export const getTVVideos = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/tv/${id}/videos`, language, CACHE.MOVIE),
);

export const getTVRecommendations = cache((id, language = DEFAULT_LANGUAGE) =>
  fetchFromTMDB(`/tv/${id}/recommendations`, language, CACHE.MOVIE),
);

export const getTVWatchProviders = cache((id) =>
  fetchFromTMDB(`/tv/${id}/watch/providers`, DEFAULT_LANGUAGE, CACHE.MOVIE),
);

/** IMDb id for a TV show — needed to fetch OMDB multi-source ratings. */
export const getTVExternalIds = cache((id) =>
  fetchFromTMDB(`/tv/${id}/external_ids`, DEFAULT_LANGUAGE, CACHE.MOVIE),
);

export const searchTV = cache(async (query, language = DEFAULT_LANGUAGE) => {
  if (!API_KEY) throw new Error("TMDB API key is not configured");

  const params = new URLSearchParams({
    api_key: API_KEY,
    language,
    query: query.trim(),
  });

  const res = await fetch(`${BASE_URL}/search/tv?${params}`, {
    next: { revalidate: CACHE.SEARCH },
  });

  if (!res.ok) throw new Error("TV search failed");

  return res.json();
});
