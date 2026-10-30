"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { TMDBMovie } from "@/types/tmdb";
import { getOrCreateMovieId } from "./helpers";

export async function toggleFavoriteAction(movie: TMDBMovie) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const movieId = await getOrCreateMovieId(movie);
      if (movieId) {
        const { data: existing } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("movie_id", movieId)
          .single();

        if (existing) {
          await supabase.from("favorites").delete().eq("id", existing.id);
          revalidatePath("/favorites");
          revalidatePath("/dashboard");
          return { success: true, isFavorite: false };
        } else {
          await supabase.from("favorites").insert({
            user_id: user.id,
            movie_id: movieId,
          });
          revalidatePath("/favorites");
          revalidatePath("/dashboard");
          return { success: true, isFavorite: true };
        }
      }
    }

    const isFavorite = filmfolioStore.toggleFavorite(movie);
    revalidatePath("/favorites");
    revalidatePath("/dashboard");
    return { success: true, isFavorite };
  } catch (error) {
    console.error("toggleFavoriteAction error:", error);
    return { success: false, error: "Failed to update favorites" };
  }
}

export async function getUserFavorites() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("favorites")
      .select("*, movie:movies(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return data || [];
  }

  return filmfolioStore.getFavorites();
}
