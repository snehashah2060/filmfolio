"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { TMDBMovie } from "@/types/tmdb";
import { DiaryEntry } from "@/types/database";
import { getOrCreateMovieId } from "./helpers";

export async function addDiaryEntryAction(
  movie: TMDBMovie,
  watchedAt: string,
  rating?: number | null,
  notes?: string | null
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const movieId = await getOrCreateMovieId(movie);
      if (movieId) {
        await supabase.from("diary_entries").insert({
          user_id: user.id,
          movie_id: movieId,
          watched_at: watchedAt,
          personal_rating: rating || null,
          notes: notes || null,
        });

        // Ensure user_movies has this movie logged as watched
        await supabase.from("user_movies").upsert(
          {
            user_id: user.id,
            movie_id: movieId,
            status: "WATCHED",
            personal_rating: rating || null,
            watched_at: watchedAt,
          },
          { onConflict: "user_id,movie_id" }
        );
      }
    } else {
      filmfolioStore.addDiaryEntry(movie, watchedAt, rating, notes);
    }

    revalidatePath("/diary");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    revalidatePath("/wrapped");
    return { success: true };
  } catch (error) {
    console.error("addDiaryEntryAction error:", error);
    return { success: false, error: "Failed to record diary entry" };
  }
}

export async function updateDiaryEntryAction(
  id: string,
  updates: Partial<Pick<DiaryEntry, "watched_at" | "personal_rating" | "notes">>
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase
        .from("diary_entries")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);
    } else {
      filmfolioStore.updateDiaryEntry(id, updates);
    }

    revalidatePath("/diary");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return { success: true };
  } catch (error) {
    console.error("updateDiaryEntryAction error:", error);
    return { success: false, error: "Failed to update diary entry" };
  }
}

export async function deleteDiaryEntryAction(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase.from("diary_entries").delete().eq("id", id).eq("user_id", user.id);
    } else {
      filmfolioStore.deleteDiaryEntry(id);
    }

    revalidatePath("/diary");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return { success: true };
  } catch (error) {
    console.error("deleteDiaryEntryAction error:", error);
    return { success: false, error: "Failed to delete diary entry" };
  }
}

export async function getUserDiary() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("diary_entries")
      .select("*, movie:movies(*)")
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false });

    return data || [];
  }

  return filmfolioStore.getDiary();
}
