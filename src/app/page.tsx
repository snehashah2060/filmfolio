import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Film,
  Bookmark,
  Calendar,
  Layers,
  BarChart3,
  Users,
  ShieldCheck,
  ChevronRight,
  Star,
  Play,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Footer } from "@/components/layout/Footer";
import { tmdbService } from "@/lib/tmdb/service";
import { getTMDBBackdropUrl, getTMDBPosterUrl } from "@/lib/tmdb/config";
import { MovieCard } from "@/components/movies/MovieCard";

export default async function LandingPage() {
  const trendingData = await tmdbService.getTrending(1);
  const popularData = await tmdbService.getPopular(1);

  const featuredMovie = trendingData.results[0] || popularData.results[0];
  const trendingList = trendingData.results.slice(1, 7);
  const popularList = popularData.results.slice(0, 6);

  const heroBackdrop = featuredMovie
    ? getTMDBBackdropUrl(featuredMovie.backdrop_path, "original")
    : "/images/placeholder-backdrop.png";

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text selection:bg-gold/20 selection:text-gold-secondary">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-obsidian/85 border-b border-obsidian-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" href="/" />

          <nav className="hidden md:flex items-center gap-6 text-sm text-cinema-muted">
            <Link href="/discover" className="hover:text-cinema-text transition-colors">
              Discover
            </Link>
            <Link href="#features" className="hover:text-cinema-text transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-cinema-text transition-colors">
              How It Works
            </Link>
            <Link href="/community" className="hover:text-cinema-text transition-colors">
              Community
            </Link>
            <Link href="/about" className="hover:text-cinema-text transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-cinema-text hover:text-gold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gold text-obsidian hover:bg-gold-secondary transition-all shadow-gold-sm hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-obsidian-border">
        {/* Background Backdrop with Gradient Overlay */}
        {featuredMovie && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroBackdrop}
              alt={featuredMovie.title}
              fill
              priority
              className="object-cover object-top opacity-35 filter brightness-75 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian/80" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Subtle Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-card/90 border border-gold/40 text-xs font-semibold text-gold-secondary mb-6 shadow-gold-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>The Premier Cinema Journal & Collection Manager</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-cinema-text max-w-4xl leading-tight">
            Your Cinema. Your Collection.{" "}
            <span className="gold-text-gradient">Your Story.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-cinema-muted max-w-2xl leading-relaxed">
            Archive every screening, curate custom cinephile collections, track
            viewing habits with detailed analytics, and engage with a discerning community
            of film lovers.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gold text-obsidian font-bold text-base hover:bg-gold-secondary transition-all shadow-gold hover:scale-105"
            >
              <span>Begin Your Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/discover"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-obsidian-card/80 border border-obsidian-border text-cinema-text font-medium text-base hover:border-gold/60 hover:text-gold transition-all"
            >
              <Film className="w-4 h-4 text-gold" />
              <span>Explore Discoveries</span>
            </Link>
          </div>

          {/* Featured Spotlight Card */}
          {featuredMovie && (
            <div className="mt-14 max-w-2xl w-full p-4 rounded-2xl bg-obsidian-secondary/80 border border-obsidian-border/80 backdrop-blur-md flex items-center gap-4 text-left shadow-cinematic">
              <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 border border-obsidian-border">
                <Image
                  src={getTMDBPosterUrl(featuredMovie.poster_path, "sm")}
                  alt={featuredMovie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-gold font-medium mb-1">
                  <span>TRENDING SPOTLIGHT</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-cinema-text font-semibold">
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    <span>{featuredMovie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-cinema-text truncate">
                  {featuredMovie.title}
                </h3>
                <p className="text-xs text-cinema-muted line-clamp-2 mt-0.5">
                  {featuredMovie.overview}
                </p>
              </div>
              <Link
                href={`/movies/${featuredMovie.id}`}
                className="shrink-0 p-3 rounded-full bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-obsidian transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cinema-text">
              Trending Cinema
            </h2>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              What cinephiles around the globe are experiencing this week.
            </p>
          </div>
          <Link
            href="/discover"
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gold hover:text-gold-secondary transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {trendingList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="bg-obsidian-secondary border-y border-obsidian-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
              Engineered for the Modern Cinephile
            </h2>
            <p className="text-sm text-cinema-muted mt-3">
              Every detail is tuned for clarity, depth, and cinematic reverence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mb-5">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cinema-text mb-2">
                Personal Movie Library
              </h3>
              <p className="text-sm text-cinema-muted leading-relaxed">
                Log watched titles, sort by directors and genres, assign 1-10 precision
                ratings, and store private screening notes with zero duplicates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cinema-text mb-2">
                Chronological Diary
              </h3>
              <p className="text-sm text-cinema-muted leading-relaxed">
                Record repeat screenings on specific calendar dates. Capture how a film resonates differently across viewings over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cinema-text mb-2">
                Curated Custom Collections
              </h3>
              <p className="text-sm text-cinema-muted leading-relaxed">
                Assemble thematic anthologies—from 1970s neo-noir to Villeneuve sci-fi—with automatic visual cover collages.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cinema-text mb-2">
                Viewing Analytics & Wrapped
              </h3>
              <p className="text-sm text-cinema-muted leading-relaxed">
                Visualize monthly watch velocity, genre preferences, rating distributions, and generate yearly Filmfolio Wrapped summaries.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cinema-text mb-2">
                Cinephile Community
              </h3>
              <p className="text-sm text-cinema-muted leading-relaxed">
                Follow peers, exchange critical reviews, like thoughtful write-ups, and discover what other enthusiasts are archiving.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mb-5">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cinema-text mb-2">
                Prioritized Watchlist
              </h3>
              <p className="text-sm text-cinema-muted leading-relaxed">
                Rank your watch targets with Low, Medium, or High priorities. Seamlessly move watched films straight into your library.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
            How Filmfolio Works
          </h2>
          <p className="text-sm text-cinema-muted mt-3">
            Start archiving your cinema journey in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col items-center">
            <span className="w-10 h-10 rounded-full bg-gold text-obsidian font-bold flex items-center justify-center text-lg mb-4">
              1
            </span>
            <h3 className="font-serif text-lg font-bold text-cinema-text mb-2">
              Discover & Search
            </h3>
            <p className="text-sm text-cinema-muted leading-relaxed">
              Find films via our direct TMDB integration featuring official posters, backdrops, trailers, and cast credits.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col items-center">
            <span className="w-10 h-10 rounded-full bg-gold text-obsidian font-bold flex items-center justify-center text-lg mb-4">
              2
            </span>
            <h3 className="font-serif text-lg font-bold text-cinema-text mb-2">
              Rate, Log & Collect
            </h3>
            <p className="text-sm text-cinema-muted leading-relaxed">
              Log watch dates in your diary, score out of 10, write critical reviews, and curate customized collections.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col items-center">
            <span className="w-10 h-10 rounded-full bg-gold text-obsidian font-bold flex items-center justify-center text-lg mb-4">
              3
            </span>
            <h3 className="font-serif text-lg font-bold text-cinema-text mb-2">
              Analyze & Share
            </h3>
            <p className="text-sm text-cinema-muted leading-relaxed">
              Gain insight into your viewing habits through charts and share public reviews with the film community.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Cinema Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-obsidian-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cinema-text">
              Popular Masterworks
            </h2>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              Essential cinema celebrating storytelling at its peak.
            </p>
          </div>
          <Link
            href="/discover"
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gold hover:text-gold-secondary transition-colors"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {popularList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Pre-Footer Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-obsidian-secondary via-obsidian-card to-obsidian-secondary border border-gold/30 p-8 sm:p-14 text-center flex flex-col items-center shadow-gold">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cinema-text">
            Start Your Cinema Journal Today
          </h2>
          <p className="mt-4 text-sm sm:text-base text-cinema-muted max-w-xl">
            Join a sanctuary built for movie enthusiasts. Your private collection, watch history, and critiques in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-gold text-obsidian font-bold text-base hover:bg-gold-secondary transition-all shadow-gold hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-obsidian border border-obsidian-border text-cinema-text font-medium text-base hover:text-gold hover:border-gold transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
