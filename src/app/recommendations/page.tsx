import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { tmdbService } from "@/lib/tmdb/service";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { MovieCard } from "@/components/movies/MovieCard";
import { Sparkles, Compass, Heart, Film } from "lucide-react";

export default async function RecommendationsPage() {
  const currentUser = filmfolioStore.getCurrentUser();
  const library = filmfolioStore.getUserMovies(currentUser.id);
  const favorites = filmfolioStore.getFavorites(currentUser.id);

  // Get recommendations based on top favorite or top watched
  const topMovie = favorites[0]?.movie || library[0]?.movie;
  const similarResponse = topMovie
    ? await tmdbService.getMovieSimilar(topMovie.tmdb_id)
    : await tmdbService.getPopular(1);

  const topRatedResponse = await tmdbService.getTopRated(1);
  const trendingResponse = await tmdbService.getTrending(1);

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="border-b border-obsidian-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold mb-2 border border-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Curation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
            Cinema Recommendations
          </h1>
          <p className="text-sm text-cinema-muted mt-1">
            Carefully curated selections based on your rated films, favorite genres, and TMDB similarity algorithms.
          </p>
        </div>

        {/* Section 1: Because you loved [Top Movie] */}
        {topMovie && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-gold fill-gold" />
              <h2 className="font-serif text-2xl font-bold text-cinema-text">
                Because You Liked &ldquo;{topMovie.title}&rdquo;
              </h2>
            </div>
            <p className="text-xs text-cinema-muted">
              Similar narrative complexity, tone, and thematic resonance from TMDB similarity engine.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 pt-2">
              {similarResponse.results.slice(0, 6).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Discover Something New */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-2xl font-bold text-cinema-text">
              Discover Something New
            </h2>
          </div>
          <p className="text-xs text-cinema-muted">
            Trending international productions captivating cinema enthusiasts right now.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 pt-2">
            {trendingResponse.results.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Section 3: High Critical Consensus */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-2xl font-bold text-cinema-text">
              Highest Critical Consensus
            </h2>
          </div>
          <p className="text-xs text-cinema-muted">
            Top-rated landmarks of film history revered worldwide.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 pt-2">
            {topRatedResponse.results.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
