"use client";

import React from "react";
import type { CommunityStats } from "@/lib/types/community";

interface TrendingSidebarProps {
  stats: CommunityStats | null;
}

export function TrendingSidebar({ stats }: TrendingSidebarProps) {
  if (!stats) return null;

  return (
    <aside className="flex flex-col gap-10">
      {/* Quick stats */}
      <div className="flex flex-col">
        <h3 className="text-[12px] uppercase tracking-[0.12em] font-semibold text-mute mb-4">
          Today’s Activity
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[28px] font-semibold text-ink">
              {stats.active_today}
            </p>
            <p className="text-[13px] text-mute mt-1">Active learners</p>
          </div>
          <div>
            <p className="text-[28px] font-semibold text-ink">
              {stats.total_posts}
            </p>
            <p className="text-[13px] text-mute mt-1">Total posts</p>
          </div>
        </div>
      </div>

      {/* Trending tags */}
      {stats.trending_tags.length > 0 && (
        <div className="flex flex-col">
          <h3 className="text-[12px] uppercase tracking-[0.12em] font-semibold text-mute mb-4">
            Trending
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.trending_tags.map((tag) => (
              <span
                key={tag}
                className="text-[13px] font-medium text-body hover:text-ink cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Learning tip */}
      <div className="bg-accent-soft/50 rounded-[10px] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent-ink mb-2">
          Tip
        </p>
        <p className="text-[14px] text-body leading-relaxed">
          Share what you learn daily — even small wins compound over time. The
          best placement performers are consistent, not perfect.
        </p>
      </div>
    </aside>
  );
}
