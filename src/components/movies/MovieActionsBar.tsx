"use client";

import React, { useState } from "react";
import {
  Film,
  Bookmark,
  Heart,
  Calendar,
  PenTool,
  FolderPlus,
  Star,
  Check,
  X,
} from "lucide-react";
import { DetailedMovie } from "@/types/tmdb";
import { addToLibraryAction } from "@/lib/actions/library";
import { addToWatchlistAction } from "@/lib/actions/watchlist";
import { toggleFavoriteAction } from "@/lib/actions/favorites";
import { addDiaryEntryAction } from "@/lib/actions/diary";
import { submitReviewAction } from "@/lib/actions/reviews";
import {
  getUserCollections,
  addMovieToCollectionAction,
} from "@/lib/actions/collections";
import { CustomCollection, WatchlistPriority, MovieWatchStatus } from "@/types/database";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MovieActionsBarProps {
  movie: DetailedMovie;
  initialIsFavorite?: boolean;
}

export function MovieActionsBar({
  movie,
  initialIsFavorite = false,
}: MovieActionsBarProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [activeModal, setActiveModal] = useState<
    "library" | "watchlist" | "diary" | "review" | "collection" | null
  >(null);

  // Form states
  const [libraryStatus, setLibraryStatus] = useState<MovieWatchStatus>("WATCHED");
  const [libraryRating, setLibraryRating] = useState<number>(8);
  const [libraryNotes, setLibraryNotes] = useState("");

  const [watchlistPriority, setWatchlistPriority] = useState<WatchlistPriority>("MEDIUM");
  const [watchlistNotes, setWatchlistNotes] = useState("");

  const [diaryDate, setDiaryDate] = useState(new Date().toISOString().split("T")[0]);
  const [diaryRating, setDiaryRating] = useState<number>(8);
  const [diaryNotes, setDiaryNotes] = useState("");

  const [reviewRating, setReviewRating] = useState<number>(8);
  const [reviewText, setReviewText] = useState("");
  const [reviewVisibility, setReviewVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState(false);

  // Favorite toggle
  const handleToggleFavorite = async () => {
    try {
      const res = await toggleFavoriteAction(movie);
      if (res.success) {
        setIsFavorite(res.isFavorite ?? !isFavorite);
        toast.success(
          res.isFavorite
            ? `Added "${movie.title}" to Favourites`
            : `Removed "${movie.title}" from Favourites`
        );
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  // Open collection modal
  const openCollectionModal = async () => {
    setActiveModal("collection");
    try {
      const cols = await getUserCollections();
      setCollections(cols);
      if (cols.length > 0) {
        setSelectedCollectionId(cols[0].id);
      }
    } catch {
      toast.error("Could not load collections");
    }
  };

  // Handlers
  const handleLibrarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const res = await addToLibraryAction(movie, {
        status: libraryStatus,
        rating: libraryRating,
        notes: libraryNotes,
      });
      if (res.success) {
        toast.success(`Saved "${movie.title}" to Personal Library`);
        setActiveModal(null);
      } else {
        toast.error("Failed to save to library");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleWatchlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const res = await addToWatchlistAction(movie, watchlistPriority, watchlistNotes);
      if (res.success) {
        toast.success(`Added "${movie.title}" to Watchlist (${watchlistPriority} priority)`);
        setActiveModal(null);
      } else {
        toast.error("Failed to add to watchlist");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const res = await addDiaryEntryAction(movie, diaryDate, diaryRating, diaryNotes);
      if (res.success) {
        toast.success(`Recorded viewing of "${movie.title}" in Diary`);
        setActiveModal(null);
      } else {
        toast.error("Failed to record diary entry");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Please provide review text");
      return;
    }
    setLoadingAction(true);
    try {
      const res = await submitReviewAction(
        movie,
        reviewRating,
        reviewText,
        reviewVisibility
      );
      if (res.success) {
        toast.success(`Published review for "${movie.title}"`);
        setActiveModal(null);
      } else {
        toast.error("Failed to publish review");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollectionId) {
      toast.error("Please select a collection");
      return;
    }
    setLoadingAction(true);
    try {
      const res = await addMovieToCollectionAction(selectedCollectionId, movie);
      if (res.success) {
        toast.success(`Added "${movie.title}" to collection`);
        setActiveModal(null);
      } else {
        toast.error("Already in collection or failed to add");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="w-full">
      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Library Button */}
        <button
          onClick={() => setActiveModal("library")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-obsidian font-semibold hover:bg-gold-secondary transition-all shadow-gold-sm hover:scale-[1.02]"
        >
          <Film className="w-4 h-4" />
          <span>Add to Library</span>
        </button>

        {/* Watchlist Button */}
        <button
          onClick={() => setActiveModal("watchlist")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-card border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 transition-all hover:scale-[1.02]"
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist</span>
        </button>

        {/* Favourite Button */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:scale-[1.02]",
            isFavorite
              ? "bg-obsidian-card border-gold text-gold"
              : "bg-obsidian-card border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-gold")} />
          <span>{isFavorite ? "Favourited" : "Favourite"}</span>
        </button>

        {/* Diary Button */}
        <button
          onClick={() => setActiveModal("diary")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-card border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 transition-all hover:scale-[1.02]"
        >
          <Calendar className="w-4 h-4" />
          <span>Log View</span>
        </button>

        {/* Review Button */}
        <button
          onClick={() => setActiveModal("review")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-card border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 transition-all hover:scale-[1.02]"
        >
          <PenTool className="w-4 h-4" />
          <span>Review</span>
        </button>

        {/* Collection Button */}
        <button
          onClick={openCollectionModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-card border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 transition-all hover:scale-[1.02]"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Add to Collection</span>
        </button>
      </div>

      {/* Modal Dialog Backdrop */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-obsidian-secondary border border-obsidian-border rounded-2xl p-6 shadow-cinematic text-cinema-text relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-cinema-muted hover:text-cinema-text rounded-lg hover:bg-obsidian-hover"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal: Library */}
            {activeModal === "library" && (
              <form onSubmit={handleLibrarySubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
                  <Film className="w-5 h-5 text-gold" />
                  <span>Add to Personal Library</span>
                </h3>
                <p className="text-xs text-cinema-muted">
                  Log &quot;{movie.title}&quot; into your permanent collection archive.
                </p>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Watch Status
                  </label>
                  <select
                    value={libraryStatus}
                    onChange={(e) => setLibraryStatus(e.target.value as MovieWatchStatus)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                  >
                    <option value="WATCHED">Watched</option>
                    <option value="UNWATCHED">Unwatched</option>
                    <option value="PLANNING">Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Personal Rating (1-10): <span className="text-gold font-bold">{libraryRating} / 10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={libraryRating}
                    onChange={(e) => setLibraryRating(parseFloat(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Personal Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={libraryNotes}
                    onChange={(e) => setLibraryNotes(e.target.value)}
                    placeholder="Edition details, format, memorable performances..."
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-sm text-cinema-muted hover:text-cinema-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="px-5 py-2 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-secondary transition-colors"
                  >
                    {loadingAction ? "Saving..." : "Save to Library"}
                  </button>
                </div>
              </form>
            )}

            {/* Modal: Watchlist */}
            {activeModal === "watchlist" && (
              <form onSubmit={handleWatchlistSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-gold" />
                  <span>Add to Watchlist</span>
                </h3>
                <p className="text-xs text-cinema-muted">
                  Queue &quot;{movie.title}&quot; for upcoming viewing sessions.
                </p>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["LOW", "MEDIUM", "HIGH"] as WatchlistPriority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setWatchlistPriority(p)}
                        className={cn(
                          "py-2 rounded-lg text-xs font-semibold border transition-all",
                          watchlistPriority === p
                            ? "bg-gold text-obsidian border-gold"
                            : "bg-obsidian-card border-obsidian-border text-cinema-muted hover:border-gold/50"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Viewing Intent Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={watchlistNotes}
                    onChange={(e) => setWatchlistNotes(e.target.value)}
                    placeholder="e.g. Recommended by Jordan; watch before the sequel..."
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-sm text-cinema-muted hover:text-cinema-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="px-5 py-2 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-secondary transition-colors"
                  >
                    {loadingAction ? "Saving..." : "Add to Watchlist"}
                  </button>
                </div>
              </form>
            )}

            {/* Modal: Diary */}
            {activeModal === "diary" && (
              <form onSubmit={handleDiarySubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span>Log in Movie Diary</span>
                </h3>
                <p className="text-xs text-cinema-muted">
                  Record when you watched &quot;{movie.title}&quot;. Multiple views are welcome!
                </p>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Date Watched
                  </label>
                  <input
                    type="date"
                    value={diaryDate}
                    onChange={(e) => setDiaryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Viewing Rating: <span className="text-gold font-bold">{diaryRating} / 10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={diaryRating}
                    onChange={(e) => setDiaryRating(parseFloat(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Viewing Impressions & Notes
                  </label>
                  <textarea
                    rows={3}
                    value={diaryNotes}
                    onChange={(e) => setDiaryNotes(e.target.value)}
                    placeholder="Cinema screening vs home, companion thoughts, emotional impact..."
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-sm text-cinema-muted hover:text-cinema-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="px-5 py-2 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-secondary transition-colors"
                  >
                    {loadingAction ? "Logging..." : "Save Diary Entry"}
                  </button>
                </div>
              </form>
            )}

            {/* Modal: Review */}
            {activeModal === "review" && (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-gold" />
                  <span>Write Movie Review</span>
                </h3>
                <p className="text-xs text-cinema-muted">
                  Share your critical perspective on &quot;{movie.title}&quot;.
                </p>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Your Rating: <span className="text-gold font-bold">{reviewRating} / 10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseFloat(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Review Text
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="What worked? What faltered? Cinematography, screenplay, thematic resonance..."
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Visibility
                  </label>
                  <select
                    value={reviewVisibility}
                    onChange={(e) => setReviewVisibility(e.target.value as "PUBLIC" | "PRIVATE")}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                  >
                    <option value="PUBLIC">Public (Visible to community & profile)</option>
                    <option value="PRIVATE">Private (Only visible to you)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-sm text-cinema-muted hover:text-cinema-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="px-5 py-2 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-secondary transition-colors"
                  >
                    {loadingAction ? "Publishing..." : "Publish Review"}
                  </button>
                </div>
              </form>
            )}

            {/* Modal: Collection */}
            {activeModal === "collection" && (
              <form onSubmit={handleCollectionSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-gold" />
                  <span>Add to Custom Collection</span>
                </h3>
                <p className="text-xs text-cinema-muted">
                  Include &quot;{movie.title}&quot; in one of your curated collections.
                </p>

                {collections.length === 0 ? (
                  <div className="p-4 rounded-xl bg-obsidian-card border border-obsidian-border text-center text-sm text-cinema-muted">
                    No custom collections created yet. Visit the Collections page to create one!
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-cinema-muted mb-1">
                      Choose Collection
                    </label>
                    <select
                      value={selectedCollectionId}
                      onChange={(e) => setSelectedCollectionId(e.target.value)}
                      className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                    >
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.movies_count || 0} films)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-sm text-cinema-muted hover:text-cinema-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction || collections.length === 0}
                    className="px-5 py-2 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-secondary transition-colors disabled:opacity-50"
                  >
                    {loadingAction ? "Adding..." : "Add to Collection"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
