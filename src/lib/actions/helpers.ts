import { createClient } from "@/lib/supabase/server";
import { TMDBMovie } from "@/types/tmdb";
import { DbMovie } from "@/types/database";

export async function getOrCreateMovieId(movie: TMDBMovie): Promise<string | null> {
  const supabase = await createClient();

  // Check if movie already exists in DB
  const { data: existing } = await supabase
    .from("movies")
    .select("id")
    .eq("tmdb_id", movie.id)
    .single();

  if (existing?.id) {
    return existing.id;
  }

  // Insert movie metadata
  const genres = movie.genres || (movie.genre_ids ? movie.genre_ids.map(id => ({ id, name: "Genre" })) : []);

  const { data: inserted, error } = await supabase
    .from("movies")
    .insert({
      tmdb_id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      runtime: movie.runtime || null,
      original_language: movie.original_language,
      genres: JSON.stringify(genres),
      tmdb_rating: movie.vote_average,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to insert movie metadata:", error);
    // Try re-querying in case of race condition
    const { data: refetched } = await supabase
      .from("movies")
      .select("id")
      .eq("tmdb_id", movie.id)
      .single();

    return refetched?.id || null;
  }

  return inserted.id;
}

export function tmdbToDbMovie(movie: TMDBMovie, dbId: string): DbMovie {
  return {
    id: dbId,
    tmdb_id: movie.id,
    title: movie.title,
    overview: movie.overview || null,
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    release_date: movie.release_date || null,
    runtime: movie.runtime || null,
    original_language: movie.original_language || null,
    genres: movie.genres || [],
    tmdb_rating: movie.vote_average || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
