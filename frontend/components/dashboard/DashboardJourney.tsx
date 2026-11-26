"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Diagram } from "@/components/learn/Diagram";
import { Progress, Section } from "@/components/ui/Page";
import { journeyDiagram, snapshot } from "@/lib/dashboard/journey";

/** Getting started (until done), the journey from zero to interview-ready, and the three next steps. */
export function DashboardJourney({ targetCompanies }: { targetCompanies: string[] }) {
  // client-only render (AppLayout), so local progress is readable on first render
  const [s] = useState(() => snapshot(targetCompanies));
  const doneCount = s.checklist.filter((c) => c.done).length;
  const allDone = doneCount === s.checklist.length;

  return (
    <>
      {s.next.length > 0 && (
        <Section title="Do these next" kicker="Your next steps">
          <ol className="grid gap-3 md:grid-cols-3">
            {s.next.map((n, i) => (
              <li key={n.href}>
                <Link href={n.href} className="brut brut-hover no-press group flex h-full flex-col rounded-2xl bg-card p-4">
                  <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-mute">
                    <span>
                      {i + 1} · {n.kind}
                    </span>
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-2 text-[16px] font-semibold leading-snug group-hover:text-accent-ink">{n.title}</span>
                  <span className="mt-1 text-[13px] text-body">{n.note}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {!allDone && (
        <Section title="Getting started" kicker={`${doneCount} of ${s.checklist.length} done`}>
          <div className="rounded-2xl border-[1.5px] border-hair bg-card p-4 md:p-5">
            <p className="mb-3 text-[14px] text-body">New to StudyHub? These first steps set up everything else. Each one takes a few minutes.</p>
            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {s.checklist.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="group flex items-center gap-2.5 rounded-lg py-1.5 text-[14.5px]">
                    {c.done ? <CheckCircle2 aria-label="Done" className="size-5 shrink-0 text-note" /> : <Circle aria-hidden className="size-5 shrink-0 text-ink/25" />}
                    <span className={clsx(c.done ? "text-mute line-through" : "font-medium group-hover:text-accent-ink")}>{c.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Progress value={(100 * doneCount) / s.checklist.length} className="mt-4" />
          </div>
        </Section>
      )}

      <Section title="Your journey" kicker="Zero to interview-ready">
        <div className="flex min-w-0 flex-col gap-4">
          <Diagram code={journeyDiagram(s.stages, s.current)} caption="A stage counts as done at 80%. You don't need everything perfect to move on." />
          <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {s.stages.map((st, i) => (
              <li key={st.name}>
                <Link
                  href={st.href}
                  className={clsx(
                    "group flex h-full flex-col rounded-2xl border-[1.5px] bg-card p-4 transition-colors hover:border-ink/40",
                    i === s.current ? "border-accent" : "border-hair"
                  )}
                >
                  <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-mute">
                    Stage {i + 1}
                    {i === s.current && <span className="rounded-full bg-accent px-1.5 py-px text-[9.5px] text-paper">Now</span>}
                    {i < s.current && <CheckCircle2 aria-label="Done" className="size-4 text-note" />}
                  </span>
                  <span className="mt-1.5 text-[15.5px] font-semibold group-hover:text-accent-ink">{st.name}</span>
                  <span className="mt-0.5 text-[12.5px] text-mute">{st.detail}</span>
                  <Progress value={st.pct} className="mt-auto pt-3" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
