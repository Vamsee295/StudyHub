"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { kmapLinks, kmapNodes, childrenOf } from "@/lib/data/knowledgeMap";
import { SectionHeader } from "@/components/ui/SectionHeader";

function nodeDelay(id: string): number {
  const node = kmapNodes.find((n) => n.id === id)!;
  const sameDepth = kmapNodes.filter((n) => n.depth === node.depth);
  const idx = sameDepth.findIndex((n) => n.id === id);
  if (node.depth === 0) return 0;
  if (node.depth === 1) return 0.25 + idx * 0.09;
  return 0.8 + idx * 0.055;
}

export function KnowledgeMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  const byId = useMemo(() => Object.fromEntries(kmapNodes.map((n) => [n.id, n])), []);
  const play = inView || !!reduced;

  const hotLinkIds = new Set(
    hovered
      ? kmapLinks
          .filter(([a, b]) => a === hovered || b === hovered)
          .map(([a, b]) => `${a}-${b}`)
      : []
  );
  const hotNodeIds = new Set(
    hovered
      ? [hovered, ...kmapLinks.filter(([a, b]) => a === hovered || b === hovered).flatMap(([a, b]) => [a, b])]
      : []
  );

  return (
    <section id="kmap" className="border-b border-border bg-white">
      <div className="container-max px-5 md:px-8 py-16 md:py-20">
        <SectionHeader
          align="center"
          eyebrow="09 — Placement Knowledge Map"
          title="Interactive placement knowledge map"
          description="Hover a node to trace its connections. Click to jump to that topic."
        />

        <div
          ref={ref}
          className="elevate-1 rounded-xl p-4 md:p-6 overflow-x-auto relative"
        >
          <svg viewBox="0 0 920 380" width="920" height="380" className="min-w-[720px]">
            {kmapLinks.map(([a, b]) => {
              const A = byId[a], B = byId[b];
              const x1 = A.x + 40, y1 = A.y + 10, x2 = B.x + 40, y2 = B.y + 10;
              const mx = (x1 + x2) / 2;
              const hot = hotLinkIds.has(`${a}-${b}`);
              return (
                <motion.path
                  key={`${a}-${b}`}
                  d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                  fill="none"
                  stroke={hot ? "var(--accent)" : "var(--border-strong)"}
                  strokeWidth={hot ? 2 : 1.3}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={play ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: reduced ? 0 : nodeDelay(b), ease: "easeOut" }}
                  style={{ transition: "stroke 0.15s ease, stroke-width 0.15s ease" }}
                />
              );
            })}

            {kmapNodes.map((n) => {
              const hot = hotNodeIds.has(n.id);
              const r = n.depth === 0 ? 7 : 5;
              return (
                <motion.g
                  key={n.id}
                  className="cursor-pointer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={play ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.45, delay: reduced ? 0 : nodeDelay(n.id), ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ transformOrigin: `${n.x + 40}px ${n.y + 10}px` }}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseMove={(e) => {
                    const host = ref.current?.getBoundingClientRect();
                    if (!host) return;
                    setTip({ x: e.clientX - host.left + 14, y: e.clientY - host.top + 10 });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => document.getElementById("hero-search")?.focus()}
                >
                  <circle
                    cx={n.x + 40}
                    cy={n.y + 10}
                    r={r}
                    stroke={hot ? "var(--accent)" : "var(--border-strong)"}
                    strokeWidth={1.4}
                    fill={n.depth === 0 ? "var(--ink)" : hot ? "var(--accent-soft)" : "var(--surface)"}
                    style={{ filter: hot ? "drop-shadow(0 0 5px var(--accent))" : "none", transition: "all .15s ease" }}
                  />
                  <text
                    x={n.x + 40 + r + 6}
                    y={n.y + 14}
                    fontFamily="var(--font-jetbrains)"
                    fontSize={n.depth === 0 ? 12 : 11}
                    fontWeight={n.depth === 0 || hot ? 600 : 400}
                    fill={hot ? "var(--accent-hover)" : n.depth === 0 ? "var(--ink)" : "var(--ink-secondary)"}
                  >
                    {n.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>

          {hovered && tip && (
            <div
              className="absolute pointer-events-none elevate-2 rounded-lg px-3 py-2 text-[12.5px] max-w-[220px] z-10"
              style={{ left: tip.x, top: tip.y }}
            >
              <p className="font-medium mb-0.5">{byId[hovered].label}</p>
              {childrenOf(hovered).length > 0 && (
                <p className="text-ink-secondary">{childrenOf(hovered).join(" · ")}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
