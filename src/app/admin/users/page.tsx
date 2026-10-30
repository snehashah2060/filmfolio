"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { toggleUserSuspensionAction } from "@/lib/actions/admin";
import { Profile } from "@/types/database";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  ShieldAlert,
  UserX,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUsers(filmfolioStore.getAllUsers());
  }, []);

  const handleToggleSuspension = async (userId: string, currentSuspended: boolean, username: string) => {
    const actionText = currentSuspended ? "reactivate" : "suspend";
    if (!confirm(`Are you sure you want to ${actionText} @${username}?`)) return;

    try {
      const res = await toggleUserSuspensionAction(userId, !currentSuspended);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_suspended: !currentSuspended } : u
          )
        );
        toast.success(
          !currentSuspended
            ? `Account @${username} has been suspended`
            : `Account @${username} has been reactivated`
        );
      } else {
        toast.error(res.error || "Failed to update suspension status");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(query) ||
      (u.full_name && u.full_name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-cinema-text">
            User Account Management
          </h2>
          <p className="text-xs text-cinema-muted mt-1">
            Search registered cinephiles, inspect permissions, and moderate active accounts.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or name..."
            className="w-full pl-9 pr-3 py-2 bg-obsidian-card border border-obsidian-border rounded-xl text-xs text-cinema-text focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-obsidian-card border border-obsidian-border shadow-cinematic overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-obsidian-border text-cinema-subtle uppercase tracking-wider">
              <th className="pb-3 font-semibold">User</th>
              <th className="pb-3 font-semibold">Assigned Role</th>
              <th className="pb-3 font-semibold">Joined Date</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-border/60">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-obsidian-secondary/50 transition-colors">
                <td className="py-3.5">
                  <div>
                    <span className="font-bold text-cinema-text block">
                      {u.full_name || u.username}
                    </span>
                    <span className="text-[10px] text-cinema-muted">@{u.username}</span>
                  </div>
                </td>
                <td className="py-3.5">
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
                <td className="py-3.5 text-cinema-muted">
                  {formatDate(u.created_at)}
                </td>
                <td className="py-3.5">
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
                <td className="py-3.5 text-right space-x-2">
                  <Link
                    href={`/community/users/${u.username}`}
                    className="text-xs text-cinema-muted hover:text-gold transition-colors font-medium"
                  >
                    Profile
                  </Link>

                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => handleToggleSuspension(u.id, u.is_suspended, u.username)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                        u.is_suspended
                          ? "bg-cinema-green/20 text-cinema-green hover:bg-cinema-green hover:text-obsidian"
                          : "bg-cinema-red/15 text-cinema-red hover:bg-cinema-red hover:text-white"
                      }`}
                    >
                      {u.is_suspended ? "Reactivate" : "Suspend Account"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
