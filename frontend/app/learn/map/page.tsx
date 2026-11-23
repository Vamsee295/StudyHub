"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, Search, List, Share2 } from "lucide-react";
import { clsx } from "clsx";
import { buildConceptGraph, GraphNode } from "@/lib/learn/conceptGraph";
import { forceLayout } from "@/lib/learn/forceLayout";
import { getStoredProgress } from "@/lib/services/learnService";

const W = 1200, H = 900;
const PALETTE = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9", "#a855f7", "#14b8a6", "#f97316", "#84cc16", "#ec4899", "#64748b", "#06b6d4", "#d946ef"];
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

export default function ConceptMapPage() {
  const { nodes, edges } = useMemo(() => buildConceptGraph(), []);
  const pos = useMemo(() => forceLayout(nodes.map((n) => ({ id: n.id, group: n.course })), edges.map((e) => ({ ...e, weight: e.kind === "cross" ? 0.08 : 1 }))), [nodes, edges]);
  const courses = useMemo(() => [...new Map(nodes.map((n) => [n.course, n.courseTitle])).entries()], [nodes]);
  const color = useMemo(() => new Map(courses.map(([c], i) => [c, PALETTE[i % PALETTE.length]])), [courses]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, w: W, h: H });
  const [listMode, setListMode] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Completion per module from the learner's saved lesson progress (keyed by lesson id or slug).
  useEffect(() => {
    const store = getStoredProgress();
    const done = (n: GraphNode) => n.lessons.filter((l) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed").length;
    setProgress(Object.fromEntries(nodes.map((n) => [n.id, n.lessons.length ? done(n) / n.lessons.length : 0])));
  }, [nodes]);

  const focus = selected ?? hovered;
  const neighbours = useMemo(() => {
    if (!focus) return null;
    const s = new Set([focus]);
    for (const e of edges) { if (e.from === focus) s.add(e.to); if (e.to === focus) s.add(e.from); }
    return s;
  }, [focus, edges]);
  const q = query.trim().toLowerCase();
  const matches = (n: GraphNode) => (!courseFilter || n.course === courseFilter) && (!q || n.title.toLowerCase().includes(q) || n.courseTitle.toLowerCase().includes(q));
  const dim = (id: string) => (neighbours ? !neighbours.has(id) : !matches(byId.get(id)!));

  const zoom = (factor: number) => setView((v) => {
    const w = Math.min(W * 1.5, Math.max(200, v.w * factor)), h = (w * H) / W;
    return { x: v.x + (v.w - w) / 2, y: v.y + (v.h - h) / 2, w, h };
  });
  const toSvg = (dx: number, dy: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect ? { dx: (dx * view.w) / rect.width, dy: (dy * view.h) / rect.height } : { dx: 0, dy: 0 };
  };

  const sel = selected ? byId.get(selected) : null;
  const incoming = sel ? edges.filter((e) => e.to === sel.id) : [];
  const outgoing = sel ? edges.filter((e) => e.from === sel.id) : [];
  const showLabel = (n: GraphNode) => (neighbours ? neighbours.has(n.id) : (courseFilter === n.course || (!!q && matches(n))));

  return (
    <div className="flex flex-col gap-5 pb-16 w-full">
      <Link href="/learn" className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] self-start rounded ${focusRing}`}>
        <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to Learn
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight flex items-center gap-3">
          <Share2 aria-hidden="true" className="w-7 h-7 text-[var(--accent)]" /> Concept Map
        </h1>
        <p className="text-[var(--ink-secondary)] text-[15px] max-w-3xl">
          Every module across all {courses.length} courses and how they build on each other. {nodes.length} modules, {edges.length} links, {edges.filter((e) => e.kind === "cross").length} of them across courses. Select a module to see what it needs and what it unlocks.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Search modules</span>
            <Search aria-hidden="true" className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-tertiary)]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search modules…" autoComplete="off"
              className={`pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[13px] text-[var(--ink)] w-56 ${focusRing}`} />
          </label>
          <button type="button" aria-pressed={listMode} onClick={() => setListMode((m) => !m)}
            className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px]", focusRing, listMode ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--ink)]")}>
            <List aria-hidden="true" className="w-4 h-4" /> List view
          </button>
          {!listMode && (
            <div className="flex gap-1 ml-auto">
              <button type="button" aria-label="Zoom in" onClick={() => zoom(0.8)} className={`p-2 rounded-lg border border-[var(--border)] text-[var(--ink)] ${focusRing}`}><ZoomIn aria-hidden="true" className="w-4 h-4" /></button>
              <button type="button" aria-label="Zoom out" onClick={() => zoom(1.25)} className={`p-2 rounded-lg border border-[var(--border)] text-[var(--ink)] ${focusRing}`}><ZoomOut aria-hidden="true" className="w-4 h-4" /></button>
              <button type="button" aria-label="Reset view" onClick={() => setView({ x: 0, y: 0, w: W, h: H })} className={`p-2 rounded-lg border border-[var(--border)] text-[var(--ink)] ${focusRing}`}><Maximize2 aria-hidden="true" className="w-4 h-4" /></button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by course">
          <button type="button" aria-pressed={courseFilter === null} onClick={() => setCourseFilter(null)}
            className={clsx("px-2.5 py-1 rounded-full border text-[12px]", focusRing, courseFilter === null ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--border)] text-[var(--ink-secondary)]")}>All courses</button>
          {courses.map(([slug, title]) => (
            <button key={slug} type="button" aria-pressed={courseFilter === slug} onClick={() => setCourseFilter(courseFilter === slug ? null : slug)}
              className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[12px]", focusRing, courseFilter === slug ? "text-[var(--ink)] font-semibold" : "text-[var(--ink-secondary)]")}
              style={{ borderColor: courseFilter === slug ? color.get(slug) : undefined }}>
              <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: color.get(slug) }} />{title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        {listMode ? (
          <section className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-5">
            {courses.filter(([c]) => !courseFilter || c === courseFilter).map(([c, title]) => (
              <div key={c}>
                <h2 className="text-[13px] font-bold text-[var(--ink)] mb-2">{title}</h2>
                <ul className="flex flex-col gap-1.5">
                  {nodes.filter((n) => n.course === c && matches(n)).map((n) => {
                    const needs = edges.filter((e) => e.to === n.id && e.kind !== "sequence");
                    return (
                      <li key={n.id} className="text-[13px]">
                        <button type="button" onClick={() => setSelected(n.id)} className={`font-medium text-[var(--ink)] hover:text-[var(--accent)] rounded ${focusRing}`}>{n.title}</button>
                        <span className="text-[var(--ink-tertiary)] tabular-nums"> · {Math.round((progress[n.id] ?? 0) * 100)}% done</span>
                        {needs.length > 0 && <span className="text-[var(--ink-secondary)]"> · builds on {needs.map((e) => byId.get(e.from)!.title).join(", ")}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        ) : (
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden touch-none">
            <svg ref={svgRef} viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} className="w-full h-auto block cursor-grab active:cursor-grabbing select-none"
              role="img" aria-label="Concept map of all course modules. Use the list view for a text version."
              onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; }}
              onPointerMove={(e) => {
                if (!drag.current) return;
                const { dx, dy } = toSvg(e.clientX - drag.current.x, e.clientY - drag.current.y);
                setView((v) => ({ ...v, x: drag.current!.vx - dx, y: drag.current!.vy - dy }));
              }}
              onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}
              onWheel={(e) => zoom(e.deltaY < 0 ? 0.9 : 1.1)}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-tertiary)" />
                </marker>
              </defs>
              {edges.map((e, i) => {
                const a = pos.get(e.from)!, b = pos.get(e.to)!;
                const active = neighbours && neighbours.has(e.from) && neighbours.has(e.to) && (e.from === focus || e.to === focus);
                return (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} markerEnd="url(#arrow)"
                    stroke={active ? "var(--accent)" : e.kind === "cross" ? "var(--ink-tertiary)" : "var(--border-strong, #cbd5e1)"}
                    strokeWidth={active ? 2.2 : e.kind === "cross" ? 1.2 : 1}
                    strokeDasharray={e.kind === "cross" ? "4 3" : undefined}
                    opacity={neighbours ? (active ? 1 : 0.08) : (dim(e.from) && dim(e.to) ? 0.1 : 0.6)} />
                );
              })}
              {nodes.map((n) => {
                const p = pos.get(n.id)!;
                const r = 6 + Math.min(6, n.lessons.length);
                const done = progress[n.id] ?? 0;
                const faded = dim(n.id);
                return (
                  <g key={n.id} transform={`translate(${p.x},${p.y})`} opacity={faded ? 0.15 : 1} className="cursor-pointer"
                    onPointerEnter={() => setHovered(n.id)} onPointerLeave={() => setHovered(null)}
                    onClick={(e) => { e.stopPropagation(); setSelected(selected === n.id ? null : n.id); }}>
                    <circle r={r} fill="var(--surface)" stroke={color.get(n.course)} strokeWidth={selected === n.id ? 4 : 2.5} />
                    {done > 0 && <circle r={r * Math.sqrt(done)} fill={color.get(n.course)} />}
                    {showLabel(n) && (
                      <text y={-r - 5} textAnchor="middle" fontSize="12" fontWeight={selected === n.id ? 700 : 500} fill="var(--ink)" stroke="var(--surface)" strokeWidth="3" paintOrder="stroke">{n.title}</text>
                    )}
                    <title>{`${n.courseTitle}: ${n.title} (${n.lessons.length} lessons, ${Math.round(done * 100)}% done)`}</title>
                  </g>
                );
              })}
              {!neighbours && !courseFilter && !q && courses.map(([c, title]) => {
                const ps = nodes.filter((n) => n.course === c).map((n) => pos.get(n.id)!);
                const x = ps.reduce((s, p) => s + p.x, 0) / ps.length, y = Math.min(...ps.map((p) => p.y)) - 18;
                return <text key={c} x={x} y={y} textAnchor="middle" fontSize="13" fontWeight="700" fill={color.get(c)} stroke="var(--surface)" strokeWidth="4" paintOrder="stroke">{title}</text>;
              })}
            </svg>
            <p className="px-4 py-2 text-[11.5px] text-[var(--ink-tertiary)] border-t border-[var(--border)]">
              Drag to pan, scroll to zoom. Solid lines follow each course&apos;s order; dashed lines link courses. Filled circles show your progress.
            </p>
          </section>
        )}

        <aside className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-4 lg:sticky lg:top-4" aria-live="polite">
          {sel ? (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: color.get(sel.course) }}>{sel.courseTitle}</span>
                <h2 className="text-[18px] font-semibold text-[var(--ink)]">{sel.title}</h2>
                <span className="text-[12px] text-[var(--ink-tertiary)] tabular-nums">{sel.lessons.length} lessons · {Math.round((progress[sel.id] ?? 0) * 100)}% done</span>
              </div>
              <Link href={`/learn/${sel.course}/${sel.lessons[0]?.slug ?? ""}`} className={`px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-[13px] font-bold text-center ${focusRing}`}>Start this module</Link>
              {[["Builds on", incoming, "from"], ["Unlocks", outgoing, "to"]].map(([label, list, end]) => (
                <div key={label as string} className="flex flex-col gap-1.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-tertiary)]">{label as string}</h3>
                  {(list as typeof edges).length === 0 ? <p className="text-[13px] text-[var(--ink-tertiary)]">Nothing</p> : (
                    <ul className="flex flex-col gap-1.5">
                      {(list as typeof edges).map((e) => {
                        const other = byId.get(e[end as "from" | "to"])!;
                        return (
                          <li key={other.id} className="text-[13px]">
                            <button type="button" onClick={() => setSelected(other.id)} className={`font-medium text-[var(--ink)] hover:text-[var(--accent)] text-left rounded ${focusRing}`}>
                              {other.course !== sel.course && <span className="text-[var(--ink-tertiary)]">{other.courseTitle}: </span>}{other.title}
                            </button>
                            {e.kind !== "sequence" && <p className="text-[12px] text-[var(--ink-secondary)]">{e.reason}</p>}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-tertiary)]">Lessons</h3>
                <ol className="flex flex-col gap-1 list-decimal pl-5">
                  {sel.lessons.map((l) => (
                    <li key={l.slug} className="text-[13px]">
                      <Link href={`/learn/${sel.course}/${l.slug}`} className={`text-[var(--ink-secondary)] hover:text-[var(--accent)] rounded ${focusRing}`}>{l.title}</Link>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-[var(--ink-secondary)]">Select a module on the map or in the list to see its prerequisites, what it unlocks and its lessons.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
