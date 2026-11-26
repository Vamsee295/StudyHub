import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Diagram } from "@/components/learn/Diagram";
import { PIPELINES, ROUND_TYPES } from "@/lib/data/companyPrep";

/** For someone who has never been through campus hiring: the usual pipelines, and what each round checks. */
export function HiringBasics() {
  return (
    <section aria-labelledby="hiring-basics" className="flex flex-col gap-6">
      <div>
        <p className="eyebrow">New to placements? Start here</p>
        <h2 id="hiring-basics" className="display mt-1 text-[32px] md:text-[40px]">
          How campus hiring works
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] text-body">
          Most companies follow one of two shapes. Know which rounds you will face, what each one checks, and where to prepare for it on StudyHub.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {PIPELINES.map((p) => (
          <div key={p.title} className="flex min-w-0 flex-col gap-3 rounded-2xl border-[1.5px] border-hair bg-card p-4 md:p-5">
            <h3 className="label-cond text-[18px]">{p.title}</h3>
            <Diagram code={p.diagram} caption={p.caption} />
          </div>
        ))}
      </div>

      <div>
        <h3 className="label-cond mb-3 text-[20px]">Every kind of round, explained</h3>
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ROUND_TYPES.map((r) => (
            <li key={r.name} className="flex flex-col rounded-2xl border-[1.5px] border-hair bg-card p-4">
              <p className="text-[15.5px] font-semibold">{r.name}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-body">
                <span className="font-semibold text-ink">Checks: </span>
                {r.checks}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-body">
                <span className="font-semibold text-ink">Prepare: </span>
                {r.prep}
              </p>
              <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3">
                {r.links.map((l) => (
                  <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline">
                    {l.label} <ArrowRight className="size-3.5" />
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
