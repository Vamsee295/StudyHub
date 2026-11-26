"use client";

import { Avatar } from "@/components/ui/Avatar";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Clock, Globe, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { localDate, LogDay, LogDraft, StudyLog, studyLogsApi } from "@/lib/api/studyLogs";
import { errorMessage } from "@/lib/utils";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const shift = (iso: string, days: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  return localDate(new Date(y, m - 1, d + days));
};
const pretty = (iso: string) => {
  const today = localDate();
  if (iso === today) return "Today";
  if (iso === shift(today, -1)) return "Yesterday";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};
const mins = (n: number) => (n >= 60 ? `${Math.floor(n / 60)}h ${n % 60 ? `${n % 60}m` : ""}`.trim() : `${n}m`);

/** Group a log's lessons by subject for compact display. */
function bySubject(log: { lessons: StudyLog["lessons"] }) {
  const map = new Map<string, { title: string; slug: string; lessons: StudyLog["lessons"] }>();
  for (const l of log.lessons) {
    if (!map.has(l.subject_slug)) map.set(l.subject_slug, { title: l.subject_title, slug: l.subject_slug, lessons: [] });
    map.get(l.subject_slug)!.lessons.push(l);
  }
  return [...map.values()];
}

function LessonList({ lessons }: { lessons: StudyLog["lessons"] }) {
  return (
    <ul className="flex flex-col gap-2">
      {bySubject({ lessons }).map((g) => (
        <li key={g.slug} className="text-[13px]">
          <span className="font-semibold text-ink">{g.title}</span>
          <span className="text-mute"> · {g.lessons.length} lesson{g.lessons.length === 1 ? "" : "s"}</span>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {g.lessons.map((l) => (
              <li key={l.topic_slug}>
                <Link href={`/learn/${l.subject_slug}/${l.topic_slug}`} className={`inline-block px-2 py-0.5 rounded-md border-[1.5px] border-hair bg-paper-2/50 text-[12px] text-body hover:text-accent-ink hover:border-accent ${focusRing}`}>
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/** The signed-in learner's private draft for a day, with publish / update / unpublish. */
function MyLog({ date, onChange }: { date: string; onChange: () => void }) {
  const [draft, setDraft] = useState<LogDraft | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [version, setVersion] = useState(0); // bumped after publish / unpublish to re-read the draft
  useEffect(() => {
    let live = true;
    studyLogsApi
      .draft(date)
      .then((d) => {
        if (!live) return;
        setDraft(d);
        setNote(d.published?.note ?? "");
        setError(null);
      })
      .catch((e) => live && setError(errorMessage(e) || "Couldn't load your log."));
    return () => {
      live = false;
    };
  }, [date, version]);

  const publishable = date === localDate() || date === shift(localDate(), -1);
  const canPublish = !!draft && (draft.lessons.length > 0 || note.trim().length > 0);

  const publish = async () => {
    setBusy(true); setError(null);
    try { await studyLogsApi.publish(date, note); setVersion((v) => v + 1); onChange(); }
    catch (e) { setError(errorMessage(e) || "Couldn't publish."); }
    finally { setBusy(false); }
  };
  const unpublish = async () => {
    setBusy(true); setError(null);
    try { await studyLogsApi.unpublish(date); setVersion((v) => v + 1); onChange(); }
    catch (e) { setError(errorMessage(e) || "Couldn't unpublish."); }
    finally { setBusy(false); }
  };

  if (!publishable) return null;
  const published = draft?.published;
  // A published log is a snapshot; flag when new lessons were completed since.
  const stale = !!published && !!draft && draft.lessons.length !== published.lesson_count;

  return (
    <section aria-labelledby="my-log" className="p-5 rounded-xl border border-accent-line bg-accent-soft/20 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="my-log" className="text-[14px] font-bold text-ink">Your log for {pretty(date).toLowerCase()}</h2>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${published ? "bg-success-soft text-note border-success-line" : "bg-card text-mute border-hair"}`}>
          {published ? <><Globe aria-hidden="true" className="w-3 h-3" /> Public</> : <><Lock aria-hidden="true" className="w-3 h-3" /> Private draft</>}
        </span>
      </div>

      {!draft && !error && <p className="flex items-center gap-2 text-[13px] text-body"><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" /> Loading…</p>}

      {draft && (
        <>
          {draft.lessons.length ? (
            <div className="flex flex-col gap-2">
              <p className="text-[12.5px] text-body tabular-nums">
                Filled in from your lesson completions: {draft.lessons.length} lesson{draft.lessons.length === 1 ? "" : "s"}, about {mins(draft.minutes)}.
              </p>
              <LessonList lessons={draft.lessons} />
            </div>
          ) : (
            <p className="text-[13px] text-body">
              No lessons completed {date === localDate() ? "yet today" : "that day"}. Lessons you mark complete appear here automatically, or publish a note on its own.
            </p>
          )}
          <label className="flex flex-col gap-1.5 text-[13px]">
            <span className="font-semibold text-ink">Note <span className="font-normal text-mute">(optional, public when published)</span></span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={2}
              placeholder="What clicked, what was hard, what's next…"
              className={`px-3 py-2 rounded-lg border-[1.5px] border-hair bg-card text-[14px] resize-y ${focusRing}`} />
          </label>
          {stale && <p className="text-[12.5px] text-warning">You’ve completed more lessons since publishing. Update to include them.</p>}
          {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={publish} disabled={busy || !canPublish}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-paper text-[13px] font-semibold hover:bg-accent-ink disabled:opacity-50 ${focusRing}`}>
              {busy && <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />} {published ? "Update public log" : "Publish to Community"}
            </button>
            {published && (
              <button type="button" onClick={unpublish} disabled={busy}
                className={`px-4 py-2 rounded-lg border-[1.5px] border-hair text-[13px] font-semibold text-body hover:text-ink disabled:opacity-50 ${focusRing}`}>
                Unpublish
              </button>
            )}
            <span className="text-[12px] text-mute">Only published logs are visible to others. You can unpublish any time.</span>
          </div>
        </>
      )}
    </section>
  );
}

function LogCard({ log }: { log: StudyLog }) {
  return (
    <li className="p-4 rounded-xl border-[1.5px] border-hair bg-card flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar src={log.avatar_url} name={log.author_name} className="size-8 text-[12px]" />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-ink truncate">{log.author_name}{log.is_mine && <span className="font-normal text-mute"> (you)</span>}</p>
          <p className="text-[12px] text-mute flex items-center gap-3 tabular-nums">
            <span className="inline-flex items-center gap-1"><BookOpen aria-hidden="true" className="w-3.5 h-3.5" /> {log.lesson_count} lesson{log.lesson_count === 1 ? "" : "s"}</span>
            {log.minutes > 0 && <span className="inline-flex items-center gap-1"><Clock aria-hidden="true" className="w-3.5 h-3.5" /> ~{mins(log.minutes)}</span>}
          </p>
        </div>
      </div>
      {log.note && <p className="text-[14px] text-ink whitespace-pre-line">{log.note}</p>}
      {log.lessons.length > 0 && <LessonList lessons={log.lessons} />}
    </li>
  );
}

/** Daily logs view: your own draft (signed in) plus the public archive, one day at a time. */
export function DailyLogs() {
  const { user, loading: authLoading } = useAuth();
  const today = useMemo(() => localDate(), []);
  const [date, setDate] = useState(today);
  const [day, setDay] = useState<LogDay | null>(null);
  const [dates, setDates] = useState<{ log_date: string; count: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  // `day` belongs to `dayDate`; while that differs from the selected date, a fetch is in flight.
  const [dayDate, setDayDate] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const loading = loadingMore || dayDate !== date;

  const [version, setVersion] = useState(0); // bumped when the learner's own log changes
  const refreshAll = useCallback(() => setVersion((v) => v + 1), []);

  // First page of the selected day, plus the dates that have logs.
  useEffect(() => {
    if (authLoading) return;
    let live = true;
    studyLogsApi
      .day(date, 0)
      .then((d) => {
        if (!live) return;
        setDay(d);
        setError(null);
      })
      .catch((e) => live && setError(errorMessage(e) || "Couldn't load logs."))
      .finally(() => live && setDayDate(date));
    studyLogsApi.dates().then((r) => live && setDates(r.dates)).catch(() => {});
    return () => {
      live = false;
    };
  }, [date, authLoading, version]);

  const loadMore = async (offset: number) => {
    setLoadingMore(true);
    try {
      const d = await studyLogsApi.day(date, offset);
      setDay((prev) => (prev ? { ...d, logs: [...prev.logs, ...d.logs] } : d));
    } catch (e) {
      setError(errorMessage(e) || "Couldn't load logs.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {user && <MyLog date={date} onChange={refreshAll} />}
      {!user && !authLoading && (
        <p className="p-4 rounded-xl border border-dashed border-hair text-[14px] text-body">
          <Link href="/login?redirect=/community" className={`text-accent-ink font-semibold underline rounded ${focusRing}`}>Sign in</Link> to keep a daily log. It fills in from the lessons you complete, and you decide whether to publish it.
        </p>
      )}

      <section aria-labelledby="logs-day" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setDate(shift(date, -1))} aria-label="Previous day" className={`p-1.5 rounded-lg border-[1.5px] border-hair text-body hover:text-ink ${focusRing}`}>
            <ChevronLeft aria-hidden="true" className="w-4 h-4" />
          </button>
          <h2 id="logs-day" className="text-[15px] font-bold text-ink min-w-[9rem] text-center">{pretty(date)}</h2>
          <button type="button" onClick={() => setDate(shift(date, 1))} disabled={date >= today} aria-label="Next day" className={`p-1.5 rounded-lg border-[1.5px] border-hair text-body hover:text-ink disabled:opacity-40 ${focusRing}`}>
            <ChevronRight aria-hidden="true" className="w-4 h-4" />
          </button>
          {date !== today && <button type="button" onClick={() => setDate(today)} className={`text-[13px] text-accent-ink underline rounded ${focusRing}`}>Back to today</button>}
          <span className="ml-auto text-[12.5px] text-mute tabular-nums">{day ? `${day.total} public log${day.total === 1 ? "" : "s"}` : ""}</span>
        </div>

        {dates.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label="Recent days with logs">
            {dates.slice(0, 14).map((d) => (
              <button key={d.log_date} type="button" onClick={() => setDate(d.log_date)} aria-pressed={d.log_date === date}
                className={`px-2.5 py-1 rounded-full text-[12px] border tabular-nums ${focusRing} ${d.log_date === date ? "bg-accent-soft border-accent-line text-accent-ink font-semibold" : "border-hair text-body hover:text-ink"}`}>
                {pretty(d.log_date)} · {d.count}
              </button>
            ))}
          </div>
        )}

        {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
        {day && day.logs.length === 0 && !loading && (
          <p className="p-8 text-center rounded-xl border border-dashed border-hair text-[14px] text-body">
            No one has published a log for {pretty(date).toLowerCase()}.{user && date === today ? " Yours could be the first." : ""}
          </p>
        )}
        <ul className="flex flex-col gap-3">{day?.logs.map((l) => <LogCard key={l.id} log={l} />)}</ul>
        {loading && <p className="flex items-center gap-2 text-[13px] text-body"><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" /> Loading logs…</p>}
        {day && !loading && day.logs.length < day.total && (
          <button type="button" onClick={() => loadMore(day.logs.length)} className={`self-center px-4 py-2 rounded-lg border-[1.5px] border-hair text-[13px] font-semibold text-ink hover:border-accent ${focusRing}`}>
            Show more ({day.total - day.logs.length} left)
          </button>
        )}
      </section>
    </div>
  );
}
