"use client";
// The landing page's interactive parts. Everything else in Landing.tsx renders on the server.
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { roadmap } from "@/lib/data/roadmap";
import { companies } from "@/lib/data/companies";
import { buttonClass } from "@/components/ui/Button";

const SIGNUP = "/login?mode=signup";
// "TCS Digital / Prime" -> "TCS", matched against roadmap testedBy entries like "TCS NQT".
const shortName = (name: string) => name.split(" ")[0];
const stagesFor = (name: string) => roadmap.filter((s) => s.testedBy.some((t) => t.startsWith(shortName(name))));
const wrap = "mx-auto w-full max-w-[1180px] px-4 md:px-8";

function CompanyCard({ index }: { index: number }) {
  const c = companies[index];
  const stages = stagesFor(c.name).slice(0, 4);
  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      {/* two sheets underneath for a hand-stacked deck */}
      <div aria-hidden className="brut absolute inset-0 translate-x-4 translate-y-3 rotate-[4deg] rounded-2xl bg-paper-2" />
      <div aria-hidden className="brut absolute inset-0 -translate-x-2 translate-y-2 -rotate-[3deg] rounded-2xl bg-card-2" />
      <div className="brut relative -rotate-1 rounded-2xl bg-card p-6 sm:p-7" aria-live="polite">
        <div key={c.name} className="fade-in"
          >
            <div className="flex items-start justify-between gap-4 border-b-[1.5px] border-dashed border-hair pb-4">
              <div>
                <p className="eyebrow">
                  {c.segment} · {c.roleTag}
                </p>
                <h2 className="display mt-1 text-[38px]">{c.name}</h2>
              </div>
              <span className="label-cond shrink-0 rounded-lg border-2 border-line px-2 py-0.5 text-[14px]">{c.focus.length} rounds</span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-body">{c.description}</p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-mute">The rounds</p>
            <ol className="mt-2 space-y-1.5">
              {c.focus.map((f, i) => (
                <li key={f} className="flex gap-3 text-[15px] font-semibold">
                  <span className="font-mono text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                  {f}
                </li>
              ))}
            </ol>
            {stages.length > 0 && (
              <>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-mute">Study these first</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {stages.map((s) => (
                    <li key={s.id} className="rounded-full border-[1.5px] border-hair bg-paper-2 px-3 py-0.5 text-[13px] font-semibold">
                      {s.title}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [picked, setPicked] = useState(Math.min(2, companies.length - 1)); // Amazon: the most-asked-about company
  return (
    <section className={`${wrap} grid items-center gap-16 pb-20 pt-12 md:pt-20 lg:grid-cols-[1.15fr_1fr]`}>
      <div>
        <p className="note -rotate-2">free placement prep for engineering students ↓</p>
        <h1 className="display mt-3 text-[52px] sm:text-[76px] xl:text-[88px]">
          Know what <br />
          {/* static block, not <Marked>: the headline must read correctly before any animation runs */}
          <span className="hl my-1 whitespace-nowrap">your company</span>
          <br />
          will ask.
        </h1>
        <p className="mt-6 max-w-[46ch] text-[18px] leading-relaxed text-body">
          The hiring rounds at each company, the subjects those rounds test, and the order to learn them in. Then you practise on the same kind of questions.
        </p>

        <p className="label-cond mt-8 text-[16px]">Pick a company:</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Companies">
          {companies.map((c, i) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={i === picked}
              onClick={() => setPicked(i)}
              className={
                "label-cond h-9 rounded-full border-2 px-4 text-[15px] transition-colors " +
                (i === picked ? "border-ink bg-ink text-paper" : "border-hair hover:border-line")
              }
            >
              {shortName(c.name)}
            </button>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link prefetch={false} href={SIGNUP} className={buttonClass("accent", "lg")}>
            Prepare for {shortName(companies[picked].name)} <ArrowRight className="size-5" />
          </Link>
          <Link prefetch={false} href="/companies" className={buttonClass("secondary", "lg")}>
            All companies
          </Link>
        </div>
      </div>
      <CompanyCard index={picked} />
    </section>
  );
}

// Click through the real roadmap: every stage's topics, an interview question and who tests it.
export function StageExplorer() {
  const [i, setI] = useState(0);
  const s = roadmap[i];
  const go = (n: number) => setI((n + roadmap.length) % roadmap.length);
  return (
    <div className="brut overflow-hidden rounded-2xl bg-card">
      <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-hair bg-paper-2 px-5 py-3">
        <span className="font-mono text-[12px] uppercase tracking-wider">
          Stage {i + 1} of {roadmap.length}
        </span>
        <span className="flex gap-1.5">
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous stage" className="tap grid size-8 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper">
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next stage" className="tap grid size-8 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper">
            <ArrowRight className="size-4" />
          </button>
        </span>
      </div>
      <ol className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-1 pt-4" aria-label="Roadmap stages">
        {roadmap.map((st, n) => (
          <li key={st.id}>
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i ? "step" : undefined}
              title={st.title}
              className={
                "no-press grid h-8 min-w-8 place-items-center rounded-lg border-2 px-1.5 font-mono text-[12px] font-bold transition-colors " +
                (n === i ? "border-ink bg-ink text-paper" : n < i ? "border-line bg-paper-2" : "border-hair text-mute hover:border-line")
              }
            >
              {String(n + 1).padStart(2, "0")}
            </button>
          </li>
        ))}
      </ol>
      <div key={s.id}
          className="fade-in px-5 pb-6 pt-4"
          aria-live="polite"
        >
          <p className="eyebrow">{s.phase}</p>
          <h4 className="display mt-1 text-[32px]">{s.title}</h4>
          <p className="mt-2 text-[15px] leading-relaxed text-body">{s.description}</p>
          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {s.topics.map((t) => (
              <li key={t} className="flex gap-2 text-[14px] font-medium leading-snug">
                <Check className="mt-0.5 size-4 shrink-0 text-note" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-night px-4 py-3.5 text-[#f5efe6]">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#f5efe6]/55">Asked in interviews</p>
            <p className="mt-1 text-[15px] font-semibold leading-snug">&ldquo;{s.sampleQuestion}&rdquo;</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-mute">Tested by</span>
            {s.testedBy.map((c) => (
              <span key={c} className="rounded-full border-[1.5px] border-hair px-2.5 py-0.5 text-[13px] font-semibold">
                {c}
              </span>
            ))}
          </div>
        </div>
      <Link prefetch={false} href="/roadmaps" className="label-cond flex items-center justify-between border-t-[1.5px] border-hair px-5 py-3.5 text-[17px] hover:bg-card-2">
        Open the full roadmap <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
