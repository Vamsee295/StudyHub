"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileCode2, Loader2, Plus, Printer, RotateCcw, Sparkles, Trash2, Undo2, X } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { askConfirm } from "@/components/ui/AskDialog";
import { AtsPanel } from "@/components/templates/AtsPanel";
import { ResumePage } from "@/components/templates/ResumePage";
import { aiApi } from "@/lib/api/ai";
import { getAuthToken } from "@/lib/api/client";
import type { SampleResume } from "@/lib/data/sampleResumes";
import type { TemplateDef } from "@/lib/data/templatesData";
import { readSavedResume, type ResumeDoc } from "@/lib/resume";
import { resumeToLatex } from "@/lib/resumeLatex";
import { deleteSavedTemplate, getSavedTemplates, saveTemplate } from "@/lib/templates";

const input =
  "w-full rounded-xl border-2 border-hair bg-paper px-3 py-2 text-[16px] text-ink outline-none placeholder:text-mute focus:border-accent md:text-[14px]";
const iconBtn = "tap shrink-0 rounded-lg p-1.5 text-mute hover:bg-paper-2 hover:text-ink disabled:opacity-40";

function saveFile(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Prints only the resume page, from a hidden iframe that carries the app's stylesheets. */
function printResume(title: string) {
  const page = document.getElementById("resume-print");
  if (!page) return;
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
  document.body.appendChild(frame);
  const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')].map((n) => n.outerHTML).join("");
  const d = frame.contentDocument!;
  d.open();
  d.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${title.replace(/</g, "")}</title>${styles}` +
      `<style>@page{size:letter;margin:0}html,body{margin:0;background:#fff}` +
      `#resume-print{box-shadow:none!important;aspect-ratio:auto!important;font-size:10.5px!important;padding:0.5in 0.55in!important}</style>` +
      `</head><body>${page.outerHTML}</body></html>`
  );
  d.close();
  const go = async () => {
    await frame.contentDocument?.fonts.ready;
    frame.contentWindow?.print();
    setTimeout(() => frame.remove(), 1000);
  };
  if (d.readyState === "complete") void go();
  else frame.addEventListener("load", () => void go(), { once: true });
}

/** Posts the LaTeX to Overleaf, which opens it as a new project. Runs only on the user's click. */
function openInOverleaf(source: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://www.overleaf.com/docs";
  form.target = "_blank";
  const field = document.createElement("textarea");
  field.name = "snip";
  field.value = source;
  form.appendChild(field);
  form.style.display = "none";
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

type AiState = { ready: boolean; why?: string };

/** One bullet: edit it, ask AI for three rewrites, or remove it. */
function Bullet({ value, onChange, onRemove, ai, context, job }: { value: string; onChange: (v: string) => void; onRemove: () => void; ai: AiState; context: string; job: string }) {
  const [options, setOptions] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const rewrite = async () => {
    setBusy(true);
    setErr("");
    try {
      setOptions((await aiApi.resumeBullet(value, context, job || undefined)).options);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Rewrite failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <li>
      <div className="flex items-start gap-1.5">
        <span aria-hidden className="mt-3.5 size-1.5 shrink-0 rounded-full bg-mute" />
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} aria-label="Bullet" className={`${input} resize-y leading-snug`} />
        <div className="flex flex-col">
          <button type="button" onClick={rewrite} disabled={!ai.ready || busy || value.trim().length < 3} title={ai.ready ? "Rewrite with AI" : ai.why} aria-label="Rewrite bullet with AI" className={iconBtn}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          </button>
          <button type="button" onClick={onRemove} aria-label="Remove bullet" className={iconBtn}>
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
      {err && <p className="ml-3 mt-1 text-[12px] text-danger">{err}</p>}
      {options && (
        <div className="ml-3 mt-2 rounded-xl border-[1.5px] border-dashed border-accent/50 bg-paper-2 p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-mute">Pick a rewrite</span>
            <button type="button" onClick={() => setOptions(null)} aria-label="Close rewrites" className={iconBtn}>
              <X className="size-3.5" />
            </button>
          </div>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                onChange(o);
                setOptions(null);
              }}
              className="block w-full rounded-lg px-2 py-1.5 text-left text-[13.5px] leading-snug text-ink hover:bg-card"
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}

export function ResumeStudio({ t, sample }: { t: TemplateDef; sample: SampleResume }) {
  // client-only render (AppLayout), so the saved copy can be read on first render
  const [doc, setDoc] = useState<ResumeDoc>(() => readSavedResume(getSavedTemplates()[t.id]?.values) ?? structuredClone(sample.doc));
  const [edited, setEdited] = useState(() => !!getSavedTemplates()[t.id]);
  const [prev, setPrev] = useState<ResumeDoc | null>(null); // one step of undo for AI changes
  const [ai, setAi] = useState<AiState>({ ready: false, why: "Checking AI…" });
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState<"build" | "tailor" | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [aiError, setAiError] = useState("");
  const [job, setJob] = useState(""); // the ATS panel's job description or role, for bullet rewrites

  useEffect(() => {
    let live = true;
    (async () => {
      const [status, token] = await Promise.all([aiApi.status().catch(() => null), getAuthToken()]);
      if (!live) return;
      if (!status) setAi({ ready: false, why: "AI needs the StudyHub server, which isn't reachable right now." });
      else if (!status.available) setAi({ ready: false, why: "AI isn't switched on for this server yet." });
      else if (!token) setAi({ ready: false, why: "Sign in to use AI." });
      else setAi({ ready: true });
    })();
    return () => {
      live = false;
    };
  }, []);

  // autosave after the first edit
  useEffect(() => {
    if (!edited) return;
    const h = setTimeout(() => saveTemplate(t.id, { doc: JSON.stringify(doc) }), 400);
    return () => clearTimeout(h);
  }, [doc, edited, t.id]);

  const edit = (fn: (d: ResumeDoc) => void) => {
    setEdited(true);
    setDoc((d) => {
      const n = structuredClone(d);
      fn(n);
      return n;
    });
  };

  const runAi = async (kind: "build" | "tailor", jobText = "") => {
    setBusy(kind);
    setAiError("");
    setNotes([]);
    try {
      const r = kind === "build" ? await aiApi.resumeBuild(details, sample.doc) : await aiApi.resumeTailor(doc, jobText);
      setPrev(doc);
      setEdited(true);
      setDoc(r.doc);
      setNotes(r.notes);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setBusy(null);
    }
  };

  const reset = async () => {
    const ok = await askConfirm("Start over from the sample?", { body: "Your edits to this resume are removed.", ok: "Start over", danger: true });
    if (!ok) return;
    deleteSavedTemplate(t.id);
    setDoc(structuredClone(sample.doc));
    setEdited(false);
    setPrev(null);
    setNotes([]);
  };

  const fileBase = `${doc.name.trim().replace(/\s+/g, "_") || "Resume"}_Resume`;

  return (
    <div className="w-full min-w-0">
      <Link href="/templates" className="mb-5 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft className="size-3.5" aria-hidden /> Templates
      </Link>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-1">Resume · ATS-friendly sample</p>
          <h1 className="display text-[36px] md:text-[48px]">{t.title}</h1>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-body">
            {sample.description} {edited ? "You're editing your own copy; it saves as you type." : `It's filled with a fictional student's details. Replace them with yours, by hand or with AI.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => printResume(fileBase)} className={buttonClass("primary", "sm")}>
            <Printer className="size-4" /> Download PDF
          </button>
          <button type="button" onClick={() => saveFile(`${fileBase}.tex`, resumeToLatex(doc), "application/x-tex")} className={buttonClass("secondary", "sm")}>
            <FileCode2 className="size-4" /> Download .tex
          </button>
          <button type="button" onClick={() => openInOverleaf(resumeToLatex(doc))} className={buttonClass("secondary", "sm")}>
            <ArrowUpRight className="size-4" /> Open in Overleaf
          </button>
          <button type="button" onClick={reset} disabled={!edited} className={buttonClass("ghost", "sm")}>
            <RotateCcw className="size-4" /> Start over
          </button>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <section aria-labelledby="ai-build" className="rounded-2xl border-[1.5px] border-accent/40 bg-card p-5">
            <h2 id="ai-build" className="eyebrow mb-2 flex items-center gap-1.5">
              <Sparkles className="size-3.5" aria-hidden /> Write it with AI
            </h2>
            <p className="mb-3 text-[13.5px] leading-relaxed text-body">
              Paste everything about you in any order: college, CGPA, internships, projects, skills, achievements, links. AI rewrites it in this resume&apos;s style. It won&apos;t invent numbers or experience.
            </p>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              placeholder={"B.Tech CSE at ABC College 2022–26, CGPA 8.2\nIntern at XYZ (Jun–Aug 2025): made admin dashboard in React…\nProject: expense tracker with Node and MongoDB, 50 users…\nSkills: Java, Python, SQL, Git\nLeetCode 300+"}
              className={`${input} resize-y leading-relaxed`}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => runAi("build")} disabled={!ai.ready || busy !== null || details.trim().length < 20} className={buttonClass("accent", "sm")}>
                {busy === "build" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} {busy === "build" ? "Writing…" : "Rewrite with my details"}
              </button>
              {prev && (
                <button
                  type="button"
                  onClick={() => {
                    setDoc(prev);
                    setPrev(null);
                    setNotes([]);
                  }}
                  className={buttonClass("ghost", "sm")}
                >
                  <Undo2 className="size-4" /> Undo AI change
                </button>
              )}
            </div>
            {!ai.ready && <p className="mt-2 text-[12.5px] text-mute">{ai.why}</p>}
            {aiError && <p className="mt-2 text-[13px] text-danger" role="alert">{aiError}</p>}
            {notes.length > 0 && (
              <div className="mt-3 rounded-xl bg-paper-2 p-3">
                <p className="font-mono text-[11px] uppercase tracking-wider text-mute">AI notes</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-[13px] leading-snug text-body">
                  {notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section aria-labelledby="edit" className="rounded-2xl border-[1.5px] border-hair bg-card p-5">
            <h2 id="edit" className="eyebrow mb-4">
              Edit by hand
            </h2>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-ink">Name</span>
              <input value={doc.name} onChange={(e) => edit((d) => void (d.name = e.target.value))} className={input} />
            </label>

            <fieldset className="mt-4">
              <legend className="mb-1.5 text-[13px] font-semibold text-ink">Contact line</legend>
              <ul className="flex flex-col gap-2">
                {doc.contacts.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <input value={c} onChange={(e) => edit((d) => void (d.contacts[i] = e.target.value))} aria-label={`Contact ${i + 1}`} className={input} />
                    <button type="button" onClick={() => edit((d) => void d.contacts.splice(i, 1))} aria-label="Remove contact" className={iconBtn}>
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => edit((d) => void d.contacts.push(""))} className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline">
                <Plus className="size-3.5" /> Add contact
              </button>
            </fieldset>

            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-ink">
                Summary <span className="font-normal text-mute">(optional, one line)</span>
              </span>
              <textarea value={doc.summary ?? ""} onChange={(e) => edit((d) => void (d.summary = e.target.value || undefined))} rows={2} className={`${input} resize-y`} />
            </label>

            {doc.sections.map((s, si) => (
              <details key={si} open className="group mt-5 border-t-[1.5px] border-hair pt-4">
                <summary className="flex cursor-pointer list-none items-center gap-2">
                  <input
                    value={s.title}
                    onChange={(e) => edit((d) => void (d.sections[si].title = e.target.value))}
                    onClick={(e) => e.preventDefault()}
                    aria-label="Section title"
                    className="label-cond min-w-0 flex-1 rounded-lg border-2 border-transparent bg-transparent px-1 text-[18px] text-ink outline-none hover:border-hair focus:border-accent"
                  />
                  <span className="font-mono text-[11px] text-mute group-open:hidden">show</span>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (await askConfirm(`Remove the ${s.title} section?`, { ok: "Remove", danger: true })) edit((d) => void d.sections.splice(si, 1));
                    }}
                    aria-label={`Remove ${s.title} section`}
                    className={iconBtn}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </summary>

                {s.entries?.map((en, ei) => (
                  <div key={ei} className="mt-3 rounded-xl bg-paper-2 p-3">
                    <div className="grid gap-2 sm:grid-cols-[1fr_10rem]">
                      <input value={en.title} onChange={(e) => edit((d) => void (d.sections[si].entries![ei].title = e.target.value))} aria-label="Title" placeholder="Title (role and company, project, college)" className={`${input} font-semibold`} />
                      <input value={en.date ?? ""} onChange={(e) => edit((d) => void (d.sections[si].entries![ei].date = e.target.value || undefined))} aria-label="Dates" placeholder="Dates" className={input} />
                    </div>
                    <input value={en.subtitle ?? ""} onChange={(e) => edit((d) => void (d.sections[si].entries![ei].subtitle = e.target.value || undefined))} aria-label="Subtitle" placeholder="Subtitle (location, stack, degree)" className={`${input} mt-2 italic`} />
                    <ul className="mt-2 flex flex-col gap-2">
                      {en.bullets.map((b, bi) => (
                        <Bullet
                          key={bi}
                          value={b}
                          ai={ai}
                          job={job}
                          context={[en.title, en.subtitle].filter(Boolean).join(" | ")}
                          onChange={(v) => edit((d) => void (d.sections[si].entries![ei].bullets[bi] = v))}
                          onRemove={() => edit((d) => void d.sections[si].entries![ei].bullets.splice(bi, 1))}
                        />
                      ))}
                    </ul>
                    <div className="mt-2 flex items-center justify-between">
                      <button type="button" onClick={() => edit((d) => void d.sections[si].entries![ei].bullets.push(""))} className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline">
                        <Plus className="size-3.5" /> Bullet
                      </button>
                      <button type="button" onClick={() => edit((d) => void d.sections[si].entries!.splice(ei, 1))} className="inline-flex items-center gap-1 text-[12.5px] text-mute hover:text-danger">
                        <Trash2 className="size-3.5" /> Remove entry
                      </button>
                    </div>
                  </div>
                ))}
                {s.entries && (
                  <button type="button" onClick={() => edit((d) => void d.sections[si].entries!.push({ title: "", bullets: [""] }))} className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline">
                    <Plus className="size-3.5" /> Add to {s.title || "section"}
                  </button>
                )}

                {s.lines && (
                  <>
                    <ul className="mt-3 flex flex-col gap-2">
                      {s.lines.map((l, li) => (
                        <li key={li} className="flex items-start gap-1.5">
                          {l.label !== undefined && (
                            <input value={l.label} onChange={(e) => edit((d) => void (d.sections[si].lines![li].label = e.target.value))} aria-label="Label" className={`${input} w-32 shrink-0 font-semibold`} />
                          )}
                          <textarea value={l.text} onChange={(e) => edit((d) => void (d.sections[si].lines![li].text = e.target.value))} rows={1} aria-label="Text" className={`${input} resize-y`} />
                          <button type="button" onClick={() => edit((d) => void d.sections[si].lines!.splice(li, 1))} aria-label="Remove line" className={iconBtn}>
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => edit((d) => void d.sections[si].lines!.push(s.lines!.some((l) => l.label !== undefined) ? { label: "", text: "" } : { text: "" }))}
                      className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline"
                    >
                      <Plus className="size-3.5" /> Add line
                    </button>
                  </>
                )}
              </details>
            ))}

            <div className="mt-5 flex flex-wrap gap-3 border-t-[1.5px] border-hair pt-4 text-[13px] font-semibold text-accent-ink">
              <button type="button" onClick={() => edit((d) => void d.sections.push({ title: "New section", entries: [{ title: "", bullets: [""] }] }))} className="inline-flex items-center gap-1 hover:underline">
                <Plus className="size-3.5" /> Section with entries
              </button>
              <button type="button" onClick={() => edit((d) => void d.sections.push({ title: "New section", lines: [{ text: "" }] }))} className="inline-flex items-center gap-1 hover:underline">
                <Plus className="size-3.5" /> Section with lines
              </button>
            </div>
          </section>

          <AtsPanel doc={doc} templateId={t.id} onJobChange={setJob} onTailor={ai.ready ? (j) => runAi("tailor", j) : undefined} tailoring={busy === "tailor"} />

          <section aria-labelledby="tips" className="rounded-2xl border-[1.5px] border-hair bg-paper-2 p-5">
            <h2 id="tips" className="eyebrow mb-3">
              Tips
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

        <section aria-label="Preview" className="brut sticky top-6 min-w-0 rounded-2xl bg-card">
          <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-hair px-5 py-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-mute">Preview</span>
            <span className="font-mono text-[11px] text-mute">{edited ? "Your copy · saved" : "Sample · edit to make it yours"}</span>
          </div>
          <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto rounded-b-2xl bg-paper-2 p-3 md:p-6">
            <ResumePage doc={doc} />
            <p className="mt-3 text-center font-mono text-[11px] text-mute">Jake&apos;s Resume layout · the .tex compiles as-is in Overleaf</p>
          </div>
        </section>
      </div>
    </div>
  );
}
