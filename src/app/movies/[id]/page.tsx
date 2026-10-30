import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { tmdbService } from "@/lib/tmdb/service";
import { getTMDBBackdropUrl, getTMDBPosterUrl, getTMDBProfileUrl } from "@/lib/tmdb/config";
import { formatRating, formatDate, formatYear, formatRuntime } from "@/lib/utils";
import { MovieActionsBar } from "@/components/movies/MovieActionsBar";
import { MovieCard } from "@/components/movies/MovieCard";
import { getMovieReviews } from "@/lib/actions/reviews";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import {
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Play,
  Heart,
  Users,
  ChevronLeft,
  Building,
} from "lucide-react";

interface MovieDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const movie = await tmdbService.getMovieDetails(params.id);

  if (!movie) {
    notFound();
  }

  const currentUser = filmfolioStore.getCurrentUser();
  const isFav = filmfolioStore.isFavorite(movie.id, currentUser.id);
  const reviews = await getMovieReviews(String(movie.id));

  const backdropUrl = getTMDBBackdropUrl(movie.backdrop_path, "original");
  const posterUrl = getTMDBPosterUrl(movie.poster_path, "lg");
  const trailerVideo = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar userRole={currentUser.role} username={currentUser.username} />

      {/* Cinematic Backdrop Hero */}
      <div className="relative w-full min-h-[60vh] lg:min-h-[75vh] flex items-end overflow-hidden border-b border-obsidian-border">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top opacity-35 brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cinema-muted hover:text-gold transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            {/* Poster Card */}
            <div className="relative w-40 sm:w-52 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shrink-0 shadow-gold border-2 border-obsidian-border bg-obsidian">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Title & Technical Specs */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="px-2.5 py-1 rounded-md bg-obsidian/80 backdrop-blur-md border border-obsidian-border text-xs text-cinema-text font-medium"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cinema-text leading-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="font-serif text-base sm:text-lg italic text-gold-secondary">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-cinema-muted pt-1">
                <div className="flex items-center gap-1.5 text-gold font-bold">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span>{formatRating(movie.vote_average)}</span>
                  <span className="text-xs text-cinema-subtle">
                    ({movie.vote_count ?? 0} votes)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>

                {movie.original_language && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-gold" />
                    <span className="uppercase">{movie.original_language}</span>
                  </div>
                )}
              </div>

              {/* Working Actions Bar */}
              <div className="pt-3">
                <MovieActionsBar movie={movie} initialIsFavorite={isFav} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left 2 Cols: Synopsis, Trailer, Cast */}
          <div className="lg:col-span-2 space-y-12">
            {/* Synopsis */}
            <section className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-cinema-text">
                Synopsis & Narrative
              </h2>
              <p className="text-base text-cinema-muted leading-relaxed">
                {movie.overview || "No synopsis available for this film presentation."}
              </p>
            </section>

            {/* Official Video Trailer */}
            {trailerVideo && (
              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-cinema-text flex items-center gap-2">
                  <Play className="w-5 h-5 text-gold" />
                  <span>Official Trailer</span>
                </h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-obsidian-border bg-obsidian-card shadow-cinematic">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerVideo.key}`}
                    title={trailerVideo.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </section>
            )}

            {/* Cast & Crew */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-cinema-text flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                <span>Cast & Key Crew</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {movie.credits?.cast?.slice(0, 8).map((actor) => (
                  <div
                    key={actor.id}
                    className="p-3 rounded-xl bg-obsidian-card border border-obsidian-border flex items-center gap-3"
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-obsidian-secondary border border-obsidian-border">
                      {actor.profile_path ? (
                        <Image
                          src={getTMDBProfileUrl(actor.profile_path, "md")}
                          alt={actor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-cinema-subtle">
                          {actor.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs text-cinema-text truncate">
                        {actor.name}
                      </p>
                      <p className="text-[10px] text-cinema-muted truncate">
                        {actor.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section for this film */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-cinema-text">
                  Community Critiques ({reviews.length})
                </h2>
              </div>

              {reviews.length === 0 ? (
                <div className="p-8 rounded-2xl bg-obsidian-card border border-obsidian-border text-center text-sm text-cinema-muted">
                  No public critiques posted yet for this film. Be the first to share your review!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-bold text-xs">
                            {r.user?.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-cinema-text">
                              {r.user?.full_name || r.user?.username}
                            </span>
                            <span className="text-[10px] text-cinema-subtle block">
                              @{r.user?.username} • {formatDate(r.created_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-obsidian-secondary border border-obsidian-border text-gold font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                          <span>{r.rating}/10</span>
                        </div>
                      </div>

                      <p className="text-sm text-cinema-muted leading-relaxed">
                        {r.review_text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Col: Technical Sidebar */}
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-5">
              <h3 className="font-serif text-lg font-bold text-cinema-text border-b border-obsidian-border pb-3">
                Production Details
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-cinema-muted block">Director</span>
                  <span className="text-cinema-text font-semibold text-sm">
                    {movie.director || "Not Specified"}
                  </span>
                </div>

                <div>
                  <span className="text-cinema-muted block">Original Title</span>
                  <span className="text-cinema-text font-medium">
                    {movie.original_title || movie.title}
                  </span>
                </div>

                <div>
                  <span className="text-cinema-muted block">Release Year</span>
                  <span className="text-cinema-text font-medium">
                    {formatYear(movie.release_date)}
                  </span>
                </div>

                <div>
                  <span className="text-cinema-muted block">Runtime</span>
                  <span className="text-cinema-text font-medium">
                    {formatRuntime(movie.runtime)} ({movie.runtime || "—"} mins)
                  </span>
                </div>

                <div>
                  <span className="text-cinema-muted block">TMDB Identifier</span>
                  <span className="text-gold font-mono">{movie.id}</span>
                </div>

                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div>
                    <span className="text-cinema-muted block mb-1">Production Companies</span>
                    <ul className="space-y-1">
                      {movie.production_companies.map((pc) => (
                        <li key={pc.id} className="text-cinema-text flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-cinema-subtle" />
                          <span>{pc.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {movie.recommendations && movie.recommendations.results.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-obsidian-border">
            <h2 className="font-serif text-2xl font-bold text-cinema-text">
              Recommended Films
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {movie.recommendations.results.slice(0, 6).map((rec) => (
                <MovieCard key={rec.id} movie={rec} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
