"use client";

import React, { useState, useEffect } from "react";
import { filmfolioStore } from "@/lib/store/filmfolio-store";
import { ActivityLog } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Activity, Clock, ShieldCheck, Film } from "lucide-react";

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    setLogs(filmfolioStore.getActivityLogs(50));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-cinema-text">
          Platform Activity Logs
        </h2>
        <p className="text-xs text-cinema-muted mt-1">
          Audit trail of critical user actions, collection launches, and review submissions.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-obsidian-card border border-obsidian-border space-y-3 shadow-cinematic">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3.5 rounded-xl bg-obsidian-secondary border border-obsidian-border flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center text-xs font-bold border border-gold/30 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-xs text-cinema-muted">
                <strong className="text-cinema-text">@{log.user?.username}</strong>{" "}
                <span>
                  performed <span className="text-gold font-mono">{log.action}</span> on entity {log.entity_type}
                </span>
                {log.entity_details && (
                  <span className="text-cinema-subtle block text-[11px] mt-0.5">
                    {JSON.stringify(log.entity_details)}
                  </span>
                )}
              </div>
            </div>

            <span className="text-[10px] text-cinema-subtle shrink-0">
              {formatDate(log.created_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
