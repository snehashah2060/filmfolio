import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Film, ShieldCheck, Heart, Award, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-xs font-semibold text-gold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Philosophy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            About FILMFOLIO
          </h1>
          <p className="text-lg text-cinema-muted max-w-2xl mx-auto leading-relaxed">
            &ldquo;Your Cinema. Your Collection. Your Story.&rdquo;
          </p>
        </div>

        <div className="space-y-12 leading-relaxed text-cinema-muted text-base">
          <div className="p-8 rounded-2xl bg-obsidian-card border border-obsidian-border space-y-4">
            <h2 className="font-serif text-2xl font-bold text-cinema-text flex items-center gap-2.5">
              <Film className="w-6 h-6 text-gold" />
              <span>The Cinephile&apos;s Sanctuary</span>
            </h2>
            <p>
              Filmfolio was conceived out of a profound love for cinema as an art form. In an era dominated by ephemeral algorithmic feeds, we set out to build an intentional digital space—a true digital cinema journal—where every screening is recorded, catalogued, and analyzed with the respect it deserves.
            </p>
            <p>
              Whether you are an aspiring director cataloguing camera movements and lighting setups, a seasoned collector preserving a lifelong viewing archive, or an inquisitive explorer tracking international film movements, Filmfolio provides the tools and visual elegance to support your cinema journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border">
              <h3 className="font-serif text-lg font-bold text-cinema-text mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span>Private & Independent</span>
              </h3>
              <p className="text-sm">
                Every user maintains an isolated collection. Your private diary entries, unreleased draft reviews, and personal notes remain entirely your own.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-card border border-obsidian-border">
              <h3 className="font-serif text-lg font-bold text-cinema-text mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" />
                <span>Authentic Movie Data</span>
              </h3>
              <p className="text-sm">
                Powered directly by the official TMDB API. We never fabricate movie titles, cast listings, box office stats, or technical runtime specifications.
              </p>
            </div>
          </div>

          {/* TMDB Notice */}
          <div className="p-6 rounded-2xl bg-obsidian-secondary border border-gold/30 flex items-start gap-4">
            <Film className="w-6 h-6 text-gold shrink-0 mt-1" />
            <div className="space-y-1 text-sm">
              <h4 className="font-bold text-cinema-text">Attribution Notice</h4>
              <p className="text-cinema-muted">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
                Film data and images are provided by{" "}
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline hover:text-gold-secondary"
                >
                  The Movie Database (TMDB)
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
