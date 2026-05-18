import { getMoviesByGenre } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get("genreId");
  const page = Number(searchParams.get("page") || "1");
  const sortBy = searchParams.get("sort") || "popularity.desc";

  if (!genreId) {
    return NextResponse.json({ error: "genreId required" }, { status: 400 });
  }

  try {
    const data = await getMoviesByGenre(genreId, undefined, page, sortBy);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Genre fetch failed" }, { status: 500 });
  }
}
