// Building blocks for the beginner theory on each lab page: numbered steps, analogies,
// key terms, formulas, worked examples, figures and a quick self-check.
import type { ReactNode } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";

export interface LabContent {
  /** What a beginner will be able to do after this page. */
  learn: string[];
  minutes: number;
  /** Plain-language steps for using the visualizer. */
  guide: string[];
  check: { q: string; a: ReactNode }[];
  Theory: () => ReactNode;
}

/** One numbered step of the explanation. */
export function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t-[1.5px] border-hair py-8 md:grid-cols-[64px_minmax(0,1fr)]">
      <p aria-hidden className="display text-[44px] leading-none text-accent md:text-[52px]">
        {String(n).padStart(2, "0")}
      </p>
      <div className="min-w-0">
        <h2 className="display mb-4 text-[28px] md:text-[34px]">{title}</h2>
        <div className="space-y-4 text-[16px] leading-[1.75] text-body [&_strong]:font-semibold [&_strong]:text-ink">{children}</div>
      </div>
    </section>
  );
}

/** An everyday comparison that makes the idea concrete. */
export function Analogy({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border-[1.5px] border-note/40 bg-note/[0.07] p-4 text-[15px] leading-relaxed text-ink">
      <Lightbulb className="mt-0.5 size-5 shrink-0 text-note" aria-hidden />
      <div>
        <span className="mr-1 font-mono text-[11px] font-bold uppercase tracking-wider text-note">Think of it like</span>
        {children}
      </div>
    </div>
  );
}

/** Key words with one-line meanings. */
export function Terms({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-hair overflow-hidden rounded-xl border-[1.5px] border-hair bg-card">
      {items.map(([term, def]) => (
        <div key={term} className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
          <dt className="font-semibold text-ink">{term}</dt>
          <dd className="text-[15px] leading-relaxed text-body">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A formula, set apart in mono. */
export function Formula({ children }: { children: ReactNode }) {
  return <p className="overflow-x-auto rounded-xl bg-paper-2 px-4 py-3 font-mono text-[14px] leading-relaxed text-ink">{children}</p>;
}

/** A worked example with real numbers. */
export function Worked({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border-[1.5px] border-hair bg-card p-5">
      <p className="eyebrow mb-2">Worked example · {title}</p>
      <div className="space-y-3 text-[15px] leading-relaxed text-body">{children}</div>
    </div>
  );
}

/** A diagram with a caption. Diagrams are inline SVG coloured from the theme tokens. */
export function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="rounded-xl border-[1.5px] border-hair bg-card p-4 md:p-5">
      <div className="overflow-x-auto">{children}</div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-mute">{caption}</figcaption>
    </figure>
  );
}

/** Quick self-check: questions with answers you reveal. */
export function Check({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <ol className="space-y-3">
      {items.map((it, i) => (
        <li key={it.q} className="rounded-xl border-[1.5px] border-hair bg-card">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-xl px-4 py-3.5 [&::-webkit-details-marker]:hidden">
              <span className="flex gap-3 text-[15px] font-semibold leading-snug text-ink">
                <span className="font-mono text-[12px] leading-6 text-accent-ink">Q{i + 1}</span>
                {it.q}
              </span>
              <span className="flex shrink-0 items-center gap-1 pt-0.5 font-mono text-[11px] uppercase tracking-wider text-mute">
                <span className="group-open:hidden">Answer</span>
                <span className="hidden group-open:inline">Hide</span>
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
              </span>
            </summary>
            <div className="border-t-[1.5px] border-hair px-4 py-3.5 text-[15px] leading-relaxed text-body">{it.a}</div>
          </details>
        </li>
      ))}
    </ol>
  );
}

/** Shared SVG text styles so diagrams match the page typography. */
export const svgText = { fontFamily: "var(--font-mono-jb), ui-monospace, monospace", fill: "var(--ink)" } as const;
export const svgMute = { fontFamily: "var(--font-mono-jb), ui-monospace, monospace", fill: "var(--mute)" } as const;
