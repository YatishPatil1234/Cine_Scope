import { NextResponse } from "next/server";

export const runtime = "edge";

const API_KEY  = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

/** Picks a random well-rated movie from a random page of discover results. */
export async function GET() {
  const page = Math.floor(Math.random() * 40) + 1;

  const params = new URLSearchParams({
    api_key:            API_KEY,
    language:           "en-US",
    sort_by:            "popularity.desc",
    page:               String(page),
    "vote_count.gte":   "300",
    "vote_average.gte": "6.5",
    include_adult:      "false",
  });

  try {
    const res  = await fetch(`${BASE_URL}/discover/movie?${params}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const results = data.results ?? [];
    if (!results.length) {
      return NextResponse.json({ error: "No results" }, { status: 404 });
    }
    const pick = results[Math.floor(Math.random() * results.length)];
    return NextResponse.json(
      { id: pick.id, title: pick.title },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
