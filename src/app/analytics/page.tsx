"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  Film,
  Star,
  Heart,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const currentUser = filmfolioStore.getCurrentUser();
  const library = filmfolioStore.getUserMovies(currentUser.id);
  const favorites = filmfolioStore.getFavorites(currentUser.id);
  const diary = filmfolioStore.getDiary(currentUser.id);
  const stats = filmfolioStore.getUserStats(currentUser.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Calculate Monthly Viewing Activity from real diary entries
  const monthsMap: Record<string, number> = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
  };
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  diary.forEach((d) => {
    if (d.watched_at) {
      const monthIdx = new Date(d.watched_at).getMonth();
      const mName = monthNames[monthIdx];
      if (mName) monthsMap[mName] = (monthsMap[mName] || 0) + 1;
    }
  });

  const monthlyData = Object.keys(monthsMap).map((m) => ({
    month: m,
    views: monthsMap[m],
  }));

  // 2. Genre Distribution from user's actual watched movies
  const genreCount: Record<string, number> = {};
  library.forEach((item) => {
    if (item.movie?.genres) {
      item.movie.genres.forEach((g) => {
        genreCount[g.name] = (genreCount[g.name] || 0) + 1;
      });
    }
  });

  const genreData = Object.keys(genreCount)
    .map((name) => ({ name, count: genreCount[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const mostWatchedGenre = genreData[0]?.name || "None Yet";

  // 3. Rating Distribution (1 to 10)
  const ratingCount: Record<string, number> = {
    "1-4": 0,
    "5-6": 0,
    "7-8": 0,
    "9-10": 0,
  };
  library.forEach((item) => {
    const r = item.personal_rating;
    if (r !== null && r !== undefined) {
      if (r <= 4) ratingCount["1-4"]++;
      else if (r <= 6) ratingCount["5-6"]++;
      else if (r <= 8) ratingCount["7-8"]++;
      else ratingCount["9-10"]++;
    }
  });

  const ratingData = Object.keys(ratingCount).map((range) => ({
    range,
    count: ratingCount[range],
  }));

  // 4. Watched vs Unwatched
  const statusData = [
    { name: "Watched", value: stats.totalWatched },
    { name: "Unwatched/Plan", value: stats.totalUnwatched },
  ];

  // Palette colors for charts
  const GOLD_COLORS = ["#C5A46D", "#E0C18B", "#9E814E", "#D4B67E", "#B08E55", "#806637"];

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <div className="border-b border-obsidian-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold mb-3 border border-gold/30">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Viewing Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
            Personal Cinema Analytics
          </h1>
          <p className="text-sm text-cinema-muted mt-1">
            Visual metrics derived directly from your personal screenings, diary records, and ratings.
          </p>
        </div>

        {/* Top Insights Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
            <span className="text-xs text-cinema-muted font-medium">Total Screenings</span>
            <span className="font-serif text-3xl font-bold text-cinema-text mt-3">
              {stats.totalWatched}
            </span>
            <span className="text-[10px] text-cinema-subtle mt-1">From {stats.totalLibrary} collected</span>
          </div>

          <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
            <span className="text-xs text-cinema-muted font-medium">Average Score</span>
            <span className="font-serif text-3xl font-bold text-gold mt-3 flex items-center gap-1.5">
              <span>{stats.averageRating > 0 ? stats.averageRating : "—"}</span>
              {stats.averageRating > 0 && <Star className="w-5 h-5 fill-gold text-gold" />}
            </span>
            <span className="text-[10px] text-cinema-subtle mt-1">On 10-point scale</span>
          </div>

          <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
            <span className="text-xs text-cinema-muted font-medium">Dominant Genre</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-cinema-text mt-3 truncate">
              {mostWatchedGenre}
            </span>
            <span className="text-[10px] text-cinema-subtle mt-1">Most logged category</span>
          </div>

          <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
            <span className="text-xs text-cinema-muted font-medium">Crown Favourites</span>
            <span className="font-serif text-3xl font-bold text-gold-secondary mt-3">
              {stats.favoritesCount}
            </span>
            <span className="text-[10px] text-cinema-subtle mt-1">Masterwork titles</span>
          </div>
        </div>

        {/* Charts Row 1: Monthly Velocity & Genre Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Screenings Chart */}
          <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4 shadow-cinematic">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
              <h3 className="font-serif text-lg font-bold text-cinema-text flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span>Monthly Viewing Velocity</span>
              </h3>
              <span className="text-xs text-cinema-muted">Screenings / Month</span>
            </div>

            <div className="h-64 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#A6A19A" fontSize={11} tickLine={false} />
                    <YAxis stroke="#A6A19A" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1B1B21",
                        borderColor: "#34343A",
                        borderRadius: "12px",
                        color: "#F5F1E8",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="views" fill="#C5A46D" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-cinema-subtle">
                  Loading chart...
                </div>
              )}
            </div>
          </div>

          {/* Genre Distribution Pie */}
          <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4 shadow-cinematic">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
              <h3 className="font-serif text-lg font-bold text-cinema-text flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-gold" />
                <span>Genre Distribution</span>
              </h3>
              <span className="text-xs text-cinema-muted">Top Watched</span>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              {mounted ? (
                genreData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="count"
                      >
                        {genreData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={GOLD_COLORS[index % GOLD_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1B1B21",
                          borderColor: "#34343A",
                          borderRadius: "12px",
                          color: "#F5F1E8",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs text-cinema-subtle">No genre data recorded yet.</span>
                )
              ) : (
                <span className="text-xs text-cinema-subtle">Loading chart...</span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {genreData.map((g, idx) => (
                <div key={g.name} className="flex items-center gap-1.5 text-xs text-cinema-muted">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: GOLD_COLORS[idx % GOLD_COLORS.length] }}
                  />
                  <span>{g.name} ({g.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Rating Distribution */}
        <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4 shadow-cinematic">
          <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
            <h3 className="font-serif text-lg font-bold text-cinema-text flex items-center gap-2">
              <Star className="w-5 h-5 text-gold" />
              <span>Personal Rating Frequency Distribution</span>
            </h3>
            <span className="text-xs text-cinema-muted">Scored out of 10</span>
          </div>

          <div className="h-56 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="range" stroke="#A6A19A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#A6A19A" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B1B21",
                      borderColor: "#34343A",
                      borderRadius: "12px",
                      color: "#F5F1E8",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#E0C18B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-cinema-subtle">
                Loading chart...
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
