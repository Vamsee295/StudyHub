"use client";

import { useEffect, useId, useState } from "react";
import { activityByDay, activityCount, bestStreakOf, streakOf, type ActivityMap } from "@/lib/activity";
import { dateKey, dayNumber, keyFromDayNumber } from "@/lib/learn/dailyCode";
import { SUBMISSIONS_EVENT } from "@/lib/problems/submissions";
import { SYNCED_EVENT } from "@/lib/sync/userSync";

const CELL = 12;
const GAP = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 0 = nothing, then four shades of teal by how much you did that day
const level = (n: number) => (n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4);
const SHADE = ["var(--ink)", "var(--note)", "var(--note)", "var(--note)", "var(--note)"];
const ALPHA = [0.08, 0.3, 0.55, 0.8, 1];

const pretty = (key: string) => new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function describe(key: string, m: ActivityMap) {
  const d = m[key];
  if (!d || activityCount(d) === 0) return `${pretty(key)}: no activity`;
  const parts = [
    d.lessons && `${d.lessons} lesson${d.lessons === 1 ? "" : "s"}`,
    d.submissions && `${d.submissions} submission${d.submissions === 1 ? "" : "s"} (${d.accepted} accepted)`,
    !d.submissions && d.problems && `${d.problems} problem${d.problems === 1 ? "" : "s"} solved`,
    d.daily && "daily problem",
  ].filter(Boolean);
  return `${pretty(key)}: ${parts.join(", ")}`;
}

/** Activity, one square per day: lessons completed, code submissions and the daily problem. `weeks` sets the span. */
export function ActivityHeatmap({ weeks: WEEKS = 53, compact = false }: { weeks?: number; compact?: boolean }) {
  // client-only render (AppLayout), so local progress is readable on first render
  const [{ m, today }, setData] = useState(() => ({ m: activityByDay(), today: dateKey() }));
  const [hover, setHover] = useState<string | null>(null);
  const headingId = useId();
  const span = WEEKS >= 52 ? "in the last year" : `in the last ${WEEKS} weeks`;

  // a new submission, or data synced from another device, redraws the map
  useEffect(() => {
    const refresh = () => setData({ m: activityByDay(), today: dateKey() });
    for (const e of [SUBMISSIONS_EVENT, SYNCED_EVENT, "studyhub:problem_status_updated"]) window.addEventListener(e, refresh);
    return () => {
      for (const e of [SUBMISSIONS_EVENT, SYNCED_EVENT, "studyhub:problem_status_updated"]) window.removeEventListener(e, refresh);
    };
  }, []);

  const end = dayNumber(today);
  const dow = new Date(`${today}T00:00:00`).getDay(); // today's row (Sunday = 0)
  const start = end - dow - (WEEKS - 1) * 7;
  const days = Array.from({ length: WEEKS * 7 }, (_, i) => start + i);
  const inRange = days.filter((n) => n <= end).map(keyFromDayNumber);

  const total = inRange.reduce((n, k) => n + activityCount(m[k]), 0);
  const activeDays = inRange.filter((k) => activityCount(m[k]) > 0);
  const current = streakOf((k) => activityCount(m[k]) > 0, today);
  const best = bestStreakOf(Object.keys(m).filter((k) => activityCount(m[k]) > 0));

  // month labels sit above the first week that starts in that month
  const monthLabels: { x: number; label: string }[] = [];
  for (let w = 0; w < WEEKS; w++) {
    const first = new Date(`${keyFromDayNumber(start + w * 7)}T00:00:00`);
    const prev = w === 0 ? null : new Date(`${keyFromDayNumber(start + (w - 1) * 7)}T00:00:00`);
    if (!prev || prev.getMonth() !== first.getMonth()) monthLabels.push({ x: w * (CELL + GAP), label: MONTHS[first.getMonth()] });
  }
  const W = WEEKS * (CELL + GAP);
  const H = 7 * (CELL + GAP);

  return (
    <section aria-labelledby={headingId} className={compact ? "" : "mb-12 rounded-2xl border-[1.5px] border-hair bg-card p-5 md:p-6"}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id={headingId} className={compact ? "text-[14px] font-semibold" : "text-[16px] font-semibold"}>
          <span className="tabular-nums">{total}</span> activities {span}
        </h2>
        <dl className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] text-mute">
          <div>
            <dt className="inline">Active days: </dt>
            <dd className="inline font-bold text-ink tabular-nums">{activeDays.length}</dd>
          </div>
          <div>
            <dt className="inline">Current streak: </dt>
            <dd className="inline font-bold text-ink tabular-nums">{current}</dd>
          </div>
          <div>
            <dt className="inline">Best streak: </dt>
            <dd className="inline font-bold text-ink tabular-nums">{best}</dd>
          </div>
        </dl>
      </div>

      <div className="overflow-x-auto pb-1">
        <svg viewBox={`-28 -18 ${W + 28} ${H + 18}`} width={compact ? "100%" : W + 28} height={compact ? undefined : H + 18} role="img" aria-label={`${total} activities on ${activeDays.length} days ${span}`} className="block">
          {monthLabels.map((ml) => (
            <text key={`${ml.label}-${ml.x}`} x={ml.x} y={-6} fontSize="10" fill="var(--mute)" style={{ fontFamily: "var(--font-mono-jb), ui-monospace, monospace" }}>
              {ml.label}
            </text>
          ))}
          {[1, 3, 5].map((r) => (
            <text key={r} x={-6} y={r * (CELL + GAP) + CELL - 2} fontSize="9" textAnchor="end" fill="var(--mute)" style={{ fontFamily: "var(--font-mono-jb), ui-monospace, monospace" }}>
              {["", "Mon", "", "Wed", "", "Fri", ""][r]}
            </text>
          ))}
          {days.map((n, i) => {
            if (n > end) return null;
            const key = keyFromDayNumber(n);
            const lv = level(activityCount(m[key]));
            return (
              <rect
                key={n}
                x={Math.floor(i / 7) * (CELL + GAP)}
                y={(i % 7) * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={3}
                fill={SHADE[lv]}
                fillOpacity={ALPHA[lv]}
                stroke={n === end ? "var(--ink)" : "none"}
                strokeWidth={1.5}
                onMouseEnter={() => setHover(key)}
                onMouseLeave={() => setHover(null)}
              >
                <title>{describe(key, m)}</title>
              </rect>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-mute">
        <p aria-live="polite" className="min-h-[1.25rem]">
          {hover ? describe(hover, m) : compact ? "Hover a day for details." : "Counts lessons completed, every code submission and the daily problem. Hover a day for details."}
        </p>
        <span className="flex items-center gap-1.5 font-mono">
          Less
          {ALPHA.map((a, i) => (
            <span key={i} className="size-[11px] rounded-[3px]" style={{ background: SHADE[i], opacity: a }} />
          ))}
          More
        </span>
      </div>
    </section>
  );
}
