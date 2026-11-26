"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { ArrowLeft, CalendarCheck, Loader2, Plus, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";
import { communityApi } from "@/lib/api/community";
import type { CommunityPost, CommunityStats, UserSummary } from "@/lib/types/community";
import { BoardCard, KINDS, kindOf, type BoardHandlers, type PostKind } from "@/components/community/BoardCard";
import { PostDialog } from "@/components/community/PostDialog";
import { PostThread } from "@/components/community/PostThread";
import { DailyLogs } from "@/components/community/DailyLogs";
import { useFeed } from "@/components/community/useFeed";

// ── What's on screen lives in the URL: Back works, and discussions / profiles / tags can be linked ──
interface View {
  sort: "top" | "new";
  kind?: PostKind;
  tag?: string;
  user?: string;
  post?: string;
  logs?: boolean;
}
function readView(q: URLSearchParams): View {
  const kind = KINDS.find((k) => k.id === q.get("type"))?.id;
  return {
    sort: q.get("sort") === "new" ? "new" : "top",
    kind,
    tag: q.get("tag") ?? undefined,
    user: q.get("user") ?? undefined,
    post: q.get("post") ?? undefined,
    logs: q.get("tab") === "logs" || q.get("view") === "logs",
  };
}
function viewUrl(v: View) {
  const q = new URLSearchParams();
  if (v.sort === "new") q.set("sort", "new");
  if (v.kind) q.set("type", v.kind);
  if (v.tag) q.set("tag", v.tag);
  if (v.user) q.set("user", v.user);
  if (v.post) q.set("post", v.post);
  if (v.logs) q.set("tab", "logs");
  const s = q.toString();
  return s ? `?${s}` : window.location.pathname;
}

// Page memory that isn't rendered: where the board was scrolled (so closing a discussion lands you back on
// the same card) and whether we've navigated inside this page (so Back can use the browser's history).
const nav = { scrollY: 0, inPage: false };
function noteNavigation(leavingBoard: boolean) {
  if (leavingBoard) nav.scrollY = window.scrollY;
  nav.inPage = true;
}

function PostList({
  posts,
  loading,
  error,
  hasMore,
  loadingMore,
  loadMore,
  h,
  empty,
}: {
  posts: CommunityPost[];
  loading: boolean;
  error: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  h: BoardHandlers;
  empty: React.ReactNode;
}) {
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && loadMore(), { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore, posts.length]);

  if (loading)
    return (
      <ul aria-busy="true" aria-label="Loading posts" className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex animate-pulse gap-4 rounded-2xl border-[1.5px] border-hair bg-card p-5">
            <span className="h-14 w-11 shrink-0 rounded-xl bg-hair" />
            <span className="flex flex-1 flex-col gap-2.5 pt-1">
              <span className="h-3 w-40 rounded bg-hair" />
              <span className="h-4 w-3/4 rounded bg-hair" />
              <span className="h-3 w-full rounded bg-hair" />
            </span>
          </li>
        ))}
      </ul>
    );
  if (error && posts.length === 0)
    return <p className="rounded-2xl border-[1.5px] border-dashed border-hair px-5 py-14 text-center text-[15px] text-body">Couldn&apos;t load posts. Check your connection and try again.</p>;
  if (posts.length === 0) return <div className="rounded-2xl border-[1.5px] border-dashed border-hair px-5 py-14 text-center">{empty}</div>;
  return (
    <>
      <ul className="flex flex-col gap-3">
        {posts.map((p) => (
          <li key={p.id}>
            <BoardCard post={p} h={h} />
          </li>
        ))}
      </ul>
      <div ref={sentinel} />
      {loadingMore && (
        <p className="flex items-center justify-center gap-2 py-6 text-[14px] text-mute">
          <Loader2 className="size-4 animate-spin" /> Loading more…
        </p>
      )}
    </>
  );
}

function BackBar({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-body hover:text-ink">
      <ArrowLeft className="size-4" /> {label}
    </button>
  );
}

function LearnerHeader({ userId }: { userId: string }) {
  const [s, setS] = useState<UserSummary | null>(null);
  useEffect(() => {
    let live = true;
    communityApi.getUser(userId).then((x) => live && setS(x)).catch(() => {});
    return () => {
      live = false;
    };
  }, [userId]);
  if (!s) return <div className="mb-5 h-16" />;
  return (
    <div className="mb-5 flex items-center gap-4">
      <Avatar src={s.author.avatar_url} name={s.author.full_name} className="size-14 text-[18px]" />
      <div className="min-w-0">
        <h2 className="display text-[28px] leading-none">{s.author.full_name}</h2>
        <p className="mt-1 text-[13.5px] text-mute">
          {s.author.university ? `${s.author.university} · ` : ""}
          {s.post_count} {s.post_count === 1 ? "post" : "posts"}
        </p>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense>
      <Community />
    </Suspense>
  );
}

function Community() {
  const { user, loading: authLoading } = useAuth();
  const { draftProfile } = useProfile();
  const signedIn = !!user;
  const me = {
    id: user?.id ?? null,
    name: draftProfile.identity?.fullName || user?.email?.split("@")[0] || "You",
    avatar: draftProfile.identity?.avatarUrl,
  };

  const router = useRouter();
  const view = readView(useSearchParams());
  const go = (next: View) => {
    noteNavigation(!view.post && !view.user && !view.logs);
    router.push(viewUrl(next), { scroll: false });
  };
  const back = () => (nav.inPage ? router.back() : go({ sort: "top" }));
  const overlay = view.post || view.user || view.logs;
  useEffect(() => {
    if (!overlay) requestAnimationFrame(() => window.scrollTo({ top: nav.scrollY }));
    else window.scrollTo({ top: 0 });
  }, [overlay]);

  const authKey = authLoading ? "pending" : (user?.id ?? "anon");
  const board = useFeed({ filter: view.tag ? `tag:${view.tag}` : "all", category: view.kind, sort: view.sort }, !authLoading, authKey);
  const learner = useFeed({ filter: "all", userId: view.user, sort: "new" }, !authLoading && !!view.user, authKey);

  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [statsKey, setStatsKey] = useState(0);
  useEffect(() => {
    communityApi.getStats().then(setStats).catch(() => {});
  }, [statsKey]);
  const [composing, setComposing] = useState(false);

  // a change to a post (vote, reply count) shows everywhere it appears
  const patch = (fn: (p: CommunityPost) => CommunityPost) => {
    board.setPosts((l) => l.map(fn));
    learner.setPosts((l) => l.map(fn));
  };
  const h: BoardHandlers = {
    signedIn,
    onOpen: (id) => go({ ...view, post: id }),
    onUser: (id) => go({ sort: "new", user: id }),
    onTag: (tag) => go({ sort: view.sort, tag }),
    onChange: (post) => patch((p) => (p.id === post.id ? post : p)),
    onDelete: (id) => {
      board.setPosts((l) => l.filter((p) => p.id !== id));
      learner.setPosts((l) => l.filter((p) => p.id !== id));
      setStatsKey((k) => k + 1);
    },
  };
  const posted = (post: CommunityPost) => {
    // show it right away when it belongs in the list being looked at
    if (!view.tag && (!view.kind || view.kind === kindOf(post.post_type))) board.setPosts((l) => [post, ...l]);
    setStatsKey((k) => k + 1);
  };

  const counts = stats?.category_counts ?? {};
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const threadPost = view.post ? [...board.posts, ...learner.posts].find((p) => p.id === view.post) : undefined;

  return (
    <div className="mx-auto max-w-[780px]">
      {view.post ? (
        <>
          <div className="overflow-clip rounded-2xl border-[1.5px] border-hair bg-card">
            <PostThread key={view.post} postId={view.post} initial={threadPost} h={h} me={me} onBack={back} />
          </div>
        </>
      ) : view.user ? (
        <>
          <BackBar label="Back to the board" onBack={back} />
          <LearnerHeader key={view.user} userId={view.user} />
          <PostList {...learner} h={h} empty={<p className="text-[15px] text-body">No posts yet.</p>} />
        </>
      ) : view.logs ? (
        <>
          <BackBar label="Back to the board" onBack={back} />
          <header className="mb-5">
            <p className="eyebrow">Community</p>
            <h1 className="display mt-1 text-[38px] leading-none">Daily study logs</h1>
            <p className="mt-2 text-[15px] text-body">What everyone studied, day by day. Yours fills in from the lessons you complete.</p>
          </header>
          <DailyLogs />
        </>
      ) : null}

      {/* the board stays mounted under a discussion or profile, so going back keeps your place */}
      <div className={clsx(overlay && "hidden")}>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Community</p>
            <h1 className="display mt-1 text-[40px] leading-none md:text-[48px]">Discussions</h1>
            <p className="mt-2 max-w-[52ch] text-[15px] text-body">Ask questions, share wins and resources, and vote up what helps other students preparing for placements.</p>
          </div>
          <button type="button" onClick={() => go({ ...view, logs: true })} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-ink hover:underline">
            <CalendarCheck className="size-4" /> Daily study logs
          </button>
        </header>

        {/* sort · type filters · post */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex rounded-full border-[1.5px] border-hair bg-card p-0.5" role="group" aria-label="Sort">
            {(["top", "new"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={view.sort === s}
                onClick={() => go({ ...view, sort: s })}
                className={clsx("rounded-full px-3.5 py-1 text-[13.5px] font-semibold capitalize transition-colors", view.sort === s ? "bg-ink text-paper" : "text-body hover:text-ink")}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="no-scrollbar -mx-1 flex flex-1 gap-1 overflow-x-auto px-1" role="group" aria-label="Type">
            {[{ id: undefined, plural: "All", n: total }, ...KINDS.map((k) => ({ id: k.id, plural: k.plural, n: counts[k.id] ?? 0 }))].map((k) => (
              <button
                key={k.plural}
                type="button"
                aria-pressed={view.kind === k.id}
                onClick={() => go({ sort: view.sort, kind: k.id, tag: view.tag })}
                className={clsx(
                  "flex shrink-0 items-baseline gap-1.5 rounded-full px-3 py-1 text-[13.5px] font-semibold transition-colors",
                  view.kind === k.id ? "bg-ink/[0.07] text-ink" : "text-mute hover:text-ink"
                )}
              >
                {k.plural}
                {stats && <span className="font-mono text-[11.5px] font-normal tabular-nums">{k.n}</span>}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="brut brut-hover no-press inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[14px] font-semibold text-paper max-sm:w-full max-sm:justify-center"
          >
            <Plus className="size-4" /> Start a discussion
          </button>
        </div>

        {view.tag && (
          <p className="mb-4 flex items-center gap-2 text-[14px] text-body">
            Showing posts tagged
            <span className="inline-flex items-center gap-1 rounded-full bg-ink py-0.5 pl-2.5 pr-1 font-mono text-[12px] uppercase tracking-wider text-paper">
              {view.tag}
              <button type="button" onClick={() => go({ sort: view.sort, kind: view.kind })} aria-label={`Stop filtering by ${view.tag}`} className="grid size-5 place-items-center rounded-full hover:bg-paper/20">
                <X className="size-3.5" />
              </button>
            </span>
          </p>
        )}

        <PostList
          {...board}
          h={h}
          empty={
            <div className="flex flex-col items-center gap-3">
              <p className="text-[15px] text-body">
                {view.tag ? `Nothing tagged ${view.tag} yet.` : view.kind ? `No ${KINDS.find((k) => k.id === view.kind)!.plural.toLowerCase()} yet.` : "No posts yet."}
              </p>
              <button type="button" onClick={() => setComposing(true)} className="text-[14px] font-semibold text-accent-ink hover:underline">
                Start the first one
              </button>
            </div>
          }
        />
      </div>

      <PostDialog open={composing} onClose={() => setComposing(false)} onPosted={posted} signedIn={signedIn} />
    </div>
  );
}
