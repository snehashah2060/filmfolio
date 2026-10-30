import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "trending";
  const page = parseInt(searchParams.get("page") || "1", 10);

  let data;
  switch (type) {
    case "popular":
      data = await tmdbService.getPopular(page);
      break;
    case "top_rated":
      data = await tmdbService.getTopRated(page);
      break;
    case "upcoming":
      data = await tmdbService.getUpcoming(page);
      break;
    case "now_playing":
      data = await tmdbService.getNowPlaying(page);
      break;
    case "trending":
    default:
      data = await tmdbService.getTrending(page);
      break;
  }

  return NextResponse.json(data);
}
