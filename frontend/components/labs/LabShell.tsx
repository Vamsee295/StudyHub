import Link from "next/link";
import { ArrowDown, ArrowLeft, BookOpen, Clock, GraduationCap, MousePointerClick } from "lucide-react";
import { LABS } from "@/lib/labs/catalog";
import { Check, type LabContent } from "@/components/labs/LabTheory";

/** Shared styles for lab controls and panels. */
export const focusRing = "";
export const inputCls = "w-full rounded-xl border-2 border-hair bg-card px-3 py-2 text-[15px] text-ink focus:border-accent";
export const cardCls = "rounded-2xl border-[1.5px] border-hair bg-card p-5";

/** Every lab reads top to bottom: theory from zero, a self-check, then the visualizer to play with. */
export function LabShell({ slug, content, children }: { slug: string; content: LabContent; children: React.ReactNode }) {
  const lab = LABS.find((l) => l.slug === slug)!;
  const { Theory } = content;
  return (
    <div className="flex w-full max-w-5xl flex-col">
      <Link href="/labs" className="mb-5 inline-flex items-center gap-1.5 self-start font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> Labs
      </Link>

      <header className="pb-8">
        <p className="eyebrow mb-2">{lab.course} lab</p>
        <h1 className="display text-[44px] md:text-[64px]">{lab.title}</h1>
        <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-body">{lab.description}</p>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] uppercase tracking-wider text-mute">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="size-3.5" aria-hidden /> Beginner, no prior knowledge needed
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden /> About {content.minutes} min to read
          </span>
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="rounded-2xl border-[1.5px] border-hair bg-card p-5">
            <p className="eyebrow mb-2.5">By the end you will be able to</p>
            <ul className="space-y-1.5 text-[15px] leading-relaxed text-ink">
              {content.learn.map((l) => (
                <li key={l} className="flex gap-2.5">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <a href="#visualizer" className="label-cond inline-flex items-center gap-1.5 self-start text-[16px] text-accent-ink hover:underline md:self-end">
            Skip to the visualizer <ArrowDown className="size-4" aria-hidden />
          </a>
        </div>
      </header>

      <Theory />

      <section className="border-t-[1.5px] border-hair py-8" aria-labelledby="check">
        <p className="eyebrow mb-1">Before you play</p>
        <h2 id="check" className="display mb-5 text-[28px] md:text-[34px]">
          Check yourself
        </h2>
        <Check items={content.check} />
      </section>

      <section id="visualizer" className="scroll-mt-6 border-t-[2.4px] border-line pt-8" aria-labelledby="viz">
        <p className="eyebrow mb-1">Now try it</p>
        <h2 id="viz" className="display text-[34px] md:text-[44px]">
          The visualizer
        </h2>
        <ol className="mt-4 grid gap-2 rounded-2xl border-[1.5px] border-hair bg-paper-2 p-5 text-[15px] leading-relaxed text-body sm:grid-cols-2">
          {content.guide.map((g, i) => (
            <li key={g} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[11px] font-bold text-paper">{i + 1}</span>
              <span>{g}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-mute">
          <MousePointerClick className="size-3.5" aria-hidden /> Everything updates as you type. Nothing is saved or sent anywhere.
        </p>
        <div className="mt-6 flex flex-col gap-6">{children}</div>
      </section>

      <section className="mt-10 flex flex-col gap-3 border-t-[1.5px] border-hair pt-6">
        <h2 className="label-cond flex items-center gap-2 text-[20px]">
          <BookOpen aria-hidden className="size-[18px] text-accent" /> Go deeper in the course
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
