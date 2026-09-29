"use client";

import React from "react";
import Link from "next/link";
import { Users, BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import type { CommunityStats } from "@/lib/types/community";

interface StudyWithMeHeroProps {
  stats: CommunityStats | null;
  onShareClick: () => void;
}

export function StudyWithMeHero({ stats, onShareClick }: StudyWithMeHeroProps) {
  return (
    <div className="bg-[#FFFFFF] px-4 sm:px-8 pt-6 sm:pt-8 pb-[48px] border-b border-slate-200">
      <div className="max-w-[1050px] mx-auto flex flex-col items-center text-center">
        {/* Top bar with back button */}
        <div className="w-full flex items-center justify-start mb-6 sm:mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-[#2563eb] transition-colors py-1.5 px-3 -ml-3 rounded-lg hover:bg-slate-100/80 border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            <Sparkles className="w-3.5 h-3.5" />
            Study Together
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] font-[600] text-[#0f172a] leading-[1.08] mb-4">
          See what students are learning today.
        </h1>
        <p className="text-[16px] text-slate-500 max-w-[650px] leading-[1.6] mb-8">
          Discover what other learners are studying, solving, building, and
          sharing across StudyHub's placement-preparation ecosystem.
        </p>

        {/* CTA + Stats Row */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onShareClick}
            className="inline-flex items-center justify-center gap-2 px-6 h-[44px] rounded-[10px] bg-[#2563eb] text-white text-[14px] font-medium hover:bg-[#1d4ed8] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Share your progress
          </button>

          {stats && (
            <div className="flex items-center gap-1.5 text-[13px] text-slate-500 mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                <span className="font-semibold text-slate-700">
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
