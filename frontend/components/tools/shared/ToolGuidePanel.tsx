"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Compass } from "lucide-react";
import { Diagram } from "@/components/learn/Diagram";
import { TOOL_GUIDES } from "@/lib/data/toolGuides";
import { toolVisitCount } from "@/lib/tools/recentTools";

/** "How to use this tool well": open on a first visit, folded away after that. */
export function ToolGuidePanel() {
  const pathname = usePathname();
  const guide = TOOL_GUIDES[pathname];
  // read before this visit is counted; client-only render (AppLayout), so storage is readable here
  const [firstVisit] = useState(() => toolVisitCount(pathname) === 0);
  if (!guide) return null;

  return (
    <details open={firstVisit} className="group mb-8 rounded-2xl border-[1.5px] border-hair bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <Compass aria-hidden className="size-[18px] text-accent" />
        <span className="label-cond text-[18px]">How to get the most from this tool</span>
        <ChevronDown aria-hidden className="ml-auto size-4 text-mute transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-4 border-t-[1.5px] border-hair px-5 pb-5 pt-4">
        <p className="max-w-3xl text-[15px] leading-relaxed text-body">{guide.plain}</p>
        <Diagram code={guide.diagram} />
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow mb-1.5">Do it like this</p>
            <ol className="list-decimal space-y-1 pl-5 text-[14px] text-body marker:font-mono marker:text-mute">
              {guide.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
          <div>
            <p className="eyebrow mb-1.5">Pairs well with</p>
            <ul className="flex flex-col gap-1.5">
              {guide.pairsWith.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink hover:underline">
                    {p.label} <ArrowRight className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </details>
  );
}
