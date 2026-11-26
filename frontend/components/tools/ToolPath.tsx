"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Diagram } from "@/components/learn/Diagram";
import { TOOL_REGISTRY } from "@/lib/data/toolsData";
import { TOOL_PATH, TOOL_PATH_DIAGRAM } from "@/lib/data/toolGuides";
import { usedTools } from "@/lib/tools/recentTools";

/** Which tool to use at which stage of placement prep, with a tick for tools already opened. */
export function ToolPath() {
  // client-only render (AppLayout), so storage is readable on first render
  const [used] = useState(usedTools);
  return (
    <div className="flex flex-col gap-4">
      <Diagram code={TOOL_PATH_DIAGRAM} caption="Use tools in roughly this order as placements get closer." />
      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {TOOL_PATH.map((stage) => (
          <li key={stage.stage} className="rounded-2xl border-[1.5px] border-hair bg-card p-4">
            <p className="eyebrow">{stage.stage}</p>
            <p className="mt-0.5 text-[13px] text-mute">{stage.when}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {stage.hrefs.map((href) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-2 text-[14.5px] font-semibold">
                    {used.has(href) ? (
                      <CheckCircle2 aria-label="Used" className="size-4 shrink-0 text-note" />
                    ) : (
                      <Circle aria-hidden className="size-4 shrink-0 text-ink/25" />
                    )}
                    <span className="group-hover:text-accent-ink">{TOOL_REGISTRY[href]?.title ?? href}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
