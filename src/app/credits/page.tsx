import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Film, ShieldCheck, ExternalLink, Code2, Heart } from "lucide-react";

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            Credits & Attribution
          </h1>
          <p className="text-sm sm:text-base text-cinema-muted max-w-xl mx-auto">
            Honoring the open technologies and cinema archives powering Filmfolio.
          </p>
        </div>

        <div className="space-y-8">
          {/* TMDB Official Attribution Section */}
          <div className="p-8 rounded-2xl bg-obsidian-card border border-gold/40 shadow-gold-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-cinema-text">
                  The Movie Database (TMDB)
                </h2>
                <p className="text-xs text-cinema-muted">Metadata, Posters & Cast Provider</p>
              </div>
            </div>

            <blockquote className="p-4 rounded-xl bg-obsidian-secondary border-l-4 border-gold text-sm italic text-cinema-text">
              &ldquo;This product uses the TMDB API but is not endorsed or certified by TMDB.&rdquo;
            </blockquote>

            <p className="text-sm text-cinema-muted leading-relaxed">
              Filmfolio relies on TMDB&apos;s API v3 for real movie metadata, international release dates, runtime information, high-resolution backdrops, poster assets, trailers, and cast credits.
            </p>

            <div className="pt-2">
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary transition-colors"
              >
                <span>Visit TheMovieDatabase.org</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Technology Credits */}
          <div className="p-8 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-obsidian-secondary text-cinema-text flex items-center justify-center border border-obsidian-border">
                <Code2 className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cinema-text">
                Architecture & Open Source Stack
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-obsidian-secondary border border-obsidian-border">
                <span className="font-semibold text-cinema-text block mb-1">Next.js 14 App Router</span>
                <p className="text-xs text-cinema-muted">React Server Components, server actions, route handlers, and streaming SSR.</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-secondary border border-obsidian-border">
                <span className="font-semibold text-cinema-text block mb-1">Supabase PostgreSQL</span>
                <p className="text-xs text-cinema-muted">Relational schema, Row Level Security (RLS) isolation, and auth session persistence.</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-secondary border border-obsidian-border">
                <span className="font-semibold text-cinema-text block mb-1">Tailwind CSS</span>
                <p className="text-xs text-cinema-muted">Obsidian & Champagne-Gold custom cinematic design system.</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-secondary border border-obsidian-border">
                <span className="font-semibold text-cinema-text block mb-1">Recharts</span>
                <p className="text-xs text-cinema-muted">Dynamic viewing habits, monthly volume, and genre preference visualizations.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
