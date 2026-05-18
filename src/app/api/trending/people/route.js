import { getTrendingPeople } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const data = await getTrendingPeople();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=172800, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
