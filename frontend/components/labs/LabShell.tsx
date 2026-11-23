import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { LABS } from "@/lib/labs/catalog";

export const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";
export const inputCls = `w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[14px] text-[var(--ink)] ${focusRing}`;
export const cardCls = "p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]";

export function LabShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const lab = LABS.find((l) => l.slug === slug)!;
  return (
    <div className="flex flex-col gap-6 pb-16 w-full max-w-5xl">
      <Link href="/labs" className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] self-start rounded ${focusRing}`}>
        <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> All labs
      </Link>
      <header className="flex flex-col gap-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--ink-tertiary)]">{lab.course} lab</span>
        <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">{lab.title}</h1>
        <p className="text-[var(--ink-secondary)] text-[15px] max-w-3xl">{lab.description}</p>
      </header>
      {children}
      <section className="flex flex-col gap-2 border-t border-[var(--border)] pt-5">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-2">
          <BookOpen aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" /> Learn the theory
        </h2>
        <ul className="flex flex-wrap gap-2">
          {lab.lessons.map((l) => (
            <li key={l.slug}>
              <Link href={`/learn/${l.subject}/${l.slug}`} className={`inline-block px-3 py-1.5 rounded-lg border border-[var(--border)] text-[13px] text-[var(--ink)] hover:border-[var(--accent)] ${focusRing}`}>
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
