import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";

const steps = [
  ["Pick a role", "Six tracks, each with the weeks it takes."],
  ["Learn in order", "Stages that build on each other, with a quiz after every lesson."],
  ["Practise the rounds", "Coding problems, mock tests and a review queue for what you miss."],
];

/** Left half of the auth pages (desktop only): same voice as the landing hero. */
export function BrandPanel() {
  return (
    <section className="relative hidden flex-col justify-between border-r-[2.4px] border-line bg-paper p-12 lg:flex lg:w-[48%] xl:p-16">
      <header className="flex items-center justify-between gap-3">
        <StudyHubLogo href="/" size="lg" />
        <Link href="/" className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
          <ArrowLeft className="size-3.5" aria-hidden /> Home
        </Link>
      </header>

      <div className="my-12">
        <p className="note -rotate-2">free placement prep ↓</p>
        <h1 className="display mt-3 text-[64px] xl:text-[80px]">
          Know what <br />
          <span className="hl">your company</span>
          <br />
          will ask.
        </h1>
      </div>

      <ol className="border-t-[2.4px] border-line">
        {steps.map(([title, body], i) => (
          <li key={title} className="flex gap-5 border-b-[1.5px] border-hair py-4">
            <span className="display text-[32px] leading-none text-accent">0{i + 1}</span>
            <span>
              <span className="label-cond block text-[19px]">{title}</span>
              <span className="text-[14px] text-body">{body}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
