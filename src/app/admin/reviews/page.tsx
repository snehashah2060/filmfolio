"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { moderateReviewAction } from "@/lib/actions/admin";
import { ReviewItem, ModerationStatus } from "@/types/database";
import { formatDate } from "@/lib/utils";
import {
  MessageSquare,
  Star,
  CheckCircle2,
  Flag,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    setReviews(filmfolioStore.getReviews());
  }, []);

  const handleModerate = async (reviewId: string, status: ModerationStatus) => {
    try {
      const res = await moderateReviewAction(reviewId, status);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, moderation_status: status } : r))
        );
        toast.success(`Review moderation status set to ${status}`);
      } else {
        toast.error(res.error || "Failed to moderate review");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-cinema-text">
          Review Moderation Queue
        </h2>
        <p className="text-xs text-cinema-muted mt-1">
          Approve, flag, or suppress public member write-ups and critical critiques.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-obsidian-card border border-obsidian-border text-sm text-cinema-muted">
            No reviews submitted to the moderation queue.
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3 shadow-cinematic"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-cinema-text">
                    @{r.user?.username}
                  </span>
                  <span className="text-xs text-cinema-muted">
                    on{" "}
                    <Link
                      href={`/movies/${r.movie?.tmdb_id}`}
                      className="text-gold font-semibold hover:underline"
                    >
                      {r.movie?.title}
                    </Link>
                  </span>
                  <span className="text-[10px] text-cinema-subtle">
                    {formatDate(r.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-gold font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-gold" />
                    <span>{r.rating}/10</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.moderation_status === "APPROVED"
                        ? "bg-cinema-green/15 text-cinema-green border border-cinema-green/30"
                        : r.moderation_status === "FLAGGED"
                        ? "bg-gold/15 text-gold border border-gold/30"
                        : "bg-cinema-red/15 text-cinema-red border border-cinema-red/30"
                    }`}
                  >
                    {r.moderation_status}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-cinema-muted leading-relaxed bg-obsidian-secondary/60 p-3 rounded-xl border border-obsidian-border/50">
                &ldquo;{r.review_text}&rdquo;
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleModerate(r.id, "APPROVED")}
                  className="px-3 py-1.5 rounded-lg bg-cinema-green/15 text-cinema-green border border-cinema-green/30 hover:bg-cinema-green hover:text-obsidian text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => handleModerate(r.id, "FLAGGED")}
                  className="px-3 py-1.5 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-obsidian text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Flag</span>
                </button>

                <button
                  onClick={() => handleModerate(r.id, "REMOVED")}
                  className="px-3 py-1.5 rounded-lg bg-cinema-red/15 text-cinema-red border border-cinema-red/30 hover:bg-cinema-red hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
