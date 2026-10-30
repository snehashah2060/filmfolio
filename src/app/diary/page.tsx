"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getUserDiary,
  updateDiaryEntryAction,
  deleteDiaryEntryAction,
} from "@/lib/actions/diary";
import { DiaryEntry } from "@/types/database";
import { getTMDBPosterUrl } from "@/lib/tmdb/config";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Star,
  Trash2,
  Edit3,
  Plus,
  Repeat,
  Film,
  X,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function DiaryPage() {
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Edit Modal
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editRating, setEditRating] = useState<number>(8);
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserDiary();
        setDiary(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleEditOpen = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setEditDate(entry.watched_at);
    setEditRating(entry.personal_rating || 8);
    setEditNotes(entry.notes || "");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    setSavingEdit(true);
    try {
      const res = await updateDiaryEntryAction(editingEntry.id, {
        watched_at: editDate,
        personal_rating: editRating,
        notes: editNotes,
      });
      if (res.success) {
        setDiary((prev) =>
          prev.map((d) =>
            d.id === editingEntry.id
              ? {
                  ...d,
                  watched_at: editDate,
                  personal_rating: editRating,
                  notes: editNotes,
                }
              : d
          )
        );
        toast.success("Diary entry updated");
        setEditingEntry(null);
      } else {
        toast.error("Failed to update diary entry");
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`Delete diary entry for "${title || "this viewing"}"?`)) return;
    try {
      const res = await deleteDiaryEntryAction(id);
      if (res.success) {
        setDiary((prev) => prev.filter((d) => d.id !== id));
        toast.success("Diary entry deleted");
      } else {
        toast.error("Failed to delete diary entry");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  // Detect repeat views
  const movieCounts: Record<string, number> = {};
  diary.forEach((d) => {
    if (d.movie_id) {
      movieCounts[d.movie_id] = (movieCounts[d.movie_id] || 0) + 1;
    }
  });

  const filtered = diary.filter((d) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const titleMatch = d.movie?.title.toLowerCase().includes(query);
    const notesMatch = d.notes?.toLowerCase().includes(query);
    return titleMatch || notesMatch;
  });

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text flex items-center gap-3">
              <Calendar className="w-8 h-8 text-gold" />
              <span>Cinema Viewing Diary</span>
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Your chronological record of screenings and re-watches across time.
            </p>
          </div>

          <Link
            href="/discover"
            className="px-4 py-2.5 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary flex items-center gap-2 transition-all shadow-gold-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log a Screening</span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border">
          <div className="relative">
            <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diary by movie title or viewing impressions..."
              className="w-full pl-10 pr-4 py-2 bg-obsidian-secondary border border-obsidian-border rounded-xl text-xs sm:text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Chronological Diary Timeline */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-obsidian-card border border-obsidian-border animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3">
            <Calendar className="w-12 h-12 text-gold mx-auto mb-2 opacity-80" />
            <h3 className="font-serif text-xl font-bold text-cinema-text">
              No Diary Entries
            </h3>
            <p className="text-sm text-cinema-muted max-w-sm mx-auto">
              {search
                ? `No entries matched "${search}".`
                : "Log films you watch on Movie Detail pages to maintain your diary."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const isRepeat = (movieCounts[item.movie_id] || 0) > 1;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group"
                >
                  {/* Watched Date Box */}
                  <div className="px-3.5 py-2 rounded-xl bg-obsidian-secondary border border-obsidian-border text-center shrink-0 min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-gold tracking-wider block">
                      WATCHED
                    </span>
                    <span className="font-serif font-bold text-sm text-cinema-text block mt-0.5">
                      {formatDate(item.watched_at)}
                    </span>
                  </div>

                  {/* Poster Thumbnail */}
                  <Link
                    href={`/movies/${item.movie?.tmdb_id}`}
                    className="relative w-16 aspect-[2/3] rounded-lg overflow-hidden shrink-0 bg-obsidian-secondary border border-obsidian-border"
                  >
                    {item.movie?.poster_path && (
                      <Image
                        src={getTMDBPosterUrl(item.movie.poster_path, "sm")}
                        alt={item.movie.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </Link>

                  {/* Content & Notes */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/movies/${item.movie?.tmdb_id}`}
                        className="font-serif text-lg font-bold text-cinema-text hover:text-gold transition-colors truncate block"
                      >
                        {item.movie?.title}
                      </Link>

                      {isRepeat && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gold/15 text-gold border border-gold/30 flex items-center gap-1">
                          <Repeat className="w-3 h-3" />
                          <span>Re-watch</span>
                        </span>
                      )}

                      {item.personal_rating && (
                        <div className="flex items-center gap-1 text-gold font-bold text-xs ml-auto">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                          <span>{item.personal_rating}/10</span>
                        </div>
                      )}
                    </div>

                    {item.notes ? (
                      <p className="text-xs sm:text-sm text-cinema-muted leading-relaxed italic bg-obsidian-secondary/50 p-2.5 rounded-xl border border-obsidian-border/60">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-cinema-subtle italic">
                        No viewing notes recorded for this session.
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleEditOpen(item)}
                      className="p-2 rounded-lg text-cinema-muted hover:text-gold hover:bg-obsidian-secondary transition-colors"
                      title="Edit Entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.movie?.title)}
                      className="p-2 rounded-lg text-cinema-muted hover:text-cinema-red hover:bg-obsidian-secondary transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
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
                Edit Diary Entry
              </h3>
              <p className="text-xs text-cinema-muted mb-4">
                {editingEntry.movie?.title}
              </p>

              <form onSubmit={handleEditSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Date Watched
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Personal Rating: <span className="text-gold font-bold">{editRating}/10</span>
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
                    Viewing Notes & Thoughts
                  </label>
                  <textarea
                    rows={4}
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
