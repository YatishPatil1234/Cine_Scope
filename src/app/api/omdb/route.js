import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imdbId  = searchParams.get("id");
  const OMDB_KEY = process.env.OMDB_API_KEY;

  if (!OMDB_KEY) {
    return NextResponse.json({ error: "OMDB_API_KEY not configured" }, { status: 501 });
  }
  if (!imdbId || !imdbId.startsWith("tt")) {
    return NextResponse.json({ error: "Invalid IMDB ID" }, { status: 400 });
  }

  try {
    const res  = await fetch(
      `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_KEY}&plot=short`,
      { next: { revalidate: 60 * 60 * 24 * 7 } },
    );
    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "OMDB request failed" }, { status: 500 });
  }
}
