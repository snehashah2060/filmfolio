"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { toggleReviewLikeAction, getMovieReviews } from "@/lib/actions/reviews";
import { toggleFollowAction } from "@/lib/actions/community";
import { ReviewItem, CustomCollection, ActivityLog, Profile } from "@/types/database";
import { getTMDBPosterUrl } from "@/lib/tmdb/config";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Heart,
  Star,
  Layers,
  Sparkles,
  MessageSquare,
  UserCheck,
  UserPlus,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

export default function CommunityPage() {
  const currentUser = filmfolioStore.getCurrentUser();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<"reviews" | "collections" | "activity">("reviews");
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load public reviews, collections, activity
    const revs = filmfolioStore.getReviews({ publicOnly: true });
    setReviews(revs);
    const cols = filmfolioStore.getCollections({ publicOnly: true });
    setCollections(cols);
    const logs = filmfolioStore.getActivityLogs(20);
    setActivityLogs(logs);

    // Initial follow map
    const otherUsers = filmfolioStore.getAllUsers().filter((u) => u.id !== currentUser.id);
    const map: Record<string, boolean> = {};
    otherUsers.forEach((u) => {
      map[u.id] = filmfolioStore.isFollowing(currentUser.id, u.id);
    });
    setFollowingMap(map);
  }, [currentUser.id]);

  const handleLikeReview = async (reviewId: string) => {
    try {
      const res = await toggleReviewLikeAction(reviewId);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  user_has_liked: res.liked ?? !r.user_has_liked,
                  likes_count:
                    res.count !== undefined
                      ? res.count
                      : res.liked
                      ? (r.likes_count || 0) + 1
                      : Math.max(0, (r.likes_count || 1) - 1),
                }
              : r
          )
        );
        toast.success(res.liked ? "Liked review" : "Unliked review");
      }
    } catch {
      toast.error("Could not update review like");
    }
  };

  const handleFollow = async (targetUserId: string, username: string) => {
    try {
      const res = await toggleFollowAction(targetUserId);
      if (res.success) {
        setFollowingMap((prev) => ({
          ...prev,
          [targetUserId]: res.isFollowing ?? !prev[targetUserId],
        }));
        toast.success(
          res.isFollowing ? `Now following @${username}` : `Unfollowed @${username}`
        );
      } else {
        toast.error(res.error || "Failed to update follow");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const otherUsers = filmfolioStore.getAllUsers().filter((u) => u.id !== currentUser.id);

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <div className="border-b border-obsidian-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold mb-2 border border-gold/30">
              <Users className="w-3.5 h-3.5" />
              <span>Cinephile Network</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
              Community Salon
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Read peer reviews, explore public anthologies, and exchange critical cinema perspectives.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-obsidian-card rounded-2xl border border-obsidian-border self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "reviews"
                  ? "bg-gold text-obsidian shadow-sm"
                  : "text-cinema-muted hover:text-cinema-text"
              }`}
            >
              Public Critiques
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "collections"
                  ? "bg-gold text-obsidian shadow-sm"
                  : "text-cinema-muted hover:text-cinema-text"
              }`}
            >
              Anthologies
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "activity"
                  ? "bg-gold text-obsidian shadow-sm"
                  : "text-cinema-muted hover:text-cinema-text"
              }`}
            >
              Live Feed
            </button>
          </div>
        </div>

        {/* Suggested Cinephiles Bar */}
        <div className="p-6 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-4 shadow-cinematic">
          <h3 className="text-xs uppercase tracking-wider text-gold font-bold">
            Discerning Cinephiles to Follow
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {otherUsers.map((u) => {
              const isFollowing = followingMap[u.id];
              return (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-obsidian-secondary border border-obsidian-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-obsidian border border-gold/40">
                      {u.avatar_url ? (
                        <Image src={u.avatar_url} alt={u.username} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gold">
                          {u.username.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/community/users/${u.username}`}
                        className="font-serif font-bold text-sm text-cinema-text hover:text-gold truncate block"
                      >
                        {u.full_name || u.username}
                      </Link>
                      <span className="text-[10px] text-cinema-subtle">@{u.username}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFollow(u.id, u.username)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isFollowing
                        ? "bg-obsidian border border-obsidian-border text-cinema-muted hover:text-cinema-red"
                        : "bg-gold text-obsidian hover:bg-gold-secondary"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Reviews Feed */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-cinema-text">
              Community Movie Critiques ({reviews.length})
            </h2>

            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/30 transition-all space-y-4 shadow-cinematic"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* User and Film Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-bold text-sm shrink-0">
                        {r.user?.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link
                          href={`/community/users/${r.user?.username}`}
                          className="font-semibold text-sm text-cinema-text hover:text-gold transition-colors"
                        >
                          {r.user?.full_name || r.user?.username}
                        </Link>
                        <p className="text-xs text-cinema-subtle">
                          reviewed{" "}
                          <Link
                            href={`/movies/${r.movie?.tmdb_id}`}
                            className="text-cinema-text font-bold hover:underline"
                          >
                            {r.movie?.title}
                          </Link>{" "}
                          • {formatDate(r.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Rating badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-obsidian-secondary border border-obsidian-border text-gold font-bold text-sm">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span>{r.rating}/10</span>
                    </div>
                  </div>

                  <p className="text-sm text-cinema-muted leading-relaxed">
                    {r.review_text}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-obsidian-border/70 text-xs text-cinema-subtle">
                    <button
                      onClick={() => handleLikeReview(r.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                        r.user_has_liked
                          ? "bg-cinema-red/15 text-cinema-red border-cinema-red/30"
                          : "bg-obsidian-secondary border-obsidian-border text-cinema-muted hover:text-cinema-red hover:border-cinema-red/40"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          r.user_has_liked ? "fill-cinema-red text-cinema-red" : ""
                        }`}
                      />
                      <span className="font-semibold">{r.likes_count || 0} Likes</span>
                    </button>

                    <Link
                      href={`/movies/${r.movie?.tmdb_id}`}
                      className="text-xs text-gold hover:text-gold-secondary font-medium"
                    >
                      View Movie Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Collections Feed */}
        {activeTab === "collections" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-cinema-text">
              Public Curated Collections ({collections.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="rounded-2xl overflow-hidden bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all flex flex-col justify-between"
                >
                  <Link
                    href={`/collections/${col.id}`}
                    className="relative aspect-video w-full overflow-hidden bg-obsidian-secondary block"
                  >
                    {col.cover_url ? (
                      <Image
                        src={col.cover_url}
                        alt={col.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 text-xs text-cinema-muted">
                        Filmfolio Anthology
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-obsidian/90 text-xs font-semibold text-gold">
                      {col.movies_count || 0} Films
                    </div>
                  </Link>

                  <div className="p-5 space-y-3">
                    <div>
                      <Link
                        href={`/collections/${col.id}`}
                        className="font-serif text-lg font-bold text-cinema-text hover:text-gold transition-colors block line-clamp-1"
                      >
                        {col.name}
                      </Link>
                      <p className="text-xs text-cinema-muted line-clamp-2 mt-1">
                        {col.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-obsidian-border text-xs text-cinema-subtle">
                      <span>Curated by @{col.user?.username || "cinephile"}</span>
                      <Link
                        href={`/collections/${col.id}`}
                        className="text-gold font-semibold hover:underline"
                      >
                        Explore →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Activity Stream */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-cinema-text">
              Live Community Activity Stream
            </h2>

            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-obsidian-secondary border border-obsidian-border flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center text-xs font-bold border border-gold/30 shrink-0">
                      {log.user?.username.slice(0, 2).toUpperCase() || "CF"}
                    </div>
                    <div className="text-xs text-cinema-muted">
                      <strong className="text-cinema-text">@{log.user?.username}</strong>{" "}
                      {log.action === "added_review" && (
                        <span>
                          posted a review on <span className="text-gold">{(log.entity_details as any)?.movie_title}</span>
                        </span>
                      )}
                      {log.action === "created_collection" && (
                        <span>
                          published anthology <span className="text-gold">{(log.entity_details as any)?.name || (log.entity_details as any)?.collection_name}</span>
                        </span>
                      )}
                      {log.action === "added_favorite" && (
                        <span>
                          favourited <span className="text-gold">{(log.entity_details as any)?.movie_title}</span>
                        </span>
                      )}
                      {log.action === "added_to_library" && (
                        <span>
                          archived <span className="text-gold">{(log.entity_details as any)?.title}</span> into their library
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-cinema-subtle whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
