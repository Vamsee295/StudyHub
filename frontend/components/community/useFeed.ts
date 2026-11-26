"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { communityApi } from "@/lib/api/community";
import type { CommunityPost, FeedFilter } from "@/lib/types/community";

const PAGE = 20;

/** One paginated list of board posts (the board, or one learner's posts). Reloads when the query changes. */
export function useFeed(
  query: { filter: FeedFilter; userId?: string; category?: string; sort: "new" | "top" },
  enabled: boolean,
  authKey: string
) {
  const { filter, userId, category, sort } = query;
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const key = [filter, userId, category, sort, authKey].join("|");
  const postsRef = useRef(posts);
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  useEffect(() => {
    if (!enabled) return;
    let live = true;
    communityApi
      .getFeed(filter, PAGE, 0, userId, { category, sort })
      .then((r) => {
        if (!live) return;
        setPosts(r.groups.flatMap((g) => g.posts));
        setHasMore(r.has_more);
        setError(false);
      })
      .catch(() => live && setError(true))
      .finally(() => live && setLoadedKey(key));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` covers every query input
  }, [key, enabled]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const r = await communityApi.getFeed(filter, PAGE, postsRef.current.length, userId, { category, sort });
      const seen = new Set(postsRef.current.map((p) => p.id));
      setPosts((prev) => [...prev, ...r.groups.flatMap((g) => g.posts).filter((p) => !seen.has(p.id))]);
      setHasMore(r.has_more);
    } catch {
      setError(true);
    } finally {
      setLoadingMore(false);
    }
  }, [filter, userId, category, sort, hasMore, loadingMore]);

  return { posts, setPosts, loading: loadedKey !== key, hasMore, loadingMore, loadMore, error };
}
