"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowLeft, ArrowUpRight, Check, Copy, Download, Lightbulb, RotateCcw } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { askConfirm } from "@/components/ui/AskDialog";
import { getTemplate, TEMPLATE_CATEGORIES } from "@/lib/data/templatesData";
import { ResumeStudio } from "@/components/templates/ResumeStudio";
import { getSampleResume } from "@/lib/data/sampleResumes";
import { boldRuns, deleteSavedTemplate, fillTemplate, getSavedTemplates, saveTemplate, toBlocks, toPlainText } from "@/lib/templates";

function Runs({ text }: { text: string }) {
  return <>{boldRuns(text).map((r, i) => (r.bold ? <strong key={i}>{r.text}</strong> : <span key={i}>{r.text}</span>))}</>;
}

/** Missing required values render as "[Label]"; show them as a soft highlight so gaps are easy to spot. */
function Line({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/g).map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <mark key={i} className="rounded bg-gold/25 px-1 text-mute">
            {part.slice(1, -1)}
          </mark>
        ) : (
          <Runs key={i} text={part} />
        ),
      )}
    </>
  );
}

function saveFile(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = getTemplate(id);
  const sample = getSampleResume(id);
  // resumes open as a complete sample to edit; other templates fill in fields
  if (t && sample) return <ResumeStudio t={t} sample={sample} />;
  return <FieldsEditor id={id} />;
}

function FieldsEditor({ id }: { id: string }) {
  const t = getTemplate(id);
  // client-only render (AppLayout), so saved work can be read on first render
  const [values, setValues] = useState<Record<string, string>>(() => getSavedTemplates()[id]?.values ?? {});
  const [copied, setCopied] = useState<"text" | "md" | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(() => getSavedTemplates()[id]?.updatedAt ?? null);

  const filled = useMemo(() => (t ? fillTemplate(t, values) : ""), [t, values]);

  // autosave once something is filled in
  useEffect(() => {
    if (!t || !Object.values(values).some((v) => v.trim())) return;
    const h = setTimeout(() => {
      saveTemplate(t.id, values);
      setSavedAt(Date.now());
    }, 500);
    return () => clearTimeout(h);
  }, [t, values]);

  if (!t) {
    return (
      <div className="py-20 text-center">
        <p className="eyebrow">Not found</p>
        <p className="display mt-2 text-[40px]">No template called “{id}”</p>
        <Link href="/templates" className="mt-4 inline-block font-semibold text-accent-ink hover:underline">
          ← All templates
        </Link>
      </div>
    );
  }

  const done = t.fields.filter((f) => values[f.key]?.trim()).length;
  const required = t.fields.filter((f) => !f.optional);
  const missing = required.filter((f) => !values[f.key]?.trim()).length;

  const copy = async (kind: "text" | "md") => {
    try {
      await navigator.clipboard.writeText(kind === "md" ? filled : toPlainText(filled));
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked: the download still works */
    }
  };

  const download = () => saveFile(`${t.id}.md`, filled + "\n", "text/markdown");

  const reset = async () => {
    const ok = await askConfirm("Clear everything you've filled in?", {
      body: "Your saved copy of this template is removed too.",
      ok: "Clear",
      danger: true,
    });
    if (!ok) return;
    deleteSavedTemplate(t.id);
    setValues({});
    setSavedAt(null);
  };

  return (
    <div className="w-full min-w-0">
      <Link href="/templates" className="mb-5 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft className="size-3.5" aria-hidden /> Templates
      </Link>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-1">
            {TEMPLATE_CATEGORIES.find((c) => c.id === t.category)?.label} · about {t.minutes} min
          </p>
          <h1 className="display text-[36px] md:text-[48px]">{t.title}</h1>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-body">{t.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => copy("text")} className={buttonClass("primary", "sm")}>
            {copied === "text" ? <Check className="size-4" /> : <Copy className="size-4" />} {copied === "text" ? "Copied" : "Copy text"}
          </button>
          <button type="button" onClick={() => copy("md")} className={buttonClass("secondary", "sm")}>
            {copied === "md" ? <Check className="size-4" /> : <Copy className="size-4" />} {copied === "md" ? "Copied" : "Copy Markdown"}
          </button>
          <button type="button" onClick={download} className={buttonClass("secondary", "sm")}>
            <Download className="size-4" /> Download .md
          </button>
          <button type="button" onClick={reset} className={buttonClass("ghost", "sm")} disabled={!done}>
            <RotateCcw className="size-4" /> Clear
          </button>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col gap-5">
          <section aria-labelledby="fields" className="rounded-2xl border-[1.5px] border-hair bg-card p-5">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 id="fields" className="eyebrow">
                Your details
              </h2>
              <span className="font-mono text-[11px] text-mute" aria-live="polite">
                {done}/{t.fields.length} filled{savedAt ? " · saved" : ""}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {t.fields.map((f) => (
                <label key={f.key} className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-semibold text-ink">
                    {f.label} {f.optional && <span className="font-normal text-mute">(optional)</span>}
                  </span>
                  {f.multiline ? (
                    <textarea
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full resize-y rounded-xl border-2 border-hair bg-paper px-3 py-2 text-[16px] leading-relaxed text-ink outline-none placeholder:text-mute focus:border-accent md:text-[14px]"
                    />
                  ) : (
                    <input
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl border-2 border-hair bg-paper px-3 py-2 text-[16px] text-ink outline-none placeholder:text-mute focus:border-accent md:text-[14px]"
                    />
                  )}
                </label>
              ))}
            </div>
          </section>

          <section aria-labelledby="tips" className="rounded-2xl border-[1.5px] border-hair bg-paper-2 p-5">
            <h2 id="tips" className="eyebrow mb-3 flex items-center gap-1.5">
              <Lightbulb className="size-3.5" aria-hidden /> Tips
            </h2>
            <ul className="space-y-2 text-[14px] leading-relaxed text-body">
              {t.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {tip}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t-[1.5px] border-hair pt-3 font-mono text-[11px] uppercase tracking-wider text-mute">Sources</p>
            <ul className="mt-1.5 space-y-1">
              {t.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline">
                    {s.label} <ArrowUpRight className="size-3.5" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-label="Preview" className="brut sticky top-6 rounded-2xl bg-card">
          <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-hair px-5 py-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-mute">Preview</span>
            <span className={clsx("font-mono text-[11px]", missing ? "text-warning" : "text-note")}>{missing ? `${missing} required field${missing === 1 ? "" : "s"} left` : "Ready to copy"}</span>
          </div>
          <article className="max-h-[calc(100dvh-10rem)] overflow-y-auto px-6 py-6 text-[14.5px] leading-relaxed text-ink md:px-10 md:py-8">
            {toBlocks(filled).map((b, i) =>
              b.kind === "gap" ? (
                <div key={i} className="h-3" />
              ) : b.kind === "h1" ? (
                <h2 key={i} className="text-[22px] font-bold leading-tight">
                  <Line text={b.text} />
                </h2>
              ) : b.kind === "h2" ? (
                <h3 key={i} className="mt-2 border-b-[1.5px] border-ink/70 pb-0.5 text-[13px] font-bold uppercase tracking-wider">
                  <Line text={b.text} />
                </h3>
              ) : b.kind === "li" ? (
                <p key={i} className="flex gap-2 pl-1">
                  <span aria-hidden>•</span>
                  <span>
                    <Line text={b.text} />
                  </span>
                </p>
              ) : (
                <p key={i}>
                  <Line text={b.text} />
                </p>
              ),
            )}
          </article>
        </section>
      </div>
    </div>
  );
}
