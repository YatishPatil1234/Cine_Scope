import { searchMovies, searchPeople, searchTV } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type") || "movie";

  if (query.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data =
      type === "person"
        ? await searchPeople(query)
        : type === "tv"
          ? await searchTV(query)
          : await searchMovies(query);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
