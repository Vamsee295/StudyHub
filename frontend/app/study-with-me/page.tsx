"use client";

import React, { useState, useEffect } from "react";
import { StudyWithMeHero } from "@/components/community/StudyWithMeHero";
import { ActivityFilterBar } from "@/components/community/ActivityFilterBar";
import { ActivityFeed } from "@/components/community/ActivityFeed";
import { ShareProgressModal } from "@/components/community/ShareProgressModal";
import { CommentPanel } from "@/components/community/CommentPanel";
import { TrendingSidebar } from "@/components/community/TrendingSidebar";
import { DailyLogs } from "@/components/community/DailyLogs";
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
  // `groups` belong to `loadedFilter`; while it differs from the active filter, the first page is loading.
  const [loadedFilter, setLoadedFilter] = useState<FeedFilter | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  // ?view=logs opens the daily logs directly (shareable link). Pages render client-side only, so window is there.
  const [view, setView] = useState<"feed" | "logs">(() =>
    new URLSearchParams(window.location.search).get("view") === "logs" ? "logs" : "feed"
  );
  const switchView = (v: "feed" | "logs") => {
    setView(v);
    window.history.replaceState(null, "", v === "logs" ? "?view=logs" : window.location.pathname);
  };

  const { user } = useAuth();
  const currentUserId = user?.id ?? null;

  // Fetch stats once
  useEffect(() => {
    communityApi.getStats().then(setStats).catch(() => {});
  }, []);

  const isLoading = loadedFilter !== activeFilter;

  // First page whenever the filter changes (pagination resets)
  useEffect(() => {
    let live = true;
    communityApi
      .getFeed(activeFilter, LIMIT, 0)
      .then((data: FeedResponse) => {
        if (!live) return;
        setGroups(data.groups);
        setHasMore(data.has_more);
        setNextOffset(data.next_offset ?? LIMIT);
      })
      .catch(() => live && setGroups([]))
      .finally(() => live && setLoadedFilter(activeFilter));
    return () => {
      live = false;
    };
  }, [activeFilter]);

  const handleFilterChange = (filter: FeedFilter) => {
    setActiveFilter(filter);
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const data: FeedResponse = await communityApi.getFeed(activeFilter, LIMIT, nextOffset);
      setGroups((prev) => mergeGroups(prev, data.groups));
      setHasMore(data.has_more);
      setNextOffset(data.next_offset ?? nextOffset + LIMIT);
    } catch {
      // keep what's shown; the button stays for a retry
    } finally {
      setIsLoadingMore(false);
    }
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

      <div className="min-h-screen bg-paper">
        {/* Hero */}
        <StudyWithMeHero stats={stats} onShareClick={() => setShareOpen(true)} />

        {/* View switch: activity feed or daily logs */}
        <div className="max-w-[1050px] mx-auto px-4 sm:px-8 pt-4">
          <div role="tablist" aria-label="Study With Me views" className="inline-flex p-1 rounded-lg border-[1.5px] border-hair bg-card">
            {([["feed", "Activity feed"], ["logs", "Daily logs"]] as const).map(([id, label]) => (
              <button key={id} role="tab" type="button" aria-selected={view === id} onClick={() => switchView(id)}
                className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${view === id ? "bg-accent text-paper" : "text-body hover:text-ink"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === "logs" ? (
          <div className="max-w-[760px] mx-auto px-4 sm:px-8 py-6">
            <DailyLogs />
          </div>
        ) : (
        <>
        {/* Filter bar */}
        <ActivityFilterBar active={activeFilter} onChange={handleFilterChange} />

        {/* Main layout: feed + sidebar */}
        <div className="max-w-[1050px] mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
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
        </>
        )}
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
