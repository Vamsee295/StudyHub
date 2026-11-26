"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, Calculator, Code2, FileText, Gauge, MessageSquareText, Building2, Timer, Layers, Star, Database, ExternalLink, FlaskConical, type LucideIcon } from "lucide-react";
import { PageHeader, Section } from "@/components/ui/Page";
import { TOOLS, TOOL_GROUPS, type ToolItem } from "@/lib/data/toolsData";
import { recentToolItems } from "@/lib/tools/recentTools";
import { ToolPath } from "@/components/tools/ToolPath";
import { EXTERNAL_TOOLS } from "@/lib/data/toolGuides";
import { LABS } from "@/lib/labs/catalog";

const ICONS: Record<string, LucideIcon> = {
  "/tools/interview-simulator": MessageSquareText,
  "/tools/tech-questions": Layers,
  "/tools/star-builder": Star,
  "/tools/resume-analyzer": FileText,
  "/tools/company-prep": Building2,
  "/tools/dsa-visualizer": Code2,
  "/tools/cgpa-converter": Calculator,
  "/tools/readiness-calculator": Gauge,
  "/tools/aptitude-timer": Timer,
};

function ToolCard({ tool, feature }: { tool: ToolItem; feature?: boolean }) {
  const Icon = ICONS[tool.href] ?? ArrowRight;
  return (
    <Link
      href={tool.href}
      className={clsx("brut brut-hover no-press group flex flex-col rounded-2xl bg-card", feature ? "p-6 md:p-7" : "p-5")}
    >
      <span className="flex items-center justify-between gap-3">
        <span className={clsx("grid place-items-center rounded-xl border-2 border-line", feature ? "size-12 bg-accent text-paper" : "size-10 bg-paper-2 text-ink")}>
          <Icon className={feature ? "size-6" : "size-5"} aria-hidden />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-mute">{tool.badge}</span>
      </span>
      <span className={clsx("label-cond mt-4 block", feature ? "text-[28px] leading-none" : "text-[21px] leading-tight")}>{tool.title}</span>
      <span className={clsx("mt-2 block leading-relaxed text-body", feature ? "max-w-[46ch] text-[16px]" : "text-[14px]")}>{tool.description}</span>
      {feature && (
        <ol className="mt-5 grid gap-2 border-t-[1.5px] border-hair pt-4 text-[14px] text-body sm:grid-cols-3">
          {["Answer out loud", "Reveal the model answer and the trap", "Rate yourself; reread what you missed"].map((s, i) => (
            <li key={s} className="flex gap-2">
              <span className="font-mono text-[12px] font-bold leading-5 text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      )}
      <span className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-mute">{tool.meta}</span>
        <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

/** Calculators are small, single-purpose: a dense row reads better than three big cards. */
function CalculatorRow({ tools }: { tools: ToolItem[] }) {
  return (
    <ul className="grid divide-y divide-hair overflow-hidden rounded-2xl border-[1.5px] border-hair bg-card md:grid-cols-3 md:divide-x md:divide-y-0">
      {tools.map((t) => {
        const Icon = ICONS[t.href] ?? Calculator;
        return (
          <li key={t.href}>
            <Link href={t.href} className="group flex h-full items-start gap-3.5 p-5 hover:bg-card-2">
              <Icon className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="label-cond text-[19px] leading-tight">{t.title}</span>
                  <ArrowRight className="size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
                </span>
                <span className="mt-1 block text-[14px] leading-relaxed text-body">{t.description}</span>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-wider text-mute">{t.meta}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function ToolsPage() {
  // AppLayout renders pages only on the client, so localStorage can be read up front
  const [recent] = useState(() => recentToolItems(3));
  const byGroup = (g: string) => TOOLS.filter((t) => t.group === g);
  const [interview, resume, coding, calculators] = TOOL_GROUPS.map((g) => byGroup(g.name));

  return (
    <div className="w-full min-w-0">
      <PageHeader eyebrow={`${TOOLS.length} tools`} title="Tools for" hl="placement" note="use them between lessons" />

      {recent.length > 0 && (
        <Section kicker="Recent" title="Pick up where you left off">
          <ul className="grid gap-3 md:grid-cols-3">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={r.href} className="group flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-hair bg-card px-4 py-3.5 hover:border-line hover:bg-card-2">
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold">{r.title}</span>
                    <span className="block font-mono text-[11px] text-mute">
                      {r.timeAgo} · {r.meta}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section kicker="New here? Start with this" title="Which tool, when">
        <ToolPath />
      </Section>

      <Section kicker={TOOL_GROUPS[0].blurb} title="Interview prep">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          {interview[0] && <ToolCard tool={interview[0]} feature />}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {interview.slice(1).map((t) => (
              <ToolCard key={t.href} tool={t} />
            ))}
          </div>
        </div>
      </Section>

      <div className="grid gap-x-8 lg:grid-cols-[2fr_1fr]">
        <Section kicker={TOOL_GROUPS[1].blurb} title="Resume & companies">
          <div className="grid gap-5 sm:grid-cols-2">
            {resume.map((t) => (
              <ToolCard key={t.href} tool={t} />
            ))}
          </div>
        </Section>
        <Section kicker={TOOL_GROUPS[2].blurb} title="Coding">
          <div className="grid gap-4">
            {coding.map((t) => (
              <ToolCard key={t.href} tool={t} />
            ))}
            <Link href="/practice/sql" className="group flex items-center gap-3 rounded-xl border-[1.5px] border-hair bg-card px-4 py-3 text-[14px] hover:bg-card-2">
              <Database className="size-4 shrink-0 text-accent-ink" aria-hidden />
              <span className="min-w-0 flex-1">
                Looking for SQL? <span className="font-semibold">It&apos;s in Practice → SQL Lab</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </Section>
      </div>

      <Section kicker={TOOL_GROUPS[3].blurb} title="Calculators & trackers">
        <CalculatorRow tools={calculators} />
      </Section>

      <Section kicker="Learn it, then play with it" title="Interactive labs">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LABS.map((l) => (
            <li key={l.slug}>
              <Link href={`/labs/${l.slug}`} className="group flex h-full flex-col rounded-2xl border-[1.5px] border-hair bg-card p-4 transition-colors hover:border-ink/40">
                <span className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-mute">
                  <span className="inline-flex items-center gap-1.5">
                    <FlaskConical aria-hidden className="size-3.5 text-accent-ink" /> {l.course}
                  </span>
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-2 text-[16px] font-semibold group-hover:text-accent-ink">{l.title}</span>
                <span className="mt-1 text-[13.5px] leading-relaxed text-body">{l.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section kicker="Free, elsewhere" title="More tools that pair well">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXTERNAL_TOOLS.map((t) => (
            <li key={t.url}>
              <a href={t.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col rounded-2xl border-[1.5px] border-hair bg-card p-4 transition-colors hover:border-ink/40">
                <span className="flex items-center justify-between gap-2 text-[15px] font-semibold group-hover:text-accent-ink">
                  {t.title}
                  <ExternalLink aria-hidden className="size-3.5 shrink-0 text-mute" />
                </span>
                <span className="mt-1 text-[13.5px] text-body">{t.why}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
