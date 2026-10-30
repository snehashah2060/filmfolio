import React from "react";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/actions/admin";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  MessageSquare,
  Activity,
  LayoutDashboard,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar userRole="ADMIN" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation Header Bar */}
        <div className="p-6 rounded-3xl bg-obsidian-card border border-gold/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-cinematic">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-cinema-text">
                Platform Administration
              </h1>
              <p className="text-xs text-cinema-muted">
                Authorized command desk for user moderation, content reviews, and system oversight.
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-obsidian-secondary border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 flex items-center gap-1.5 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-gold" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-obsidian-secondary border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-gold" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/reviews"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-obsidian-secondary border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-gold" />
              <span>Reviews</span>
            </Link>
            <Link
              href="/admin/activity"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-obsidian-secondary border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold/50 flex items-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-gold" />
              <span>Activity</span>
            </Link>
          </nav>
        </div>

        {children}
      </div>

      <Footer />
    </div>
  );
}
