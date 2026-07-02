import { NextResponse } from "next/server";

export const runtime = "edge";

const API_KEY  = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MOOD_CONFIG = {
  laugh:     { genres: "35",        sortBy: "popularity.desc",    minVotes: 200, minRating: 6   },
  cry:       { genres: "18",        sortBy: "vote_average.desc",  minVotes: 300, minRating: 7.5 },
  scared:    { genres: "27",        sortBy: "popularity.desc",    minVotes: 200, minRating: 5   },
  thrilled:  { genres: "53",        sortBy: "vote_average.desc",  minVotes: 200, minRating: 7   },
  mindblown: { genres: "878",       sortBy: "vote_average.desc",  minVotes: 300, minRating: 7   },
  romance:   { genres: "10749",     sortBy: "vote_average.desc",  minVotes: 200, minRating: 6.5 },
  action:    { genres: "28",        sortBy: "popularity.desc",    minVotes: 200, minRating: 6   },
  chill:     { genres: "16,35",     sortBy: "popularity.desc",    minVotes: 150, minRating: 6   },
  epic:      { genres: "14,12",     sortBy: "vote_average.desc",  minVotes: 200, minRating: 7   },
  animated:  { genres: "16",        sortBy: "vote_average.desc",  minVotes: 200, minRating: 7   },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get("mood") ?? "laugh";
  const page = Math.min(Number(searchParams.get("page") ?? "1"), 5);

  const config = MOOD_CONFIG[mood] ?? MOOD_CONFIG.laugh;

  const params = new URLSearchParams({
    api_key:            API_KEY,
    language:           "en-US",
    sort_by:            config.sortBy,
    page:               String(page),
    "vote_count.gte":   String(config.minVotes),
    "vote_average.gte": String(config.minRating),
    with_genres:        config.genres,
    include_adult:      "false",
  });

  try {
    const res  = await fetch(`${BASE_URL}/discover/movie?${params}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
