"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  aiRoles, aiTargets, aiTimelines, aiBaselines, planLibrary, AIRoleValue,
} from "@/lib/data/ai";
import { resources } from "@/lib/data/resources";
import { practiceCategories } from "@/lib/data/practice";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function AICopilot() {
  const [role, setRole] = useState<AIRoleValue>("swe");
  const [target, setTarget] = useState(aiTargets[0].value);
  const [timeline, setTimeline] = useState(aiTimelines[0].value);
  const [baseline, setBaseline] = useState(aiBaselines[0].value);
  const reduced = useReducedMotion();

  const stages = planLibrary[role];
  const roleLabel = aiRoles.find((r) => r.value === role)!.label;
  const timelineLabel = aiTimelines.find((t) => t.value === timeline)!.label;
  const baselineLabel = aiBaselines.find((b) => b.value === baseline)!.label;

  return (
    <section id="ai" className="border-b border-border bg-white">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader
          eyebrow="Autonomous Planning"
          title="Build a preparation plan around you"
          description="A working frontend prototype on local sample logic — no account or external AI API required yet."
        />

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          <Reveal direction="left" className="elevate-1 rounded-xl p-6 space-y-5 h-fit">
            <div>
              <label className="text-[13px] text-ink-secondary block mb-1.5">Target role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AIRoleValue)}
                className="field w-full"
              >
                {aiRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[13px] text-ink-secondary block mb-1.5">Hiring target</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="field w-full">
                {aiTargets.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[13px] text-ink-secondary block mb-1.5">Current baseline</label>
              <div className="flex flex-col gap-2">
                {aiBaselines.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setBaseline(b.value)}
                    className={`text-left rounded-md py-2 px-3 text-[13px] border transition-colors ${
                      baseline === b.value
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-ink-secondary"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[13px] text-ink-secondary block mb-1.5">Preparation timeline</label>
              <div className="flex gap-2">
                {aiTimelines.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTimeline(t.value)}
                    className={`flex-1 rounded-md py-2 text-[12.5px] border transition-colors ${
                      timeline === t.value
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-ink-secondary"
                    }`}
                  >
                    {t.value}d
                  </button>
                ))}
              </div>
            </div>
            <div className="btn-primary w-full cursor-default select-none">
              <Sparkles size={14} /> Plan updates live
            </div>
          </Reveal>

          <Reveal direction="right" className="elevate-1 rounded-xl p-6 md:p-7">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div>
                <p className="tag-mono text-ink-tertiary uppercase mb-1">Generated Plan</p>
                <h3 className="font-display text-xl font-medium">{roleLabel}</h3>
                <p className="text-ink-secondary text-[13px] mt-1">
                  {timelineLabel} · {baselineLabel.split(" (")[0]} · {aiTargets.find((t) => t.value === target)!.label}
                </p>
              </div>
              <span className="pill pill-neutral">Sample logic — no account needed</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${role}-${baseline}-${timeline}-${target}`}
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ staggerChildren: 0.06 }}
                className="space-y-3 mb-6"
              >
                {stages.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={reduced ? undefined : { opacity: 0, x: -12 }}
                    animate={reduced ? undefined : { opacity: 1, x: 0 }}
                    transition={{ delay: reduced ? 0 : i * 0.08, duration: 0.35 }}
                    className="border border-border rounded-lg p-4 flex items-start justify-between gap-4 flex-wrap"
                  >
                    <div>
                      <span className="pill pill-accent mb-2 inline-block">{s.label}</span>
                      <p className="font-medium text-[14.5px] mb-1">{s.title}</p>
                      <p className="text-ink-secondary text-[13px] leading-relaxed max-w-lg">
                        {s.description}
                      </p>
                    </div>
                    <span className="tag-mono text-ink-tertiary shrink-0">{s.metric}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="grid sm:grid-cols-3 gap-4 text-[13.5px] pt-4 border-t border-border">
              <div>
                <p className="text-ink-secondary mb-1">Weak areas (sample)</p>
                <p>{baseline === "beginner" ? "DSA, DBMS" : baseline === "intermediate" ? "System Design" : "Advanced DSA"}</p>
              </div>
              <div>
                <p className="text-ink-secondary mb-1">Recommended resource</p>
                <p>{resources[0].title}</p>
              </div>
              <div>
                <p className="text-ink-secondary mb-1">Practice</p>
                <p>
                  {practiceCategories[0].name} — {practiceCategories[0].questions} questions
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
