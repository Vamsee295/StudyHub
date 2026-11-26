"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Diagram } from "@/components/learn/Diagram";
import { COMPANY_PROFILES } from "@/lib/data/askedIn";
import { prepFor, stagesDiagram, topicProgress } from "@/lib/data/companyPrep";
import { problemStorage } from "@/lib/problems/problemStorage";
import type { CompanyWorkspaceDetail } from "@/types";

/** A company's rounds as a picture, then what to study for each round on StudyHub, with progress. */
export function CompanyPrepPlan({ workspace }: { workspace: CompanyWorkspaceDetail }) {
  // client-only render (AppLayout), so local progress is readable on first render
  const [solved] = useState(() => problemStorage.getAllStatuses());
  const official = COMPANY_PROFILES.find((p) => p.id === workspace.id || workspace.id.startsWith(`${p.id}-`))?.sources ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex min-w-0 flex-col gap-3">
        <h3 className="label-cond text-[20px]">Picture the process</h3>
        <Diagram code={stagesDiagram(workspace.hiringStages)} caption={`${workspace.name}'s typical rounds, left to right. Each round is a filter.`} />
      </div>

      <div>
        <h3 className="label-cond text-[20px]">Your prep plan for {workspace.name}</h3>
        <p className="mb-3 text-[13px] text-body">What to study for each round, in order. Practice topics show how many problems you have solved.</p>
        <ol className="flex flex-col gap-3">
          {workspace.hiringStages.map((stage) => {
            const links = prepFor(stage.tags);
            return (
              <li key={stage.stageNumber} className="grid gap-x-4 gap-y-2 rounded-2xl border-[1.5px] border-hair bg-card p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-mute">
                    Round {stage.stageNumber} · {stage.duration}
                  </p>
                  <p className="text-[15px] font-semibold">{stage.title}</p>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {links.length === 0 && <li className="text-[13px] text-mute">Revise the topics listed for this round.</li>}
                  {links.map((l) => {
                    const p = l.topic ? topicProgress(l.topic, solved) : null;
                    const done = p && p.total > 0 && p.done === p.total;
                    return (
                      <li key={l.href}>
                        <Link href={l.href} className="group flex items-center gap-2 text-[14px]">
                          {done && <CheckCircle2 aria-label="Completed" className="size-4 shrink-0 text-note" />}
                          <span className="font-semibold text-ink group-hover:text-accent-ink">{l.label}</span>
                          {p && p.total > 0 && (
                            <>
                              <span aria-hidden className="ml-auto h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-hair">
                                <span className="block h-full rounded-full bg-note" style={{ width: `${(100 * p.done) / p.total}%` }} />
                              </span>
                              <span className="w-12 shrink-0 text-right font-mono text-[11px] text-mute tabular-nums">
                                {p.done}/{p.total}
                              </span>
                            </>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      {official.length > 0 && (
        <div>
          <h3 className="label-cond mb-2 text-[18px]">From {workspace.name} and prep guides</h3>
          <ul className="flex flex-col gap-1.5">
            {official.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-ink hover:underline">
                  <ExternalLink className="size-3.5" /> {s.title}
                  {s.official && <span className="rounded bg-success-soft px-1.5 font-mono text-[10px] uppercase text-note">Official</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
