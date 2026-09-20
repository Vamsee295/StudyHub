"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Search } from "lucide-react";
import { resources } from "@/lib/data/resources";
import { companies } from "@/lib/data/companies";

const searchExamples = [
  "Java OOP",
  "SQL interview questions",
  "DSA roadmap",
  "DBMS",
  "TCS preparation",
  "Resume template",
];

const stats = [
  { value: "1.2M+", label: "Tech interview guides" },
  { value: "150+", label: "Verified company blueprints" },
  { value: "40", label: "Learning tracks in DSA" },
  { value: "94.2%", label: "Students report feeling ready" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const headY = useTransform(scrollYProgress, [0, 1], [0, -26]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.1]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const searchScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const searchOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  const results = useMemo(() => {
    if (!query.trim()) return { res: [], co: [] };
    const q = query.toLowerCase();
    return {
      res: resources.filter(
        (r) => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
      ),
      co: companies.filter((c) => c.name.toLowerCase().includes(q)),
    };
  }, [query]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden border-b border-border">
      <motion.div
        style={reduced ? undefined : { y: gridY }}
        className="absolute inset-0 grid-texture grid-fade-mask pointer-events-none"
      />

      <div className="relative container-max px-5 md:px-8 pt-20 pb-14 md:pt-28 md:pb-16 text-center">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 text-[13px] text-ink-secondary border border-border rounded-full px-3 py-1 mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Built for engineering students, 2026 placement season
        </motion.div>

        <motion.h1
          style={reduced ? undefined : { y: headY }}
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-[38px] leading-[1.12] sm:text-5xl md:text-[56px] md:leading-[1.08] font-medium tracking-tight max-w-3xl mx-auto"
        >
          Everything you need to prepare for your first tech job.
        </motion.h1>

        <motion.p
          style={reduced ? undefined : { opacity: subOpacity }}
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="text-ink-secondary text-[16.5px] md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed"
        >
          Structured roadmaps, technical resources, company preparation, practice and career
          tools — mapped into one system instead of five hundred PDFs.
        </motion.p>

        <motion.div
          style={reduced ? undefined : { opacity: ctaOpacity, y: ctaY }}
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-8 flex items-center justify-center gap-3 flex-wrap"
        >
          <Link href="/login" className="btn-primary">
            Start Preparing
          </Link>
          <a href="#resources" className="btn-secondary">
            Explore Resources
          </a>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { scale: searchScale, opacity: searchOpacity }}
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          className="mt-10 max-w-xl mx-auto text-left"
        >
          <div className="elevate-1 rounded-xl p-1.5 flex items-center gap-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-shadow">
            <Search size={18} className="ml-2 shrink-0 text-ink-tertiary" />
            <input
              id="hero-search"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value) setShowResults(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && setShowResults(true)}
              placeholder="What do you want to learn?"
              className="flex-1 bg-transparent outline-none text-[15px] py-2"
            />
            <button
              onClick={() => setShowResults(true)}
              className="bg-ink text-white text-[13.5px] font-medium px-3.5 py-2 rounded-lg shrink-0 hover:opacity-90 transition"
            >
              Search
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {searchExamples.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setQuery(ex);
                  setShowResults(true);
                }}
                className="text-[12.5px] text-ink-secondary border border-border rounded-full px-3 py-1 hover:border-accent transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          {showResults && query.trim() && (
            <div className="mt-4 elevate-1 rounded-lg p-4 text-[14px]">
              <p className="text-ink-secondary mb-2">Results for &ldquo;{query}&rdquo;</p>
              {results.res.length === 0 && results.co.length === 0 ? (
                <p className="text-ink-secondary">
                  No exact match in this preview — try &ldquo;DSA&rdquo;, &ldquo;SQL&rdquo;, or &ldquo;TCS&rdquo;.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {results.res.map((r) => (
                    <div key={r.title} className="py-2 flex items-center justify-between">
                      <span>{r.title}</span>
                      <span className="pill pill-neutral">{r.category}</span>
                    </div>
                  ))}
                  {results.co.map((c) => (
                    <div key={c.name} className="py-2 flex items-center justify-between">
                      <span>{c.name} preparation guide</span>
                      <span className="pill pill-accent">Company</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left"
        >
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <p className="font-display text-xl text-accent font-medium">{s.value}</p>
              <p className="text-ink-secondary text-[12px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
