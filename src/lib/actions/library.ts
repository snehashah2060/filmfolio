"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { TMDBMovie } from "@/types/tmdb";
import { MovieWatchStatus, UserMovie } from "@/types/database";
import { getOrCreateMovieId } from "./helpers";

export async function addToLibraryAction(
  movie: TMDBMovie,
  options: {
    status?: MovieWatchStatus;
    rating?: number | null;
    watchedAt?: string | null;
    notes?: string | null;
  } = {}
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const movieId = await getOrCreateMovieId(movie);
      if (movieId) {
        // Upsert into user_movies
        await supabase.from("user_movies").upsert(
          {
            user_id: user.id,
            movie_id: movieId,
            status: options.status || "WATCHED",
            personal_rating: options.rating || null,
            watched_at: options.watchedAt || new Date().toISOString().split("T")[0],
            personal_notes: options.notes || null,
          },
          { onConflict: "user_id,movie_id" }
        );

        // Delete from watchlist if present
        await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movieId);
      }
    } else {
      // In-store fallback
      filmfolioStore.addToLibrary(movie, {
        status: options.status,
        personal_rating: options.rating,
        watched_at: options.watchedAt,
        personal_notes: options.notes,
      });
    }

    revalidatePath("/library");
    revalidatePath("/dashboard");
    revalidatePath("/watchlist");
    return { success: true };
  } catch (error) {
    console.error("addToLibraryAction error:", error);
    return { success: false, error: "Failed to add movie to library" };
  }
}

export async function updateLibraryEntryAction(
  id: string,
  updates: Partial<Pick<UserMovie, "status" | "personal_rating" | "watched_at" | "personal_notes">>
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase
        .from("user_movies")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);
    } else {
      filmfolioStore.updateLibraryEntry(id, updates);
    }

    revalidatePath("/library");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("updateLibraryEntryAction error:", error);
    return { success: false, error: "Failed to update library entry" };
  }
}

export async function removeFromLibraryAction(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase
        .from("user_movies")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
    } else {
      filmfolioStore.removeFromLibrary(id);
    }

    revalidatePath("/library");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("removeFromLibraryAction error:", error);
    return { success: false, error: "Failed to remove movie" };
  }
}

export async function getUserLibrary() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("user_movies")
      .select("*, movie:movies(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return data || [];
  }

  return filmfolioStore.getUserMovies();
}
