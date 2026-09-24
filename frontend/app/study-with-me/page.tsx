"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { StudyWithMeHero } from "@/components/community/StudyWithMeHero";
import { ActivityFilterBar } from "@/components/community/ActivityFilterBar";
import { ActivityFeed } from "@/components/community/ActivityFeed";
import { ShareProgressModal } from "@/components/community/ShareProgressModal";
import { CommentPanel } from "@/components/community/CommentPanel";
import { TrendingSidebar } from "@/components/community/TrendingSidebar";
import { communityApi } from "@/lib/api/community";
import type {
  FeedResponse,
  FeedFilter,
  DateGroup,
  CommunityPost,
  CommunityStats,
} from "@/lib/types/community";
import { useAuth } from "@/components/providers/AuthProvider";

const LIMIT = 20;

/** Merge new date groups into the existing ones (for pagination) */
function mergeGroups(existing: DateGroup[], incoming: DateGroup[]): DateGroup[] {
  const map = new Map<string, DateGroup>(existing.map((g) => [g.date, g]));
  for (const group of incoming) {
    if (map.has(group.date)) {
      const ex = map.get(group.date)!;
      // Deduplicate by post id
      const existingIds = new Set(ex.posts.map((p) => p.id));
      const newPosts = group.posts.filter((p) => !existingIds.has(p.id));
      map.set(group.date, { ...ex, posts: [...ex.posts, ...newPosts] });
    } else {
      map.set(group.date, group);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
}

export default function StudyWithMePage() {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("all");
  const [groups, setGroups] = useState<DateGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { user } = useAuth();

  // Sync current user id from auth context
  useEffect(() => {
    setCurrentUserId(user?.id ?? null);
  }, [user]);

  // Fetch stats once
  useEffect(() => {
    communityApi.getStats().then(setStats).catch(() => {});
  }, []);

  // Load feed when filter changes (reset pagination)
  const loadFeed = useCallback(
    async (filter: FeedFilter, offset = 0, append = false) => {
      if (offset === 0) setIsLoading(true);
      else setIsLoadingMore(true);
      try {
        const data: FeedResponse = await communityApi.getFeed(filter, LIMIT, offset);
        if (append) {
          setGroups((prev) => mergeGroups(prev, data.groups));
        } else {
          setGroups(data.groups);
        }
        setHasMore(data.has_more);
        setNextOffset(data.next_offset ?? offset + LIMIT);
      } catch {
        if (!append) setGroups([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    loadFeed(activeFilter, 0, false);
  }, [activeFilter, loadFeed]);

  const handleFilterChange = (filter: FeedFilter) => {
    setActiveFilter(filter);
  };

  const handleLoadMore = () => {
    loadFeed(activeFilter, nextOffset, true);
  };

  const handlePostCreated = (newPost: CommunityPost) => {
    const dateStr = newPost.created_at.substring(0, 10);
    setGroups((prev) => {
      const existingIdx = prev.findIndex((g) => g.date === dateStr);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          posts: [newPost, ...updated[existingIdx].posts],
        };
        return updated;
      }
      // New date group at the top
      return [{ label: "TODAY", date: dateStr, posts: [newPost] }, ...prev];
    });
    // Increment stats
    setStats((prev) =>
      prev
        ? { ...prev, active_today: prev.active_today + 1, total_posts: prev.total_posts + 1 }
        : prev
    );
  };

  const activeCommentPost = groups
    .flatMap((g) => g.posts)
    .find((p) => p.id === commentPostId) ?? null;

  return (
    <>
      {/* SEO */}
      <title>Study With Me — StudyHub</title>
      <meta
        name="description"
        content="See what students are learning, solving, and building today on StudyHub's community learning feed."
      />

      <div className="min-h-screen bg-[var(--bg)]">
        {/* Hero */}
        <StudyWithMeHero stats={stats} onShareClick={() => setShareOpen(true)} />

        {/* Filter bar */}
        <ActivityFilterBar active={activeFilter} onChange={handleFilterChange} />

        {/* Main layout: feed + sidebar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Feed */}
          <ActivityFeed
            groups={groups}
            isLoading={isLoading}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            currentUserId={currentUserId}
            onCommentClick={(id) => setCommentPostId(id)}
            onLoadMore={handleLoadMore}
            onShareClick={() => setShareOpen(true)}
          />

          {/* Sidebar — hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <TrendingSidebar stats={stats} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShareProgressModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <CommentPanel
        post={activeCommentPost}
        currentUserId={currentUserId}
        onClose={() => setCommentPostId(null)}
      />
    </>
  );
}
