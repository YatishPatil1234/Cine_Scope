import { getTVRecommendations } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(_request, { params }) {
  const { id } = await params;

  try {
    const recommendations = await getTVRecommendations(id);
    return NextResponse.json(
      { recommendations },
      {
        headers: {
          "Cache-Control": "public, s-maxage=172800, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return NextResponse.json({ recommendations: { results: [] } }, { status: 500 });
  }
}
