"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, CheckCircle2, Clock, Copy, FileCode2, Loader2, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { buttonClass } from "@/components/ui/Button";
import { LANGUAGE_LABEL, submissionsApi, VERDICT_LABEL, type SubmissionDetail, type SubmissionSummary } from "@/lib/api/submissions";
import { getAuthToken } from "@/lib/api/client";
import { errorMessage } from "@/lib/utils";

const show = (v: unknown) => JSON.stringify(v);

/** Submissions tab of the problem page: your history for this problem, and any one submission's code. */
export function SubmissionsPanel({
  problemId,
  refreshKey,
  openId,
  onOpen,
  onLoadCode,
  highlightId,
}: {
  problemId: string;
  refreshKey: number; // bump after a submit to reload the list
  openId: string | null; // the submission being viewed, or null for the list
  onOpen: (id: string | null) => void;
  onLoadCode: (code: string, language: string) => void;
  highlightId?: string | null; // the submission just made, marked in the list
}) {
  const [list, setList] = useState<{ total: number; items: SubmissionSummary[] } | null>(null);
  const [loaded, setDetail] = useState<SubmissionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [noteDraft, setNoteDraft] = useState<{ id: string; text: string } | null>(null);
  const [noteState, setNoteState] = useState<"idle" | "saving" | "saved">("idle");

  const saveNote = async (id: string, text: string) => {
    setNoteState("saving");
    try {
      const r = await submissionsApi.setNote(id, text);
      setDetail((d) => (d && d.id === id ? { ...d, note: r.note } : d));
      setList((l) => (l ? { ...l, items: l.items.map((x) => (x.id === id ? { ...x, note: r.note } : x)) } : l));
      setNoteState("saved");
    } catch (e) {
      setError(errorMessage(e) || "Couldn't save the note.");
      setNoteState("idle");
    }
  };

  useEffect(() => {
    let live = true;
    (async () => {
      if (!(await getAuthToken())) {
        if (live) setError("Sign in to keep a history of your submissions.");
        return;
      }
      try {
        const r = await submissionsApi.list({ problemId, limit: 50 });
        if (!live) return;
        setError(null);
        setList(r);
      } catch (e) {
        if (live) setError(errorMessage(e) || "Couldn't load your submissions.");
      }
    })();
    return () => {
      live = false;
    };
  }, [problemId, refreshKey]);

  useEffect(() => {
    if (!openId) return;
    let live = true;
    submissionsApi
      .get(openId)
      .then((d) => live && setDetail(d))
      .catch((e) => live && setError(errorMessage(e) || "Couldn't open that submission."));
    return () => {
      live = false;
    };
  }, [openId]);

  if (error) return <p className="text-[14px] text-mute">{error}</p>;

  if (openId) {
    const detail = loaded?.id === openId ? loaded : null; // a stale detail from another submission isn't shown
    if (!detail) return <Loader2 className="size-5 animate-spin text-mute" aria-label="Loading submission" />;
    const ok = detail.status === "accepted";
    return (
      <div className="flex flex-col gap-4">
        <button type="button" onClick={() => onOpen(null)} className="inline-flex w-fit items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
          <ArrowLeft className="size-3.5" /> All submissions
        </button>
        <div>
          <p className={clsx("flex items-center gap-2 text-[20px] font-semibold", ok ? "text-note" : "text-danger")}>
            {ok ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {VERDICT_LABEL[detail.status] ?? detail.status}
          </p>
          <p className="mt-1 font-mono text-[12px] text-mute">
            {detail.passed} / {detail.total} tests passed · {LANGUAGE_LABEL[detail.language] ?? detail.language}
            {detail.runtimeMs != null && ` · ${detail.runtimeMs} ms`} · {new Date(detail.createdAt).toLocaleString()}
          </p>
        </div>

        {detail.failedCase && (
          <div className="space-y-1.5 rounded-xl border-[1.5px] border-danger-line bg-danger-soft p-3.5 font-mono text-[12.5px] leading-relaxed">
            <p className="font-sans text-[13px] font-semibold text-ink">First failing test</p>
            <p>
              <span className="font-sans font-semibold">Input: </span>
              {Object.entries(detail.failedCase.input).map(([k, v]) => `${k} = ${show(v)}`).join(", ")}
            </p>
            <p>
              <span className="font-sans font-semibold">Expected: </span>
              {show(detail.failedCase.expectedOutput)}
            </p>
            {detail.failedCase.actualOutput !== undefined && detail.failedCase.actualOutput !== null && (
              <p>
                <span className="font-sans font-semibold">Your output: </span>
                {show(detail.failedCase.actualOutput)}
              </p>
            )}
            {detail.failedCase.error && <p className="whitespace-pre-wrap text-danger">{detail.failedCase.error}</p>}
          </div>
        )}
        {detail.error && !detail.failedCase?.error && (
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-danger-soft p-3 font-mono text-[12px] text-danger">{detail.error}</pre>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onLoadCode(detail.code, detail.language)} className={buttonClass("primary", "sm")}>
            <FileCode2 className="size-4" /> Load into editor
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(detail.code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                /* clipboard blocked */
              }
            }}
            className={buttonClass("secondary", "sm")}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        <pre className="overflow-auto rounded-xl bg-night p-4 font-mono text-[12.5px] leading-relaxed text-[#f5efe6]">{detail.code}</pre>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void saveNote(detail.id, noteDraft?.id === detail.id ? noteDraft.text : detail.note ?? "");
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="submission-note" className="text-[13px] font-semibold text-ink">
            Note on this submission <span className="font-normal text-mute">(shows in the list)</span>
          </label>
          <textarea
            id="submission-note"
            rows={2}
            maxLength={500}
            value={noteDraft?.id === detail.id ? noteDraft.text : detail.note ?? ""}
            onChange={(e) => {
              setNoteDraft({ id: detail.id, text: e.target.value });
              setNoteState("idle");
            }}
            placeholder="What went wrong, what fixed it, time taken…"
            className="w-full resize-y rounded-xl border-2 border-hair bg-paper px-3 py-2 text-[16px] text-ink outline-none placeholder:text-mute focus:border-accent md:text-[14px]"
          />
          <div className="flex items-center gap-3">
            <button type="submit" disabled={noteState === "saving"} className={buttonClass("secondary", "sm")}>
              {noteState === "saving" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Save note
            </button>
            {noteState === "saved" && <span className="font-mono text-[11px] text-note">Saved</span>}
          </div>
        </form>
      </div>
    );
  }

  if (!list) return <Loader2 className="size-5 animate-spin text-mute" aria-label="Loading submissions" />;
  if (list.items.length === 0) return <p className="text-[14px] text-mute">No submissions yet. Press Submit and every attempt, with its code, is kept here.</p>;

  // A compact table, newest first; a row's code and test details load only when it's opened.
  return (
    <div className="-mx-5 sm:-mx-6">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-[1.5px] border-hair font-mono text-[11px] uppercase tracking-wider text-mute">
            <th className="w-10 py-2 pl-5 font-medium sm:pl-6">
              <span className="sr-only">Number</span>
            </th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 font-medium">Language</th>
            <th className="py-2 font-medium">Runtime</th>
            <th className="hidden py-2 pr-5 font-medium sm:table-cell sm:pr-6">Notes</th>
          </tr>
        </thead>
        <tbody>
          {list.items.map((s, i) => (
            <tr
              key={s.id}
              onClick={() => onOpen(s.id)}
              className={clsx("cursor-pointer border-b-[1.5px] border-hair hover:bg-card-2", s.id === highlightId && "bg-paper-2")}
            >
              <td className="py-2.5 pl-5 align-top font-mono text-[12px] text-mute sm:pl-6">{list.total - i}</td>
              <td className="py-2.5 pr-3 align-top">
                {/* the status is the row's link, so keyboard users can open it too */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(s.id);
                  }}
                  className={clsx("text-left text-[14px] font-semibold hover:underline", s.status === "accepted" ? "text-note" : "text-danger")}
                >
                  {VERDICT_LABEL[s.status] ?? s.status}
                </button>
                <span className="block font-mono text-[11.5px] text-mute" title={new Date(s.createdAt).toLocaleString()}>
                  {new Date(s.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </td>
              <td className="py-2.5 pr-3 align-top">
                <span className="rounded-md bg-paper-2 px-2 py-0.5 font-mono text-[11.5px] text-body">{LANGUAGE_LABEL[s.language] ?? s.language}</span>
              </td>
              <td className="py-2.5 pr-3 align-top font-mono text-[12.5px] text-body">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5 text-mute" aria-hidden />
                  {s.runtimeMs != null && s.status !== "compile_error" ? `${s.runtimeMs} ms` : "N/A"}
                </span>
              </td>
              <td className="hidden max-w-[10rem] truncate py-2.5 pr-5 align-top text-[12.5px] text-body sm:table-cell sm:pr-6" title={s.note ?? undefined}>
                {s.note ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
