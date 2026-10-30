import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Film, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-obsidian-secondary border-t border-obsidian-border text-cinema-muted mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Logo size="md" />
            <p className="text-sm text-cinema-muted/80 max-w-sm leading-relaxed">
              Your Cinema. Your Collection. Your Story. An advanced cinematic journaling
              platform designed for cinephiles to record watch history, manage custom libraries, and discover film masterworks.
            </p>
            <div className="flex items-center gap-2 text-xs text-cinema-subtle">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-gold fill-gold/30" />
              <span>for cinema purists</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-cinema-text font-semibold">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/discover" className="hover:text-gold transition-colors">
                  Discover Films
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-gold transition-colors">
                  Personal Library
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-gold transition-colors">
                  Watchlist
                </Link>
              </li>
              <li>
                <Link href="/diary" className="hover:text-gold transition-colors">
                  Viewing Diary
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-gold transition-colors">
                  Cinephile Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Attribution */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-cinema-text font-semibold">
              Attribution & Info
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Filmfolio
                </Link>
              </li>
              <li>
                <Link href="/credits" className="hover:text-gold transition-colors">
                  Credits & TMDB API
                </Link>
              </li>
              <li>
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-1.5"
                >
                  <Film className="w-3.5 h-3.5 text-gold" />
                  <span>The Movie Database</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* TMDB Mandatory Notice Bar */}
        <div className="mt-10 pt-6 border-t border-obsidian-border/70 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cinema-subtle">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </span>
          </p>
          <p>
            &copy; {new Date().getFullYear()} FILMFOLIO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
