"use client";

import React from "react";
import { BookOpen, Users } from "lucide-react";

interface EmptyFeedStateProps {
  onShareClick: () => void;
  isFollowingFilter?: boolean;
}

export function EmptyFeedState({ onShareClick, isFollowingFilter }: EmptyFeedStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] flex items-center justify-center mb-5">
        {isFollowingFilter ? (
          <Users className="w-7 h-7 text-[var(--accent)]" />
        ) : (
          <BookOpen className="w-7 h-7 text-[var(--accent)]" />
        )}
      </div>

      <h3 className="text-[17px] font-semibold text-[var(--ink)] mb-2">
        {isFollowingFilter ? "No activity from people you follow yet." : "No activity yet."}
      </h3>
      <p className="text-[14px] text-[var(--ink-secondary)] max-w-xs leading-relaxed mb-7">
        {isFollowingFilter
          ? "Discover more learners and start following their progress."
          : "Be the first person to share what you're learning today."}
      </p>

      <button
        onClick={onShareClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
      >
        <BookOpen className="w-4 h-4" />
        Share your progress
      </button>
    </div>
  );
}
