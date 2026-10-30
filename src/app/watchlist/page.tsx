"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getUserWatchlist,
  removeFromWatchlistAction,
} from "@/lib/actions/watchlist";
import { addToLibraryAction } from "@/lib/actions/library";
import { WatchlistItem, WatchlistPriority } from "@/types/database";
import { getTMDBPosterUrl } from "@/lib/tmdb/config";
import { formatDate, formatYear } from "@/lib/utils";
import {
  Bookmark,
  Search,
  CheckCircle2,
  Trash2,
  Plus,
  AlertCircle,
  Film,
} from "lucide-react";
import { toast } from "sonner";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | WatchlistPriority>("ALL");

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserWatchlist();
        setWatchlist(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleMarkWatched = async (item: WatchlistItem) => {
    if (!item.movie) return;
    try {
      const res = await addToLibraryAction(
        {
          id: item.movie.tmdb_id,
          title: item.movie.title,
          overview: item.movie.overview || "",
          poster_path: item.movie.poster_path,
          backdrop_path: item.movie.backdrop_path,
          release_date: item.movie.release_date || "",
          original_language: item.movie.original_language || "en",
          vote_average: item.movie.tmdb_rating || 0,
        },
        { status: "WATCHED", notes: item.notes }
      );
      if (res.success) {
        setWatchlist((prev) => prev.filter((w) => w.id !== item.id));
        toast.success(`Moved "${item.movie.title}" to Library as Watched`);
      } else {
        toast.error("Failed to move movie to library");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleRemove = async (id: string, title?: string) => {
    try {
      const res = await removeFromWatchlistAction(id);
      if (res.success) {
        setWatchlist((prev) => prev.filter((w) => w.id !== id));
        toast.success(`Removed "${title || "film"}" from watchlist`);
      } else {
        toast.error("Failed to remove from watchlist");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const filtered = watchlist.filter((item) => {
    if (priorityFilter !== "ALL" && item.priority !== priorityFilter) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      const titleMatch = item.movie?.title.toLowerCase().includes(query);
      const notesMatch = item.notes?.toLowerCase().includes(query);
      if (!titleMatch && !notesMatch) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
              Curated Watchlist
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Your planned queue of upcoming cinema screenings, prioritized by urgency.
            </p>
          </div>

          <Link
            href="/discover"
            className="px-4 py-2.5 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary flex items-center gap-2 transition-all shadow-gold-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Discover More Films</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search watchlist by title or notes..."
              className="w-full pl-10 pr-4 py-2 bg-obsidian-secondary border border-obsidian-border rounded-xl text-xs sm:text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-obsidian-secondary rounded-xl border border-obsidian-border">
            {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  priorityFilter === p
                    ? "bg-gold text-obsidian shadow-sm"
                    : "text-cinema-muted hover:text-cinema-text"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-obsidian-card border border-obsidian-border animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3">
            <Bookmark className="w-12 h-12 text-gold mx-auto mb-2 opacity-80" />
            <h3 className="font-serif text-xl font-bold text-cinema-text">
              Watchlist Empty
            </h3>
            <p className="text-sm text-cinema-muted max-w-sm mx-auto">
              {search
                ? `No watchlist entries matched "${search}".`
                : "Your watchlist has no pending films in this filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all flex gap-4 group"
              >
                {/* Poster */}
                <Link
                  href={`/movies/${item.movie?.tmdb_id}`}
                  className="relative w-20 aspect-[2/3] rounded-xl overflow-hidden shrink-0 bg-obsidian-secondary border border-obsidian-border"
                >
                  {item.movie?.poster_path && (
                    <Image
                      src={getTMDBPosterUrl(item.movie.poster_path, "sm")}
                      alt={item.movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === "HIGH"
                          ? "bg-cinema-red/15 text-cinema-red border border-cinema-red/30"
                          : item.priority === "MEDIUM"
                          ? "bg-gold/15 text-gold border border-gold/30"
                          : "bg-obsidian border border-obsidian-border text-cinema-muted"
                      }`}
                    >
                      {item.priority} PRIORITY
                    </span>

                    <Link
                      href={`/movies/${item.movie?.tmdb_id}`}
                      className="font-serif text-base font-bold text-cinema-text hover:text-gold truncate block transition-colors"
                    >
                      {item.movie?.title}
                    </Link>

                    <p className="text-xs text-cinema-muted">
                      {formatYear(item.movie?.release_date)} • Added {formatDate(item.created_at)}
                    </p>

                    {item.notes && (
                      <p className="text-xs text-cinema-muted/80 line-clamp-2 italic pt-1">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-obsidian-border/60">
                    <button
                      onClick={() => handleMarkWatched(item)}
                      className="px-2.5 py-1 rounded-lg bg-cinema-green/15 text-cinema-green border border-cinema-green/30 hover:bg-cinema-green hover:text-obsidian text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Mark watched and move to library"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Watched</span>
                    </button>

                    <button
                      onClick={() => handleRemove(item.id, item.movie?.title)}
                      className="p-1.5 text-cinema-muted hover:text-cinema-red transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
