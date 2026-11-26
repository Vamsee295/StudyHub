"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Loader2, Share2, Timer } from "lucide-react";
import { ProblemWorkspace, type WorkspaceEvent } from "@/components/practice/ProblemWorkspace";
import { buttonClass } from "@/components/ui/Button";
import { captureElement, warmShareFonts } from "@/lib/shareImage";
import {
  dailyProblem,
  dateKey,
  draftKeyFor,
  getDailyCodeHistory,
  msUntilMidnight,
  recordDailyResult,
  type DailyCodeHistory,
} from "@/lib/learn/dailyCode";

const prettyDate = (key: string) =>
  new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function hms(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function DailyPage() {
  // AppLayout renders pages on the client only, so the learner's clock and storage are readable on first render.
  const [today, setToday] = useState(dateKey);
  const [history, setHistory] = useState<DailyCodeHistory>(getDailyCodeHistory);
  const [left, setLeft] = useState(msUntilMidnight);
  const [sharing, setSharing] = useState<"idle" | "busy" | "done" | "error">("idle");
  const pageRef = useRef<HTMLDivElement>(null);

  // 12:00 AM: move to the new day's problem without a reload
  useEffect(() => {
    const tick = setInterval(() => {
      const ms = msUntilMidnight();
      setLeft(ms);
      const now = dateKey();
      setToday((t) => (t === now ? t : now));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // get the share image's fonts ready while the learner reads, so Share is quick
  useEffect(() => {
    const t = setTimeout(warmShareFonts, 3000);
    return () => clearTimeout(t);
  }, []);

  const problem = dailyProblem(today);
  const entry = history[today];

  const onResult = useCallback(
    (e: WorkspaceEvent) => setHistory(recordDailyResult(today, problem.id, e.accepted, e.kind, e.language)),
    [today, problem.id]
  );

  const share = async () => {
    const node = pageRef.current;
    if (!node) return;
    setSharing("busy");
    try {
      const blob = await captureElement(node);
      const file = new File([blob], `studyhub-daily-${today}.png`, { type: "image/png" });
      const text = `StudyHub daily problem, ${prettyDate(today)}: ${problem.title}${entry?.status === "solved" ? " ✓ solved" : ""}.`;
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "My StudyHub daily", text });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      setSharing("done");
    } catch (err) {
      // closing the share sheet is not an error
      setSharing(err instanceof DOMException && err.name === "AbortError" ? "idle" : "error");
    }
    setTimeout(() => setSharing("idle"), 2500);
  };

  return (
    <div ref={pageRef} className="flex h-full flex-col bg-paper">
      {/* slim LeetCode-style bar: what this is on the left, the clock and Share on the right */}
      <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b-[1.5px] border-hair px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <CalendarCheck className="size-4 shrink-0 text-accent-ink" aria-hidden />
          <h1 className="truncate text-[15px] font-semibold">Daily Question</h1>
          <span className="hidden truncate text-[13px] text-mute sm:inline">· {prettyDate(today)}</span>
          {entry?.status === "solved" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-note/15 px-2 py-0.5 text-[12px] font-semibold text-note">
              <CheckCircle2 className="size-3.5" aria-hidden /> Solved
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-1.5 font-mono text-[12px] tabular-nums text-mute sm:flex" title="A new problem appears at midnight">
            <Timer className="size-3.5" aria-hidden /> Next in <span className="font-bold text-ink">{hms(left)}</span>
          </span>
          <button type="button" onClick={share} disabled={sharing === "busy"} data-share-exclude className={buttonClass("secondary", "sm")} aria-live="polite">
            {sharing === "busy" ? <Loader2 className="size-4 animate-spin" /> : <Share2 className="size-4" />}
            <span className="max-sm:sr-only">{sharing === "busy" ? "Capturing…" : sharing === "done" ? "Shared" : sharing === "error" ? "Try again" : "Share"}</span>
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ProblemWorkspace
          key={`${today}|${problem.id}`}
          problemId={problem.id}
          header={<></>}
          onResult={onResult}
          draftKey={draftKeyFor(today)}
        />
      </div>

      <p className="sr-only">
        A new problem appears every day at midnight. Solve it with Submit to keep your streak. <Link href="/practice/problems">All problems</Link>
      </p>
    </div>
  );
}
