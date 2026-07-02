import { getDiscoverMovies } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page      = Number(searchParams.get("page")     || "1");
  const sortBy    = searchParams.get("sort")             || "popularity.desc";
  const genre     = searchParams.get("genre")            || undefined;
  const year      = searchParams.get("year")             || undefined;
  const minRating = searchParams.get("minRating")        || undefined;
  const dateFrom  = searchParams.get("dateFrom")         || undefined;
  const dateTo    = searchParams.get("dateTo")           || undefined;

  try {
    const data = await getDiscoverMovies({
      page,
      sortBy,
      withGenres:            genre     || undefined,
      primaryReleaseYear:    year      ? Number(year) : undefined,
      voteAverageGte:        minRating ? Number(minRating) : undefined,
      primaryReleaseDateGte: dateFrom  || undefined,
      primaryReleaseDateLte: dateTo    || undefined,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Discover failed" }, { status: 500 });
  }
}
