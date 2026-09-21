"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";

const pipeline = ["Learn", "Practice", "Prepare", "Build", "Interview"];

const capabilities = [
  {
    title: "Learning Paths",
    description: "Structured role-based roadmaps for SDE, AI/ML & Core CS.",
    cta: "Explore Paths",
    href: "/#learn",
  },
  {
    title: "Technical Guides",
    description: "Deep-dive notes, blueprints & curated interview collections.",
    cta: "Browse Guides",
    href: "/#resources",
  },
  {
    title: "Practice & Labs",
    description: "Interactive SQL sandboxes, code decoders & placement tools.",
    cta: "Open Labs",
    href: "/#labs",
  },
];

export function BrandPanel() {
  const reduced = useReducedMotion();
  const fade = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: 0.04 + i * 0.07, ease: "easeOut" as const },
        };

  return (
    <section className="lg:w-[48%] relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-border bg-[#f4f4f1] overflow-hidden">
      <div className="absolute inset-0 auth-grid-light pointer-events-none" />
      <div className="absolute inset-0 auth-ambient-glow pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="relative z-10">
        <motion.div {...fade(0)} className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-medium text-ink-secondary hover:text-ink transition-colors px-3 py-1.5 rounded-md border border-border bg-white shadow-2xs"
          >
            <ArrowLeft size={13} className="text-accent transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-soft-border bg-accent-soft text-[11px] tag-mono font-medium text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            2026 CYCLE PREPARATION
          </div>
        </motion.div>

        <motion.div {...fade(1)} className="mt-8 sm:mt-12 flex items-center gap-3">
          <StudyHubLogo href="/" size="lg" showBadge={false} />
        </motion.div>
      </header>

      <motion.div {...fade(2)} className="relative z-10 my-10 sm:my-14 lg:my-0">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-[40px] leading-[1.18] text-ink tracking-tight font-normal max-w-xl">
          Everything you need to prepare for your first tech job.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-ink-secondary leading-relaxed max-w-lg">
          Structured roadmaps, technical resources, company preparation, practice environments,
          and career tools — mapped into one connected system.
        </p>

        <div className="mt-8 pt-6 border-t border-border grid grid-cols-5 gap-2 text-center">
          {pipeline.map((step, i) => (
            <div key={step} className="p-2.5 rounded-lg bg-white border border-border shadow-2xs">
              <span className="text-accent font-semibold block mb-0.5 tag-mono text-[11px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-medium text-ink text-[10.5px] tag-mono uppercase">{step}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.footer {...fade(3)} className="relative z-10 pt-6 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {capabilities.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group p-3.5 rounded-lg bg-white border border-border shadow-2xs flex flex-col justify-between hover:border-accent transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-ink">{c.title}</div>
                <div className="text-xs text-ink-secondary mt-1 leading-snug">{c.description}</div>
              </div>
              <div className="mt-2.5 flex items-center gap-1 text-[10px] tag-mono text-accent font-medium uppercase">
                <span>{c.cta}</span>
                <ArrowRight size={11} className="arrow" />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-5 text-[11px] tag-mono text-ink-tertiary">
          StudyHub · Engineering Placement Preparation &amp; Career Engine
        </div>
      </motion.footer>
    </section>
  );
}
