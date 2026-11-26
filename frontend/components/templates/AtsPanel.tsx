"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { Check, Loader2, Sparkles, Target, X } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { analyse, keywordsFromJD, ROLE_PRESETS } from "@/lib/ats";
import type { ResumeDoc } from "@/lib/resume";

const KEY = "studyhub_ats_v1";
type Saved = Record<string, { role: string; jd: string }>;
const load = (): Saved => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Saved;
  } catch {
    return {};
  }
};

/** Scores the resume against a role's usual keywords, or the skills named in a pasted job description. */
export function AtsPanel({
  doc,
  templateId,
  onJobChange,
  onTailor,
  tailoring,
}: {
  doc: ResumeDoc;
  templateId: string;
  onJobChange?: (job: string) => void; // the pasted description, or the role's name
  onTailor?: (job: string) => void; // shown only when AI is available
  tailoring?: boolean;
}) {
  const [role, setRole] = useState(() => load()[templateId]?.role ?? "sde");
  const [jd, setJd] = useState(() => load()[templateId]?.jd ?? "");

  const save = (next: { role: string; jd: string }) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...load(), [templateId]: next }));
    } catch {
      /* private mode: the choice just isn't remembered */
    }
  };

  const jdKeywords = useMemo(() => keywordsFromJD(jd), [jd]);
  const usingJd = jd.trim().length > 0;
  const keywords = usingJd ? jdKeywords : ROLE_PRESETS.find((r) => r.id === role)!.keywords;
  const result = useMemo(() => analyse(doc, keywords), [doc, keywords]);
  const roleLabel = ROLE_PRESETS.find((r) => r.id === role)!.label;
  const job = usingJd ? jd : roleLabel;
  useEffect(() => onJobChange?.(job), [job, onJobChange]);
  const tone = result.score >= 75 ? "text-note" : result.score >= 50 ? "text-warning" : "text-danger";

  return (
    <section aria-labelledby="ats" className="rounded-2xl border-[1.5px] border-hair bg-card p-5">
      <h2 id="ats" className="eyebrow mb-4 flex items-center gap-1.5">
        <Target className="size-3.5" aria-hidden /> ATS match
      </h2>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">Job role</span>
        <select
          value={role}
          disabled={usingJd}
          onChange={(e) => {
            setRole(e.target.value);
            save({ role: e.target.value, jd });
          }}
          className="w-full rounded-xl border-2 border-hair bg-paper px-3 py-2 text-[16px] text-ink outline-none focus:border-accent disabled:opacity-50 md:text-[14px]"
        >
          {ROLE_PRESETS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">
          Or paste the job description <span className="font-normal text-mute">(overrides the role)</span>
        </span>
        <textarea
          value={jd}
          onChange={(e) => {
            setJd(e.target.value);
            save({ role, jd: e.target.value });
          }}
          rows={4}
          placeholder="Paste the posting here. Skills it mentions become the keywords to match."
          className="w-full resize-y rounded-xl border-2 border-hair bg-paper px-3 py-2 text-[16px] leading-relaxed text-ink outline-none placeholder:text-mute focus:border-accent md:text-[14px]"
        />
      </label>

      {usingJd && jdKeywords.length === 0 ? (
        <p className="mt-4 text-[14px] text-mute">No known skills found in that description yet. Paste the requirements section.</p>
      ) : (
        <>
          <div className="mt-5 flex items-end gap-5">
            <p className={clsx("display text-[48px] leading-none tabular-nums", tone)} aria-label={`Estimated match ${result.score} out of 100`}>
              {result.score}
              <span className="text-[18px] text-mute">/100</span>
            </p>
            <p className="pb-1 text-[13px] leading-snug text-body">
              {result.matched.length} of {keywords.length} keywords found
              <br />
              <span className="text-mute">{usingJd ? "from the job description" : roleLabel}</span>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {result.matched.map((k) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-full bg-note/15 px-2.5 py-1 text-[12px] font-semibold text-ink">
                <Check className="size-3" aria-hidden /> {k}
              </span>
            ))}
            {result.missing.map((k) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-dashed border-hair px-2.5 py-1 text-[12px] text-mute">
                <X className="size-3" aria-hidden /> <span className="sr-only">Missing:</span> {k}
              </span>
            ))}
          </div>
          {onTailor && (
            <button type="button" onClick={() => onTailor(job)} disabled={tailoring} className={`${buttonClass("accent", "sm")} mt-4`}>
              {tailoring ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} {tailoring ? "Tailoring…" : `Tailor resume to this ${usingJd ? "job" : "role"} with AI`}
            </button>
          )}
          {result.missing.length > 0 && (
            <p className="mt-2 text-[12.5px] text-mute">Add the missing ones only where they&apos;re true: in a project&apos;s stack, a bullet or your skills line.</p>
          )}
        </>
      )}

      <ul className="mt-5 space-y-2 border-t-[1.5px] border-hair pt-4">
        {result.checks.map((c) => (
          <li key={c.label} className="flex gap-2.5 text-[13.5px]">
            {c.ok ? <Check className="mt-0.5 size-4 shrink-0 text-note" aria-label="Passes" /> : <X className="mt-0.5 size-4 shrink-0 text-warning" aria-label="Needs work" />}
            <span>
              <span className="font-semibold text-ink">{c.label}</span>
              <span className="block text-[12.5px] text-mute">{c.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12px] leading-relaxed text-mute">
        An estimate of keyword screening. Real applicant tracking systems vary by company; a clear, honest resume matters more than the number.
      </p>
    </section>
  );
}
