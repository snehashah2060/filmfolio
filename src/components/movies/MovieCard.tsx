"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Bookmark, Eye, Check } from "lucide-react";
import { TMDBMovie } from "@/types/tmdb";
import { getTMDBPosterUrl } from "@/lib/tmdb/config";
import { formatRating, formatYear, cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/lib/actions/favorites";
import { addToWatchlistAction } from "@/lib/actions/watchlist";
import { toast } from "sonner";

interface MovieCardProps {
  movie: TMDBMovie;
  isFavoriteInitial?: boolean;
  isWatchlistInitial?: boolean;
  priority?: boolean;
}

export function MovieCard({
  movie,
  isFavoriteInitial = false,
  isWatchlistInitial = false,
  priority = false,
}: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [isWatchlist, setIsWatchlist] = useState(isWatchlistInitial);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const posterUrl = getTMDBPosterUrl(movie.poster_path, "md");
  const releaseYear = formatYear(movie.release_date);
  const rating = formatRating(movie.vote_average);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingAction("favorite");
    try {
      const res = await toggleFavoriteAction(movie);
      if (res.success) {
        setIsFavorite(res.isFavorite ?? !isFavorite);
        toast.success(
          res.isFavorite
            ? `Added "${movie.title}" to Favourites`
            : `Removed "${movie.title}" from Favourites`
        );
      } else {
        toast.error("Could not update favorites");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingAction("watchlist");
    try {
      const res = await addToWatchlistAction(movie, "MEDIUM");
      if (res.success) {
        setIsWatchlist(true);
        toast.success(`Added "${movie.title}" to Watchlist`);
      } else {
        toast.error("Could not add to watchlist");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-obsidian-card border border-obsidian-border hover:border-gold/50 transition-all duration-300 hover:shadow-gold-sm">
      {/* Poster Container */}
      <Link href={`/movies/${movie.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-obsidian-secondary block">
        {movie.poster_path ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-obsidian-secondary">
            <span className="font-serif text-gold text-lg mb-2">FILMFOLIO</span>
            <span className="text-xs text-cinema-muted line-clamp-3">{movie.title}</span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-obsidian/85 backdrop-blur-md border border-obsidian-border/80 flex items-center gap-1 text-xs font-semibold text-cinema-text">
          <Star className="w-3 h-3 text-gold fill-gold" />
          <span>{rating}</span>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* Favorite Action Button */}
            <button
              onClick={handleFavoriteClick}
              disabled={loadingAction === "favorite"}
              aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
              className={cn(
                "p-2 rounded-full backdrop-blur-md transition-all duration-200 border",
                isFavorite
                  ? "bg-gold text-obsidian border-gold hover:scale-110"
                  : "bg-obsidian/80 text-cinema-text border-obsidian-border hover:text-gold hover:border-gold hover:scale-110"
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  isFavorite ? "fill-obsidian" : "fill-transparent"
                )}
              />
            </button>

            {/* Watchlist Action Button */}
            <button
              onClick={handleWatchlistClick}
              disabled={loadingAction === "watchlist"}
              aria-label={isWatchlist ? "In watchlist" : "Add to watchlist"}
              className={cn(
                "p-2 rounded-full backdrop-blur-md transition-all duration-200 border",
                isWatchlist
                  ? "bg-gold-secondary text-obsidian border-gold-secondary hover:scale-110"
                  : "bg-obsidian/80 text-cinema-text border-obsidian-border hover:text-gold-secondary hover:border-gold-secondary hover:scale-110"
              )}
            >
              {isWatchlist ? <Check className="w-4 h-4 stroke-[3]" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* View Details Button */}
            <div className="p-2 rounded-full bg-obsidian/80 text-cinema-text border border-obsidian-border hover:text-gold hover:border-gold hover:scale-110 backdrop-blur-md transition-all">
              <Eye className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>

      {/* Meta Content */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <Link
            href={`/movies/${movie.id}`}
            className="font-medium text-sm text-cinema-text hover:text-gold transition-colors line-clamp-1"
            title={movie.title}
          >
            {movie.title}
          </Link>
          <div className="flex items-center justify-between text-xs text-cinema-muted mt-1">
            <span>{releaseYear}</span>
            {movie.original_language && (
              <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-obsidian border border-obsidian-border">
                {movie.original_language}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
