import { getMovieWatchProviders } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const data = await getMovieWatchProviders(id);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=172800, stale-while-revalidate=345600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
