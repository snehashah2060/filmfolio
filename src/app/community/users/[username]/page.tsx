"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { toggleFollowAction } from "@/lib/actions/community";
import { Profile, ReviewItem, CustomCollection } from "@/types/database";
import { formatDate } from "@/lib/utils";
import {
  User,
  Heart,
  Star,
  Layers,
  Calendar,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Film,
} from "lucide-react";
import { toast } from "sonner";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const currentUser = filmfolioStore.getCurrentUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = filmfolioStore.getUserByUsername(username);
    if (user) {
      setProfile(user);
      const userRevs = filmfolioStore.getReviews({ userId: user.id, publicOnly: true });
      setReviews(userRevs);
      const userCols = filmfolioStore.getCollections({ userId: user.id, publicOnly: true });
      setCollections(userCols);
      setIsFollowing(filmfolioStore.isFollowing(currentUser.id, user.id));
      setFollowCounts(filmfolioStore.getFollowCounts(user.id));
    }
    setLoading(false);
  }, [username, currentUser.id]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    try {
      const res = await toggleFollowAction(profile.id);
      if (res.success) {
        setIsFollowing(res.isFollowing ?? !isFollowing);
        setFollowCounts((prev) => ({
          ...prev,
          followers: res.isFollowing ? prev.followers + 1 : Math.max(0, prev.followers - 1),
        }));
        toast.success(
          res.isFollowing ? `Now following @${profile.username}` : `Unfollowed @${profile.username}`
        );
      }
    } catch {
      toast.error("Failed to update follow");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian text-cinema-text">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-cinema-muted">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-obsidian text-cinema-text">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold">User Not Found</h2>
          <p className="text-cinema-muted text-sm">
            This cinephile profile does not exist or has been made private.
          </p>
          <Link
            href="/community"
            className="inline-block px-4 py-2 rounded-xl bg-gold text-obsidian font-bold text-xs"
          >
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  const isSelf = currentUser.id === profile.id;

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Profile Card Header */}
        <div className="p-8 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-6 shadow-cinematic">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 bg-obsidian-secondary border-2 border-gold shadow-gold-sm">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.username} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-gold font-bold">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cinema-text">
                    {profile.full_name || profile.username}
                  </h1>
                  {profile.role === "ADMIN" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold border border-gold/30">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-cinema-muted">@{profile.username}</p>
                <div className="flex items-center gap-4 text-xs text-cinema-muted pt-1">
                  <span>
                    <strong className="text-cinema-text font-bold">{followCounts.followers}</strong> Followers
                  </span>
                  <span>
                    <strong className="text-cinema-text font-bold">{followCounts.following}</strong> Following
                  </span>
                </div>
              </div>
            </div>

            {!isSelf && (
              <button
                onClick={handleFollowToggle}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                  isFollowing
                    ? "bg-obsidian-secondary border border-obsidian-border text-cinema-muted hover:text-cinema-red"
                    : "bg-gold text-obsidian hover:bg-gold-secondary shadow-gold-sm"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow Cinephile</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-cinema-muted leading-relaxed border-t border-obsidian-border/70 pt-4">
              {profile.bio}
            </p>
          )}

          {/* Favourite Genres */}
          {profile.favourite_genres && profile.favourite_genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-cinema-subtle mr-1">Favorite Categories:</span>
              {(profile.favourite_genres as string[]).map((g) => (
                <span
                  key={typeof g === "string" ? g : (g as any).name}
                  className="px-2.5 py-0.5 rounded-md bg-obsidian-secondary border border-obsidian-border text-xs text-cinema-text"
                >
                  {typeof g === "string" ? g : (g as any).name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Public Reviews */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-cinema-text">
            Public Critiques ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-obsidian-card border border-obsidian-border text-xs text-cinema-muted">
              @{profile.username} has not published any public reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/movies/${r.movie?.tmdb_id}`}
                        className="font-serif text-base font-bold text-cinema-text hover:text-gold"
                      >
                        {r.movie?.title}
                      </Link>
                      <span className="text-[10px] text-cinema-subtle block">
                        Critique posted on {formatDate(r.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-obsidian-secondary border border-obsidian-border text-gold font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                      <span>{r.rating}/10</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-cinema-muted leading-relaxed">
                    {r.review_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Public Collections */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-cinema-text">
            Public Collections ({collections.length})
          </h2>

          {collections.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-obsidian-card border border-obsidian-border text-xs text-cinema-muted">
              @{profile.username} has not published any public collections yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all space-y-2 group block"
                >
                  <h3 className="font-serif font-bold text-sm text-cinema-text group-hover:text-gold transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-cinema-muted line-clamp-2">
                    {col.description || "Curated cinema collection"}
                  </p>
                  <div className="text-[10px] text-gold pt-2 font-medium">
                    {col.movies_count || 0} Films Included
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
