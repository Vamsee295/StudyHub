"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { concepts } from "@/lib/data/concepts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function ConceptDecoder() {
  const [activeKey, setActiveKey] = useState(concepts[0].key);
  const reduced = useReducedMotion();
  const active = concepts.find((c) => c.key === activeKey) ?? concepts[0];

  return (
    <section id="decoder" className="border-b border-border">
      <div className="container-max px-5 md:px-8 py-16 md:py-20 max-w-4xl mx-auto">
        <SectionHeader
          align="center"
          eyebrow="Cognitive Mental Models"
          title="CS Concept Decoder: understand, don't memorize"
          description="Interviewers rarely ask for a dictionary definition — they're checking whether you have an operating mental model."
        />

        <Reveal direction="scale" className="elevate-2 rounded-xl p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2 pb-5 mb-5 border-b border-border">
            <span className="tag-mono text-ink-tertiary uppercase mr-1">Select concept:</span>
            {concepts.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveKey(c.key)}
                className={`pill whitespace-nowrap transition-colors ${
                  active.key === c.key ? "bg-accent text-white border border-accent" : "pill-neutral hover:border-accent"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-surface-subdued rounded-lg p-4">
                <p className="tag-mono text-accent uppercase mb-1.5">Plain English Meaning</p>
                <p className="text-[14.5px] font-medium leading-relaxed">{active.simple}</p>
              </div>

              <div className="bg-surface-subdued rounded-lg p-4">
                <p className="tag-mono text-ink-tertiary uppercase mb-1.5">Real-World Engineering Analogy</p>
                <p className="text-[14px] leading-relaxed">{active.analogy}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-surface-subdued border border-border rounded-lg p-4">
                  <p className="tag-mono text-ink-tertiary uppercase mb-1.5">What Interviewers Look For</p>
                  <p className="text-[13.5px] leading-relaxed">{active.interview}</p>
                </div>
                <div className="bg-error-soft border border-error-soft-border rounded-lg p-4">
                  <p className="tag-mono text-error uppercase mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle size={12} /> Common Gotcha / Trap
                  </p>
                  <p className="text-[13.5px] leading-relaxed text-ink">{active.mistake}</p>
                </div>
              </div>

              <div className="pt-1">
                <p className="tag-mono text-ink-tertiary uppercase mb-2">Related Architectural Terms</p>
                <div className="flex flex-wrap gap-2">
                  {active.related.map((r) => (
                    <span key={r} className="pill pill-neutral">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
