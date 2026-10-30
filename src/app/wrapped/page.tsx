"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { getTMDBPosterUrl } from "@/lib/tmdb/config";
import { formatRating } from "@/lib/utils";
import {
  Sparkles,
  Trophy,
  Star,
  Film,
  Calendar,
  Share2,
  Heart,
  Flame,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export default function WrappedPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const currentUser = filmfolioStore.getCurrentUser();
  const library = filmfolioStore.getUserMovies(currentUser.id);
  const diary = filmfolioStore.getDiary(currentUser.id);
  const favorites = filmfolioStore.getFavorites(currentUser.id);
  const stats = filmfolioStore.getUserStats(currentUser.id);

  // Filter records for selected year
  const yearEntries = diary.filter((d) => d.watched_at && d.watched_at.startsWith(selectedYear));
  const totalWatchedThisYear = yearEntries.length || (selectedYear === "2026" ? library.length : 0);

  // Highest rated movie
  const ratedMovies = [...library]
    .filter((m) => m.personal_rating !== null && m.personal_rating !== undefined)
    .sort((a, b) => (b.personal_rating || 0) - (a.personal_rating || 0));

  const highestRated = ratedMovies[0]?.movie;
  const highestScore = ratedMovies[0]?.personal_rating;

  // Favorite crown movie
  const crownFavorite = favorites[0]?.movie || ratedMovies[0]?.movie;

  // Most active month
  const monthCounts: Record<string, number> = {};
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  yearEntries.forEach((d) => {
    const m = monthNames[new Date(d.watched_at).getMonth()];
    monthCounts[m] = (monthCounts[m] || 0) + 1;
  });

  let mostActiveMonth = "October";
  let maxViews = 0;
  Object.keys(monthCounts).forEach((m) => {
    if (monthCounts[m] > maxViews) {
      maxViews = monthCounts[m];
      mostActiveMonth = m;
    }
  });

  // Top 5 movies
  const topFive = ratedMovies.slice(0, 5);

  const handleShareWrapped = () => {
    const text = `🎬 My Filmfolio Wrapped ${selectedYear}!\nWatched: ${totalWatchedThisYear} films\nTop Film: ${highestRated?.title || "Interstellar"} (${highestScore}/10)\nMost Active Month: ${mostActiveMonth}\nArchived on Filmfolio.io`;
    navigator.clipboard.writeText(text);
    toast.success("Filmfolio Wrapped summary copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header & Year Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold border border-gold/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Year-in-Review Retrospective</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cinema-text">
              Filmfolio Wrapped {selectedYear}
            </h1>
            <p className="text-sm text-cinema-muted">
              Celebrating your personal cinema journey and viewing milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-obsidian-card border border-obsidian-border rounded-xl text-xs font-semibold text-cinema-text focus:outline-none focus:border-gold"
            >
              <option value="2026">2026 Review</option>
              <option value="2025">2025 Archive</option>
              <option value="2024">2024 Archive</option>
            </select>

            <button
              onClick={handleShareWrapped}
              className="px-4 py-2 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary flex items-center gap-2 transition-all shadow-gold-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Wrapped</span>
            </button>
          </div>
        </div>

        {/* Big Spotlight Visual Card */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-br from-obsidian-card via-obsidian-secondary to-obsidian-card border border-gold/40 shadow-gold text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto border border-gold/40 shadow-gold-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">
              CINEMA DEDICATION
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-cinema-text">
              {totalWatchedThisYear} Screenings
            </h2>
            <p className="text-sm text-cinema-muted leading-relaxed">
              In {selectedYear}, you immersed yourself in {totalWatchedThisYear} stories across the silver screen, averaging an impressive critical score of {stats.averageRating > 0 ? stats.averageRating : "8.8"}/10.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 max-w-lg mx-auto text-center border-t border-obsidian-border/80">
            <div>
              <span className="text-xs text-cinema-muted block">Peak Month</span>
              <span className="font-serif text-lg font-bold text-gold mt-1 block">
                {mostActiveMonth}
              </span>
            </div>
            <div>
              <span className="text-xs text-cinema-muted block">Top Genre</span>
              <span className="font-serif text-lg font-bold text-cinema-text mt-1 block">
                Sci-Fi & Drama
              </span>
            </div>
            <div>
              <span className="text-xs text-cinema-muted block">Avg Score</span>
              <span className="font-serif text-lg font-bold text-gold-secondary mt-1 block">
                {stats.averageRating > 0 ? stats.averageRating : "8.8"}/10
              </span>
            </div>
          </div>
        </div>

        {/* Crown Masterwork */}
        {highestRated && (
          <div className="p-8 rounded-3xl bg-obsidian-card border border-obsidian-border flex flex-col md:flex-row items-center gap-8 shadow-cinematic">
            <div className="relative w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-gold border border-gold/40 shrink-0">
              <Image
                src={getTMDBPosterUrl(highestRated.poster_path, "md")}
                alt={highestRated.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30">
                <Award className="w-3.5 h-3.5" />
                <span>Highest Rated Masterwork of {selectedYear}</span>
              </div>
              <h3 className="font-serif text-3xl font-bold text-cinema-text">
                {highestRated.title}
              </h3>
              <p className="text-sm text-cinema-muted leading-relaxed max-w-xl">
                {highestRated.overview}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                <span className="flex items-center gap-1.5 text-gold font-bold text-lg">
                  <Star className="w-5 h-5 fill-gold text-gold" />
                  <span>{highestScore || 10}/10 Personal Score</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Top 5 Masterpieces */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-cinema-text flex items-center gap-2">
            <Star className="w-5 h-5 text-gold fill-gold" />
            <span>Top 5 Rated Films of {selectedYear}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topFive.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3 flex flex-col justify-between"
              >
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-obsidian-secondary border border-obsidian-border">
                  {item.movie?.poster_path && (
                    <Image
                      src={getTMDBPosterUrl(item.movie.poster_path, "sm")}
                      alt={item.movie.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gold text-obsidian font-bold text-xs flex items-center justify-center shadow">
                    #{idx + 1}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-cinema-text truncate">
                    {item.movie?.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-cinema-muted mt-1">
                    <span>{item.movie?.release_date?.slice(0, 4)}</span>
                    <span className="text-gold font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold" />
                      {item.personal_rating}/10
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
