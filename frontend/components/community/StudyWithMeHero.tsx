"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import type { CommunityStats } from "@/lib/types/community";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";

interface StudyWithMeHeroProps {
  stats: CommunityStats | null;
  onShareClick: () => void;
}

export function StudyWithMeHero({ stats, onShareClick }: StudyWithMeHeroProps) {
  return (
    <div className="mx-auto max-w-[1050px] px-4 pb-8 pt-2 sm:px-8">
      <PageHeader eyebrow="Study with me" title="Learn" hl="together" note="see what everyone's working on today">
        <div className="flex flex-col items-start gap-2 md:items-end">
          <button onClick={onShareClick} className={buttonClass("accent")}>
            <BookOpen className="size-4" />
            Share your progress
          </button>
          {stats && (
            <span className="flex items-center gap-1.5 font-mono text-[12px] text-mute">
              <span className="size-2 rounded-full bg-note" aria-hidden />
              {stats.active_today.toLocaleString()} active today
            </span>
          )}
        </div>
      </PageHeader>
    </div>
  );
}
