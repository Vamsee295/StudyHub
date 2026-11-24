import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { LABS } from "@/lib/labs/catalog";

/** Shared styles for lab controls and panels. */
export const focusRing = "";
export const inputCls = "w-full rounded-xl border-2 border-hair bg-card px-3 py-2 text-[15px] text-ink focus:border-accent";
export const cardCls = "rounded-2xl border-[1.5px] border-hair bg-card p-5";

export function LabShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const lab = LABS.find((l) => l.slug === slug)!;
  return (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <Link href="/labs" className="inline-flex items-center gap-1.5 self-start font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> Labs
      </Link>
      <header>
        <p className="eyebrow mb-2">{lab.course} lab</p>
        <h1 className="display text-[44px] md:text-[60px]">{lab.title}</h1>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-body">{lab.description}</p>
      </header>
      {children}
      <section className="flex flex-col gap-3 border-t-[1.5px] border-hair pt-6">
        <h2 className="label-cond flex items-center gap-2 text-[20px]">
          <BookOpen aria-hidden className="size-[18px] text-accent" /> Learn the theory
        </h2>
        <ul className="flex flex-wrap gap-2">
          {lab.lessons.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/learn/${l.subject}/${l.slug}`}
                className="inline-block rounded-full border-[1.5px] border-hair px-3.5 py-1 text-[14px] font-medium hover:border-line hover:text-accent-ink"
              >
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
