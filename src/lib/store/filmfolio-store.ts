import {
  Profile,
  DbMovie,
  UserMovie,
  WatchlistItem,
  FavoriteItem,
  ReviewItem,
  CustomCollection,
  DiaryEntry,
  ActivityLog,
  WatchlistPriority,
  MovieWatchStatus,
  Visibility,
  ModerationStatus,
} from "@/types/database";
import { TMDBMovie } from "@/types/tmdb";
import {
  DEMO_USER,
  DEMO_USER_2,
  INITIAL_DB_MOVIES,
  INITIAL_USER_MOVIES,
  INITIAL_WATCHLIST,
  INITIAL_FAVORITES,
  INITIAL_DIARY_ENTRIES,
  INITIAL_REVIEWS,
  INITIAL_COLLECTIONS,
  INITIAL_FOLLOWS,
  INITIAL_ACTIVITY_LOGS,
} from "./demo-data";

// In-memory persistent data store
class FilmfolioStore {
  private users: Profile[] = [DEMO_USER, DEMO_USER_2];
  private currentUserId: string = DEMO_USER.id;
  private movies: DbMovie[] = [...INITIAL_DB_MOVIES];
  private userMovies: UserMovie[] = [...INITIAL_USER_MOVIES];
  private watchlist: WatchlistItem[] = [...INITIAL_WATCHLIST];
  private favorites: FavoriteItem[] = [...INITIAL_FAVORITES];
  private diaryEntries: DiaryEntry[] = [...INITIAL_DIARY_ENTRIES];
  private reviews: ReviewItem[] = [...INITIAL_REVIEWS];
  private collections: CustomCollection[] = [...INITIAL_COLLECTIONS];
  private follows = [...INITIAL_FOLLOWS];
  private reviewLikes = new Set<string>(["r2"]); // demo user liked r2
  private activityLogs: ActivityLog[] = [...INITIAL_ACTIVITY_LOGS];

  // Auth & Profile
  getCurrentUser(): Profile {
    return this.users.find((u) => u.id === this.currentUserId) || DEMO_USER;
  }

  setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  getUserById(id: string): Profile | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByUsername(username: string): Profile | undefined {
    return this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
  }

  getAllUsers(): Profile[] {
    return [...this.users];
  }

  updateProfile(userId: string, updates: Partial<Profile>): Profile {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      this.users[idx] = {
        ...this.users[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return this.users[idx];
    }
    return DEMO_USER;
  }

  toggleSuspension(userId: string, suspend: boolean): boolean {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.is_suspended = suspend;
      return true;
    }
    return false;
  }

  // Movie Helper
  getOrCreateMovie(tmdbMovie: TMDBMovie): DbMovie {
    let existing = this.movies.find((m) => m.tmdb_id === tmdbMovie.id);
    if (!existing) {
      existing = {
        id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tmdb_id: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview || null,
        poster_path: tmdbMovie.poster_path || null,
        backdrop_path: tmdbMovie.backdrop_path || null,
        release_date: tmdbMovie.release_date || null,
        runtime: tmdbMovie.runtime || 120,
        original_language: tmdbMovie.original_language || "en",
        genres: tmdbMovie.genres || [],
        tmdb_rating: tmdbMovie.vote_average || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.movies.push(existing);
    }
    return existing;
  }

  // Library
  getUserMovies(userId: string = this.currentUserId): UserMovie[] {
    return this.userMovies
      .filter((um) => um.user_id === userId)
      .map((um) => ({
        ...um,
        movie: this.movies.find((m) => m.id === um.movie_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  addToLibrary(
    movie: TMDBMovie,
    options: {
      status?: MovieWatchStatus;
      personal_rating?: number | null;
      watched_at?: string | null;
      personal_notes?: string | null;
      userId?: string;
    } = {}
  ): UserMovie {
    const userId = options.userId || this.currentUserId;
    const dbMovie = this.getOrCreateMovie(movie);

    // Prevent duplicate entry
    const existingIdx = this.userMovies.findIndex(
      (um) => um.user_id === userId && um.movie_id === dbMovie.id
    );

    const now = new Date().toISOString();
    if (existingIdx !== -1) {
      this.userMovies[existingIdx] = {
        ...this.userMovies[existingIdx],
        status: options.status || this.userMovies[existingIdx].status,
        personal_rating: options.personal_rating !== undefined ? options.personal_rating : this.userMovies[existingIdx].personal_rating,
        watched_at: options.watched_at !== undefined ? options.watched_at : this.userMovies[existingIdx].watched_at,
        personal_notes: options.personal_notes !== undefined ? options.personal_notes : this.userMovies[existingIdx].personal_notes,
        updated_at: now,
      };
      return { ...this.userMovies[existingIdx], movie: dbMovie };
    }

    const newEntry: UserMovie = {
      id: `um_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      movie_id: dbMovie.id,
      status: options.status || "WATCHED",
      personal_rating: options.personal_rating || null,
      watched_at: options.watched_at || new Date().toISOString().split("T")[0],
      personal_notes: options.personal_notes || null,
      created_at: now,
      updated_at: now,
      movie: dbMovie,
    };

    this.userMovies.unshift(newEntry);

    // Also remove from watchlist if present
    this.watchlist = this.watchlist.filter(
      (w) => !(w.user_id === userId && w.movie_id === dbMovie.id)
    );

    // Log activity
    this.logActivity(userId, "added_to_library", "movie", dbMovie.id, {
      title: dbMovie.title,
    });

    return newEntry;
  }

  updateLibraryEntry(
    id: string,
    updates: Partial<Pick<UserMovie, "status" | "personal_rating" | "watched_at" | "personal_notes">>
  ): UserMovie | null {
    const idx = this.userMovies.findIndex((um) => um.id === id);
    if (idx === -1) return null;

    this.userMovies[idx] = {
      ...this.userMovies[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return {
      ...this.userMovies[idx],
      movie: this.movies.find((m) => m.id === this.userMovies[idx].movie_id),
    };
  }

  removeFromLibrary(id: string, userId: string = this.currentUserId): boolean {
    const initialLen = this.userMovies.length;
    this.userMovies = this.userMovies.filter(
      (um) => !(um.id === id && um.user_id === userId)
    );
    return this.userMovies.length < initialLen;
  }

  // Watchlist
  getWatchlist(userId: string = this.currentUserId): WatchlistItem[] {
    return this.watchlist
      .filter((w) => w.user_id === userId)
      .map((w) => ({
        ...w,
        movie: this.movies.find((m) => m.id === w.movie_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  addToWatchlist(
    movie: TMDBMovie,
    priority: WatchlistPriority = "MEDIUM",
    notes?: string,
    userId: string = this.currentUserId
  ): WatchlistItem {
    const dbMovie = this.getOrCreateMovie(movie);
    const existing = this.watchlist.find(
      (w) => w.user_id === userId && w.movie_id === dbMovie.id
    );

    if (existing) {
      existing.priority = priority;
      if (notes) existing.notes = notes;
      return { ...existing, movie: dbMovie };
    }

    const newItem: WatchlistItem = {
      id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      movie_id: dbMovie.id,
      priority,
      notes: notes || null,
      created_at: new Date().toISOString(),
      movie: dbMovie,
    };
    this.watchlist.unshift(newItem);
    return newItem;
  }

  removeFromWatchlist(id: string, userId: string = this.currentUserId): boolean {
    const initialLen = this.watchlist.length;
    this.watchlist = this.watchlist.filter(
      (w) => !(w.id === id && w.user_id === userId)
    );
    return this.watchlist.length < initialLen;
  }

  // Favorites
  getFavorites(userId: string = this.currentUserId): FavoriteItem[] {
    return this.favorites
      .filter((f) => f.user_id === userId)
      .map((f) => ({
        ...f,
        movie: this.movies.find((m) => m.id === f.movie_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  isFavorite(tmdbId: number, userId: string = this.currentUserId): boolean {
    const dbMovie = this.movies.find((m) => m.tmdb_id === tmdbId);
    if (!dbMovie) return false;
    return this.favorites.some((f) => f.user_id === userId && f.movie_id === dbMovie.id);
  }

  toggleFavorite(movie: TMDBMovie, userId: string = this.currentUserId): boolean {
    const dbMovie = this.getOrCreateMovie(movie);
    const existingIdx = this.favorites.findIndex(
      (f) => f.user_id === userId && f.movie_id === dbMovie.id
    );

    if (existingIdx !== -1) {
      this.favorites.splice(existingIdx, 1);
      return false; // Removed
    } else {
      this.favorites.unshift({
        id: `f_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        user_id: userId,
        movie_id: dbMovie.id,
        created_at: new Date().toISOString(),
        movie: dbMovie,
      });
      this.logActivity(userId, "added_favorite", "movie", dbMovie.id, {
        title: dbMovie.title,
      });
      return true; // Added
    }
  }

  // Diary Entries (Multiple viewing records permitted!)
  getDiary(userId: string = this.currentUserId): DiaryEntry[] {
    return this.diaryEntries
      .filter((d) => d.user_id === userId)
      .map((d) => ({
        ...d,
        movie: this.movies.find((m) => m.id === d.movie_id),
      }))
      .sort((a, b) => new Date(b.watched_at).getTime() - new Date(a.watched_at).getTime());
  }

  addDiaryEntry(
    movie: TMDBMovie,
    watchedAt: string,
    rating?: number | null,
    notes?: string | null,
    userId: string = this.currentUserId
  ): DiaryEntry {
    const dbMovie = this.getOrCreateMovie(movie);
    const now = new Date().toISOString();
    const entry: DiaryEntry = {
      id: `d_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      movie_id: dbMovie.id,
      watched_at: watchedAt || now.split("T")[0],
      personal_rating: rating || null,
      notes: notes || null,
      created_at: now,
      updated_at: now,
      movie: dbMovie,
    };
    this.diaryEntries.unshift(entry);

    // Also ensure it is present in library as watched
    this.addToLibrary(movie, {
      status: "WATCHED",
      personal_rating: rating,
      watched_at: watchedAt,
      userId,
    });

    this.logActivity(userId, "added_diary_entry", "diary", entry.id, {
      title: dbMovie.title,
      watched_at: entry.watched_at,
    });

    return entry;
  }

  updateDiaryEntry(
    id: string,
    updates: Partial<Pick<DiaryEntry, "watched_at" | "personal_rating" | "notes">>,
    userId: string = this.currentUserId
  ): DiaryEntry | null {
    const idx = this.diaryEntries.findIndex((d) => d.id === id && d.user_id === userId);
    if (idx === -1) return null;

    this.diaryEntries[idx] = {
      ...this.diaryEntries[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return {
      ...this.diaryEntries[idx],
      movie: this.movies.find((m) => m.id === this.diaryEntries[idx].movie_id),
    };
  }

  deleteDiaryEntry(id: string, userId: string = this.currentUserId): boolean {
    const initialLen = this.diaryEntries.length;
    this.diaryEntries = this.diaryEntries.filter(
      (d) => !(d.id === id && d.user_id === userId)
    );
    return this.diaryEntries.length < initialLen;
  }

  // Reviews
  getReviews(filter?: { movieId?: string; userId?: string; publicOnly?: boolean }): ReviewItem[] {
    let result = [...this.reviews];

    if (filter?.movieId) {
      result = result.filter((r) => r.movie_id === filter.movieId);
    }
    if (filter?.userId) {
      result = result.filter((r) => r.user_id === filter.userId);
    }
    if (filter?.publicOnly) {
      result = result.filter(
        (r) => r.visibility === "PUBLIC" && r.moderation_status === "APPROVED"
      );
    }

    return result
      .map((r) => ({
        ...r,
        user: this.users.find((u) => u.id === r.user_id),
        movie: this.movies.find((m) => m.id === r.movie_id),
        user_has_liked: this.reviewLikes.has(r.id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  submitReview(
    movie: TMDBMovie,
    rating: number,
    text: string,
    visibility: Visibility = "PUBLIC",
    userId: string = this.currentUserId
  ): ReviewItem {
    const dbMovie = this.getOrCreateMovie(movie);
    const existingIdx = this.reviews.findIndex(
      (r) => r.user_id === userId && r.movie_id === dbMovie.id
    );

    const now = new Date().toISOString();
    if (existingIdx !== -1) {
      this.reviews[existingIdx] = {
        ...this.reviews[existingIdx],
        rating,
        review_text: text,
        visibility,
        updated_at: now,
      };
      return {
        ...this.reviews[existingIdx],
        user: this.getCurrentUser(),
        movie: dbMovie,
      };
    }

    const newReview: ReviewItem = {
      id: `r_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      movie_id: dbMovie.id,
      rating,
      review_text: text,
      visibility,
      moderation_status: "APPROVED",
      created_at: now,
      updated_at: now,
      likes_count: 0,
      user_has_liked: false,
      user: this.getCurrentUser(),
      movie: dbMovie,
    };

    this.reviews.unshift(newReview);

    // Also update personal rating in user_movies
    this.addToLibrary(movie, { personal_rating: rating, userId });

    if (visibility === "PUBLIC") {
      this.logActivity(userId, "added_review", "review", newReview.id, {
        title: dbMovie.title,
        rating,
      });
    }

    return newReview;
  }

  updateReview(
    id: string,
    updates: Partial<Pick<ReviewItem, "rating" | "review_text" | "visibility" | "moderation_status">>,
    userId?: string
  ): ReviewItem | null {
    const idx = this.reviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    // Check authorization: owner or admin
    const currentUser = this.getCurrentUser();
    if (userId && this.reviews[idx].user_id !== userId && currentUser.role !== "ADMIN") {
      return null;
    }

    this.reviews[idx] = {
      ...this.reviews[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return {
      ...this.reviews[idx],
      user: this.users.find((u) => u.id === this.reviews[idx].user_id),
      movie: this.movies.find((m) => m.id === this.reviews[idx].movie_id),
    };
  }

  deleteReview(id: string, userId?: string): boolean {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) return false;

    const currentUser = this.getCurrentUser();
    if (userId && review.user_id !== userId && currentUser.role !== "ADMIN") {
      return false;
    }

    this.reviews = this.reviews.filter((r) => r.id !== id);
    return true;
  }

  toggleReviewLike(reviewId: string): { liked: boolean; count: number } {
    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review) return { liked: false, count: 0 };

    if (this.reviewLikes.has(reviewId)) {
      this.reviewLikes.delete(reviewId);
      review.likes_count = Math.max(0, (review.likes_count || 1) - 1);
      return { liked: false, count: review.likes_count };
    } else {
      this.reviewLikes.add(reviewId);
      review.likes_count = (review.likes_count || 0) + 1;
      return { liked: true, count: review.likes_count };
    }
  }

  // Collections
  getCollections(filter?: { userId?: string; publicOnly?: boolean }): CustomCollection[] {
    let list = [...this.collections];
    if (filter?.userId) {
      list = list.filter((c) => c.user_id === filter.userId);
    }
    if (filter?.publicOnly) {
      list = list.filter((c) => c.visibility === "PUBLIC");
    }

    return list
      .map((c) => ({
        ...c,
        user: this.users.find((u) => u.id === c.user_id),
        movies_count: c.movies?.length || 0,
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getCollectionById(id: string): CustomCollection | null {
    const c = this.collections.find((item) => item.id === id);
    if (!c) return null;
    return {
      ...c,
      user: this.users.find((u) => u.id === c.user_id),
      movies_count: c.movies?.length || 0,
    };
  }

  createCollection(
    name: string,
    description?: string,
    visibility: Visibility = "PUBLIC",
    userId: string = this.currentUserId
  ): CustomCollection {
    const now = new Date().toISOString();
    const newCollection: CustomCollection = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      name,
      description: description || null,
      cover_url: null,
      visibility,
      created_at: now,
      updated_at: now,
      movies: [],
      movies_count: 0,
      user: this.getCurrentUser(),
    };

    this.collections.unshift(newCollection);

    if (visibility === "PUBLIC") {
      this.logActivity(userId, "created_collection", "collection", newCollection.id, {
        name,
      });
    }

    return newCollection;
  }

  updateCollection(
    id: string,
    updates: Partial<Pick<CustomCollection, "name" | "description" | "visibility" | "cover_url">>,
    userId: string = this.currentUserId
  ): CustomCollection | null {
    const idx = this.collections.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return null;

    this.collections[idx] = {
      ...this.collections[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.getCollectionById(id);
  }

  deleteCollection(id: string, userId: string = this.currentUserId): boolean {
    const initialLen = this.collections.length;
    this.collections = this.collections.filter(
      (c) => !(c.id === id && c.user_id === userId)
    );
    return this.collections.length < initialLen;
  }

  addMovieToCollection(collectionId: string, movie: TMDBMovie, userId: string = this.currentUserId): boolean {
    const collection = this.collections.find(
      (c) => c.id === collectionId && c.user_id === userId
    );
    if (!collection) return false;

    const dbMovie = this.getOrCreateMovie(movie);
    collection.movies = collection.movies || [];

    if (!collection.movies.some((m) => m.id === dbMovie.id)) {
      collection.movies.push(dbMovie);
      collection.movies_count = collection.movies.length;
      // Generate cover from first movie's backdrop if not set
      if (!collection.cover_url && dbMovie.backdrop_path) {
        collection.cover_url = `https://image.tmdb.org/t/p/w780${dbMovie.backdrop_path}`;
      }
      return true;
    }
    return false;
  }

  removeMovieFromCollection(collectionId: string, movieId: string, userId: string = this.currentUserId): boolean {
    const collection = this.collections.find(
      (c) => c.id === collectionId && c.user_id === userId
    );
    if (!collection || !collection.movies) return false;

    const initialLen = collection.movies.length;
    collection.movies = collection.movies.filter((m) => m.id !== movieId);
    collection.movies_count = collection.movies.length;
    return collection.movies.length < initialLen;
  }

  // Follow System
  isFollowing(followerId: string, followingId: string): boolean {
    return this.follows.some(
      (f) => f.follower_id === followerId && f.following_id === followingId
    );
  }

  toggleFollow(followingId: string, followerId: string = this.currentUserId): boolean {
    if (followerId === followingId) return false; // Self-following prohibited!

    const existingIdx = this.follows.findIndex(
      (f) => f.follower_id === followerId && f.following_id === followingId
    );

    if (existingIdx !== -1) {
      this.follows.splice(existingIdx, 1);
      return false; // Unfollowed
    } else {
      this.follows.push({
        id: `fol_${Date.now()}`,
        follower_id: followerId,
        following_id: followingId,
        created_at: new Date().toISOString(),
      });
      return true; // Followed
    }
  }

  getFollowCounts(userId: string) {
    const followers = this.follows.filter((f) => f.following_id === userId).length;
    const following = this.follows.filter((f) => f.follower_id === userId).length;
    return { followers, following };
  }

  // Activity Log
  private logActivity(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    details?: Record<string, unknown>
  ) {
    this.activityLogs.unshift({
      id: `act_${Date.now()}`,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      visibility: "PUBLIC",
      created_at: new Date().toISOString(),
      user: this.getUserById(userId),
      entity_details: details,
    });
  }

  getActivityLogs(limit = 20): ActivityLog[] {
    return this.activityLogs
      .filter((a) => a.visibility === "PUBLIC")
      .slice(0, limit)
      .map((a) => ({
        ...a,
        user: this.getUserById(a.user_id),
      }));
  }

  // Statistics calculation for user dashboard & analytics
  getUserStats(userId: string = this.currentUserId) {
    const library = this.getUserMovies(userId);
    const watched = library.filter((m) => m.status === "WATCHED");
    const unwatched = library.filter((m) => m.status === "UNWATCHED" || m.status === "PLANNING");
    const watchlist = this.getWatchlist(userId);
    const favorites = this.getFavorites(userId);
    const reviews = this.getReviews({ userId });
    const diary = this.getDiary(userId);

    const ratings = library
      .map((m) => m.personal_rating)
      .filter((r): r is number => r !== null && r !== undefined);

    const averageRating =
      ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

    return {
      totalLibrary: library.length,
      totalWatched: watched.length,
      totalUnwatched: unwatched.length,
      watchlistCount: watchlist.length,
      favoritesCount: favorites.length,
      averageRating: Number(averageRating.toFixed(1)),
      reviewsCount: reviews.length,
      diaryCount: diary.length,
    };
  }
}

// Global Singleton Store Instance
const globalForStore = globalThis as unknown as { filmfolioStore: FilmfolioStore };
export const filmfolioStore = globalForStore.filmfolioStore || new FilmfolioStore();
if (process.env.NODE_ENV !== "production") globalForStore.filmfolioStore = filmfolioStore;
