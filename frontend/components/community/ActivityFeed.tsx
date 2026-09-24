"use client";

import React from "react";
import type { DateGroup, CommunityPost } from "@/lib/types/community";
import { ActivityCard } from "./ActivityCard";
import { FeedSkeleton } from "./FeedSkeleton";
import { EmptyFeedState } from "./EmptyFeedState";

interface ActivityFeedProps {
  groups: DateGroup[];
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  currentUserId?: string | null;
  onCommentClick: (postId: string) => void;
  onLoadMore: () => void;
  onShareClick: () => void;
}

export function ActivityFeed({
  groups,
  isLoading,
  hasMore,
  isLoadingMore,
  currentUserId,
  onCommentClick,
  onLoadMore,
  onShareClick,
}: ActivityFeedProps) {
  if (isLoading) return <FeedSkeleton />;
  if (groups.length === 0) return <EmptyFeedState onShareClick={onShareClick} />;

  return (
    <div className="flex flex-col gap-8 py-6">
      {groups.map((group) => (
        <section key={group.date} aria-labelledby={`date-${group.date}`}>
          {/* Date separator */}
          <div className="flex items-center gap-3 mb-4 px-4 sm:px-0">
            <span
              id={`date-${group.date}`}
              className="text-[11px] font-semibold uppercase tracking-widest text-[var(--ink-tertiary)]"
            >
              {group.label}
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[11px] text-[var(--ink-tertiary)]">
              {group.posts.length} post{group.posts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Post cards */}
          <div className="flex flex-col gap-4">
            {group.posts.map((post) => (
              <ActivityCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onCommentClick={onCommentClick}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-[13px] font-medium text-[var(--ink-secondary)] hover:bg-[var(--surface-subdued)] transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
