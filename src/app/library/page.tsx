"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getUserLibrary,
  updateLibraryEntryAction,
  removeFromLibraryAction,
} from "@/lib/actions/library";
import { UserMovie, MovieWatchStatus } from "@/types/database";
import { getTMDBPosterUrl } from "@/lib/tmdb/config";
import { formatRating, formatDate, formatYear } from "@/lib/utils";
import {
  Film,
  Search,
  SlidersHorizontal,
  Star,
  Calendar,
  Trash2,
  Edit3,
  Download,
  Plus,
  X,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function LibraryPage() {
  const [library, setLibrary] = useState<UserMovie[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters and sorting
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | MovieWatchStatus>("ALL");
  const [sortBy, setSortBy] = useState<"date_added" | "rating" | "title" | "release_date">("date_added");

  // Edit Modal
  const [editingEntry, setEditingEntry] = useState<UserMovie | null>(null);
  const [editStatus, setEditStatus] = useState<MovieWatchStatus>("WATCHED");
  const [editRating, setEditRating] = useState<number>(8);
  const [editWatchedAt, setEditWatchedAt] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserLibrary();
        setLibrary(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleEditOpen = (entry: UserMovie) => {
    setEditingEntry(entry);
    setEditStatus(entry.status);
    setEditRating(entry.personal_rating || 8);
    setEditWatchedAt(entry.watched_at || new Date().toISOString().split("T")[0]);
    setEditNotes(entry.personal_notes || "");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    setSavingEdit(true);
    try {
      const res = await updateLibraryEntryAction(editingEntry.id, {
        status: editStatus,
        personal_rating: editRating,
        watched_at: editWatchedAt,
        personal_notes: editNotes,
      });
      if (res.success) {
        setLibrary((prev) =>
          prev.map((item) =>
            item.id === editingEntry.id
              ? {
                  ...item,
                  status: editStatus,
                  personal_rating: editRating,
                  watched_at: editWatchedAt,
                  personal_notes: editNotes,
                }
              : item
          )
        );
        toast.success("Library record updated");
        setEditingEntry(null);
      } else {
        toast.error("Failed to update record");
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRemove = async (id: string, title?: string) => {
    if (!confirm(`Are you sure you want to remove "${title || "this film"}" from your library?`)) {
      return;
    }
    try {
      const res = await removeFromLibraryAction(id);
      if (res.success) {
        setLibrary((prev) => prev.filter((item) => item.id !== id));
        toast.success(`Removed "${title || "film"}" from library`);
      } else {
        toast.error("Failed to remove from library");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  // CSV Export feature
  const exportCSV = () => {
    if (library.length === 0) {
      toast.error("No entries to export");
      return;
    }

    const headers = ["Title", "TMDB_ID", "Status", "Personal_Rating", "Watched_Date", "Notes"];
    const rows = library.map((item) => [
      `"${item.movie?.title?.replace(/"/g, '""') || ""}"`,
      item.movie?.tmdb_id || "",
      item.status,
      item.personal_rating || "",
      item.watched_at || "",
      `"${(item.personal_notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `filmfolio_library_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export downloaded successfully");
  };

  // Filtering & Sorting
  const filtered = library
    .filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const titleMatch = item.movie?.title.toLowerCase().includes(query);
        const notesMatch = item.personal_notes?.toLowerCase().includes(query);
        if (!titleMatch && !notesMatch) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.personal_rating || 0) - (a.personal_rating || 0);
      }
      if (sortBy === "title") {
        return (a.movie?.title || "").localeCompare(b.movie?.title || "");
      }
      if (sortBy === "release_date") {
        return (b.movie?.release_date || "").localeCompare(a.movie?.release_date || "");
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
              Personal Movie Library
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Your permanent archive of viewed, collected, and catalogued films.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-obsidian-card border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 text-xs font-semibold flex items-center gap-2 transition-colors"
              title="Export library to CSV"
            >
              <Download className="w-4 h-4 text-gold" />
              <span>Export CSV</span>
            </button>
            <Link
              href="/discover"
              className="px-4 py-2.5 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary flex items-center gap-2 transition-all shadow-gold-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Movies</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter library by title or notes..."
              className="w-full pl-10 pr-4 py-2 bg-obsidian-secondary border border-obsidian-border rounded-xl text-xs sm:text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 p-1 bg-obsidian-secondary rounded-xl border border-obsidian-border">
              {(["ALL", "WATCHED", "UNWATCHED", "PLANNING"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? "bg-gold text-obsidian shadow-sm"
                      : "text-cinema-muted hover:text-cinema-text"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-xs text-cinema-text focus:outline-none focus:border-gold"
            >
              <option value="date_added">Date Added</option>
              <option value="rating">Highest Rated</option>
              <option value="release_date">Release Year</option>
              <option value="title">Film Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Library Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-obsidian-card border border-obsidian-border animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3">
            <Film className="w-12 h-12 text-gold mx-auto mb-2 opacity-80" />
            <h3 className="font-serif text-xl font-bold text-cinema-text">
              No Films In This View
            </h3>
            <p className="text-sm text-cinema-muted max-w-sm mx-auto">
              {search
                ? `No library titles matched "${search}".`
                : "Your collection does not have any films matching the selected status filter."}
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
                  className="relative w-24 aspect-[2/3] rounded-xl overflow-hidden shrink-0 bg-obsidian-secondary border border-obsidian-border"
                >
                  {item.movie?.poster_path ? (
                    <Image
                      src={getTMDBPosterUrl(item.movie.poster_path, "sm")}
                      alt={item.movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 text-center text-xs text-cinema-subtle">
                      No Poster
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === "WATCHED"
                            ? "bg-cinema-green/15 text-cinema-green border border-cinema-green/30"
                            : item.status === "PLANNING"
                            ? "bg-gold/15 text-gold border border-gold/30"
                            : "bg-obsidian border border-obsidian-border text-cinema-muted"
                        }`}
                      >
                        {item.status}
                      </span>

                      {item.personal_rating && (
                        <div className="flex items-center gap-1 text-gold font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                          <span>{item.personal_rating}/10</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/movies/${item.movie?.tmdb_id}`}
                      className="font-serif text-base font-bold text-cinema-text hover:text-gold truncate block transition-colors"
                      title={item.movie?.title}
                    >
                      {item.movie?.title}
                    </Link>

                    <div className="flex items-center gap-3 text-xs text-cinema-muted">
                      <span>{formatYear(item.movie?.release_date)}</span>
                      {item.watched_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-cinema-subtle" />
                          <span>{formatDate(item.watched_at)}</span>
                        </span>
                      )}
                    </div>

                    {item.personal_notes && (
                      <p className="text-xs text-cinema-muted/80 line-clamp-2 italic pt-1">
                        &ldquo;{item.personal_notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-obsidian-border/60">
                    <button
                      onClick={() => handleEditOpen(item)}
                      className="p-1.5 rounded-lg text-cinema-muted hover:text-gold hover:bg-obsidian-secondary transition-colors"
                      title="Edit Entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.movie?.title)}
                      className="p-1.5 rounded-lg text-cinema-muted hover:text-cinema-red hover:bg-obsidian-secondary transition-colors"
                      title="Remove from Library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-obsidian-secondary border border-obsidian-border rounded-2xl p-6 shadow-cinematic text-cinema-text relative">
              <button
                onClick={() => setEditingEntry(null)}
                className="absolute top-4 right-4 p-2 text-cinema-muted hover:text-cinema-text"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-xl font-bold text-cinema-text mb-1">
                Edit Library Entry
              </h3>
              <p className="text-xs text-cinema-muted mb-4">
                {editingEntry.movie?.title}
              </p>

              <form onSubmit={handleEditSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Watch Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as MovieWatchStatus)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                  >
                    <option value="WATCHED">Watched</option>
                    <option value="UNWATCHED">Unwatched</option>
                    <option value="PLANNING">Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Personal Rating (1-10): <span className="text-gold font-bold">{editRating}/10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={editRating}
                    onChange={(e) => setEditRating(parseFloat(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Date Watched
                  </label>
                  <input
                    type="date"
                    value={editWatchedAt}
                    onChange={(e) => setEditWatchedAt(e.target.value)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Personal Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEntry(null)}
                    className="px-4 py-2 text-sm text-cinema-muted hover:text-cinema-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-secondary transition-colors"
                  >
                    {savingEdit ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
