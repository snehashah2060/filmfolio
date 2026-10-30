"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Film,
  Bookmark,
  Calendar,
  Layers,
  BarChart3,
  Users,
  Sparkles,
  ShieldAlert,
  Search,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Settings,
  Scale,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

interface NavbarProps {
  userRole?: string;
  username?: string;
}

export function Navbar({ userRole = "ADMIN", username = "alex_cinema" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Library", href: "/library", icon: Film },
    { label: "Watchlist", href: "/watchlist", icon: Bookmark },
    { label: "Diary", href: "/diary", icon: Calendar },
    { label: "Collections", href: "/collections", icon: Layers },
    { label: "Compare", href: "/compare", icon: Scale },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Wrapped", href: "/wrapped", icon: Sparkles },
    { label: "Community", href: "/community", icon: Users },
  ];

  const isAdmin = userRole === "ADMIN";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md border-b",
        scrolled
          ? "bg-obsidian/95 border-obsidian-border shadow-cinematic"
          : "bg-obsidian/80 border-obsidian-border/50"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Logo size="md" href="/dashboard" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "text-gold font-semibold bg-obsidian-hover/60"
                        : "text-cinema-muted hover:text-cinema-text hover:bg-obsidian-hover/40"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Global Search Shortcut */}
            <Link
              href="/discover"
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-cinema-muted bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-gold" />
              <span>Search films...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-obsidian-secondary border border-obsidian-border rounded text-cinema-subtle">
                /
              </kbd>
            </Link>

            {/* Admin Badge/Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-gold text-obsidian border-gold font-semibold"
                    : "bg-gold/10 text-gold-secondary border-gold/30 hover:bg-gold/20"
                )}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Profile Menu */}
            <div className="flex items-center gap-3 pl-2 border-l border-obsidian-border">
              <Link
                href="/profile"
                className="flex items-center gap-2 group focus:outline-none"
                title={`Logged in as ${username}`}
              >
                <div className="w-8 h-8 rounded-full bg-obsidian-card border border-gold/40 flex items-center justify-center text-gold group-hover:border-gold transition-colors">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-cinema-text group-hover:text-gold transition-colors">
                  {username}
                </span>
              </Link>

              <Link
                href="/settings"
                className="p-1.5 text-cinema-muted hover:text-cinema-text hover:bg-obsidian-hover rounded-md transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="p-1.5 text-cinema-muted hover:text-cinema-red hover:bg-obsidian-hover rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/discover"
              className="p-2 text-cinema-muted hover:text-cinema-text"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-cinema-muted hover:text-cinema-text hover:bg-obsidian-card focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-secondary border-b border-obsidian-border px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                  isActive
                    ? "bg-obsidian-hover text-gold font-semibold"
                    : "text-cinema-muted hover:text-cinema-text hover:bg-obsidian-hover/50"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-obsidian-border space-y-2">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gold bg-gold/10 font-medium"
              >
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Admin Management</span>
              </Link>
            )}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-cinema-muted hover:text-cinema-text"
            >
              <UserIcon className="w-5 h-5 shrink-0" />
              <span>Profile ({username})</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-cinema-muted hover:text-cinema-text"
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span>Settings</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-cinema-red hover:bg-obsidian-hover/40"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
