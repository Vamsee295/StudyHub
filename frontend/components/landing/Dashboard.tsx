"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Flame, ArrowRight, Target } from "lucide-react";
import { dashboardSkills, dashboardStats } from "@/lib/data/ai";
import { SectionHeader } from "@/components/ui/SectionHeader";

function useCountUp(target: number, play: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!play) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, target, duration]);
  return value;
}

export function Dashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const play = inView || !!reduced;
  const score = useCountUp(dashboardStats.readiness, play);
  const solved = useCountUp(dashboardStats.problemsSolved, play, 1100);

  return (
    <section id="dashboard" className="border-b border-border">
      <div className="container-max px-5 md:px-8 py-16 md:py-20 max-w-5xl mx-auto">
        <SectionHeader eyebrow="Mission Control" title="Your personal readiness dashboard" />

        <div ref={ref} className="elevate-1 rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-[220px_1fr]">
            <div className="p-5 border-b md:border-b-0 md:border-r border-border bg-surface-subdued/50">
              <div className="flex items-center justify-between mb-1">
                <p className="text-ink-secondary text-[13px]">Readiness Score</p>
                {play && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                    className="pill pill-accent"
                  >
                    Live
                  </motion.span>
                )}
              </div>
              <p className="font-display text-4xl font-medium text-accent">{score}%</p>
              <p className="text-ink-secondary text-[12.5px] mt-2 leading-relaxed">
                Composite of DSA, core CS, aptitude and mock interview scores.
              </p>
              {play && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                  className="flex items-center justify-between mt-4 pt-4 border-t border-border text-[12.5px]"
                >
                  <span className="inline-flex items-center gap-1.5 text-warning font-medium">
                    <Flame size={14} /> {dashboardStats.streakDays} Days
                  </span>
                  <span className="text-ink-tertiary">
                    {solved}/{dashboardStats.problemsTarget}
                  </span>
                </motion.div>
              )}
            </div>

            <div>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 p-5">
                {dashboardSkills.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-[13.5px] w-36 shrink-0">{s.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-accent-soft overflow-hidden">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={play ? { width: `${s.value}%` } : {}}
                        transition={{ duration: 0.9, delay: reduced ? 0 : 0.15 + i * 0.08 }}
                      />
                    </div>
                    <span className="text-[12.5px] text-ink-secondary w-9 text-right">{s.value}%</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-5 flex items-center justify-between gap-4 flex-wrap bg-surface-subdued/40">
                <p className="text-[12.5px] text-ink-secondary flex items-start gap-2 max-w-md">
                  <Target size={15} className="text-accent shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium text-ink">Next priority task: </span>
                    {dashboardStats.nextTask}
                  </span>
                </p>
                <a href="#" className="btn-primary h-9 px-4 text-[13px]">
                  Get Full Report <ArrowRight size={13} className="arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
