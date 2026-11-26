"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Mermaid is ~1 MB, so it loads only when a lesson actually shows a diagram, and only once.
let mermaidLoad: Promise<(typeof import("mermaid"))["default"]> | null = null;
const loadMermaid = () => (mermaidLoad ??= import("mermaid").then((m) => m.default));
let renderSeq = 0;

// re-render diagrams when the reader switches between light and dark
const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const readTheme = () => document.documentElement.dataset.theme ?? "paper";

/** Natural width of a Mermaid SVG, from its viewBox. */
// (split, don't pattern-match the numbers: Mermaid sometimes writes them like 9.5367431640625e-7)
const svgWidth = (svg: string) => Number(svg.match(/viewBox="([^"]+)"/)?.[1].trim().split(/[\s,]+/)[2] ?? 0) || 0;

/** Give the SVG a real pixel width (charts come back as width="100%"), so CSS can shrink it to fit but never
 *  blows it up or collapses it to the browser's 300px default. */
function withNaturalWidth(svg: string): string {
  const w = svgWidth(svg);
  if (!w) return svg;
  return svg.replace(/<svg([^>]*?)\swidth="[^"]*"/, `<svg$1 width="${Math.round(w)}"`).replace(/(<svg[^>]*?)\sstyle="max-width:[^"]*"/, "$1");
}

/** The same flowchart drawn the other way round (left-to-right ↔ top-to-bottom), or null for other diagrams. */
function flipped(code: string): string | null {
  const m = code.match(/^(\s*(?:flowchart|graph)\s+)(LR|RL|TB|TD|BT)\b/);
  if (!m) return null;
  return code.replace(m[0], `${m[1]}${m[2] === "LR" || m[2] === "RL" ? "TB" : "LR"}`);
}

/**
 * A diagram written as Mermaid text (flowchart, sequence, state, class, ER…), drawn in the site's colours.
 * It always fits its frame: a flowchart too wide for the space is redrawn in the other direction when that
 * is narrower, and anything still too wide is scaled down. Nothing scrolls sideways.
 * Our own lesson data is the only input; Mermaid's strict security level sanitises the SVG it returns.
 */
export function Diagram({ code, caption }: { code: string; caption?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "paper");
  const frame = useRef<HTMLDivElement>(null);
  // frame width in 40px steps, so resizing re-picks the layout without re-rendering on every pixel
  const [space, setSpace] = useState(0);
  const [out, setOut] = useState<{ key: string; svg: string | null }>({ key: "", svg: null });
  const key = `${theme}|${space}|${code}`;

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => setSpace(Math.floor((el.clientWidth - 32) / 40) * 40); // minus the frame's padding
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!space) return;
    const narrow = space < 560;
    let live = true;
    loadMermaid()
      .then(async (mermaid) => {
        const css = getComputedStyle(document.documentElement);
        const v = (name: string) => css.getPropertyValue(name).trim();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          themeVariables: {
            fontSize: narrow ? "14px" : "15px",
            background: v("--card"),
            primaryColor: v("--paper"),
            primaryTextColor: v("--ink"),
            primaryBorderColor: v("--ink"),
            secondaryColor: v("--card"),
            tertiaryColor: v("--card"),
            lineColor: v("--ink"),
            textColor: v("--ink"),
            mainBkg: v("--paper"),
            nodeBorder: v("--ink"),
            clusterBkg: v("--card"),
            clusterBorder: v("--ink"),
            edgeLabelBackground: v("--card"),
            noteBkgColor: v("--card"),
            noteTextColor: v("--ink"),
            noteBorderColor: v("--accent"),
            actorBkg: v("--paper"),
            actorBorder: v("--ink"),
            actorTextColor: v("--ink"),
            signalColor: v("--ink"),
            signalTextColor: v("--ink"),
            labelBoxBkgColor: v("--paper"),
            labelBoxBorderColor: v("--ink"),
            activationBkgColor: v("--card"),
            activationBorderColor: v("--accent"),
            // charts need strong data colours, not the paper tone used for boxes
            pie1: v("--accent"),
            pie2: v("--note"),
            pie3: v("--gold"),
            pie4: v("--ink"),
            pieStrokeColor: v("--card"),
            pieTitleTextColor: v("--ink"),
            pieSectionTextColor: v("--card"),
            pieLegendTextColor: v("--ink"),
            xyChart: {
              backgroundColor: v("--card"),
              titleColor: v("--ink"),
              xAxisLabelColor: v("--ink"),
              yAxisLabelColor: v("--ink"),
              xAxisLineColor: v("--ink"),
              yAxisLineColor: v("--ink"),
              xAxisTickColor: v("--ink"),
              yAxisTickColor: v("--ink"),
              plotColorPalette: [v("--accent"), v("--note"), v("--gold")].join(","),
            },
          },
          // natural size out of Mermaid; fitting to the frame happens below and in CSS.
          // On narrow frames (phones) everything is drawn more compactly so it needs less shrinking.
          flowchart: {
            curve: "basis",
            htmlLabels: false,
            useMaxWidth: false,
            ...(narrow ? { wrappingWidth: 120, nodeSpacing: 24, rankSpacing: 32, padding: 8 } : {}),
          },
          sequence: narrow
            ? { useMaxWidth: false, width: 96, actorMargin: 16, boxMargin: 6, messageMargin: 26, wrap: true, actorFontSize: 13, messageFontSize: 13, noteFontSize: 12 }
            : { useMaxWidth: false },
          xyChart: { width: Math.max(260, Math.min(space, 700)), height: Math.round(Math.max(260, Math.min(space, 700)) * 0.62) },
          // Gantt charts otherwise assume a very wide page when drawn off-screen
          gantt: { useMaxWidth: false, useWidth: Math.max(300, space), fontSize: 13, sectionFontSize: 13, barHeight: 22 },
          state: { useMaxWidth: false },
          class: { useMaxWidth: false },
          er: { useMaxWidth: false },
        });
        let { svg } = await mermaid.render(`dgm-${++renderSeq}`, code);
        // too wide for the frame? try the flowchart the other way round and keep the narrower one
        const alt = svgWidth(svg) > space ? flipped(code) : null;
        if (alt) {
          const other = (await mermaid.render(`dgm-${++renderSeq}`, alt)).svg;
          if (svgWidth(other) < svgWidth(svg)) svg = other;
        }
        if (live) setOut({ key, svg: withNaturalWidth(svg) });
      })
      .catch(() => live && setOut({ key, svg: null }));
    return () => {
      live = false;
    };
  }, [key, code, space]);

  const ready = out.key === key;
  return (
    <figure className="flex flex-col gap-2">
      <div ref={frame} className="rounded-xl border-[1.5px] border-hair bg-card p-4" tabIndex={0} role="img" aria-label={caption ?? "Diagram"}>
        {ready && out.svg ? (
          // scale down (never up) to the frame width, keeping the aspect ratio
          <div className="mx-auto w-fit max-w-full [&_svg]:!h-auto [&_svg]:!max-w-full" dangerouslySetInnerHTML={{ __html: out.svg }} />
        ) : ready ? (
          // couldn't draw it: show the source so nothing is lost
          <pre className="whitespace-pre-wrap font-mono text-[13px] text-body">{code}</pre>
        ) : (
          <div aria-hidden className="h-40 animate-pulse rounded-lg bg-paper-2" />
        )}
      </div>
      {caption && <figcaption className="text-center text-[13.5px] leading-snug text-mute">{caption}</figcaption>}
    </figure>
  );
}

/** A picture with a caption and credit line. Opens full size in a new tab. */
export function Figure({ src, alt, caption, credit, href }: { src: string; alt: string; caption?: string; credit?: string; href?: string }) {
  return (
    <figure className="flex flex-col gap-2">
      <a href={href ?? src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border-[1.5px] border-hair bg-white p-3">
        {/* external, licensed images (Wikimedia Commons etc.): a plain img works for any host */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="mx-auto h-auto max-h-[420px] w-auto max-w-full" />
      </a>
      {(caption || credit) && (
        <figcaption className="text-center text-[13.5px] leading-snug text-mute">
          {caption}
          {credit && <span className="block text-[12px]">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
