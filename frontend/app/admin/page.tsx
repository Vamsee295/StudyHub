"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Ban, Check, Loader2, RotateCcw, Search, ShieldCheck, Trash2, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { errorMessage } from "@/lib/utils";
import type { CommunityPost } from "@/lib/types/community";
import {
  adminApi,
  isAdmin,
  type AdminUser,
  type AuditEntry,
  type BoardStats,
  type Overview,
  type Report,
  type ReportedContent,
} from "@/lib/admin";

const TABS = ["Overview", "Reports", "Posts", "Users", "Audit log"] as const;
type Tab = (typeof TABS)[number];
const when = (s: string | null) => (s ? new Date(s).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "never");

/** Moderation for admins. Everyone else sees the same "not found" as any unknown page. */
export default function AdminPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("Overview");

  if (loading) return null;
  if (!isAdmin(user)) {
    return (
      <div className="py-24 text-center">
        <p className="display text-[64px] leading-none">404</p>
        <p className="mt-3 text-body">This page could not be found.</p>
        <Link href="/dashboard" className={clsx(buttonClass("secondary", "sm"), "mt-6")}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow={`Signed in as ${user!.email}`} title="Admin" hl="desk" />
      <div role="tablist" aria-label="Admin sections" className="no-scrollbar -mt-2 mb-8 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={clsx(
              "label-cond h-9 shrink-0 rounded-full border-2 px-4 text-[15px]",
              tab === t ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Overview" && <OverviewTab onOpen={setTab} />}
      {tab === "Reports" && <ReportsTab adminId={user!.id} />}
      {tab === "Posts" && <PostsTab adminId={user!.id} />}
      {tab === "Users" && <UsersTab selfId={user!.id} />}
      {tab === "Audit log" && <AuditTab />}
    </>
  );
}

/** Loads once per mount (and on reload()), with loading and error states. */
function useLoad<T>(load: () => Promise<T>) {
  const [nonce, setNonce] = useState(0);
  // the result remembers which request it answers, so "busy" is derived rather than set in the effect
  const [res, setRes] = useState<{ load: () => Promise<T>; nonce: number; data?: T; error?: string } | null>(null);
  useEffect(() => {
    let live = true;
    load()
      .then((data) => live && setRes({ load, nonce, data }))
      .catch((e) => live && setRes({ load, nonce, error: errorMessage(e) }));
    return () => {
      live = false;
    };
  }, [load, nonce]);
  const busy = !res || res.load !== load || res.nonce !== nonce;
  return { data: res?.data, error: busy ? undefined : res?.error, busy, reload: () => setNonce((n) => n + 1) };
}

function Status({ busy, error, empty }: { busy: boolean; error?: string; empty?: string | false }) {
  if (busy) return <p className="flex items-center gap-2 text-[14px] text-mute"><Loader2 className="size-4 animate-spin" /> Loading…</p>;
  if (error) return <p className="rounded-xl border-[1.5px] border-danger-line bg-danger-soft p-3 text-[14px] text-danger">{error}</p>;
  if (empty) return <p className="rounded-xl border-[1.5px] border-dashed border-hair p-8 text-center text-[14px] text-mute">{empty}</p>;
  return null;
}

function Stat({ label, value, onClick }: { label: string; value: number | string; onClick?: () => void }) {
  const body = (
    <>
      <span className="block font-mono text-[11px] uppercase tracking-wider text-mute">{label}</span>
      <span className="display text-[34px] leading-none tabular-nums">{value}</span>
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className="rounded-2xl border-[1.5px] border-accent bg-card p-4 text-left hover:bg-accent/5">{body}</button>
  ) : (
    <div className="rounded-2xl border-[1.5px] border-hair bg-card p-4">{body}</div>
  );
}

function OverviewTab({ onOpen }: { onOpen: (t: Tab) => void }) {
  const accounts = useLoad<Overview>(adminApi.overview);
  const board = useLoad<BoardStats>(adminApi.boardStats);
  const a = accounts.data;
  const b = board.data;
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="label-cond mb-3 text-[20px]">Accounts</h2>
        <Status busy={accounts.busy} error={accounts.error} />
        {a && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Stat label="Accounts" value={a.users} />
            <Stat label="New this week" value={a.new_7d} />
            <Stat label="Signed in this week" value={a.active_7d} />
            <Stat label="Open reports" value={a.open_reports} onClick={a.open_reports ? () => onOpen("Reports") : undefined} />
            <Stat label="Suspended" value={a.suspended} />
            <Stat label="Admins" value={a.admins} />
          </div>
        )}
      </section>
      <section>
        <h2 className="label-cond mb-3 text-[20px]">Community board</h2>
        <Status busy={board.busy} error={board.error} />
        {b && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="Posts" value={b.posts} />
            <Stat label="Posts this week" value={b.posts_7d} />
            <Stat label="Replies" value={b.replies} />
            <Stat label="Learners with a profile" value={b.learners} />
            <Stat label="Active learners this week" value={b.active_learners_7d} />
          </div>
        )}
      </section>
    </div>
  );
}

function ReportsTab({ adminId }: { adminId: string }) {
  const [status, setStatus] = useState<Report["status"]>("open");
  const load = useCallback(() => adminApi.reports(status), [status]);
  const { data, busy, error, reload } = useLoad(load);
  // one card per reported item, with every reason people gave
  const groups = [...(data ?? []).reduce((m, r) => m.set(`${r.target_type}:${r.target_id}`, [...(m.get(`${r.target_type}:${r.target_id}`) ?? []), r]), new Map<string, Report[]>()).values()];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2" role="group" aria-label="Report status">
        {(["open", "resolved", "dismissed"] as const).map((s) => (
          <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}
            className={clsx("rounded-full border-[1.5px] px-3 py-1 text-[13px] font-medium capitalize", status === s ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line")}>
            {s}
          </button>
        ))}
      </div>
      <Status busy={busy} error={error} empty={!busy && !error && groups.length === 0 && `No ${status} reports.`} />
      {groups.map((rs) => (
        <ReportCard key={`${rs[0].target_type}:${rs[0].target_id}`} reports={rs} adminId={adminId} onDone={reload} />
      ))}
    </div>
  );
}

function ReportCard({ reports, adminId, onDone }: { reports: Report[]; adminId: string; onDone: () => void }) {
  const r = reports[0];
  const [item, setItem] = useState<ReportedContent | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    adminApi.content(r.target_type, r.target_id).then(setItem).catch((e) => setError(errorMessage(e)));
  }, [r.target_type, r.target_id]);

  const act = async (remove: boolean) => {
    setBusy(true);
    setError(null);
    try {
      if (remove && item?.exists) await (r.target_type === "post" ? adminApi.deletePost(r.target_id) : adminApi.deleteComment(r.target_id));
      await adminApi.closeReports(r, remove ? "resolved" : "dismissed", adminId);
      await adminApi.log(adminId, remove ? `delete_${r.target_type}` : "dismiss_report", r.target_id, {
        reports: reports.length,
        author: item?.author?.full_name,
        excerpt: item?.content?.slice(0, 120),
      });
      onDone();
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <article className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-card p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-mute">
        {r.target_type === "post" ? "Post" : "Reply"} · reported {reports.length}× · last {when(reports[reports.length - 1].created_at)}
      </p>
      {item === null && !error ? (
        <p className="text-[14px] text-mute">Loading the reported {r.target_type}…</p>
      ) : item && !item.exists ? (
        <p className="text-[14px] text-mute">Already deleted.</p>
      ) : item ? (
        <blockquote className="whitespace-pre-wrap rounded-xl bg-paper p-3 text-[14.5px] text-ink">
          {item.content}
          <footer className="mt-2 text-[12.5px] text-mute">
            by {item.author?.full_name} · {when(item.created_at ?? null)} ·{" "}
            <Link href={`/community?post=${item.post_id}`} className="underline" target="_blank">open on the board</Link>
          </footer>
        </blockquote>
      ) : null}
      <ul className="flex flex-col gap-1 text-[13.5px] text-body">
        {reports.map((x) => (
          <li key={x.id}>&ldquo;{x.reason}&rdquo;</li>
        ))}
      </ul>
      {error && <p className="text-[13px] text-danger">{error}</p>}
      {r.status === "open" && (
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => act(true)} className={buttonClass("primary", "sm")}>
            <Trash2 className="size-4" /> {item?.exists === false ? "Mark resolved" : `Delete ${r.target_type === "post" ? "post" : "reply"}`}
          </button>
          <button type="button" disabled={busy} onClick={() => act(false)} className={buttonClass("secondary", "sm")}>
            <X className="size-4" /> Dismiss
          </button>
        </div>
      )}
    </article>
  );
}

function PostsTab({ adminId }: { adminId: string }) {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const load = useCallback(() => adminApi.posts(query), [query]);
  const { data, busy, error, reload } = useLoad<CommunityPost[]>(load);
  const [err, setErr] = useState<string | null>(null);

  const remove = async (p: CommunityPost) => {
    if (!window.confirm(`Delete this post by ${p.author?.full_name ?? "a learner"}, with its replies? This can't be undone.`)) return;
    setErr(null);
    try {
      await adminApi.deletePost(p.id);
      await adminApi.log(adminId, "delete_post", p.id, { author: p.author?.full_name, excerpt: p.content.slice(0, 120) });
      reload();
    } catch (e) {
      setErr(errorMessage(e));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={(e) => { e.preventDefault(); setQuery(q); }} className="relative max-w-md">
        <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search post text, press Enter" className="field w-full pl-9" />
      </form>
      {err && <p className="text-[13px] text-danger">{err}</p>}
      <Status busy={busy} error={error} empty={!busy && !error && !data?.length && "No posts."} />
      <ul className="flex flex-col gap-3">
        {data?.map((p) => (
          <li key={p.id} className="flex items-start gap-3 rounded-2xl border-[1.5px] border-hair bg-card p-4">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-wider text-mute">
                {p.author?.full_name ?? "Unknown"} · {when(p.created_at)} · {p.like_count} likes · {p.comment_count} replies
              </p>
              <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-[14.5px]">{p.content}</p>
            </div>
            <button type="button" onClick={() => remove(p)} aria-label="Delete post" title="Delete post" className="rounded-lg p-2 text-mute hover:bg-danger-soft hover:text-danger">
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsersTab({ selfId }: { selfId: string }) {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const load = useCallback(() => adminApi.users(query), [query]);
  const { data, busy, error, reload } = useLoad<AdminUser[]>(load);
  const [err, setErr] = useState<string | null>(null);

  const toggle = async (u: AdminUser) => {
    const verb = u.suspended ? "Restore" : "Suspend";
    if (!window.confirm(`${verb} ${u.email}?${u.suspended ? "" : " They won't be able to sign in or post."}`)) return;
    setErr(null);
    try {
      await adminApi.setSuspended(u.id, !u.suspended); // logs to the audit log itself
      reload();
    } catch (e) {
      setErr(errorMessage(e));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={(e) => { e.preventDefault(); setQuery(q); }} className="relative max-w-md">
        <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by email, press Enter" className="field w-full pl-9" />
      </form>
      {err && <p className="text-[13px] text-danger">{err}</p>}
      <Status busy={busy} error={error} empty={!busy && !error && !data?.length && "No accounts match."} />
      {data && data.length > 0 && (
        <div className="overflow-x-auto [contain:inline-size]">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b-[1.5px] border-hair font-mono text-[11px] uppercase tracking-wider text-mute">
              <tr>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Joined</th>
                <th className="py-2 pr-4 font-medium">Last sign-in</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id} className="border-b-[1.5px] border-hair">
                  <td className="py-2.5 pr-4 font-medium">{u.email}</td>
                  <td className="py-2.5 pr-4 text-body">{when(u.created_at)}</td>
                  <td className="py-2.5 pr-4 text-body">{when(u.last_sign_in_at)}</td>
                  <td className="py-2.5 pr-4">
                    {u.is_admin ? (
                      <span className="inline-flex items-center gap-1 text-accent-ink"><ShieldCheck className="size-4" /> Admin</span>
                    ) : u.suspended ? (
                      <span className="inline-flex items-center gap-1 text-danger"><Ban className="size-4" /> Suspended</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-note"><Check className="size-4" /> Active</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    {!u.is_admin && u.id !== selfId && (
                      <button type="button" onClick={() => toggle(u)} className={buttonClass("secondary", "sm")}>
                        {u.suspended ? <><RotateCcw className="size-3.5" /> Restore</> : <><Ban className="size-3.5" /> Suspend</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AuditTab() {
  const { data, busy, error } = useLoad<AuditEntry[]>(adminApi.audit);
  return (
    <div className="flex flex-col gap-3">
      <Status busy={busy} error={error} empty={!busy && !error && !data?.length && "No admin actions yet."} />
      <ul className="border-t-[1.5px] border-hair">
        {data?.map((e) => (
          <li key={e.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-[1.5px] border-hair py-2.5 text-[14px]">
            <span className="font-mono text-[12px] text-mute">{when(e.created_at)}</span>
            <span className="font-semibold">{e.action.replace(/_/g, " ")}</span>
            <span className="text-body">{e.target}</span>
            {typeof e.details.excerpt === "string" && <span className="truncate text-[13px] text-mute">&ldquo;{e.details.excerpt}&rdquo;</span>}
            <span className="ml-auto text-[12.5px] text-mute">{e.admin_email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
