"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useProfile } from "@/components/providers/ProfileProvider";
import { Section } from "@/components/ui/Page";
import { CompanyLogo } from "@/components/companies/CompanyLogo";
import { askedAt, problems } from "@/lib/problems/problemRegistry";
import { problemStorage } from "@/lib/problems/problemStorage";
import { COMPANIES, companyById, companyByName } from "@/lib/data/companyData";

const TOP = 12;
const POPULAR = ["google", "amazon", "microsoft", "tcs-prime"];
const dot = (d: string) => (d === "Easy" ? "bg-note" : d === "Medium" ? "bg-gold" : "bg-accent");

/** Real interview data on the practice hub: the problems most companies ask, and progress on your target companies' questions. */
export function AskedInInterviews() {
  // client-only render (AppLayout), so local progress is readable on first render
  const [statuses] = useState(() => problemStorage.getAllStatuses());
  const { draftProfile } = useProfile();
  const solved = (id: string) => statuses[id] === "solved";

  const all = Object.values(problems);
  const favourites = all
    .map((p) => ({ p, at: askedAt(p.id) }))
    .filter((x) => x.at.length > 0)
    .sort((a, b) => b.at.length - a.at.length || b.at[0].frequency - a.at[0].frequency)
    .slice(0, TOP);

  const mine = (draftProfile.targets?.companies ?? []).map(companyByName).filter((c) => !!c);
  const targets = [...new Map((mine.length ? mine : POPULAR.map(companyById)).filter((c) => !!c).map((c) => [c!.id, c!])).values()].slice(0, 4);
  const targetRows = targets.map((c) => {
    const ids = all.filter((p) => p.companies?.includes(c.name)).map((p) => p.id);
    return { c, total: ids.length, done: ids.filter(solved).length };
  });

  return (
    <>
      <Section title="Asked the most" kicker="Real interview data">
        <p className="-mt-2 mb-5 max-w-2xl text-[15px] text-body">
          The problems here that the most companies ask, from {COMPANIES.length} companies&apos; reported interview questions. Solve these first if you&apos;re short on time.
        </p>
        <ol className="grid gap-x-6 sm:grid-cols-2">
          {favourites.map(({ p, at }, i) => (
            <li key={p.id} className="border-b-[1.5px] border-hair">
              <Link href={`/practice/problems/${p.id}`} className="group flex items-center gap-3 py-3">
                <span className="w-6 shrink-0 font-mono text-[12px] text-mute">{i + 1}</span>
                {solved(p.id) ? <CheckCircle2 aria-label="Solved" className="size-4 shrink-0 text-note" /> : <Circle aria-hidden className="size-4 shrink-0 text-ink/25" />}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-semibold group-hover:text-accent-ink">{p.title}</span>
                    <span aria-label={p.difficulty} title={p.difficulty} className={clsx("size-2 shrink-0 rounded-full", dot(p.difficulty))} />
                  </span>
                  <span className="block truncate text-[12.5px] text-mute">{at.slice(0, 4).map((c) => c.name).join(", ")}{at.length > 4 ? "…" : ""}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-[15px] font-semibold leading-none">{at.length}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-mute">companies</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={mine.length ? "Your target companies" : "Popular companies"} kicker="Practise for a company" href="/profile/target-companies">
        <p className="-mt-2 mb-5 max-w-2xl text-[15px] text-body">
          {mine.length
            ? "How many of each target company's reported questions you've solved here."
            : "Set your target companies in your profile to see your progress on their questions. Until then, here are popular ones."}
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {targetRows.map(({ c, total, done }) => (
            <li key={c.id}>
              <Link href={`/practice/problems?company=${encodeURIComponent(c.name)}`} className="group flex h-full flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-card p-4 transition-colors hover:border-ink/40">
                <span className="flex items-center gap-3">
                  <CompanyLogo company={c} size={36} />
                  <span className="label-cond text-[18px] leading-tight group-hover:text-accent-ink">{c.name}</span>
                </span>
                <span className="text-[14px] text-body">
                  <b className="display text-[26px] leading-none text-ink">{done}</b> of {total} solved
                </span>
                <span className="h-2 overflow-hidden rounded-full bg-paper-2" aria-hidden>
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${total ? (100 * done) / total : 0}%` }} />
                </span>
                <span className="mt-auto flex items-center gap-1 font-mono text-[12px] uppercase tracking-wider text-accent-ink">
                  Practise these <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
