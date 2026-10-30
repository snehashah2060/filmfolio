"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { TMDBMovie } from "@/types/tmdb";
import { WatchlistPriority } from "@/types/database";
import { getOrCreateMovieId } from "./helpers";

export async function addToWatchlistAction(
  movie: TMDBMovie,
  priority: WatchlistPriority = "MEDIUM",
  notes?: string
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const movieId = await getOrCreateMovieId(movie);
      if (movieId) {
        await supabase.from("watchlist").upsert(
          {
            user_id: user.id,
            movie_id: movieId,
            priority,
            notes: notes || null,
          },
          { onConflict: "user_id,movie_id" }
        );
      }
    } else {
      filmfolioStore.addToWatchlist(movie, priority, notes);
    }

    revalidatePath("/watchlist");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("addToWatchlistAction error:", error);
    return { success: false, error: "Failed to add to watchlist" };
  }
}

export async function removeFromWatchlistAction(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase.from("watchlist").delete().eq("id", id).eq("user_id", user.id);
    } else {
      filmfolioStore.removeFromWatchlist(id);
    }

    revalidatePath("/watchlist");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("removeFromWatchlistAction error:", error);
    return { success: false, error: "Failed to remove from watchlist" };
  }
}

export async function getUserWatchlist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("watchlist")
      .select("*, movie:movies(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return data || [];
  }

  return filmfolioStore.getWatchlist();
}
