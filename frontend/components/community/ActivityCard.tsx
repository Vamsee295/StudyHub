"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, ExternalLink, UserPlus, Check } from "lucide-react";
import { clsx } from "clsx";
import type { CommunityPost, CommunityAuthor } from "@/lib/types/community";
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_EMOJI,
  activityLink,
  type ActivityType,
} from "@/lib/types/community";
import { communityApi } from "@/lib/api/community";
import { formatDistanceToNow } from "@/lib/utils";

interface ActivityCardProps {
  post: CommunityPost;
  currentUserId?: string | null;
  onCommentClick: (postId: string) => void;
  onPostUpdated?: (post: CommunityPost) => void;
}

function Avatar({ author }: { author?: CommunityAuthor | null }) {
  const name = author?.full_name || "?";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (author?.avatar_url) {
    return (
      <img
        src={author.avatar_url}
        alt={name}
        className="w-9 h-9 rounded-full object-cover border border-[var(--border)] shrink-0"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] flex items-center justify-center shrink-0">
      <span className="text-[12px] font-bold text-[var(--accent)]">{initials}</span>
    </div>
  );
}

function ActivityBadge({ type }: { type: ActivityType }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft-border)]">
      {ACTIVITY_TYPE_EMOJI[type]} {ACTIVITY_TYPE_LABELS[type]}
    </span>
  );
}

function TagList({ tags }: { tags?: string | null }) {
  if (!tags) return null;
  const list = tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5);
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {list.map((t) => (
        <span
          key={t}
          className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium border border-gray-200"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function ActivityCard({
  post,
  currentUserId,
  onCommentClick,
  onPostUpdated,
}: ActivityCardProps) {
  const [liked, setLiked] = useState(post.user_has_liked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [isLiking, setIsLiking] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(post.created_at));
  const activity = post.activity;
  const link = activity ? activityLink(activity) : null;

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;
    setIsLiking(true);
    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      const res = await communityApi.toggleLike(post.id);
      setLiked(res.liked);
      setLikeCount(res.like_count);
    } catch {
      // Rollback on error
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-shadow"
      aria-label={`Post by ${post.author?.full_name || "a learner"}`}
    >
      {/* Header: Avatar + Author + Time */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar author={post.author} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-semibold text-[var(--ink)] truncate">
                {post.author?.full_name || "StudyHub Learner"}
              </span>
            </div>
            {post.author?.university && (
              <p className="text-[11px] text-[var(--ink-tertiary)] truncate">
                {post.author.university}
              </p>
            )}
          </div>
        </div>
        <span className="text-[11px] text-[var(--ink-tertiary)] shrink-0 pt-0.5">
          {timeAgo}
        </span>
      </div>

      {/* Activity badge */}
      {activity && (
        <div className="mb-2">
          <ActivityBadge type={activity.activity_type as ActivityType} />
        </div>
      )}

      {/* Activity context line */}
      {activity && (
        <p className="text-[13px] font-medium text-[var(--ink)] mb-1">
          {activity.title}
        </p>
      )}

      {/* Post content */}
      <p className="text-[14px] text-[var(--ink-secondary)] leading-relaxed mb-3 whitespace-pre-wrap break-words">
        {post.content}
      </p>

      {/* Tags */}
      <TagList tags={post.tags} />

      {/* Action Bar */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={!currentUserId || isLiking}
            aria-label={liked ? "Unlike this post" : "Like this post"}
            className={clsx(
              "flex items-center gap-1.5 text-[13px] font-medium transition-all",
              liked
                ? "text-red-500"
                : "text-[var(--ink-secondary)] hover:text-red-400",
              !currentUserId && "opacity-50 cursor-default"
            )}
          >
            <Heart
              className={clsx("w-4 h-4 transition-transform", liked && "scale-110 fill-current")}
            />
            <span>{likeCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => onCommentClick(post.id)}
            aria-label="View comments"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comment_count}</span>
          </button>
        </div>

        {/* Deep link back into StudyHub */}
        {link && (
          <Link
            href={link}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:underline"
            aria-label="Open related StudyHub page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View in StudyHub
          </Link>
        )}
      </div>
    </article>
  );
}
