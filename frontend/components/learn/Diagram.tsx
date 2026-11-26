"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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

/**
 * A diagram written as Mermaid text (flowchart, sequence, state, class, ER…), drawn in the site's colours.
 * Our own lesson data is the only input; Mermaid's strict security level sanitises the SVG it returns.
 */
export function Diagram({ code, caption }: { code: string; caption?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "paper");
  const [out, setOut] = useState<{ key: string; svg: string | null }>({ key: "", svg: null });
  const key = `${theme}|${code}`;

  useEffect(() => {
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
            fontSize: "15px",
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
          // Box-and-arrow diagrams keep their natural size so the text stays readable on phones;
          // wide ones scroll sideways inside the frame. Charts (pie, xy, gantt) still shrink to fit.
          flowchart: { curve: "basis", htmlLabels: false, useMaxWidth: false },
          sequence: { useMaxWidth: false },
          state: { useMaxWidth: false },
          class: { useMaxWidth: false },
          er: { useMaxWidth: false },
        });
        const { svg } = await mermaid.render(`dgm-${++renderSeq}`, code);
        if (live) setOut({ key, svg });
      })
      .catch(() => live && setOut({ key, svg: null }));
    return () => {
      live = false;
    };
  }, [key, code]);

  const ready = out.key === key;
  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-x-auto rounded-xl border-[1.5px] border-hair bg-card p-4" tabIndex={0} role="img" aria-label={caption ?? "Diagram"}>
        {ready && out.svg ? (
          <div className="mx-auto w-fit [&_svg]:h-auto" dangerouslySetInnerHTML={{ __html: out.svg }} />
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
