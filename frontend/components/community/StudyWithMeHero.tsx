"use client";

import React from "react";
import { Users, BookOpen, Sparkles } from "lucide-react";
import type { CommunityStats } from "@/lib/types/community";

interface StudyWithMeHeroProps {
  stats: CommunityStats | null;
  onShareClick: () => void;
}

export function StudyWithMeHero({ stats, onShareClick }: StudyWithMeHeroProps) {
  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-8 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1 rounded-full border border-[var(--accent-soft-border)]">
            <Sparkles className="w-3 h-3" />
            Study Together
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] leading-tight mb-3">
          See what students are learning today.
        </h1>
        <p className="text-[15px] text-[var(--ink-secondary)] max-w-xl leading-relaxed mb-8">
          Discover what other learners are studying, solving, building, and
          sharing across StudyHub's placement-preparation ecosystem.
        </p>

        {/* CTA + Stats Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={onShareClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            Share your progress
          </button>

          {stats && (
            <div className="flex items-center gap-1.5 text-[13px] text-[var(--ink-secondary)]">
              <Users className="w-4 h-4 text-[var(--accent)]" />
              <span>
                <span className="font-semibold text-[var(--ink)]">
                  {stats.active_today.toLocaleString()}
                </span>{" "}
                learners active today
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
