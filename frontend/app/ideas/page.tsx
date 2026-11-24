"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/Page";
import { ChevronUp, Lightbulb, Loader2, Search, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/components/providers/AuthProvider";
import { ideasApi, Idea, IdeaCategory, IdeaFilter, IdeaList, IdeaStatus } from "@/lib/api/ideas";
import { errorMessage } from "@/lib/utils";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const PAGE = 20;

const STATUS: Record<IdeaStatus, { label: string; cls: string }> = {
  open: { label: "Open", cls: "bg-paper-2 text-body border-hair" },
  planned: { label: "Planned", cls: "bg-accent-soft text-accent-ink border-accent-line" },
  in_progress: { label: "In progress", cls: "bg-warning-soft text-warning border-warning/30" },
  shipped: { label: "Shipped", cls: "bg-success-soft text-note border-success-line" },
  declined: { label: "Declined", cls: "bg-paper-2 text-mute border-hair" },
};
const FILTERS: { id: IdeaFilter; label: string }[] = [
  { id: "active", label: "Active" }, { id: "open", label: "Open" }, { id: "planned", label: "Planned" },
  { id: "in_progress", label: "In progress" }, { id: "shipped", label: "Shipped" }, { id: "declined", label: "Declined" },
];
const CATEGORIES: { id: IdeaCategory; label: string }[] = [
  { id: "learn", label: "Learn" }, { id: "practice", label: "Practice" }, { id: "tools", label: "Tools" },
  { id: "community", label: "Community" }, { id: "other", label: "Other" },
];

function timeAgo(iso: string) {
  // Backend timestamps are UTC without a zone suffix.
  const t = new Date(iso.endsWith("Z") ? iso : iso + "Z").getTime();
  const d = Math.floor((Date.now() - t) / 86_400_000);
  if (d < 1) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d} days ago`;
  return new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function IdeasPage() {
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<IdeaFilter>("active");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [data, setData] = useState<IdeaList | null>(null);
  // `data` belongs to the filters in `dataKey`; while they differ from the current filters, a fetch is in flight.
  const [dataKey, setDataKey] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const key = `${filter}|${sort}|${debounced}`;
  const loading = loadingMore || dataKey !== key;
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => { const t = setTimeout(() => setDebounced(query), 300); return () => clearTimeout(t); }, [query]);

  const [reload, setReload] = useState(0);

  // First page for the current filters. Waits for auth so the list marks the user's own votes.
  useEffect(() => {
    if (authLoading) return;
    let live = true;
    const k = `${filter}|${sort}|${debounced}`;
    ideasApi
      .list({ status: filter, sort, q: debounced, limit: PAGE, offset: 0 })
      .then((res) => {
        if (!live) return;
        setData(res);
        setError(null);
      })
      .catch((e) => live && setError(errorMessage(e) || "Couldn't load ideas."))
      .finally(() => live && setDataKey(k));
    return () => {
      live = false; // a newer filter's response wins
    };
  }, [filter, sort, debounced, authLoading, reload]);

  const loadMore = async (offset: number) => {
    setLoadingMore(true);
    try {
      const res = await ideasApi.list({ status: filter, sort, q: debounced, limit: PAGE, offset });
      setData((prev) => (prev ? { ...res, items: [...prev.items, ...res.items] } : res));
    } catch (e) {
      setError(errorMessage(e) || "Couldn't load ideas.");
    } finally {
      setLoadingMore(false);
    }
  };

  const patchIdea = (id: string, patch: Partial<Idea>) =>
    setData((d) => d && { ...d, items: d.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

  const toggleVote = async (idea: Idea) => {
    if (!user) return;
    setBusy(idea.id);
    // Optimistic update, corrected by the server's count.
    patchIdea(idea.id, { has_voted: !idea.has_voted, vote_count: idea.vote_count + (idea.has_voted ? -1 : 1) });
    try {
      const r = idea.has_voted ? await ideasApi.unvote(idea.id) : await ideasApi.vote(idea.id);
      patchIdea(idea.id, r);
    } catch (e) {
      patchIdea(idea.id, { has_voted: idea.has_voted, vote_count: idea.vote_count });
      setError(errorMessage(e) || "Vote failed.");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (idea: Idea) => {
    if (!window.confirm(`Delete "${idea.title}"? This can't be undone.`)) return;
    try {
      await ideasApi.remove(idea.id);
      setData((d) => d && { ...d, items: d.items.filter((i) => i.id !== idea.id), total: d.total - 1 });
    } catch (e) {
      setError(errorMessage(e) || "Delete failed.");
    }
  };

  const changeStatus = async (idea: Idea, status: IdeaStatus) => {
    const note = window.prompt(`Optional note to show with "${STATUS[status].label}":`, idea.status_note ?? "") ?? undefined;
    try {
      const updated = await ideasApi.setStatus(idea.id, status, note || undefined);
      patchIdea(idea.id, { status: updated.status, status_note: updated.status_note });
    } catch (e) {
      setError(errorMessage(e) || "Status change failed.");
    }
  };

  const counts = data?.counts ?? {};
  const countFor = (f: IdeaFilter) =>
    f === "active" ? (counts.open ?? 0) + (counts.planned ?? 0) + (counts.in_progress ?? 0) : f === "all" ? undefined : counts[f] ?? 0;

  return (
    <div className="flex w-full max-w-[900px] flex-col gap-8">
      <PageHeader eyebrow="Ideas board" title="What should we" hl="build?" note="suggest it, upvote it, watch it ship" />

      {user ? <NewIdeaForm onCreated={() => { setFilter("active"); setSort("new"); setReload((r) => r + 1); }} /> : !authLoading && (
        <p className="p-4 rounded-xl border border-dashed border-hair text-[14px] text-body">
          <Link href="/login?redirect=/ideas" className={`text-accent-ink font-semibold underline rounded ${focusRing}`}>Sign in</Link> to post ideas and vote.
        </p>
      )}

      <section aria-label="Ideas" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button key={f.id} role="tab" aria-selected={filter === f.id} type="button" onClick={() => setFilter(f.id)}
                className={clsx("px-3 py-1.5 rounded-full text-[13px] border transition-colors", focusRing,
                  filter === f.id ? "bg-accent-soft border-accent-line text-accent-ink font-semibold" : "border-hair text-body hover:text-ink")}>
                {f.label} <span className="tabular-nums opacity-70">{countFor(f.id)}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <label className="relative">
              <span className="sr-only">Search ideas</span>
              <Search aria-hidden="true" className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-mute" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" maxLength={100}
                className={`pl-8 pr-3 py-1.5 rounded-lg border border-hair bg-card text-[13px] w-40 ${focusRing}`} />
            </label>
            <label className="text-[13px]">
              <span className="sr-only">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as "top" | "new")} className={`px-2 py-1.5 rounded-lg border border-hair bg-card ${focusRing}`}>
                <option value="top">Most votes</option>
                <option value="new">Newest</option>
              </select>
            </label>
          </div>
        </div>

        {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}

        {data && data.items.length === 0 && !loading && (
          <p className="p-8 text-center rounded-xl border border-dashed border-hair text-[14px] text-body">
            {debounced ? `No ideas match “${debounced}”.` : "No ideas here yet."} {user && filter !== "shipped" && filter !== "declined" ? "Be the first to suggest one." : ""}
          </p>
        )}

        <ul className="flex flex-col gap-3">
          {data?.items.map((idea) => (
            <li key={idea.id} className="flex gap-4 p-4 rounded-xl border border-hair bg-card">
              <button type="button" onClick={() => toggleVote(idea)} disabled={!user || busy === idea.id}
                aria-pressed={idea.has_voted} aria-label={`${idea.has_voted ? "Remove your vote from" : "Upvote"} ${idea.title}. ${idea.vote_count} votes`}
                title={user ? undefined : "Sign in to vote"}
                className={clsx("shrink-0 w-14 h-16 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-colors", focusRing,
                  idea.has_voted ? "bg-accent-soft border-accent-line text-accent-ink" : "border-hair text-body hover:border-accent",
                  !user && "cursor-not-allowed opacity-70")}>
                <ChevronUp aria-hidden="true" className="w-5 h-5" />
                <span className="text-[14px] font-bold tabular-nums">{idea.vote_count}</span>
              </button>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[15px] font-semibold text-ink">{idea.title}</h2>
                  <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${STATUS[idea.status].cls}`}>{STATUS[idea.status].label}</span>
                </div>
                {idea.description && <p className="text-[13.5px] text-body whitespace-pre-line">{idea.description}</p>}
                {idea.status_note && (
                  <p className="text-[13px] text-ink border-l-2 border-accent pl-2"><span className="font-semibold">Team note:</span> {idea.status_note}</p>
                )}
                <p className="text-[12px] text-mute flex flex-wrap items-center gap-x-2">
                  <span className="capitalize">{idea.category}</span><span aria-hidden="true">·</span>
                  <span>{idea.author_name}</span><span aria-hidden="true">·</span><span>{timeAgo(idea.created_at)}</span>
                  {data.is_admin && (
                    <label className="ml-auto inline-flex items-center gap-1">
                      <span className="sr-only">Change status</span>
                      <select value={idea.status} onChange={(e) => changeStatus(idea, e.target.value as IdeaStatus)}
                        className={`px-1.5 py-0.5 rounded border border-hair bg-card text-[12px] ${focusRing}`}>
                        {(Object.keys(STATUS) as IdeaStatus[]).map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                      </select>
                    </label>
                  )}
                  {(data.is_admin || (idea.is_mine && idea.status === "open")) && (
                    <button type="button" onClick={() => remove(idea)} aria-label={`Delete ${idea.title}`}
                      className={`${data.is_admin ? "" : "ml-auto"} p-1 rounded text-mute hover:text-danger ${focusRing}`}>
                      <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {loading && <p className="flex items-center gap-2 text-[13px] text-body"><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" /> Loading ideas…</p>}
        {data && !loading && data.items.length < data.total && (
          <button type="button" onClick={() => loadMore(data.items.length)}
            className={`self-center px-4 py-2 rounded-lg border border-hair text-[13px] font-semibold text-ink hover:border-accent ${focusRing}`}>
            Show more ({data.total - data.items.length} left)
          </button>
        )}
      </section>
    </div>
  );
}

function NewIdeaForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IdeaCategory>("learn");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleOk = title.trim().length >= 8 && title.trim().length <= 120;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleOk) return;
    setSaving(true);
    setError(null);
    try {
      await ideasApi.create({ title: title.trim(), description: description.trim() || undefined, category });
      setTitle(""); setDescription(""); setOpen(false);
      onCreated();
    } catch (err) {
      setError(errorMessage(err) || "Couldn't post your idea.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className={`self-start inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-paper text-[14px] font-semibold hover:bg-accent-ink ${focusRing}`}>
        <Lightbulb aria-hidden="true" className="w-4 h-4" /> Suggest an idea
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="p-5 rounded-xl border border-hair bg-card flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-[13px]">
        <span className="flex justify-between font-semibold text-ink">Title <span className="font-normal text-mute tabular-nums">{title.trim().length}/120</span></span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} autoFocus required
          placeholder="e.g. Add practice questions for operating systems" aria-describedby="title-help"
          className={`px-3 py-2 rounded-lg border border-hair bg-card text-[14px] ${focusRing}`} />
        <span id="title-help" className="text-[12px] text-mute">At least 8 characters. Check the board first: upvoting an existing idea counts more than a duplicate.</span>
      </label>
      <label className="flex flex-col gap-1.5 text-[13px]">
        <span className="font-semibold text-ink">Details <span className="font-normal text-mute">(optional)</span></span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3}
          placeholder="What problem would this solve for you?"
          className={`px-3 py-2 rounded-lg border border-hair bg-card text-[14px] resize-y ${focusRing}`} />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] max-w-[200px]">
        <span className="font-semibold text-ink">Area</span>
        <select value={category} onChange={(e) => setCategory(e.target.value as IdeaCategory)} className={`px-3 py-2 rounded-lg border border-hair bg-card ${focusRing}`}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </label>
      {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={!titleOk || saving}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-paper text-[14px] font-semibold hover:bg-accent-ink disabled:opacity-50 ${focusRing}`}>
          {saving && <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />} Post idea
        </button>
        <button type="button" onClick={() => setOpen(false)} className={`px-4 py-2 rounded-lg text-[14px] text-body hover:text-ink ${focusRing}`}>Cancel</button>
      </div>
    </form>
  );
}
