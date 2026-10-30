import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Film, Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian text-cinema-text flex flex-col justify-between">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-obsidian-card border border-gold/40 text-gold flex items-center justify-center mx-auto shadow-gold-sm">
          <Film className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest">
            ERROR 404
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">
            Scene Missing from Reel
          </h1>
          <p className="text-sm text-cinema-muted leading-relaxed">
            The frame or sequence you are searching for does not exist in our archive or has been cut in editing.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-gold text-obsidian font-bold text-xs rounded-xl hover:bg-gold-secondary transition-all shadow-gold-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/discover"
            className="px-5 py-2.5 bg-obsidian-card border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4 text-gold" />
            <span>Explore Discovery</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
