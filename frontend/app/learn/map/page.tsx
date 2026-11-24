"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, Search, List } from "lucide-react";
import { clsx } from "clsx";
import { buildConceptGraph, GraphNode } from "@/lib/learn/conceptGraph";
import { forceLayout } from "@/lib/learn/forceLayout";
import { getStoredProgress } from "@/lib/services/learnService";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";

const chip = (on: boolean) =>
  clsx(
    "label-cond inline-flex h-8 items-center rounded-full border-2 px-3.5 text-[14px] transition-colors",
    on ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink"
  );

const W = 1200, H = 900;

export default function ConceptMapPage() {
  const { nodes, edges } = useMemo(() => buildConceptGraph(), []);
  const pos = useMemo(() => forceLayout(nodes.map((n) => ({ id: n.id, group: n.course })), edges.map((e) => ({ ...e, weight: e.kind === "cross" ? 0.08 : 1 }))), [nodes, edges]);
  const courses = useMemo(() => [...new Map(nodes.map((n) => [n.course, n.courseTitle])).entries()], [nodes]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, w: W, h: H });
  const [listMode, setListMode] = useState(false);
  const [progress] = useState<Record<string, number>>(() => {
    const store = getStoredProgress();
    const done = (n: GraphNode) => n.lessons.filter((l) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed").length;
    return Object.fromEntries(nodes.map((n) => [n.id, n.lessons.length ? done(n) / n.lessons.length : 0]));
  });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);


  const focus = selected ?? hovered;
  const focusCourse = (focus && byId.get(focus)?.course) || courseFilter;
  const color = (course: string) => (course === focusCourse ? "var(--accent)" : "var(--ink)");
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
    <div className="flex flex-col gap-5">
      <Link href="/learn" className="mb-6 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> Learn
      </Link>
      <PageHeader eyebrow={`${nodes.length} modules · ${edges.length} links`} title="Concept" hl="map" />
      <p className="-mt-4 max-w-3xl text-[15px] leading-relaxed text-body">
        Every module across all {courses.length} courses and how they build on each other, {edges.filter((e) => e.kind === "cross").length} links of them crossing courses. Pick a
        module to see what it needs and what it unlocks.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Search modules</span>
            <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search modules…" autoComplete="off"
              className="field w-60 pl-9" />
          </label>
          <button type="button" aria-pressed={listMode} onClick={() => setListMode((m) => !m)}
            className={clsx("label-cond inline-flex h-[42px] items-center gap-1.5 rounded-xl border-2 px-3.5 text-[15px]", listMode ? "border-ink bg-ink text-paper" : "border-hair hover:border-line")}>
            <List aria-hidden="true" className="w-4 h-4" /> List view
          </button>
          {!listMode && (
            <div className="flex gap-1 ml-auto">
              <button type="button" aria-label="Zoom in" onClick={() => zoom(0.8)} className="tap grid size-10 place-items-center rounded-xl border-2 border-hair hover:border-line"><ZoomIn aria-hidden="true" className="w-4 h-4" /></button>
              <button type="button" aria-label="Zoom out" onClick={() => zoom(1.25)} className="tap grid size-10 place-items-center rounded-xl border-2 border-hair hover:border-line"><ZoomOut aria-hidden="true" className="w-4 h-4" /></button>
              <button type="button" aria-label="Reset view" onClick={() => setView({ x: 0, y: 0, w: W, h: H })} className="tap grid size-10 place-items-center rounded-xl border-2 border-hair hover:border-line"><Maximize2 aria-hidden="true" className="w-4 h-4" /></button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by course">
          <button type="button" aria-pressed={courseFilter === null} onClick={() => setCourseFilter(null)}
            className={chip(courseFilter === null)}>All courses</button>
          {courses.map(([slug, title]) => (
            <button key={slug} type="button" aria-pressed={courseFilter === slug} onClick={() => setCourseFilter(courseFilter === slug ? null : slug)}
              className={chip(courseFilter === slug)}>
              {title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        {listMode ? (
          <section className="flex flex-col gap-6 rounded-2xl border-[1.5px] border-hair bg-card p-5">
            {courses.filter(([c]) => !courseFilter || c === courseFilter).map(([c, title]) => (
              <div key={c}>
                <h2 className="label-cond mb-2 text-[19px]">{title}</h2>
                <ul className="flex flex-col gap-1.5">
                  {nodes.filter((n) => n.course === c && matches(n)).map((n) => {
                    const needs = edges.filter((e) => e.to === n.id && e.kind !== "sequence");
                    return (
                      <li key={n.id} className="text-[13px]">
                        <button type="button" onClick={() => setSelected(n.id)} className={`font-medium text-ink hover:text-accent-ink rounded`}>{n.title}</button>
                        <span className="text-mute tabular-nums"> · {Math.round((progress[n.id] ?? 0) * 100)}% done</span>
                        {needs.length > 0 && <span className="text-body"> · builds on {needs.map((e) => byId.get(e.from)!.title).join(", ")}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        ) : (
          <section className="brut touch-none overflow-hidden rounded-2xl bg-card">
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
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--mute)" />
                </marker>
              </defs>
              {edges.map((e, i) => {
                const a = pos.get(e.from)!, b = pos.get(e.to)!;
                const active = neighbours && neighbours.has(e.from) && neighbours.has(e.to) && (e.from === focus || e.to === focus);
                return (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} markerEnd="url(#arrow)"
                    stroke={active ? "var(--accent)" : e.kind === "cross" ? "var(--mute)" : "var(--border-strong)"}
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
                    <circle r={r} fill="var(--card)" stroke={color(n.course)} strokeWidth={selected === n.id ? 4 : 2.4} />
                    {done > 0 && <circle r={r * Math.sqrt(done)} fill="var(--note)" />}
                    {showLabel(n) && (
                      <text y={-r - 5} textAnchor="middle" fontSize="12" fontWeight={selected === n.id ? 700 : 500} fill="var(--ink)" stroke="var(--card)" strokeWidth="3" paintOrder="stroke">{n.title}</text>
                    )}
                    <title>{`${n.courseTitle}: ${n.title} (${n.lessons.length} lessons, ${Math.round(done * 100)}% done)`}</title>
                  </g>
                );
              })}
              {!neighbours && !courseFilter && !q && courses.map(([c, title]) => {
                const ps = nodes.filter((n) => n.course === c).map((n) => pos.get(n.id)!);
                const x = ps.reduce((s, p) => s + p.x, 0) / ps.length, y = Math.min(...ps.map((p) => p.y)) - 18;
                return <text key={c} x={x} y={y} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--mute)" stroke="var(--card)" strokeWidth="4" paintOrder="stroke">{title}</text>;
              })}
            </svg>
            <p className="border-t-[1.5px] border-hair px-4 py-2 font-mono text-[11px] text-mute">
              Drag to pan, scroll to zoom. Solid lines follow each course&apos;s order; dashed lines link courses. Filled circles show your progress.
            </p>
          </section>
        )}

        <aside className="flex flex-col gap-4 rounded-2xl border-[1.5px] border-hair bg-card p-5 lg:sticky lg:top-4" aria-live="polite">
          {sel ? (
            <>
              <div className="flex flex-col gap-1">
                <span className="eyebrow">{sel.courseTitle}</span>
                <h2 className="display text-[28px]">{sel.title}</h2>
                <span className="text-[12px] text-mute tabular-nums">{sel.lessons.length} lessons · {Math.round((progress[sel.id] ?? 0) * 100)}% done</span>
              </div>
              <Link href={`/learn/${sel.course}/${sel.lessons[0]?.slug ?? ""}`} className={buttonClass("primary", "sm")}>Start this module</Link>
              {[["Builds on", incoming, "from"], ["Unlocks", outgoing, "to"]].map(([label, list, end]) => (
                <div key={label as string} className="flex flex-col gap-1.5">
                  <h3 className="font-mono text-[11px] uppercase tracking-wider text-mute">{label as string}</h3>
                  {(list as typeof edges).length === 0 ? <p className="text-[13px] text-mute">Nothing</p> : (
                    <ul className="flex flex-col gap-1.5">
                      {(list as typeof edges).map((e) => {
                        const other = byId.get(e[end as "from" | "to"])!;
                        return (
                          <li key={other.id} className="text-[13px]">
                            <button type="button" onClick={() => setSelected(other.id)} className={`font-medium text-ink hover:text-accent-ink text-left rounded`}>
                              {other.course !== sel.course && <span className="text-mute">{other.courseTitle}: </span>}{other.title}
                            </button>
                            {e.kind !== "sequence" && <p className="text-[12px] text-body">{e.reason}</p>}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-mute">Lessons</h3>
                <ol className="flex flex-col gap-1 list-decimal pl-5">
                  {sel.lessons.map((l) => (
                    <li key={l.slug} className="text-[13px]">
                      <Link href={`/learn/${sel.course}/${l.slug}`} className={`text-body hover:text-accent-ink rounded`}>{l.title}</Link>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-body">Select a module on the map or in the list to see its prerequisites, what it unlocks and its lessons.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
