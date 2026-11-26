"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight, Clock, GitFork, Star, Trash2 } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/Page";
import { askConfirm } from "@/components/ui/AskDialog";
import { GITHUB_TEMPLATE_REPOS, TEMPLATE_CATEGORIES, TEMPLATES, type TemplateCategory, type TemplateDef } from "@/lib/data/templatesData";
import { ResumePage } from "@/components/templates/ResumePage";
import { getSampleResume } from "@/lib/data/sampleResumes";
import { readSavedResume } from "@/lib/resume";
import { deleteSavedTemplate, fetchRepoStats, getSavedTemplates, type RepoStats, type SavedTemplate } from "@/lib/templates";

function timeAgo(ms: number) {
  const min = Math.round((Date.now() - ms) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : String(n));

function TemplateCard({ t, saved }: { t: TemplateDef; saved?: SavedTemplate }) {
  const sample = getSampleResume(t.id);
  return (
    <Link href={`/templates/${t.id}`} className="brut brut-hover no-press group flex h-full flex-col rounded-2xl bg-card p-5">
      {sample && (
        // the top of the actual sample page, so students see what they get before opening it
        <span aria-hidden className="pointer-events-none -mx-5 -mt-5 mb-4 block aspect-[8.5/6] overflow-hidden rounded-t-2xl border-b-[1.5px] border-hair bg-paper-2 px-5 pt-5">
          <ResumePage doc={readSavedResume(saved?.values) ?? sample.doc} thumb />
        </span>
      )}
      <span className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-wider text-mute">
        <span className="flex items-center gap-1">
          <Clock className="size-3" aria-hidden /> {t.minutes} min
        </span>
        {saved && <span className="text-note">Saved · {timeAgo(saved.updatedAt)}</span>}
      </span>
      <span className="label-cond mt-3 block text-[21px] leading-tight">{t.title}</span>
      <span className="mt-2 flex-1 text-[14px] leading-relaxed text-body">{t.description}</span>
      <span className="mt-4 border-t-[1.5px] border-hair pt-3 text-[12px] text-mute">
        Based on {t.sources.map((s) => s.label.split(":")[0]).filter((v, i, a) => a.indexOf(v) === i).join(", ")}
      </span>
      <span className="label-cond mt-3 inline-flex items-center gap-1 text-[16px]">
        {saved ? "Continue" : sample ? "Edit this resume" : "Fill it in"} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export default function TemplatesPage() {
  // client-only render (AppLayout), so localStorage can be read up front
  const [saved, setSaved] = useState(getSavedTemplates);
  const [cat, setCat] = useState<TemplateCategory | "all">("all");
  const [stats, setStats] = useState<Record<string, RepoStats> | null>(null);

  useEffect(() => {
    let live = true;
    fetchRepoStats(GITHUB_TEMPLATE_REPOS.map((r) => r.repo)).then((s) => live && setStats(s));
    return () => {
      live = false;
    };
  }, []);

  const savedList = Object.entries(saved)
    .map(([id, s]) => ({ t: TEMPLATES.find((x) => x.id === id), s }))
    .filter((x): x is { t: TemplateDef; s: SavedTemplate } => !!x.t)
    .sort((a, b) => b.s.updatedAt - a.s.updatedAt);

  const remove = async (t: TemplateDef) => {
    const ok = await askConfirm(`Delete your saved "${t.title}"?`, { body: "The template stays in the library; only what you filled in is removed.", ok: "Delete", danger: true });
    if (!ok) return;
    deleteSavedTemplate(t.id);
    setSaved(getSavedTemplates());
  };

  const categories = TEMPLATE_CATEGORIES.filter((c) => cat === "all" || c.id === cat);

  return (
    <div className="w-full min-w-0">
      <PageHeader eyebrow={`${TEMPLATES.length} templates · every source credited`} title="Fill in a" hl="template" note="type once, copy anywhere" />

      {savedList.length > 0 && (
        <Section kicker="Your work" title="Saved templates">
          <ul className="divide-y divide-hair overflow-hidden rounded-2xl border-[1.5px] border-hair bg-card">
            {savedList.map(({ t, s }) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                <Link href={`/templates/${t.id}`} className="group min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold group-hover:text-accent-ink">{t.title}</span>
                  <span className="block font-mono text-[11px] text-mute">
                    {TEMPLATE_CATEGORIES.find((c) => c.id === t.category)?.label} · saved {timeAgo(s.updatedAt)}
                    {t.fields.length > 0 && ` · ${Object.values(s.values).filter((v) => v.trim()).length}/${t.fields.length} fields filled`}
                  </span>
                </Link>
                <button type="button" onClick={() => remove(t)} aria-label={`Delete saved ${t.title}`} className="tap rounded-lg p-2 text-mute hover:text-danger">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:-mx-8 md:px-8">
        {[{ id: "all" as const, label: "All" }, ...TEMPLATE_CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={clsx(
              "label-cond flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1.5 text-[15px]",
              cat === c.id ? "border-ink bg-ink text-paper" : "border-hair bg-card text-body hover:border-line"
            )}
          >
            {c.label}
            <span className={clsx("font-mono text-[11px]", cat === c.id ? "text-paper/70" : "text-mute")}>
              {c.id === "all" ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === c.id).length}
            </span>
          </button>
        ))}
      </div>

      {categories.map((c) => (
        <Section key={c.id} kicker={c.blurb} title={c.label}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.filter((t) => t.category === c.id).map((t) => (
              <li key={t.id}>
                <TemplateCard t={t} saved={saved[t.id]} />
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <Section kicker="Open-source templates, live from GitHub" title="From GitHub">
        <p className="-mt-1 mb-4 max-w-[70ch] text-[14px] text-body">
          Well-known free template projects. Stars and last-update dates are fetched live from GitHub (refreshed once a day); check each project&apos;s licence before reusing it.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GITHUB_TEMPLATE_REPOS.map((r) => {
            const s = stats?.[r.repo];
            return (
              <li key={r.repo}>
                <a
                  href={s?.url ?? `https://github.com/${r.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border-[1.5px] border-hair bg-card p-5 hover:border-line hover:bg-card-2"
                >
                  <span className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-mute">
                    {r.kind}
                    <ArrowUpRight className="size-4 shrink-0 group-hover:text-ink" aria-hidden />
                  </span>
                  <span className="mt-2 block text-[16px] font-semibold">{r.title}</span>
                  <span className="block font-mono text-[11px] text-mute">{r.repo}</span>
                  <span className="mt-2 flex-1 text-[14px] leading-relaxed text-body">{r.description}</span>
                  <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t-[1.5px] border-hair pt-3 font-mono text-[12px] text-mute">
                    {s ? (
                      <>
                        <span className="flex items-center gap-1 text-ink">
                          <Star className="size-3.5 text-gold" aria-hidden /> {compact(s.stars)}
                        </span>
                        <span>updated {new Date(s.pushedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
                        {s.license && s.license !== "NOASSERTION" && <span>{s.license}</span>}
                        {s.archived && <span className="text-warning">archived</span>}
                      </>
                    ) : stats ? (
                      <span>GitHub data unavailable right now</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <GitFork className="size-3.5" aria-hidden /> loading from GitHub…
                      </span>
                    )}
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}
