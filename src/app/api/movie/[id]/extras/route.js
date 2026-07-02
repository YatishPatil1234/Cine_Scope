import { getMovieRecommendations, getMovieReviews } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Combines recommendations + reviews into ONE edge function call.
 * Previously the movie page fired 2 separate client requests for this
 * below-the-fold content — merging them halves the invocation count
 * for every single movie page view.
 */
export async function GET(_request, { params }) {
  const { id } = await params;

  const [recommendations, reviews] = await Promise.allSettled([
    getMovieRecommendations(id),
    getMovieReviews(id),
  ]);

  return NextResponse.json(
    {
      recommendations: recommendations.status === "fulfilled" ? recommendations.value : { results: [] },
      reviews: reviews.status === "fulfilled" ? reviews.value : { results: [] },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=172800, stale-while-revalidate=604800",
      },
    },
  );
}
