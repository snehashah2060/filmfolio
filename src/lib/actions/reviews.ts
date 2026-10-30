"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { TMDBMovie } from "@/types/tmdb";
import { ReviewItem, Visibility } from "@/types/database";
import { getOrCreateMovieId } from "./helpers";

export async function submitReviewAction(
  movie: TMDBMovie,
  rating: number,
  reviewText: string,
  visibility: Visibility = "PUBLIC"
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const movieId = await getOrCreateMovieId(movie);
      if (movieId) {
        await supabase.from("reviews").upsert(
          {
            user_id: user.id,
            movie_id: movieId,
            rating,
            review_text: reviewText,
            visibility,
            moderation_status: "APPROVED",
          },
          { onConflict: "user_id,movie_id" }
        );

        // Also update personal rating in user_movies
        await supabase.from("user_movies").upsert(
          {
            user_id: user.id,
            movie_id: movieId,
            personal_rating: rating,
            status: "WATCHED",
          },
          { onConflict: "user_id,movie_id" }
        );
      }
    } else {
      filmfolioStore.submitReview(movie, rating, reviewText, visibility);
    }

    revalidatePath(`/movies/${movie.id}`);
    revalidatePath("/reviews");
    revalidatePath("/community");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("submitReviewAction error:", error);
    return { success: false, error: "Failed to publish review" };
  }
}

export async function updateReviewAction(
  id: string,
  rating: number,
  reviewText: string,
  visibility: Visibility = "PUBLIC"
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase
        .from("reviews")
        .update({
          rating,
          review_text: reviewText,
          visibility,
        })
        .eq("id", id)
        .eq("user_id", user.id);
    } else {
      filmfolioStore.updateReview(id, { rating, review_text: reviewText, visibility });
    }

    revalidatePath("/reviews");
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("updateReviewAction error:", error);
    return { success: false, error: "Failed to update review" };
  }
}

export async function deleteReviewAction(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase.from("reviews").delete().eq("id", id).eq("user_id", user.id);
    } else {
      filmfolioStore.deleteReview(id);
    }

    revalidatePath("/reviews");
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("deleteReviewAction error:", error);
    return { success: false, error: "Failed to delete review" };
  }
}

export interface ToggleLikeResult {
  success: boolean;
  liked?: boolean;
  count?: number;
  error?: string;
}

export async function toggleReviewLikeAction(reviewId: string): Promise<ToggleLikeResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const { data: existing } = await supabase
        .from("review_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("review_id", reviewId)
        .single();

      if (existing) {
        await supabase.from("review_likes").delete().eq("id", existing.id);
        revalidatePath("/community");
        return { success: true, liked: false };
      } else {
        await supabase.from("review_likes").insert({
          user_id: user.id,
          review_id: reviewId,
        });
        revalidatePath("/community");
        return { success: true, liked: true };
      }
    }

    const res = filmfolioStore.toggleReviewLike(reviewId);
    revalidatePath("/community");
    return { success: true, liked: res.liked, count: res.count };
  } catch (error) {
    console.error("toggleReviewLikeAction error:", error);
    return { success: false, error: "Failed to like review" };
  }
}

export async function getMovieReviews(movieId?: string): Promise<ReviewItem[]> {
  const supabase = await createClient();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    let query = supabase
      .from("reviews")
      .select("*, user:profiles(*), movie:movies(*)")
      .eq("visibility", "PUBLIC")
      .eq("moderation_status", "APPROVED");

    if (movieId) {
      query = query.eq("movie_id", movieId);
    }

    const { data } = await query.order("created_at", { ascending: false });
    return (data as ReviewItem[]) || [];
  }

  return filmfolioStore.getReviews({ movieId, publicOnly: true });
}

export async function getUserReviews(userId?: string): Promise<ReviewItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const targetId = userId || user?.id;
  if (!targetId && !filmfolioStore.getCurrentUser()) return [];

  if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("reviews")
      .select("*, user:profiles(*), movie:movies(*)")
      .eq("user_id", targetId)
      .order("created_at", { ascending: false });

    return (data as ReviewItem[]) || [];
  }

  return filmfolioStore.getReviews({ userId: targetId });
}
