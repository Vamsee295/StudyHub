import { Source_Serif_4 } from "next/font/google";
import type { CSSProperties } from "react";
import type { ResumeDoc } from "@/lib/resume";

// A LaTeX-like serif for the on-screen page. The .tex export compiles with Computer Modern in Overleaf.
const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"], display: "swap" });

const isLink = (s: string) => /@|\.(com|in|io|dev|org|me|net)\b/i.test(s);

/** One US Letter page laid out like Jake's Resume: centred name, ruled small-caps sections, right-aligned dates. */
/** `thumb` drops the print id so several small copies can share a page. */
export function ResumePage({ doc, thumb }: { doc: ResumeDoc; thumb?: boolean }) {
  return (
    // the wrapper is the size container, so the page's type scales with its width like a sheet of paper
    <div className="mx-auto w-full max-w-[816px]" style={{ containerType: "inline-size" } as CSSProperties}>
    <div
      id={thumb ? undefined : "resume-print"}
      className={`${serif.className} aspect-[8.5/11] w-full bg-white px-[6%] py-[5.5%] text-[#111] shadow-[0_1px_3px_rgb(0_0_0/0.12),0_8px_24px_rgb(0_0_0/0.08)]`}
      style={{ fontSize: thumb ? "1.32cqw" : "clamp(7px, 1.32cqw, 11px)" }}
    >
      <header className="text-center">
        <h2 className="text-[2.6em] font-bold leading-none tracking-tight [font-variant:small-caps]">{doc.name}</h2>
        {doc.contacts.length > 0 && (
          <p className="mt-[0.4em] text-[0.95em]">
            {doc.contacts.map((c, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-[0.45em]">|</span>}
                <span className={isLink(c) ? "underline underline-offset-2" : undefined}>{c}</span>
              </span>
            ))}
          </p>
        )}
      </header>

      {doc.summary && <p className="mt-[0.9em] text-[0.95em]">{doc.summary}</p>}

      {doc.sections.map((s) => (
        <section key={s.title} className="mt-[0.9em]">
          <h3 className="border-b border-[#111] pb-[0.1em] text-[1.2em] leading-tight [font-variant:small-caps]">{s.title}</h3>
          <div className="mt-[0.35em] pl-[1.4em]">
            {s.entries?.map((e, i) => (
              <div key={i} className="mb-[0.45em]">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{e.title}</span>
                  {e.date && <span className="shrink-0">{e.date}</span>}
                </div>
                {e.subtitle && <div className="text-[0.9em] italic">{e.subtitle}</div>}
                {e.bullets.length > 0 && (
                  <ul className="mt-[0.15em] list-disc pl-[1.6em] text-[0.92em] marker:text-[0.7em]">
                    {e.bullets.map((b, j) => (
                      <li key={j} className="leading-snug">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {s.lines?.map((l, i) => (
              <p key={i} className="text-[0.92em] leading-snug">
                {l.label && <span className="font-semibold">{l.label}: </span>}
                {l.text}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
    </div>
  );
}
