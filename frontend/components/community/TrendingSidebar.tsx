"use client";

import React from "react";
import type { CommunityStats } from "@/lib/types/community";
import { TrendingUp, Activity } from "lucide-react";

interface TrendingSidebarProps {
  stats: CommunityStats | null;
}

export function TrendingSidebar({ stats }: TrendingSidebarProps) {
  if (!stats) return null;

  return (
    <aside className="flex flex-col gap-5">
      {/* Quick stats */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[var(--accent)]" />
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">Today's Activity</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--surface-subdued)] rounded-xl p-3 text-center">
            <p className="text-[22px] font-bold text-[var(--accent)]">
              {stats.active_today}
            </p>
            <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">Active learners</p>
          </div>
          <div className="bg-[var(--surface-subdued)] rounded-xl p-3 text-center">
            <p className="text-[22px] font-bold text-[var(--accent)]">
              {stats.total_posts}
            </p>
            <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">Total posts</p>
          </div>
        </div>
      </div>

      {/* Trending tags */}
      {stats.trending_tags.length > 0 && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-[13px] font-semibold text-[var(--ink)]">Trending Today</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.trending_tags.map((tag) => (
              <span
                key={tag}
                className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft-border)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Learning tip */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-blue-500 mb-2">
          Tip
        </p>
        <p className="text-[13px] text-blue-900 leading-relaxed">
          Share what you learn daily — even small wins compound over time. The
          best placement performers are consistent, not perfect.
        </p>
      </div>
    </aside>
  );
}
