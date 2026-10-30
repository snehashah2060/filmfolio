"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { Visibility } from "@/types/database";
import {
  Settings,
  ShieldCheck,
  Lock,
  Eye,
  Bell,
  Download,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const currentUser = filmfolioStore.getCurrentUser();
  const [visibility, setVisibility] = useState<Visibility>(currentUser.profile_visibility || "PUBLIC");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(true);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    toast.success("Security credentials updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filmfolioStore.updateProfile(currentUser.id, { profile_visibility: visibility });
    toast.success("Privacy preferences saved");
  };

  const handleAccountExport = () => {
    const data = {
      profile: currentUser,
      stats: filmfolioStore.getUserStats(currentUser.id),
      library: filmfolioStore.getUserMovies(currentUser.id),
      diary: filmfolioStore.getDiary(currentUser.id),
      favorites: filmfolioStore.getFavorites(currentUser.id),
      watchlist: filmfolioStore.getWatchlist(currentUser.id),
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `filmfolio_archive_${currentUser.username}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Personal archive JSON exported successfully");
  };

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar userRole={currentUser.role} username={currentUser.username} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="border-b border-obsidian-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold mb-2 border border-gold/30">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Security</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text">
            Account Settings
          </h1>
          <p className="text-sm text-cinema-muted mt-1">
            Manage your credentials, privacy boundaries, and data export archives.
          </p>
        </div>

        {/* Privacy Settings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-4 shadow-cinematic">
          <h2 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
            <Eye className="w-5 h-5 text-gold" />
            <span>Profile Visibility & Privacy</span>
          </h2>
          <p className="text-xs text-cinema-muted">
            Configure how your profile and reviews appear to other cinephiles.
          </p>

          <form onSubmit={handlePrivacySubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1">
                Profile Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="w-full sm:w-80 px-3 py-2 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text focus:outline-none focus:border-gold"
              >
                <option value="PUBLIC">Public (Profile & Approved Reviews Discoverable)</option>
                <option value="PRIVATE">Private (Completely hidden from community)</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary transition-all shadow-gold-sm"
            >
              Save Privacy Preferences
            </button>
          </form>
        </div>

        {/* Password Update */}
        <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-4 shadow-cinematic">
          <h2 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
            <Lock className="w-5 h-5 text-gold" />
            <span>Update Password</span>
          </h2>
          <p className="text-xs text-cinema-muted">
            Ensure your account is protected with a strong, distinct password.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2 max-w-md">
            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-cinema-muted mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-obsidian-secondary border border-obsidian-border rounded-xl text-sm text-cinema-text focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary transition-all shadow-gold-sm"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Notifications & Data Export */}
        <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-6 shadow-cinematic">
          <div>
            <h2 className="font-serif text-xl font-bold text-cinema-text flex items-center gap-2">
              <Download className="w-5 h-5 text-gold" />
              <span>Full Archive Data Export</span>
            </h2>
            <p className="text-xs text-cinema-muted mt-1">
              Download your complete personal cinema history, library, diary entries, and critiques in portable JSON format.
            </p>
          </div>

          <button
            onClick={handleAccountExport}
            className="px-5 py-2.5 rounded-xl bg-obsidian-secondary border border-obsidian-border text-cinema-text hover:text-gold hover:border-gold text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>Export Complete Filmfolio Data Archive (JSON)</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
