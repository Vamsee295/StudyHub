"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { roadmap } from "@/lib/data/roadmap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Roadmap() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const stage = roadmap[active];

  return (
    <section id="roadmap" className="border-b border-border bg-surface-subdued/40">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader
          eyebrow="Execution Pipeline"
          title="From baseline fundamentals to offer letter"
          description="Click each milestone to inspect syllabus focus, interview criteria and vetted preparation drills."
        />

        {/* horizontal stepper */}
        <RevealGroup className="elevate-1 rounded-xl px-5 py-5 mb-4 overflow-x-auto" stagger={0.04}>
          <div className="flex items-center min-w-max">
            {roadmap.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <RevealItem direction="scale">
                  <button
                    onClick={() => setActive(i)}
                    className={`pill whitespace-nowrap transition-colors gap-1.5 ${
                      i === active
                        ? "bg-accent text-white border border-accent"
                        : "pill-neutral hover:border-accent"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${i === active ? "bg-white" : "bg-border-strong"}`} />
                    {s.title.split(" ").slice(0, 2).join(" ")}
                  </button>
                </RevealItem>
                {i < roadmap.length - 1 && <ChevronRight size={14} className="mx-1 text-ink-tertiary shrink-0" />}
              </div>
            ))}
          </div>
        </RevealGroup>

        {/* detail panel */}
        <div className="elevate-1 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between gap-4 flex-wrap px-5 py-4 border-b border-border bg-surface-subdued/60">
            <div>
              <span className="pill pill-neutral">{stage.phase}</span>
              <h3 className="font-display text-lg font-medium mt-2">{stage.title}</h3>
            </div>
            <a href="#" className="btn-secondary text-[13px] h-9 px-3.5">
              Open {stage.title.split(" ")[0]} Track <ChevronRight size={14} className="arrow" />
            </a>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={reduced ? undefined : { opacity: 0, x: 8 }}
              animate={reduced ? undefined : { opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="p-5 md:p-6"
            >
              <p className="text-ink-secondary text-[14.5px] leading-relaxed mb-6 max-w-2xl">
                {stage.description}
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-surface-subdued rounded-lg p-4">
                  <p className="tag-mono text-ink-tertiary uppercase mb-3">What You Will Master</p>
                  <ul className="space-y-2">
                    {stage.topics.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[13.5px]">
                        <Check size={14} className="text-accent mt-0.5 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-surface-subdued rounded-lg p-4">
                  <p className="tag-mono text-ink-tertiary uppercase mb-3">Recommended Resource</p>
                  <div className="bg-surface border border-border rounded-md p-3">
                    <p className="font-medium text-[13.5px] leading-tight">{stage.resourceHighlight.title}</p>
                    <p className="text-ink-tertiary text-[12px] mt-1">{stage.resourceHighlight.detail}</p>
                  </div>
                  <p className="text-[13px] text-ink-secondary italic mt-4 border-l-2 border-accent-soft-border pl-3">
                    &ldquo;{stage.sampleQuestion}&rdquo;
                  </p>
                </div>

                <div className="bg-surface-subdued rounded-lg p-4">
                  <p className="tag-mono text-ink-tertiary uppercase mb-3">Frequently Tested By</p>
                  <div className="flex flex-wrap gap-2">
                    {stage.testedBy.map((c) => (
                      <span key={c} className="pill bg-surface border border-border text-ink">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
