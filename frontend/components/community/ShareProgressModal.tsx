"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, BookOpen, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import type { ActivityType, CreatePostPayload } from "@/lib/types/community";
import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_EMOJI } from "@/lib/types/community";
import { communityApi } from "@/lib/api/community";
import type { CommunityPost } from "@/lib/types/community";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

const ACTIVITY_TYPES: ActivityType[] = [
  "LEARNING_COMPLETED",
  "PROBLEM_SOLVED",
  "RESOURCE_SHARED",
  "PROJECT_SHARED",
  "COURSE_COMPLETED",
  "MILESTONE",
  "CUSTOM_POST",
];

const POPULAR_TAGS = [
  "java", "dsa", "python", "sql", "arrays", "oop",
  "aptitude", "system-design", "interview", "ml",
];

interface ShareProgressModalProps {
  open: boolean;
  onClose: () => void;
  onPostCreated: (post: CommunityPost) => void;
}

export function ShareProgressModal({ open, onClose, onPostCreated }: ShareProgressModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<ActivityType>("CUSTOM_POST");
  const [activityTitle, setActivityTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
      setContent("");
      setSelectedType("CUSTOM_POST");
      setActivityTitle("");
      setSelectedTags([]);
      setError(null);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("Please sign in to share your learning progress.");
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) { setError("Please write something to share."); return; }
    if (trimmed.length > 2000) { setError("Post must be under 2000 characters."); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreatePostPayload = {
        content: trimmed,
        tags: selectedTags.length ? selectedTags.join(",") : undefined,
        visibility: "public",
        activity_type: selectedType !== "CUSTOM_POST" ? selectedType : undefined,
        activity_title: selectedType !== "CUSTOM_POST" && activityTitle.trim() ? activityTitle.trim() : undefined,
      };

      const post = await communityApi.createPost(payload);
      onPostCreated(post);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Unable to publish your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const charCount = content.length;
  const charWarning = charCount > 1800;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Share your progress"
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-[15px] font-semibold text-[var(--ink)]">
              What did you learn today?
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
          {/* Activity type selector */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-secondary)] mb-2">
              Type
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={clsx(
                    "text-[12px] font-medium px-3 py-1 rounded-full border transition-all",
                    selectedType === type
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "border-gray-200 text-gray-600 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  )}
                >
                  {ACTIVITY_TYPE_EMOJI[type]} {ACTIVITY_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Activity title (shown if a structured type is chosen) */}
          {selectedType !== "CUSTOM_POST" && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-secondary)] mb-1.5">
                Topic / Problem / Title
              </label>
              <input
                type="text"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                placeholder={
                  selectedType === "PROBLEM_SOLVED"
                    ? "e.g. Two Sum"
                    : selectedType === "LEARNING_COMPLETED"
                    ? "e.g. Java → OOP → Inheritance"
                    : "Brief title…"
                }
                maxLength={200}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>
          )}

          {/* Content textarea */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-secondary)] mb-1.5">
              Your thoughts
            </label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what you learned, problems you solved, resources you found useful, or a milestone you reached…"
              rows={4}
              maxLength={2000}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none leading-relaxed"
            />
            <p className={clsx(
              "text-right text-[11px] mt-0.5",
              charWarning ? "text-orange-500 font-medium" : "text-gray-400"
            )}>
              {charCount}/2000
            </p>
          </div>

          {/* Tags */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-secondary)] mb-2">
              Tags (optional)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={clsx(
                    "text-[12px] font-medium px-2.5 py-0.5 rounded-md border transition-all",
                    selectedTags.includes(tag)
                      ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-soft-border)]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Guest notice if not authenticated */}
          {!user && (
            <div className="text-[13px] bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
              <span>You must be signed in to publish posts.</span>
              <Link href="/login" className="font-semibold underline hover:text-amber-950">
                Sign in →
              </Link>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isSubmitting ? "Posting…" : "Post Progress"}
          </button>
        </div>
      </div>
    </div>
  );
}
