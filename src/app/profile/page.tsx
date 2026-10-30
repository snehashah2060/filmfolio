"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { formatDate } from "@/lib/utils";
import {
  User,
  Settings,
  Film,
  Bookmark,
  Calendar,
  Star,
  ShieldCheck,
  Edit3,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const currentUser = filmfolioStore.getCurrentUser();
  const stats = filmfolioStore.getUserStats(currentUser.id);

  const [fullName, setFullName] = useState(currentUser.full_name || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    filmfolioStore.updateProfile(currentUser.id, {
      full_name: fullName,
      bio,
    });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar userRole={currentUser.role} username={currentUser.username} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex items-center justify-between border-b border-obsidian-border pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
              My Profile
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Personal cinema credentials and biographical archive.
            </p>
          </div>

          <Link
            href="/settings"
            className="px-4 py-2 rounded-xl bg-obsidian-card border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4 text-gold" />
            <span>Account Settings</span>
          </Link>
        </div>

        {/* Profile Details Card */}
        <div className="p-8 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-6 shadow-cinematic">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 bg-obsidian-secondary border-2 border-gold shadow-gold-sm">
                {currentUser.avatar_url ? (
                  <Image src={currentUser.avatar_url} alt={currentUser.username} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-gold font-bold">
                    {currentUser.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-cinema-text">
                  {currentUser.full_name || currentUser.username}
                </h2>
                <p className="text-xs text-cinema-muted">@{currentUser.username}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold border border-gold/30">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-cinema-subtle">
                    Member since {formatDate(currentUser.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-obsidian-secondary border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Edit3 className="w-4 h-4 text-gold" />
              <span>{isEditing ? "Close Editing" : "Edit Profile"}</span>
            </button>
          </div>

          {/* Edit Form or Bio View */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-obsidian-border">
              <div>
                <label className="block text-xs font-medium text-cinema-muted mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-secondary border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-cinema-muted mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-secondary border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs text-cinema-muted hover:text-cinema-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold text-obsidian font-bold text-xs rounded-lg hover:bg-gold-secondary"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 pt-4 border-t border-obsidian-border/70">
              <p className="text-sm text-cinema-muted leading-relaxed">
                {currentUser.bio || "No bio added yet."}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-cinema-subtle mr-1">Favorite Genres:</span>
                {(currentUser.favourite_genres as string[]).map((g) => (
                  <span
                    key={typeof g === "string" ? g : (g as any).name}
                    className="px-2.5 py-0.5 rounded-md bg-obsidian-secondary border border-obsidian-border text-xs text-cinema-text"
                  >
                    {typeof g === "string" ? g : (g as any).name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lifetime Activity Stats */}
        <section className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-cinema-text">
            Lifetime Collection Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border">
              <span className="text-xs text-cinema-muted">Films in Library</span>
              <span className="font-serif text-2xl font-bold text-cinema-text block mt-1">
                {stats.totalLibrary}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border">
              <span className="text-xs text-cinema-muted">Logged Views</span>
              <span className="font-serif text-2xl font-bold text-gold block mt-1">
                {stats.diaryCount}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border">
              <span className="text-xs text-cinema-muted">Reviews Written</span>
              <span className="font-serif text-2xl font-bold text-cinema-text block mt-1">
                {stats.reviewsCount}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border">
              <span className="text-xs text-cinema-muted">Average Rating</span>
              <span className="font-serif text-2xl font-bold text-gold-secondary block mt-1">
                {stats.averageRating > 0 ? `${stats.averageRating}/10` : "—"}
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
