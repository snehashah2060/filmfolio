"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { deleteReviewAction, updateReviewAction } from "@/lib/actions/reviews";
import { ReviewItem, Visibility } from "@/types/database";
import { formatDate } from "@/lib/utils";
import {
  PenTool,
  Star,
  Trash2,
  Edit3,
  Globe,
  Lock,
  Plus,
  X,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const currentUser = filmfolioStore.getCurrentUser();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [editRating, setEditRating] = useState<number>(8);
  const [editText, setEditText] = useState("");
  const [editVisibility, setEditVisibility] = useState<Visibility>("PUBLIC");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    setReviews(filmfolioStore.getReviews({ userId: currentUser.id }));
  }, [currentUser.id]);

  const handleEditOpen = (review: ReviewItem) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditText(review.review_text);
    setEditVisibility(review.visibility);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setSavingEdit(true);
    try {
      const res = await updateReviewAction(
        editingReview.id,
        editRating,
        editText,
        editVisibility
      );
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === editingReview.id
              ? {
                  ...r,
                  rating: editRating,
                  review_text: editText,
                  visibility: editVisibility,
                }
              : r
          )
        );
        toast.success("Review updated successfully");
        setEditingReview(null);
      } else {
        toast.error("Failed to update review");
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`Delete critique for "${title || "this film"}"?`)) return;
    try {
      const res = await deleteReviewAction(id);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Review deleted");
      } else {
        toast.error("Failed to delete review");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text flex items-center gap-3">
              <PenTool className="w-8 h-8 text-gold" />
              <span>My Film Critiques</span>
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Your authored reviews, critical ratings, and public or private reflections.
            </p>
          </div>

          <Link
            href="/discover"
            className="px-4 py-2.5 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary flex items-center gap-2 transition-all shadow-gold-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Review a Film</span>
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3">
            <PenTool className="w-12 h-12 text-gold mx-auto mb-2 opacity-80" />
            <h3 className="font-serif text-xl font-bold text-cinema-text">
              No Reviews Authored Yet
            </h3>
            <p className="text-sm text-cinema-muted max-w-sm mx-auto mb-4">
              Explore films and click &quot;Review&quot; to publish your critical thoughts.
            </p>
            <Link
              href="/discover"
              className="px-4 py-2 bg-gold text-obsidian font-bold text-xs rounded-xl hover:bg-gold-secondary"
            >
              Browse Discovery
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/30 transition-all space-y-4 shadow-cinematic"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/movies/${r.movie?.tmdb_id}`}
                      className="font-serif text-xl font-bold text-cinema-text hover:text-gold transition-colors"
                    >
                      {r.movie?.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-cinema-muted mt-1">
                      <span>Authored on {formatDate(r.created_at)}</span>
                      <span className="flex items-center gap-1 font-semibold text-cinema-subtle">
                        {r.visibility === "PUBLIC" ? (
                          <>
                            <Globe className="w-3 h-3 text-gold" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-cinema-subtle" />
                            <span>Private</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-obsidian-secondary border border-obsidian-border text-gold font-bold text-sm">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span>{r.rating}/10</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-cinema-muted leading-relaxed">
                  {r.review_text}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-obsidian-border/60 text-xs">
                  <div className="flex items-center gap-1.5 text-cinema-muted">
                    <Heart className="w-3.5 h-3.5 text-cinema-red" />
                    <span>{r.likes_count || 0} Likes from Community</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditOpen(r)}
                      className="p-1.5 rounded-lg text-cinema-muted hover:text-gold hover:bg-obsidian-secondary transition-colors"
                      title="Edit Review"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.movie?.title)}
                      className="p-1.5 rounded-lg text-cinema-muted hover:text-cinema-red hover:bg-obsidian-secondary transition-colors"
                      title="Delete Review"
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
        {editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-obsidian-secondary border border-obsidian-border rounded-2xl p-6 shadow-cinematic text-cinema-text relative">
              <button
                onClick={() => setEditingReview(null)}
                className="absolute top-4 right-4 p-2 text-cinema-muted hover:text-cinema-text"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-xl font-bold text-cinema-text mb-1">
                Edit Critique
              </h3>
              <p className="text-xs text-cinema-muted mb-4">
                {editingReview.movie?.title}
              </p>

              <form onSubmit={handleEditSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Rating (1-10): <span className="text-gold font-bold">{editRating}/10</span>
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
                    Review Text
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Visibility
                  </label>
                  <select
                    value={editVisibility}
                    onChange={(e) => setEditVisibility(e.target.value as Visibility)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingReview(null)}
                    className="px-4 py-2 text-sm text-cinema-muted hover:text-cinema-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-secondary transition-colors"
                  >
                    {savingEdit ? "Updating..." : "Save Critique"}
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
