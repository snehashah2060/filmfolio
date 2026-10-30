export type UserRole = "USER" | "ADMIN";
export type Visibility = "PUBLIC" | "PRIVATE";
export type WatchlistPriority = "LOW" | "MEDIUM" | "HIGH";
export type MovieWatchStatus = "WATCHED" | "UNWATCHED" | "PLANNING";
export type ModerationStatus = "APPROVED" | "FLAGGED" | "REMOVED";

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  is_suspended: boolean;
  favourite_genres: string[] | { id: number; name: string }[];
  profile_visibility: Visibility;
  created_at: string;
  updated_at: string;
}

export interface DbMovie {
  id: string;
  tmdb_id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  runtime: number | null;
  original_language: string | null;
  genres: { id: number; name: string }[];
  tmdb_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserMovie {
  id: string;
  user_id: string;
  movie_id: string;
  status: MovieWatchStatus;
  personal_rating: number | null;
  watched_at: string | null;
  personal_notes: string | null;
  created_at: string;
  updated_at: string;
  movie?: DbMovie;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id: string;
  priority: WatchlistPriority;
  notes: string | null;
  created_at: string;
  movie?: DbMovie;
}

export interface FavoriteItem {
  id: string;
  user_id: string;
  movie_id: string;
  created_at: string;
  movie?: DbMovie;
}

export interface ReviewItem {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  review_text: string;
  visibility: Visibility;
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
  user?: Profile;
  movie?: DbMovie;
  likes_count?: number;
  user_has_liked?: boolean;
}

export interface CustomCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
  user?: Profile;
  movies_count?: number;
  movies?: DbMovie[];
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  movie_id: string;
  watched_at: string;
  personal_rating: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  movie?: DbMovie;
}

export interface FollowRelationship {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  visibility: Visibility;
  created_at: string;
  user?: Profile;
  entity_details?: Record<string, unknown>;
}
