"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { getAuthToken } from "@/lib/api/client";
import { LANGUAGE_LABEL, submissionsApi, timeAgo, VERDICT_LABEL, type SubmissionSummary } from "@/lib/api/submissions";
import { problems } from "@/lib/problems/problemRegistry";
import { errorMessage } from "@/lib/utils";

const PAGE = 25;

/** Every submission you've made, newest first; each row opens the problem with that submission's code. */
export default function SubmissionsPage() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<{ total: number; items: SubmissionSummary[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!(await getAuthToken())) {
        if (live) setError("Sign in to see your submissions.");
        return;
      }
      try {
        const r = await submissionsApi.list({ limit: PAGE, offset: page * PAGE });
        if (!live) return;
        setError(null);
        setData(r);
      } catch (e) {
        if (live) setError(errorMessage(e) || "Couldn't load your submissions.");
      }
    })();
    return () => {
      live = false;
    };
  }, [page]);

  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE)) : 1;

  return (
    <>
      <Link href="/practice/problems" className="mb-5 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft className="size-3.5" /> Problems
      </Link>
      <PageHeader eyebrow="Practice" title="Your" hl="submissions" note="every Submit, with its code" />

      {error ? (
        <p className="text-[15px] text-mute">{error}</p>
      ) : !data ? (
        <Loader2 className="size-6 animate-spin text-mute" aria-label="Loading" />
      ) : data.items.length === 0 ? (
        <p className="text-[15px] text-body">
          No submissions yet.{" "}
          <Link href="/practice/problems" className="font-semibold text-accent-ink hover:underline">
            Pick a problem
          </Link>{" "}
          and press Submit; every attempt is kept with its code.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y-[2.4px] border-line font-mono text-[11px] uppercase tracking-wider text-mute">
                  <th className="py-2.5 pl-1 font-medium">Problem</th>
                  <th className="py-2.5 font-medium">Verdict</th>
                  <th className="hidden py-2.5 font-medium sm:table-cell">Language</th>
                  <th className="hidden py-2.5 font-medium md:table-cell">Tests</th>
                  <th className="hidden py-2.5 font-medium md:table-cell">Runtime</th>
                  <th className="py-2.5 pr-1 text-right font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((s) => (
                  <tr key={s.id} className="group border-b-[1.5px] border-hair hover:bg-card-2">
                    <td className="py-3 pl-1 pr-4">
                      <Link href={`/practice/problems/${s.problemId}?submission=${s.id}`} className="text-[15px] font-semibold group-hover:text-accent-ink">
                        {problems[s.problemId]?.title ?? s.problemId}
                      </Link>
                    </td>
                    <td className={clsx("py-3 pr-4 text-[14px] font-semibold", s.status === "accepted" ? "text-note" : "text-danger")}>{VERDICT_LABEL[s.status] ?? s.status}</td>
                    <td className="hidden py-3 pr-4 font-mono text-[13px] text-body sm:table-cell">{LANGUAGE_LABEL[s.language] ?? s.language}</td>
                    <td className="hidden py-3 pr-4 font-mono text-[13px] text-body md:table-cell">
                      {s.passed}/{s.total}
                    </td>
                    <td className="hidden py-3 pr-4 font-mono text-[13px] text-body md:table-cell">{s.runtimeMs != null ? `${s.runtimeMs} ms` : "–"}</td>
                    <td className="py-3 pr-1 text-right font-mono text-[12px] text-mute" title={new Date(s.createdAt).toLocaleString()}>
                      {timeAgo(s.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className={buttonClass("secondary", "sm")}>
                <ArrowLeft className="size-4" /> Newer
              </button>
              <span className="font-mono text-[12px] text-mute">
                Page {page + 1} of {pages} · {data.total} submissions
              </span>
              <button type="button" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className={buttonClass("secondary", "sm")}>
                Older <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
