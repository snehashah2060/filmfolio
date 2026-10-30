"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { TMDBMovie } from "@/types/tmdb";
import { CustomCollection, Visibility, DbMovie } from "@/types/database";
import { getOrCreateMovieId } from "./helpers";

export async function createCollectionAction(
  name: string,
  description?: string,
  visibility: Visibility = "PUBLIC"
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const { data, error } = await supabase
        .from("custom_collections")
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          visibility,
        })
        .select()
        .single();

      if (error) throw error;
      revalidatePath("/collections");
      return { success: true, collection: data };
    }

    const col = filmfolioStore.createCollection(name, description, visibility);
    revalidatePath("/collections");
    return { success: true, collection: col };
  } catch (error) {
    console.error("createCollectionAction error:", error);
    return { success: false, error: "Failed to create collection" };
  }
}

export async function updateCollectionAction(
  id: string,
  updates: Partial<Pick<CustomCollection, "name" | "description" | "visibility" | "cover_url">>
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase
        .from("custom_collections")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);
    } else {
      filmfolioStore.updateCollection(id, updates);
    }

    revalidatePath("/collections");
    revalidatePath(`/collections/${id}`);
    return { success: true };
  } catch (error) {
    console.error("updateCollectionAction error:", error);
    return { success: false, error: "Failed to update collection" };
  }
}

export async function deleteCollectionAction(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase.from("custom_collections").delete().eq("id", id).eq("user_id", user.id);
    } else {
      filmfolioStore.deleteCollection(id);
    }

    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    console.error("deleteCollectionAction error:", error);
    return { success: false, error: "Failed to delete collection" };
  }
}

export async function addMovieToCollectionAction(collectionId: string, movie: TMDBMovie) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      const movieId = await getOrCreateMovieId(movie);
      if (movieId) {
        await supabase.from("collection_movies").insert({
          collection_id: collectionId,
          movie_id: movieId,
        });

        // Update cover_url if not set
        if (movie.backdrop_path) {
          await supabase
            .from("custom_collections")
            .update({ cover_url: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` })
            .eq("id", collectionId)
            .is("cover_url", null);
        }
      }
    } else {
      filmfolioStore.addMovieToCollection(collectionId, movie);
    }

    revalidatePath(`/collections/${collectionId}`);
    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    console.error("addMovieToCollectionAction error:", error);
    return { success: false, error: "Failed to add movie to collection" };
  }
}

export async function removeMovieFromCollectionAction(collectionId: string, movieId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      await supabase
        .from("collection_movies")
        .delete()
        .eq("collection_id", collectionId)
        .eq("movie_id", movieId);
    } else {
      filmfolioStore.removeMovieFromCollection(collectionId, movieId);
    }

    revalidatePath(`/collections/${collectionId}`);
    return { success: true };
  } catch (error) {
    console.error("removeMovieFromCollectionAction error:", error);
    return { success: false, error: "Failed to remove movie" };
  }
}

export async function getUserCollections(userId?: string): Promise<CustomCollection[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const targetId = userId || user?.id;

  if (targetId && process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("custom_collections")
      .select("*, user:profiles(*)")
      .eq("user_id", targetId)
      .order("created_at", { ascending: false });

    return (data as CustomCollection[]) || [];
  }

  return filmfolioStore.getCollections({ userId: targetId });
}

export async function getCollectionByIdAction(collectionId: string): Promise<CustomCollection | null> {
  const supabase = await createClient();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    const { data } = await supabase
      .from("custom_collections")
      .select("*, user:profiles(*)")
      .eq("id", collectionId)
      .single();

    if (!data) return null;

    // Get collection movies
    const { data: moviesData } = await supabase
      .from("collection_movies")
      .select("movie:movies(*)")
      .eq("collection_id", collectionId);

    const movies = (moviesData?.map((item: any) => item.movie) || []).flat().filter(Boolean) as DbMovie[];

    return {
      ...(data as CustomCollection),
      movies,
      movies_count: movies.length,
    };
  }

  return filmfolioStore.getCollectionById(collectionId);
}
