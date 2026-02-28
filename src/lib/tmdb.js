const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const DEFAULT_LANGUAGE = "en-US";

function appendLanguage(url, language) {
  const lang = language || DEFAULT_LANGUAGE;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}language=${encodeURIComponent(lang)}`;
}

async function fetchFromTMDB(endpoint, language = DEFAULT_LANGUAGE) {
  const separator = endpoint.includes("?") ? "&" : "?";

  const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&language=${language}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("TMDB ERROR:", error);
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getTrending(language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB("/trending/movie/week", language);
}

export async function getPopular(language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB("/movie/popular", language);
}

export async function getTopRated(language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB("/movie/top_rated", language);
}

export async function getUpcoming(language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB("/movie/upcoming", language);
}

export async function getNowPlaying(language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB("/movie/now_playing", language);
}

export async function getMovieDetails(id, language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB(`/movie/${id}`, language);
}

export async function getMovieCredits(id, language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB(`/movie/${id}/credits`, language);
}

export async function getSimilarMovies(id, language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB(`/movie/${id}/similar`, language);
}

export async function searchMovies(query, language = DEFAULT_LANGUAGE) {
  const url = appendLanguage(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    language,
  );
  const res = await fetch(url);

  if (!res.ok) throw new Error("Search failed");

  return res.json();
}

/**
 * Discover movies filtered by original language (e.g. Marathi).
 * Use when user selects "Marathi" to show movies in that language.
 */
export async function getDiscoverMovies(options = {}) {
  const {
    withOriginalLanguage,
    sortBy = "popularity.desc",
    page = 1,
    language = DEFAULT_LANGUAGE,
    primaryReleaseDateGte,
    primaryReleaseDateLte,
    voteCountGte = 50,
  } = options;

  const params = new URLSearchParams({
    api_key: API_KEY,
    language,
    sort_by: sortBy,
    page: String(page),
    "vote_count.gte": String(voteCountGte),
  });

  if (withOriginalLanguage) {
    params.set("with_original_language", withOriginalLanguage);
  }
  if (primaryReleaseDateGte) {
    params.set("primary_release_date.gte", primaryReleaseDateGte);
  }
  if (primaryReleaseDateLte) {
    params.set("primary_release_date.lte", primaryReleaseDateLte);
  }

  const res = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch discover movies");

  return res.json();
}

export async function getMovieVideos(id, language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB(`/movie/${id}/videos`, language);
}

export async function getMovieReviews(id, language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB(`/movie/${id}/reviews`, language);
}

export async function getPersonDetails(id, language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB(`/person/${id}`, language);
}

export async function getPersonMovieCredits(id, language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB(`/person/${id}/movie_credits`, language);
}

export async function getMoviesByGenre(
  genreId,
  language = DEFAULT_LANGUAGE,
  page = 1,
  sortBy = "popularity.desc",
) {
  return fetchFromTMDB(
    `/discover/movie?with_genres=${genreId}&page=${page}&sort_by=${sortBy}`,
    language,
  );
}

export async function getAllGenres(language = DEFAULT_LANGUAGE) {
  return fetchFromTMDB("/genre/movie/list", language);
}

export { DEFAULT_LANGUAGE };
