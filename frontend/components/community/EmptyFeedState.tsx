"use client";

import React from "react";
import { BookOpen, Users } from "lucide-react";

interface EmptyFeedStateProps {
  onShareClick: () => void;
  isFollowingFilter?: boolean;
}

export function EmptyFeedState({ onShareClick, isFollowingFilter }: EmptyFeedStateProps) {
  return (
    <div className="flex flex-col items-start py-12 px-4 sm:px-0">
      <h3 className="text-[15px] font-semibold text-[#0f172a] mb-1">
        {isFollowingFilter ? "No activity from people you follow" : "No activity yet"}
      </h3>
      <p className="text-[14px] text-slate-500 mb-6">
        {isFollowingFilter
          ? "Discover more learners and start following their progress."
          : "Be the first to share what you're learning."}
      </p>

      <button
        onClick={onShareClick}
        className="inline-flex items-center justify-center gap-2 px-5 h-[38px] rounded-[8px] bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4ed8] transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        Share your progress
      </button>
    </div>
  );
}
