"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Loader2, X } from "lucide-react";
import { communityApi } from "@/lib/api/community";
import type { CommunityPost } from "@/lib/types/community";
import { errorMessage } from "@/lib/utils";
import { KINDS, type PostKind } from "./BoardCard";
import { hashtags } from "./feedUtils";

const TOPICS = ["dsa", "java", "python", "sql", "oop", "dbms", "os", "aptitude", "system-design", "interview"];
const PLACEHOLDER: Record<PostKind, string> = {
  question: "e.g. How do I know when a problem needs DP?",
  discussion: "e.g. What's your revision routine before placements?",
  win: "e.g. Solved my first 100 problems",
  resource: "e.g. The clearest video on B+ trees I've found",
};

/** "Start a discussion" dialog: type, one-line title, optional details, topics. */
export function PostDialog({
  open,
  onClose,
  onPosted,
  signedIn,
}: {
  open: boolean;
  onClose: () => void;
  onPosted: (post: CommunityPost) => void;
  signedIn: boolean;
}) {
  const [kind, setKind] = useState<PostKind>("question");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => titleRef.current?.focus(), 30);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", esc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const canPost = signedIn && title.trim().length > 0 && !busy;
  const submit = async () => {
    if (!canPost) return;
    setBusy(true);
    setError(null);
    try {
      const content = details.trim() ? `${title.trim()}\n\n${details.trim()}` : title.trim();
      const tags = [...new Set([...topics, ...hashtags(details)])];
      const post = await communityApi.createPost({ content, post_type: kind, tags: tags.join(",") || undefined });
      onPosted(post);
      setTitle("");
      setDetails("");
      setTopics([]);
      onClose();
    } catch (e) {
      setError(errorMessage(e) || "Couldn't post. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="post-dialog-title" className="pop-in brut w-full max-w-[540px] rounded-2xl bg-card">
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            <h2 id="post-dialog-title" className="text-[18px] font-semibold">
              Start a discussion
            </h2>
            <p className="mt-1 text-[13.5px] text-body">Ask a question, share a win or a resource. Be kind; everyone here is preparing too.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-full text-mute hover:bg-ink/[0.06] hover:text-ink">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <fieldset>
            <legend className="mb-1.5 text-[13px] font-semibold">Type</legend>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  role="radio"
                  aria-checked={kind === k.id}
                  onClick={() => setKind(k.id)}
                  className={clsx(
                    "rounded-xl border-[1.5px] px-2 py-2 text-[13px] font-semibold transition-colors",
                    kind === k.id ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-ink/40"
                  )}
                >
                  {k.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[12.5px] text-mute">{KINDS.find((k) => k.id === kind)!.hint}</p>
          </fieldset>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Title</span>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
              onKeyDown={(e) => e.key === "Enter" && (e.ctrlKey || e.metaKey) && submit()}
              maxLength={140}
              placeholder={PLACEHOLDER[kind]}
              className="field w-full"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">
              Details <span className="font-normal text-mute">Optional</span>
            </span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.ctrlKey || e.metaKey) && submit()}
              maxLength={1800}
              rows={4}
              placeholder={kind === "question" ? "What have you tried? Where are you stuck?" : "Add context, links or what you learned."}
              className="field w-full resize-y"
            />
          </label>

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-semibold">
              Topics <span className="font-normal text-mute">Optional</span>
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={topics.includes(t)}
                  onClick={() => setTopics((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))}
                  className={clsx(
                    "rounded-md border px-2 py-0.5 font-mono text-[11.5px] uppercase tracking-wider transition-colors",
                    topics.includes(t) ? "border-ink bg-ink text-paper" : "border-hair text-mute hover:border-ink/40 hover:text-ink"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="text-[13px] text-danger">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t-[1.5px] border-hair px-5 py-3.5">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-[14px] font-semibold text-body hover:bg-ink/[0.06]">
            Cancel
          </button>
          {signedIn ? (
            <button
              type="button"
              onClick={submit}
              disabled={!canPost}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-[14px] font-semibold text-paper hover:bg-ink/85 disabled:opacity-40"
            >
              {busy && <Loader2 className="size-4 animate-spin" />} Post
            </button>
          ) : (
            <Link href="/login?redirect=/community" className="rounded-full bg-ink px-5 py-2 text-[14px] font-semibold text-paper hover:bg-ink/85">
              Sign in to post
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
