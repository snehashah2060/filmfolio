import {
  Profile,
  DbMovie,
  UserMovie,
  WatchlistItem,
  FavoriteItem,
  ReviewItem,
  CustomCollection,
  DiaryEntry,
  FollowRelationship,
  ActivityLog,
} from "@/types/database";
import { REAL_TMDB_MOVIES } from "@/lib/tmdb/curated-data";

export const DEMO_USER: Profile = {
  id: "u1111111-1111-1111-1111-111111111111",
  username: "alex_cinema",
  full_name: "Alexander Vance",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Cinema archivist, 35mm enthusiast, and narrative structure obsessive.",
  role: "ADMIN",
  is_suspended: false,
  favourite_genres: ["Science Fiction", "Drama", "Thriller"],
  profile_visibility: "PUBLIC",
  created_at: "2026-01-10T10:00:00Z",
  updated_at: "2026-10-15T12:00:00Z",
};

export const DEMO_USER_2: Profile = {
  id: "u2222222-2222-2222-2222-222222222222",
  username: "elena_noir",
  full_name: "Elena Rostova",
  avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  bio: "Exploring midnight retrospectives and neo-noir aesthetics.",
  role: "USER",
  is_suspended: false,
  favourite_genres: ["Crime", "Mystery", "Animation"],
  profile_visibility: "PUBLIC",
  created_at: "2026-02-14T14:30:00Z",
  updated_at: "2026-09-01T09:15:00Z",
};

export const INITIAL_DB_MOVIES: DbMovie[] = REAL_TMDB_MOVIES.map((m, idx) => ({
  id: `m0000000-0000-0000-0000-00000000000${idx + 1}`,
  tmdb_id: m.id,
  title: m.title,
  overview: m.overview || null,
  poster_path: m.poster_path,
  backdrop_path: m.backdrop_path,
  release_date: m.release_date || null,
  runtime: m.runtime || 140,
  original_language: m.original_language || "en",
  genres: m.genres || [],
  tmdb_rating: m.vote_average || 8.0,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
}));

export const INITIAL_USER_MOVIES: UserMovie[] = [
  {
    id: "um1",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[0].id, // Oppenheimer
    status: "WATCHED",
    personal_rating: 9.0,
    watched_at: "2026-07-21",
    personal_notes: "Phenomenal sound design and cross-cut editing. Robert Downey Jr.'s Strauss was magnetic.",
    created_at: "2026-07-22T02:00:00Z",
    updated_at: "2026-07-22T02:00:00Z",
    movie: INITIAL_DB_MOVIES[0],
  },
  {
    id: "um2",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[2].id, // Interstellar
    status: "WATCHED",
    personal_rating: 9.5,
    watched_at: "2026-08-14",
    personal_notes: "Zimmer's organ score in the wormhole sequence gives chills every time.",
    created_at: "2026-08-15T18:00:00Z",
    updated_at: "2026-08-15T18:00:00Z",
    movie: INITIAL_DB_MOVIES[2],
  },
  {
    id: "um3",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[3].id, // Inception
    status: "WATCHED",
    personal_rating: 9.0,
    watched_at: "2026-09-02",
    personal_notes: "Dream within a dream mechanics are tight and immaculate.",
    created_at: "2026-09-03T11:00:00Z",
    updated_at: "2026-09-03T11:00:00Z",
    movie: INITIAL_DB_MOVIES[3],
  },
  {
    id: "um4",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[4].id, // The Godfather
    status: "WATCHED",
    personal_rating: 10.0,
    watched_at: "2026-10-01",
    personal_notes: "The undisputed gold standard of family drama and cinematic lighting.",
    created_at: "2026-10-02T14:00:00Z",
    updated_at: "2026-10-02T14:00:00Z",
    movie: INITIAL_DB_MOVIES[4],
  },
  {
    id: "um5",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[6].id, // Parasite
    status: "WATCHED",
    personal_rating: 9.5,
    watched_at: "2026-10-10",
    personal_notes: "Seamless genre shifts from black comedy to visceral thriller.",
    created_at: "2026-10-11T16:00:00Z",
    updated_at: "2026-10-11T16:00:00Z",
    movie: INITIAL_DB_MOVIES[6],
  },
];

export const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    id: "w1",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[1].id, // Dune: Part Two
    priority: "HIGH",
    notes: "Must experience on the largest cinema screen possible.",
    created_at: "2026-09-10T12:00:00Z",
    movie: INITIAL_DB_MOVIES[1],
  },
  {
    id: "w2",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[11].id, // Blade Runner 2049
    priority: "MEDIUM",
    notes: "Planning a weekend Roger Deakins cinematography retrospective.",
    created_at: "2026-09-18T10:00:00Z",
    movie: INITIAL_DB_MOVIES[11],
  },
  {
    id: "w3",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[10].id, // Past Lives
    priority: "HIGH",
    notes: "Celine Song's directorial debut, highly acclaimed.",
    created_at: "2026-10-05T08:30:00Z",
    movie: INITIAL_DB_MOVIES[10],
  },
];

export const INITIAL_FAVORITES: FavoriteItem[] = [
  {
    id: "f1",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[2].id, // Interstellar
    created_at: "2026-08-15T18:05:00Z",
    movie: INITIAL_DB_MOVIES[2],
  },
  {
    id: "f2",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[4].id, // The Godfather
    created_at: "2026-10-02T14:05:00Z",
    movie: INITIAL_DB_MOVIES[4],
  },
  {
    id: "f3",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[7].id, // Spirited Away
    created_at: "2026-09-12T19:00:00Z",
    movie: INITIAL_DB_MOVIES[7],
  },
];

export const INITIAL_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: "d1",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[2].id, // Interstellar
    watched_at: "2026-10-18",
    personal_rating: 9.5,
    notes: "Re-watched with headphones. The Miller's Planet ticking soundtrack creates extraordinary stress.",
    created_at: "2026-10-18T23:30:00Z",
    updated_at: "2026-10-18T23:30:00Z",
    movie: INITIAL_DB_MOVIES[2],
  },
  {
    id: "d2",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[0].id, // Oppenheimer
    watched_at: "2026-09-28",
    personal_rating: 9.0,
    notes: "Second viewing. Focused on the trinity test silence sequence. Masterclass in audio anticipation.",
    created_at: "2026-09-28T22:00:00Z",
    updated_at: "2026-09-28T22:00:00Z",
    movie: INITIAL_DB_MOVIES[0],
  },
  {
    id: "d3",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[6].id, // Parasite
    watched_at: "2026-09-15",
    personal_rating: 9.5,
    notes: "The torrential rain sequence down the stairs to the sub-basement remains unforgettable.",
    created_at: "2026-09-15T21:15:00Z",
    updated_at: "2026-09-15T21:15:00Z",
    movie: INITIAL_DB_MOVIES[6],
  },
  {
    id: "d4",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[3].id, // Inception
    watched_at: "2026-08-30",
    personal_rating: 9.0,
    notes: "Zero-gravity hallway fight choreography is still unmatched.",
    created_at: "2026-08-30T23:00:00Z",
    updated_at: "2026-08-30T23:00:00Z",
    movie: INITIAL_DB_MOVIES[3],
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[0].id, // Oppenheimer
    rating: 9.0,
    review_text:
      "A monumental character study disguised as an epic thriller. Nolan strips away melodrama and replaces it with pure kinetic history. Cillian Murphy conveys decades of guilt and ambition solely through his gaze.",
    visibility: "PUBLIC",
    moderation_status: "APPROVED",
    created_at: "2026-07-23T14:00:00Z",
    updated_at: "2026-07-23T14:00:00Z",
    user: DEMO_USER,
    movie: INITIAL_DB_MOVIES[0],
    likes_count: 14,
    user_has_liked: false,
  },
  {
    id: "r2",
    user_id: DEMO_USER_2.id,
    movie_id: INITIAL_DB_MOVIES[6].id, // Parasite
    rating: 10.0,
    review_text:
      "Every frame is purposeful. Bong Joon-ho orchestrates tension like an allegro symphony. The architectural contrast between the hill house and the semi-basement is cinematic genius.",
    visibility: "PUBLIC",
    moderation_status: "APPROVED",
    created_at: "2026-08-10T19:20:00Z",
    updated_at: "2026-08-10T19:20:00Z",
    user: DEMO_USER_2,
    movie: INITIAL_DB_MOVIES[6],
    likes_count: 28,
    user_has_liked: true,
  },
  {
    id: "r3",
    user_id: DEMO_USER.id,
    movie_id: INITIAL_DB_MOVIES[2].id, // Interstellar
    rating: 9.5,
    review_text:
      "Transcends hard science fiction into a deeply emotional meditation on time and parental devotion. The docking sequence alone justifies cinema's existence.",
    visibility: "PUBLIC",
    moderation_status: "APPROVED",
    created_at: "2026-08-16T10:15:00Z",
    updated_at: "2026-08-16T10:15:00Z",
    user: DEMO_USER,
    movie: INITIAL_DB_MOVIES[2],
    likes_count: 32,
    user_has_liked: false,
  },
];

export const INITIAL_COLLECTIONS: CustomCollection[] = [
  {
    id: "c1",
    user_id: DEMO_USER.id,
    name: "Architects of Modern Sci-Fi",
    description: "Expansive horizons, time dilation, and existential human questions in 21st century visionary cinema.",
    cover_url: "https://image.tmdb.org/t/p/w780/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    visibility: "PUBLIC",
    created_at: "2026-08-01T12:00:00Z",
    updated_at: "2026-08-01T12:00:00Z",
    user: DEMO_USER,
    movies_count: 3,
    movies: [INITIAL_DB_MOVIES[0], INITIAL_DB_MOVIES[2], INITIAL_DB_MOVIES[1]],
  },
  {
    id: "c2",
    user_id: DEMO_USER.id,
    name: "Pure Cinema Tension",
    description: "Films where pacing, editing and sound design elevate pulse rates to the absolute limit.",
    cover_url: "https://image.tmdb.org/t/p/w780/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    visibility: "PUBLIC",
    created_at: "2026-09-05T14:30:00Z",
    updated_at: "2026-09-05T14:30:00Z",
    user: DEMO_USER,
    movies_count: 3,
    movies: [INITIAL_DB_MOVIES[3], INITIAL_DB_MOVIES[6], INITIAL_DB_MOVIES[8]],
  },
];

export const INITIAL_FOLLOWS: FollowRelationship[] = [
  {
    id: "fol1",
    follower_id: DEMO_USER.id,
    following_id: DEMO_USER_2.id,
    created_at: "2026-08-12T11:00:00Z",
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "act1",
    user_id: DEMO_USER.id,
    action: "added_review",
    entity_type: "review",
    entity_id: "r1",
    visibility: "PUBLIC",
    created_at: "2026-10-25T15:00:00Z",
    user: DEMO_USER,
    entity_details: { movie_title: "Oppenheimer", rating: 9.0 },
  },
  {
    id: "act2",
    user_id: DEMO_USER_2.id,
    action: "created_collection",
    entity_type: "collection",
    entity_id: "c1",
    visibility: "PUBLIC",
    created_at: "2026-10-24T18:20:00Z",
    user: DEMO_USER_2,
    entity_details: { collection_name: "Architects of Modern Sci-Fi" },
  },
  {
    id: "act3",
    user_id: DEMO_USER.id,
    action: "added_favorite",
    entity_type: "favorite",
    entity_id: "f1",
    visibility: "PUBLIC",
    created_at: "2026-10-22T09:40:00Z",
    user: DEMO_USER,
    entity_details: { movie_title: "Interstellar" },
  },
];
