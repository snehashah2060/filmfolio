"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getUserFavorites } from "@/lib/actions/favorites";
import { FavoriteItem } from "@/types/database";
import { MovieCard } from "@/components/movies/MovieCard";
import { Heart, Search, Plus, Film } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserFavorites();
        setFavorites(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = favorites.filter((f) => {
    if (!search.trim()) return true;
    return f.movie?.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text flex items-center gap-3">
              <Heart className="w-8 h-8 text-gold fill-gold" />
              <span>Personal Favourites</span>
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Your crown jewels of cinema—films that define your passion.
            </p>
          </div>

          <Link
            href="/discover"
            className="px-4 py-2.5 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary flex items-center gap-2 transition-all shadow-gold-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Discover More Films</span>
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
              placeholder="Filter favourites by title..."
              className="w-full pl-10 pr-4 py-2 bg-obsidian-secondary border border-obsidian-border rounded-xl text-xs sm:text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Favourites Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-xl bg-obsidian-card border border-obsidian-border animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3">
            <Heart className="w-12 h-12 text-gold mx-auto mb-2 opacity-80" />
            <h3 className="font-serif text-xl font-bold text-cinema-text">
              No Favourites Saved
            </h3>
            <p className="text-sm text-cinema-muted max-w-sm mx-auto">
              Heart any movie while discovering to showcase it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {filtered.map((item) =>
              item.movie ? (
                <MovieCard
                  key={item.id}
                  isFavoriteInitial={true}
                  movie={{
                    id: item.movie.tmdb_id,
                    title: item.movie.title,
                    overview: item.movie.overview || "",
                    poster_path: item.movie.poster_path,
                    backdrop_path: item.movie.backdrop_path,
                    release_date: item.movie.release_date || "",
                    original_language: item.movie.original_language || "en",
                    vote_average: item.movie.tmdb_rating || 0,
                  }}
                />
              ) : null
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
