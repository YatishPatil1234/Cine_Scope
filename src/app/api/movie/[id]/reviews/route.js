import { getMovieReviews } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(_request, { params }) {
  const { id } = await params;

  try {
    const data = await getMovieReviews(id);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch {
    return NextResponse.json({ error: "Reviews failed" }, { status: 500 });
  }
}
