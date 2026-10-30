"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MovieCard } from "@/components/movies/MovieCard";
import { TMDBMovie, TMDBGenre } from "@/types/tmdb";
import { TMDB_GENRES } from "@/lib/tmdb/curated-data";
import { getTMDBBackdropUrl } from "@/lib/tmdb/config";
import {
  Search,
  SlidersHorizontal,
  Flame,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
  Filter,
} from "lucide-react";

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<"trending" | "popular" | "top_rated" | "upcoming">("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState<TMDBMovie | null>(null);

  // Fetch movies based on activeTab or search
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        if (searchQuery.trim().length > 0) {
          const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setMovies(data.results || []);
              setFeaturedMovie(data.results?.[0] || null);
            }
          }
        } else {
          const res = await fetch(`/api/tmdb/discover?type=${activeTab}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setMovies(data.results || []);
              setFeaturedMovie(data.results?.[0] || null);
            }
          }
        }
      } catch (err) {
        console.error("Discovery fetch failed:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadData();
    }, searchQuery ? 300 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [activeTab, searchQuery]);

  // Client filtering by genre and year if applied
  const filteredMovies = movies.filter((m) => {
    if (selectedGenre) {
      const matchGenre = m.genres?.some((g) => g.id === selectedGenre) ||
        m.genre_ids?.includes(selectedGenre);
      if (!matchGenre) return false;
    }
    if (selectedYear) {
      if (!m.release_date || !m.release_date.startsWith(selectedYear)) {
        return false;
      }
    }
    return true;
  });

  const years = ["2026", "2024", "2023", "2022", "2021", "2020", "2019", "2014", "2010", "1994", "1972"];

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Featured Spotlight Banner */}
        {featuredMovie && !searchQuery && (
          <div className="relative rounded-3xl overflow-hidden min-h-[380px] flex items-end p-6 sm:p-10 border border-obsidian-border shadow-cinematic">
            <Image
              src={getTMDBBackdropUrl(featuredMovie.backdrop_path, "original")}
              alt={featuredMovie.title}
              fill
              priority
              className="object-cover object-center opacity-40 brightness-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian/60" />

            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Presentation</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cinema-text leading-tight">
                {featuredMovie.title}
              </h1>
              <p className="text-xs sm:text-sm text-cinema-muted line-clamp-3 leading-relaxed">
                {featuredMovie.overview}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/movies/${featuredMovie.id}`}
                  className="px-5 py-2.5 bg-gold text-obsidian font-bold text-xs sm:text-sm rounded-xl hover:bg-gold-secondary transition-all shadow-gold-sm"
                >
                  View Details & Reviews
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Discovery Controls Bar */}
        <div className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Live Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cinema-subtle">
                <Search className="w-4 h-4 text-gold" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search TMDB catalog by title, director or concept..."
                className="w-full pl-10 pr-10 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-cinema-muted hover:text-cinema-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Section Tabs (only if not searching) */}
            {!searchQuery && (
              <div className="flex items-center gap-1.5 p-1 bg-obsidian-secondary rounded-xl border border-obsidian-border overflow-x-auto">
                <button
                  onClick={() => setActiveTab("trending")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === "trending"
                      ? "bg-gold text-obsidian shadow-sm"
                      : "text-cinema-muted hover:text-cinema-text"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Trending</span>
                </button>

                <button
                  onClick={() => setActiveTab("popular")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === "popular"
                      ? "bg-gold text-obsidian shadow-sm"
                      : "text-cinema-muted hover:text-cinema-text"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Popular</span>
                </button>

                <button
                  onClick={() => setActiveTab("top_rated")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === "top_rated"
                      ? "bg-gold text-obsidian shadow-sm"
                      : "text-cinema-muted hover:text-cinema-text"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Top Rated</span>
                </button>

                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === "upcoming"
                      ? "bg-gold text-obsidian shadow-sm"
                      : "text-cinema-muted hover:text-cinema-text"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Upcoming</span>
                </button>
              </div>
            )}
          </div>

          {/* Filters: Genre and Year */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-obsidian-border/60">
            <div className="flex items-center gap-1.5 text-xs text-cinema-muted font-medium">
              <Filter className="w-3.5 h-3.5 text-gold" />
              <span>Filters:</span>
            </div>

            {/* Genre Dropdown */}
            <select
              value={selectedGenre || ""}
              onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-1.5 bg-obsidian-secondary border border-obsidian-border rounded-lg text-xs text-cinema-text focus:outline-none focus:border-gold"
            >
              <option value="">All Genres</option>
              {TMDB_GENRES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            {/* Release Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 bg-obsidian-secondary border border-obsidian-border rounded-lg text-xs text-cinema-text focus:outline-none focus:border-gold"
            >
              <option value="">All Release Years</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {(selectedGenre || selectedYear || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setSelectedYear("");
                  setSearchQuery("");
                }}
                className="text-xs text-cinema-muted hover:text-cinema-red transition-colors ml-auto flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-cinema-text capitalize">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : `${activeTab.replace("_", " ")} Films`}
          </h2>
          <span className="text-xs text-cinema-muted">
            Showing {filteredMovies.length} films
          </span>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-obsidian-card border border-obsidian-border animate-pulse"
              >
                <div className="aspect-[2/3] bg-obsidian-secondary w-full" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-obsidian-secondary rounded w-3/4" />
                  <div className="h-3 bg-obsidian-secondary rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3">
            <h3 className="font-serif text-xl font-bold text-cinema-text">
              No Films Match Current Criteria
            </h3>
            <p className="text-sm text-cinema-muted max-w-sm mx-auto">
              Try adjusting your genre, release year filter or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
