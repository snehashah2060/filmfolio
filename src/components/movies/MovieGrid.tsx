import React from "react";
import { TMDBMovie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";
import { Film } from "lucide-react";

interface MovieGridProps {
  movies: TMDBMovie[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function MovieGrid({
  movies,
  isLoading = false,
  emptyMessage = "No movies found matching your criteria.",
}: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-obsidian-card border border-obsidian-border">
        <div className="w-16 h-16 rounded-full bg-obsidian flex items-center justify-center text-gold mb-4 border border-obsidian-border">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-lg font-medium text-cinema-text mb-1">
          No Films Found
        </h3>
        <p className="text-sm text-cinema-muted max-w-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} priority={index < 4} />
      ))}
    </div>
  );
}
