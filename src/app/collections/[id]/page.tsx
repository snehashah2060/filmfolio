"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getCollectionByIdAction,
  removeMovieFromCollectionAction,
} from "@/lib/actions/collections";
import { CustomCollection, DbMovie } from "@/types/database";
import { getTMDBPosterUrl } from "@/lib/tmdb/config";
import { formatRating, formatYear } from "@/lib/utils";
import {
  Layers,
  Globe,
  Lock,
  Share2,
  Trash2,
  ChevronLeft,
  Plus,
  Star,
  Film,
} from "lucide-react";
import { toast } from "sonner";

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = params.id as string;

  const [collection, setCollection] = useState<CustomCollection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCollectionByIdAction(collectionId);
        setCollection(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [collectionId]);

  const handleRemoveMovie = async (movieId: string, title?: string) => {
    if (!confirm(`Remove "${title || "this film"}" from this collection?`)) return;
    try {
      const res = await removeMovieFromCollectionAction(collectionId, movieId);
      if (res.success) {
        setCollection((prev) => {
          if (!prev) return null;
          const updatedMovies = prev.movies?.filter((m) => m.id !== movieId) || [];
          return {
            ...prev,
            movies: updatedMovies,
            movies_count: updatedMovies.length,
          };
        });
        toast.success(`Removed "${title || "film"}" from collection`);
      } else {
        toast.error("Failed to remove movie");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Collection URL copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian text-cinema-text">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-cinema-muted">
          Loading collection anthology...
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-obsidian text-cinema-text">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold">Collection Not Found</h2>
          <p className="text-cinema-muted text-sm">
            This collection may be private or has been removed.
          </p>
          <Link
            href="/collections"
            className="inline-block px-4 py-2 rounded-xl bg-gold text-obsidian font-bold text-xs"
          >
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  const movies = collection.movies || [];

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cinema-muted hover:text-gold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </Link>

        {/* Collection Hero Header */}
        <div className="p-8 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-6 shadow-cinematic">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-gold/15 text-gold border border-gold/30">
                  ANTHOLOGY
                </span>
                <span className="flex items-center gap-1 text-xs text-cinema-muted">
                  {collection.visibility === "PUBLIC" ? (
                    <>
                      <Globe className="w-3 h-3 text-gold" />
                      <span>Public Collection</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-cinema-subtle" />
                      <span>Private Collection</span>
                    </>
                  )}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
                {collection.name}
              </h1>

              <p className="text-sm text-cinema-muted leading-relaxed">
                {collection.description || "A curated cinematic collection."}
              </p>

              <div className="text-xs text-cinema-subtle pt-2">
                Curated by <span className="text-gold font-medium">@{collection.user?.username || "cinephile"}</span> • {movies.length} titles
              </div>
            </div>

            <div className="flex items-center gap-3 self-start">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-obsidian-secondary border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4 text-gold" />
                <span>Share Collection</span>
              </button>
              <Link
                href="/discover"
                className="px-4 py-2 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary flex items-center gap-2 transition-all shadow-gold-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Films</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Movies in Collection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-cinema-text">
              Included Titles ({movies.length})
            </h2>
          </div>

          {movies.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3">
              <Film className="w-12 h-12 text-gold mx-auto mb-2 opacity-80" />
              <h3 className="font-serif text-xl font-bold text-cinema-text">
                No Titles in This Collection
              </h3>
              <p className="text-sm text-cinema-muted max-w-sm mx-auto mb-4">
                Explore movies in Discover or detail pages and click &quot;Add to Collection&quot;.
              </p>
              <Link
                href="/discover"
                className="px-4 py-2 bg-gold text-obsidian font-bold text-xs rounded-xl hover:bg-gold-secondary"
              >
                Browse Discoveries
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="group relative flex flex-col rounded-xl overflow-hidden bg-obsidian-card border border-obsidian-border hover:border-gold/50 transition-all shadow-sm"
                >
                  <Link
                    href={`/movies/${movie.tmdb_id}`}
                    className="relative aspect-[2/3] w-full overflow-hidden bg-obsidian-secondary block"
                  >
                    {movie.poster_path && (
                      <Image
                        src={getTMDBPosterUrl(movie.poster_path, "sm")}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </Link>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/movies/${movie.tmdb_id}`}
                        className="font-medium text-xs sm:text-sm text-cinema-text hover:text-gold transition-colors line-clamp-1"
                        title={movie.title}
                      >
                        {movie.title}
                      </Link>
                      <div className="flex items-center justify-between text-xs text-cinema-muted mt-1">
                        <span>{formatYear(movie.release_date)}</span>
                        {movie.tmdb_rating && (
                          <span className="flex items-center gap-1 text-gold font-bold">
                            <Star className="w-3 h-3 fill-gold" />
                            {formatRating(movie.tmdb_rating)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-obsidian-border/50 flex justify-end">
                      <button
                        onClick={() => handleRemoveMovie(movie.id, movie.title)}
                        className="text-[10px] text-cinema-subtle hover:text-cinema-red transition-colors flex items-center gap-1"
                        title="Remove from collection"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
