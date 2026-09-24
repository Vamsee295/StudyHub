"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Loader2, MessageCircle } from "lucide-react";
import type { PostComment, CommunityPost } from "@/lib/types/community";
import { communityApi } from "@/lib/api/community";
import { formatDistanceToNow } from "@/lib/utils";

interface CommentPanelProps {
  post: CommunityPost | null;
  currentUserId?: string | null;
  onClose: () => void;
}

export function CommentPanel({ post, currentUserId, onClose }: CommentPanelProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!post) return;
    setComments([]);
    setIsLoading(true);
    communityApi
      .getComments(post.id)
      .then(setComments)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [post?.id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (post) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [post, onClose]);

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !post || !currentUserId) return;
    setIsSubmitting(true);
    try {
      const created = await communityApi.createComment(post.id, { content: trimmed });
      setComments((prev) => [...prev, created]);
      setNewComment("");
    } catch (err: any) {
      console.error("Comment failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Comments"
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-[15px] font-semibold text-[var(--ink)]">
              Comments
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close comments"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Original post snippet */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-[13px] text-gray-600 line-clamp-2">{post.content}</p>
        </div>

        {/* Comments list */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[13px] text-[var(--ink-secondary)]">No comments yet. Be the first!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[var(--accent)]">
                      {(c.author?.full_name || "?").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                      <span className="text-[13px] font-semibold text-[var(--ink)]">
                        {c.author?.full_name || "Learner"}
                      </span>
                      <span className="text-[11px] text-[var(--ink-tertiary)]">
                        {formatDistanceToNow(new Date(c.created_at))}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed whitespace-pre-wrap break-words">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment input (only for authenticated users) */}
        {currentUserId ? (
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex gap-3 items-end">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment… (Ctrl+Enter to post)"
                rows={2}
                maxLength={1000}
                className="flex-1 resize-none px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent leading-relaxed"
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !newComment.trim()}
                aria-label="Post comment"
                className="p-2.5 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-center text-[13px] text-[var(--ink-secondary)]">
              Sign in to leave a comment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
