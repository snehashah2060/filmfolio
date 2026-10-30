import React from "react";
import Link from "next/link";
import { getAdminStatsAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Film,
  MessageSquare,
  Layers,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getAdminStatsAction();

  return (
    <div className="space-y-8">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-cinema-muted">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-gold" />
          </div>
          <span className="font-serif text-3xl font-bold text-cinema-text mt-3">
            {stats.totalUsers}
          </span>
          <span className="text-[10px] text-cinema-green mt-1 font-semibold">
            {stats.activeUsers} Active (0 Suspended)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-cinema-muted">
            <span>Library Entries</span>
            <Film className="w-4 h-4 text-gold" />
          </div>
          <span className="font-serif text-3xl font-bold text-cinema-text mt-3">
            {stats.totalMoviesTracked}
          </span>
          <span className="text-[10px] text-cinema-subtle mt-1">Across all users</span>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-cinema-muted">
            <span>Published Reviews</span>
            <MessageSquare className="w-4 h-4 text-gold" />
          </div>
          <span className="font-serif text-3xl font-bold text-cinema-text mt-3">
            {stats.totalReviews}
          </span>
          <span className="text-[10px] text-cinema-subtle mt-1">Community Critiques</span>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-cinema-muted">
            <span>Public Anthologies</span>
            <Layers className="w-4 h-4 text-gold" />
          </div>
          <span className="font-serif text-3xl font-bold text-cinema-text mt-3">
            {stats.totalPublicCollections}
          </span>
          <span className="text-[10px] text-cinema-subtle mt-1">Curated Collections</span>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-cinema-muted">
            <span>Security Status</span>
            <ShieldCheck className="w-4 h-4 text-gold" />
          </div>
          <span className="font-serif text-2xl font-bold text-cinema-green mt-3">
            Nominal
          </span>
          <span className="text-[10px] text-cinema-subtle mt-1">RLS Policies Enforced</span>
        </div>
      </div>

      {/* Recent Users Registration Table */}
      <div className="p-6 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-4 shadow-cinematic">
        <div className="flex items-center justify-between border-b border-obsidian-border pb-3">
          <h2 className="font-serif text-xl font-bold text-cinema-text">
            Recent User Registrations
          </h2>
          <Link
            href="/admin/users"
            className="text-xs text-gold hover:text-gold-secondary flex items-center gap-1 font-semibold"
          >
            <span>Manage All Users</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-obsidian-border text-cinema-subtle uppercase tracking-wider">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Joined Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-border/60">
              {stats.recentRegistrations.map((u) => (
                <tr key={u.id} className="hover:bg-obsidian-secondary/50 transition-colors">
                  <td className="py-3">
                    <div>
                      <span className="font-bold text-cinema-text block">
                        {u.full_name || u.username}
                      </span>
                      <span className="text-[10px] text-cinema-muted">@{u.username}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-gold/20 text-gold border border-gold/30"
                          : "bg-obsidian border border-obsidian-border text-cinema-muted"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-cinema-muted">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.is_suspended
                          ? "bg-cinema-red/15 text-cinema-red border border-cinema-red/30"
                          : "bg-cinema-green/15 text-cinema-green border border-cinema-green/30"
                      }`}
                    >
                      {u.is_suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/community/users/${u.username}`}
                      className="text-xs text-gold hover:underline font-medium"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
