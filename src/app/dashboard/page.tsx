import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Film,
  Bookmark,
  Heart,
  Calendar,
  PenTool,
  Star,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
  CheckCircle2,
  Users,
} from "lucide-react";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { getUserLibrary } from "@/lib/actions/library";
import { getUserWatchlist } from "@/lib/actions/watchlist";
import { getUserFavorites } from "@/lib/actions/favorites";
import { getCommunityActivityAction } from "@/lib/actions/community";
import { tmdbService } from "@/lib/tmdb/service";
import { getTMDBPosterUrl, getTMDBBackdropUrl } from "@/lib/tmdb/config";
import { formatRating, formatDate, formatYear } from "@/lib/utils";
import { MovieCard } from "@/components/movies/MovieCard";

export default async function DashboardPage() {
  const currentUser = filmfolioStore.getCurrentUser();
  const stats = filmfolioStore.getUserStats(currentUser.id);

  // Fetch user personal data
  const library = await getUserLibrary();
  const watchlist = await getUserWatchlist();
  const favorites = await getUserFavorites();
  const communityActivity = await getCommunityActivityAction();

  // Fetch TMDB live discovery
  const trendingData = await tmdbService.getTrending(1);
  const recommendedData = await tmdbService.getPopular(1);

  const recentlyWatched = library.filter((m) => m.status === "WATCHED").slice(0, 4);
  const recentlyAdded = library.slice(0, 6);
  const watchlistPreview = watchlist.slice(0, 4);
  const favoritesPreview = favorites.slice(0, 4);

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar userRole={currentUser.role} username={currentUser.username} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-obsidian-card via-obsidian-secondary to-obsidian-card border border-obsidian-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-cinematic">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold border border-gold/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Cinema Desk</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cinema-text">
              Welcome back, {currentUser.full_name || currentUser.username}
            </h1>
            <p className="text-sm text-cinema-muted">
              Here is the state of your cinema collection and recent viewing history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/discover"
              className="px-4 py-2.5 rounded-xl bg-gold text-obsidian font-semibold text-sm hover:bg-gold-secondary transition-all shadow-gold-sm flex items-center gap-2"
            >
              <Film className="w-4 h-4" />
              <span>Discover Films</span>
            </Link>
            <Link
              href="/diary"
              className="px-4 py-2.5 rounded-xl bg-obsidian-secondary border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 transition-all text-sm flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-gold" />
              <span>Log a View</span>
            </Link>
          </div>
        </div>

        {/* Real Statistics Grid (Never hardcoded) */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-cinema-subtle font-semibold mb-4">
            Collection Key Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
              <span className="text-xs text-cinema-muted">Total Library</span>
              <span className="font-serif text-2xl font-bold text-cinema-text mt-2">
                {stats.totalLibrary}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
              <span className="text-xs text-cinema-muted">Watched</span>
              <span className="font-serif text-2xl font-bold text-cinema-green mt-2">
                {stats.totalWatched}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
              <span className="text-xs text-cinema-muted">Unwatched</span>
              <span className="font-serif text-2xl font-bold text-cinema-muted mt-2">
                {stats.totalUnwatched}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
              <span className="text-xs text-cinema-muted">Watchlist</span>
              <span className="font-serif text-2xl font-bold text-gold mt-2">
                {stats.watchlistCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
              <span className="text-xs text-cinema-muted">Favourites</span>
              <span className="font-serif text-2xl font-bold text-gold-secondary mt-2">
                {stats.favoritesCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
              <span className="text-xs text-cinema-muted">Avg Rating</span>
              <span className="font-serif text-2xl font-bold text-gold mt-2 flex items-center gap-1">
                <span>{stats.averageRating > 0 ? stats.averageRating : "—"}</span>
                {stats.averageRating > 0 && <Star className="w-4 h-4 fill-gold text-gold" />}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
              <span className="text-xs text-cinema-muted">Reviews</span>
              <span className="font-serif text-2xl font-bold text-cinema-text mt-2">
                {stats.reviewsCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
              <span className="text-xs text-cinema-muted">Diary Entries</span>
              <span className="font-serif text-2xl font-bold text-cinema-text mt-2">
                {stats.diaryCount}
              </span>
            </div>
          </div>
        </section>

        {/* Recently Watched & Personal Favourites in 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recently Watched */}
          <section className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                <span>Recently Watched</span>
              </h2>
              <Link
                href="/library"
                className="text-xs text-gold hover:text-gold-secondary flex items-center gap-1"
              >
                <span>View Library</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentlyWatched.length === 0 ? (
              <div className="p-8 text-center text-sm text-cinema-muted bg-obsidian-secondary rounded-xl border border-obsidian-border">
                No films logged as watched yet. Click &quot;Log a View&quot; to begin!
              </div>
            ) : (
              <div className="space-y-3">
                {recentlyWatched.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-obsidian-secondary border border-obsidian-border flex items-center gap-3 hover:border-gold/30 transition-colors"
                  >
                    <div className="relative w-12 h-16 rounded-md overflow-hidden shrink-0 bg-obsidian">
                      {item.movie?.poster_path && (
                        <Image
                          src={getTMDBPosterUrl(item.movie.poster_path, "sm")}
                          alt={item.movie.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/movies/${item.movie?.tmdb_id}`}
                        className="font-medium text-sm text-cinema-text hover:text-gold truncate block"
                      >
                        {item.movie?.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-cinema-muted mt-1">
                        <span>Watched {formatDate(item.watched_at)}</span>
                        {item.personal_rating && (
                          <span className="flex items-center gap-1 text-gold font-semibold">
                            <Star className="w-3 h-3 fill-gold" />
                            {item.personal_rating}/10
                          </span>
                        )}
                      </div>
                      {item.personal_notes && (
                        <p className="text-xs text-cinema-muted/80 line-clamp-1 italic mt-1">
                          &ldquo;{item.personal_notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Watchlist Preview */}
          <section className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-gold" />
                <span>Watchlist Queue</span>
              </h2>
              <Link
                href="/watchlist"
                className="text-xs text-gold hover:text-gold-secondary flex items-center gap-1"
              >
                <span>View Full Watchlist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {watchlistPreview.length === 0 ? (
              <div className="p-8 text-center text-sm text-cinema-muted bg-obsidian-secondary rounded-xl border border-obsidian-border">
                Your watchlist is currently empty. Explore discoveries to add films!
              </div>
            ) : (
              <div className="space-y-3">
                {watchlistPreview.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-obsidian-secondary border border-obsidian-border flex items-center gap-3 hover:border-gold/30 transition-colors"
                  >
                    <div className="relative w-12 h-16 rounded-md overflow-hidden shrink-0 bg-obsidian">
                      {item.movie?.poster_path && (
                        <Image
                          src={getTMDBPosterUrl(item.movie.poster_path, "sm")}
                          alt={item.movie.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/movies/${item.movie?.tmdb_id}`}
                        className="font-medium text-sm text-cinema-text hover:text-gold truncate block"
                      >
                        {item.movie?.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-cinema-muted mt-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.priority === "HIGH"
                              ? "bg-cinema-red/20 text-cinema-red border border-cinema-red/30"
                              : item.priority === "MEDIUM"
                              ? "bg-gold/20 text-gold border border-gold/30"
                              : "bg-obsidian border border-obsidian-border text-cinema-muted"
                          }`}
                        >
                          {item.priority} PRIORITY
                        </span>
                        <span>{formatYear(item.movie?.release_date)}</span>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-cinema-muted/80 line-clamp-1 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Recently Added to Library */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-cinema-text">
              Recently Added to Library
            </h2>
            <Link
              href="/library"
              className="text-xs sm:text-sm font-medium text-gold hover:text-gold-secondary flex items-center gap-1"
            >
              <span>Manage Library ({library.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentlyAdded.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-obsidian-card border border-obsidian-border">
              <Film className="w-10 h-10 text-gold mx-auto mb-3" />
              <p className="font-serif text-base font-medium text-cinema-text mb-1">
                Your Library is Empty
              </p>
              <p className="text-xs text-cinema-muted max-w-sm mx-auto mb-4">
                Discover titles from the TMDB database and add them to your archive.
              </p>
              <Link
                href="/discover"
                className="px-4 py-2 bg-gold text-obsidian font-bold text-xs rounded-xl hover:bg-gold-secondary"
              >
                Browse Trending Films
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {recentlyAdded.map((item) =>
                item.movie ? (
                  <MovieCard
                    key={item.id}
                    movie={{
                      id: item.movie.tmdb_id,
                      title: item.movie.title,
                      overview: item.movie.overview || "",
                      poster_path: item.movie.poster_path,
                      backdrop_path: item.movie.backdrop_path,
                      release_date: item.movie.release_date || "",
                      original_language: item.movie.original_language || "en",
                      vote_average: item.movie.tmdb_rating || 0,
                    }}
                  />
                ) : null
              )}
            </div>
          )}
        </section>

        {/* Live Trending Movies */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-cinema-text flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              <span>Trending Cinema Discovery</span>
            </h2>
            <Link
              href="/discover"
              className="text-xs sm:text-sm font-medium text-gold hover:text-gold-secondary flex items-center gap-1"
            >
              <span>See All Discoveries</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {trendingData.results.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Community Activity Preview */}
        <section className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              <span>Recent Community Cinema Activity</span>
            </h2>
            <Link
              href="/community"
              className="text-xs text-gold hover:text-gold-secondary flex items-center gap-1"
            >
              <span>Explore Community</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityActivity.slice(0, 3).map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-obsidian-secondary border border-obsidian-border space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center text-xs font-bold">
                    {act.user?.username.slice(0, 2).toUpperCase() || "CF"}
                  </div>
                  <span className="text-xs font-semibold text-cinema-text">
                    {act.user?.username}
                  </span>
                  <span className="text-[10px] text-cinema-subtle ml-auto">
                    {formatDate(act.created_at)}
                  </span>
                </div>
                <p className="text-xs text-cinema-muted">
                  {act.action === "added_review" && (
                    <span>
                      Reviewed <strong className="text-cinema-text">{(act.entity_details as any)?.movie_title}</strong> with a score of {(act.entity_details as any)?.rating}/10
                    </span>
                  )}
                  {act.action === "created_collection" && (
                    <span>
                      Created custom collection <strong className="text-cinema-text">{(act.entity_details as any)?.name || (act.entity_details as any)?.collection_name}</strong>
                    </span>
                  )}
                  {act.action === "added_favorite" && (
                    <span>
                      Favourited <strong className="text-cinema-text">{(act.entity_details as any)?.movie_title}</strong>
                    </span>
                  )}
                  {!["added_review", "created_collection", "added_favorite"].includes(act.action) && (
                    <span>Logged new cinema activity</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
