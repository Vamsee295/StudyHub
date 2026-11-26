"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowUp, Link2, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { communityApi } from "@/lib/api/community";
import { activityLink, ACTIVITY_TYPE_LABELS, type ActivityType, type CommunityPost } from "@/lib/types/community";
import { ago, fullDate, hashtags, postLink, splitHashtags } from "./feedUtils";

// ── Post types on the board ──
export type PostKind = "question" | "discussion" | "win" | "resource";
export const KINDS: { id: PostKind; label: string; plural: string; hint: string; chip: string }[] = [
  { id: "question", label: "Question", plural: "Questions", hint: "Stuck on something? Ask.", chip: "bg-accent-soft text-accent-ink" },
  { id: "discussion", label: "Discussion", plural: "Discussions", hint: "Start a conversation.", chip: "bg-card-2 text-body" },
  { id: "win", label: "Win", plural: "Wins", hint: "Share progress worth celebrating.", chip: "bg-success-soft text-note" },
  { id: "resource", label: "Resource", plural: "Resources", hint: "Recommend a guide, video or tool.", chip: "bg-warning-soft text-warning" },
];
/** Older posts stored "custom" (a discussion) or "activity" (a learning win). */
export const kindOf = (postType: string): PostKind =>
  postType === "custom" ? "discussion" : postType === "activity" ? "win" : ((KINDS.find((k) => k.id === postType)?.id ?? "discussion") as PostKind);

/** The first line of a post is its title on the board; the rest is the details. */
export function splitPost(post: CommunityPost): { title: string; body: string } {
  if (post.activity) {
    const body = post.content.trim() === post.activity.title.trim() ? "" : post.content;
    return { title: post.activity.title, body };
  }
  const [first, ...rest] = post.content.split("\n");
  return { title: first.trim(), body: rest.join("\n").trim() };
}

export interface BoardHandlers {
  signedIn: boolean;
  onOpen: (postId: string) => void;
  onUser: (userId: string) => void;
  onTag: (tag: string) => void;
  onChange: (post: CommunityPost) => void;
  onDelete: (postId: string) => void;
}

function Text({ text, onTag }: { text: string; onTag: (t: string) => void }) {
  return (
    <>
      {splitHashtags(text).map((part, i) =>
        part.tag ? (
          <button key={i} type="button" onClick={() => onTag(part.tag!)} className="font-medium text-accent-ink hover:underline">
            {part.text}
          </button>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

function Menu({ post, onDelete }: { post: CommunityPost; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  const copy = async () => {
    await navigator.clipboard?.writeText(postLink(post.id)).catch(() => {});
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 900);
  };
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="More options"
        aria-expanded={open}
        className="grid size-8 place-items-center rounded-full text-mute hover:bg-ink/[0.06] hover:text-ink"
      >
        <MoreHorizontal className="size-[18px]" />
      </button>
      {open && (
        <div role="menu" className="pop-in brut absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl bg-card py-1 text-[14px]">
          <button role="menuitem" type="button" onClick={copy} className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left hover:bg-card-2">
            <Link2 className="size-4" /> {copied ? "Link copied" : "Copy link"}
          </button>
          {post.is_mine && (
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                if (confirm("Delete this post? Its replies and votes go too. This can't be undone.")) onDelete();
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-danger hover:bg-card-2"
            >
              <Trash2 className="size-4" /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** One post on the board: vote box, type / topic / author line, title, preview, replies. `full` shows everything (thread view). */
export function BoardCard({ post, h, full = false }: { post: CommunityPost; h: BoardHandlers; full?: boolean }) {
  const kind = KINDS.find((k) => k.id === kindOf(post.post_type))!;
  const { title, body } = splitPost(post);
  const name = post.author?.full_name || "StudyHub Learner";
  const link = post.activity ? activityLink(post.activity) : null;
  const inText = new Set(hashtags(post.content));
  const tags = (post.tags || "").split(",").map((t) => t.trim()).filter(Boolean);

  const vote = async () => {
    if (!h.signedIn) return;
    const was = post.user_has_liked;
    h.onChange({ ...post, user_has_liked: !was, like_count: post.like_count + (was ? -1 : 1) });
    try {
      const r = await communityApi.toggleLike(post.id);
      h.onChange({ ...post, user_has_liked: r.liked, like_count: r.like_count });
    } catch {
      h.onChange(post);
    }
  };
  const remove = async () => {
    try {
      await communityApi.deletePost(post.id);
      h.onDelete(post.id);
    } catch {
      alert("Couldn't delete the post. Try again.");
    }
  };
  // clicking the card (not a button or link inside it) opens the discussion
  const open = (e: React.MouseEvent) => {
    if (full || (e.target as HTMLElement).closest("a,button,[role=menu]") || window.getSelection()?.toString()) return;
    h.onOpen(post.id);
  };

  return (
    <article
      onClick={open}
      aria-label={title}
      className={clsx(
        "flex gap-3.5 rounded-2xl border-[1.5px] border-hair bg-card p-4 md:gap-4 md:p-5",
        !full && "cursor-pointer transition-colors hover:border-ink/30"
      )}
    >
      {/* vote */}
      <button
        type="button"
        onClick={vote}
        disabled={!h.signedIn}
        aria-pressed={post.user_has_liked}
        aria-label={`${post.user_has_liked ? "Remove upvote" : "Upvote"} (${post.like_count})`}
        title={h.signedIn ? undefined : "Sign in to vote"}
        className={clsx(
          "flex h-14 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border-[1.5px] font-mono text-[12px] tabular-nums transition-colors disabled:cursor-default",
          post.user_has_liked ? "border-accent bg-accent text-paper" : "border-hair bg-paper-2/60 text-mute hover:border-ink/40 hover:text-ink"
        )}
      >
        <ArrowUp className="size-4" strokeWidth={2.4} />
        {post.like_count}
      </button>

      <div className="min-w-0 flex-1">
        {/* type · topics · age · author */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
          <span className={clsx("rounded-md px-1.5 py-0.5 font-semibold", kind.chip)}>{kind.label}</span>
          {post.activity && (
            <span className="rounded-md border border-hair px-1.5 py-0.5 text-mute">{ACTIVITY_TYPE_LABELS[post.activity.activity_type as ActivityType]}</span>
          )}
          {tags
            .filter((t) => full || !inText.has(t))
            .slice(0, 3)
            .map((t) => (
              <button key={t} type="button" onClick={() => h.onTag(t)} className="rounded-md border border-hair px-1.5 py-0.5 text-mute hover:border-ink/40 hover:text-ink">
                {t}
              </button>
            ))}
          <span className="normal-case tracking-normal text-mute">
            <time dateTime={post.created_at} title={fullDate(post.created_at)}>
              {ago(post.created_at)}
            </time>{" "}
            ·{" "}
            <button type="button" onClick={() => h.onUser(post.user_id)} className="hover:text-ink hover:underline">
              {name}
            </button>
          </span>
          <span className="ml-auto -my-1">
            <Menu post={post} onDelete={remove} />
          </span>
        </div>

        {/* title */}
        {full ? (
          <h2 className="mt-1.5 text-[21px] font-semibold leading-snug text-ink">{title}</h2>
        ) : (
          <h3 className="mt-1.5 text-[16px] font-semibold leading-snug text-ink">
            <a
              href={`?post=${post.id}`}
              onClick={(e) => {
                e.preventDefault();
                h.onOpen(post.id);
              }}
              className="hover:underline"
            >
              {title}
            </a>
          </h3>
        )}
        {link && (
          <Link href={link} className="mt-0.5 inline-block text-[13px] font-medium text-accent-ink hover:underline">
            Open in StudyHub →
          </Link>
        )}

        {body && (
          <p className={clsx("mt-1 whitespace-pre-wrap break-words text-body", full ? "text-[15.5px] leading-[1.6]" : "line-clamp-2 text-[14px] leading-[1.5]")}>
            <Text text={body} onTag={h.onTag} />
          </p>
        )}

        {!full && (
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-mute">
            <MessageCircle className="size-4" aria-hidden />
            {post.comment_count === 0 ? "No replies yet" : `${post.comment_count} ${post.comment_count === 1 ? "reply" : "replies"}`}
          </p>
        )}
      </div>
    </article>
  );
}
