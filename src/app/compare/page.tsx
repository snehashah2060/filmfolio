"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { REAL_TMDB_MOVIES } from "@/lib/tmdb/curated-data";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { DetailedMovie } from "@/types/tmdb";
import { getTMDBPosterUrl, getTMDBBackdropUrl } from "@/lib/tmdb/config";
import { formatRating, formatDate, formatYear, formatRuntime } from "@/lib/utils";
import {
  Scale,
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";

export default function ComparePage() {
  const [movieA, setMovieA] = useState<DetailedMovie>(REAL_TMDB_MOVIES[0]); // Oppenheimer
  const [movieB, setMovieB] = useState<DetailedMovie>(REAL_TMDB_MOVIES[1]); // Dune 2

  const currentUser = filmfolioStore.getCurrentUser();
  const library = filmfolioStore.getUserMovies(currentUser.id);

  // Look up personal ratings for selected movies
  const personalRatingA = library.find((m) => m.movie?.tmdb_id === movieA.id)?.personal_rating;
  const personalRatingB = library.find((m) => m.movie?.tmdb_id === movieB.id)?.personal_rating;

  const handleSelectA = (idStr: string) => {
    const found = REAL_TMDB_MOVIES.find((m) => m.id === Number(idStr));
    if (found) setMovieA(found);
  };

  const handleSelectB = (idStr: string) => {
    const found = REAL_TMDB_MOVIES.find((m) => m.id === Number(idStr));
    if (found) setMovieB(found);
  };

  const swapMovies = () => {
    const temp = movieA;
    setMovieA(movieB);
    setMovieB(temp);
  };

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-obsidian-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold mb-2 border border-gold/30">
              <Scale className="w-3.5 h-3.5" />
              <span>Side-by-Side Analysis</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
              Cinema Comparison Tool
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Direct comparative breakdown of narrative scope, technical runtime, ratings, and directorial craft.
            </p>
          </div>

          <button
            onClick={swapMovies}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-obsidian-card border border-obsidian-border hover:border-gold text-cinema-text hover:text-gold text-xs font-semibold flex items-center gap-2 transition-all"
            title="Swap positions"
          >
            <ArrowRightLeft className="w-4 h-4 text-gold" />
            <span>Swap Films</span>
          </button>
        </div>

        {/* Selection Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-obsidian-card border border-obsidian-border">
          <div>
            <label className="block text-xs font-medium text-gold mb-1.5 uppercase tracking-wider">
              Film Alpha
            </label>
            <select
              value={movieA.id}
              onChange={(e) => handleSelectA(e.target.value)}
              className="w-full px-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text focus:outline-none focus:border-gold"
            >
              {REAL_TMDB_MOVIES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({formatYear(m.release_date)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gold mb-1.5 uppercase tracking-wider">
              Film Beta
            </label>
            <select
              value={movieB.id}
              onChange={(e) => handleSelectB(e.target.value)}
              className="w-full px-3 py-2.5 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text focus:outline-none focus:border-gold"
            >
              {REAL_TMDB_MOVIES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({formatYear(m.release_date)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparative Side-by-Side Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Movie A Card */}
          <div className="p-6 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-6 shadow-cinematic">
            <div className="relative aspect-[2/3] w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-gold-sm border border-obsidian-border">
              <Image
                src={getTMDBPosterUrl(movieA.poster_path, "lg")}
                alt={movieA.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center space-y-1">
              <h2 className="font-serif text-2xl font-bold text-cinema-text">
                {movieA.title}
              </h2>
              {movieA.tagline && (
                <p className="text-xs text-gold-secondary italic font-serif">
                  &ldquo;{movieA.tagline}&rdquo;
                </p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-obsidian-border text-sm">
              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Director</span>
                <span className="text-cinema-text font-semibold">{movieA.director || "Christopher Nolan"}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">TMDB Global Rating</span>
                <span className="text-gold font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span>{formatRating(movieA.vote_average)} / 10</span>
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Your Personal Rating</span>
                <span className="text-cinema-text font-bold">
                  {personalRatingA ? (
                    <span className="text-gold">{personalRatingA} / 10</span>
                  ) : (
                    <span className="text-cinema-subtle">Not Rated Yet</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Runtime</span>
                <span className="text-cinema-text font-semibold">{formatRuntime(movieA.runtime)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Release Date</span>
                <span className="text-cinema-text">{formatDate(movieA.release_date)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Language</span>
                <span className="text-cinema-text uppercase">{movieA.original_language}</span>
              </div>

              <div className="py-2">
                <span className="text-cinema-muted block mb-1.5">Genres</span>
                <div className="flex flex-wrap gap-1.5">
                  {movieA.genres?.map((g) => (
                    <span
                      key={g.id}
                      className="px-2 py-0.5 rounded text-xs bg-obsidian border border-obsidian-border text-cinema-text"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href={`/movies/${movieA.id}`}
                  className="inline-block text-xs font-semibold text-gold hover:text-gold-secondary"
                >
                  Open Full Film Dossier →
                </Link>
              </div>
            </div>
          </div>

          {/* Movie B Card */}
          <div className="p-6 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-6 shadow-cinematic">
            <div className="relative aspect-[2/3] w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-gold-sm border border-obsidian-border">
              <Image
                src={getTMDBPosterUrl(movieB.poster_path, "lg")}
                alt={movieB.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center space-y-1">
              <h2 className="font-serif text-2xl font-bold text-cinema-text">
                {movieB.title}
              </h2>
              {movieB.tagline && (
                <p className="text-xs text-gold-secondary italic font-serif">
                  &ldquo;{movieB.tagline}&rdquo;
                </p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-obsidian-border text-sm">
              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Director</span>
                <span className="text-cinema-text font-semibold">{movieB.director || "Denis Villeneuve"}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">TMDB Global Rating</span>
                <span className="text-gold font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span>{formatRating(movieB.vote_average)} / 10</span>
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Your Personal Rating</span>
                <span className="text-cinema-text font-bold">
                  {personalRatingB ? (
                    <span className="text-gold">{personalRatingB} / 10</span>
                  ) : (
                    <span className="text-cinema-subtle">Not Rated Yet</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Runtime</span>
                <span className="text-cinema-text font-semibold">{formatRuntime(movieB.runtime)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Release Date</span>
                <span className="text-cinema-text">{formatDate(movieB.release_date)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-obsidian-border/50">
                <span className="text-cinema-muted">Language</span>
                <span className="text-cinema-text uppercase">{movieB.original_language}</span>
              </div>

              <div className="py-2">
                <span className="text-cinema-muted block mb-1.5">Genres</span>
                <div className="flex flex-wrap gap-1.5">
                  {movieB.genres?.map((g) => (
                    <span
                      key={g.id}
                      className="px-2 py-0.5 rounded text-xs bg-obsidian border border-obsidian-border text-cinema-text"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href={`/movies/${movieB.id}`}
                  className="inline-block text-xs font-semibold text-gold hover:text-gold-secondary"
                >
                  Open Full Film Dossier →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
