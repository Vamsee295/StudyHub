"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { CalendarClock } from "lucide-react";
import { Diagram } from "@/components/learn/Diagram";
import { planGantt, roadmapDiagram, type MapStage } from "@/lib/roadmap/visuals";

export interface PlanItem extends MapStage {
  hoursLeft: number;
  estimated: boolean; // a self-paced stage with an estimated effort, not lesson minutes
}

const PACES = [1, 2, 3];

/** The roadmap as a map of what depends on what, and a time plan at the pace you choose. */
export function RoadmapOverview({ items }: { items: PlanItem[] }) {
  const [pace, setPace] = useState(2);
  const plan = planGantt(items, pace, new Date());
  const weeks = Math.ceil(plan.days / 7);
  const hoursLeft = Math.round(items.reduce((n, i) => n + i.hoursLeft, 0));

  return (
    <section aria-label="Roadmap overview" className="mb-10 grid gap-5">
      <div className="flex min-w-0 flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-card p-4 md:p-5">
        <p className="eyebrow">Picture the roadmap</p>
        <p className="text-[14px] text-body">
          Arrows show what to learn first. Stages side by side can run in parallel, for example OS and networks alongside DSA once the basics are done.
        </p>
        <Diagram code={roadmapDiagram(items)} caption="✓ done · ▶ you are here" />
      </div>

      <div className="flex min-w-0 flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-card p-4 md:p-5">
        <p className="eyebrow flex items-center gap-1.5">
          <CalendarClock aria-hidden className="size-3.5" /> Plan your time
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[14px] text-body">
          I can study
          <div role="group" aria-label="Hours per day" className="flex rounded-full border-[1.5px] border-hair p-0.5">
            {PACES.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={pace === p}
                onClick={() => setPace(p)}
                className={clsx("rounded-full px-3 py-0.5 text-[13.5px] font-semibold", pace === p ? "bg-ink text-paper" : "text-body hover:text-ink")}
              >
                {p} h
              </button>
            ))}
          </div>
          a day.
        </div>
        <p className="text-[15px] text-ink">
          About <b className="display text-[30px] leading-none">{weeks}</b> weeks to finish everything ({hoursLeft} hours left), around{" "}
          <b>{plan.finish.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</b>.
        </p>
        <details className="group">
          <summary className="cursor-pointer text-[13.5px] font-semibold text-accent-ink hover:underline">See the week-by-week plan</summary>
          <div className="mt-3">
            <Diagram code={plan.diagram} caption="One stage at a time, in roadmap order. Finished lessons are already taken off." />
          </div>
        </details>
        <p className="mt-auto text-[12px] leading-relaxed text-mute">
          Lesson stages use the lessons&apos; own reading times. Projects, resume, tests and interviews use rough estimates ({items.filter((i) => i.estimated).map((i) => i.name).join(", ")}). Add practice time on top.
        </p>
      </div>
    </section>
  );
}
