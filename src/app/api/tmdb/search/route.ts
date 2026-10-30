import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!query) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0 });
  }

  const results = await tmdbService.searchMovies(query, page);
  return NextResponse.json(results);
}
