"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import { ASKED_IN_CAVEAT, COMPANY_PROFILES } from "@/lib/data/askedIn";
import { getCourseBySlug } from "@/lib/data/courses/index";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/** What each company is reported to test, mapped to StudyHub modules, with sources. */
export function AskedInSection() {
  // Deep links such as /companies?company=infosys#asked-in preselect a company (pages render client-side only).
  const [linked] = useState(() => {
    const id = new URLSearchParams(window.location.search).get("company");
    return id && COMPANY_PROFILES.some((c) => c.id === id) ? id : null;
  });
  const [selected, setSelected] = useState(linked ?? COMPANY_PROFILES[0].id);
  useEffect(() => {
    // only for links aimed here (…#asked-in); a plain ?company= link opens the company's workspace instead
    if (linked && window.location.hash === "#asked-in") document.getElementById("asked-in")?.scrollIntoView({ block: "start" });
  }, [linked]);

  const company = COMPANY_PROFILES.find((c) => c.id === selected)!;

  return (
    <section id="asked-in" className="flex flex-col gap-4 scroll-mt-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-[13px] font-bold text-ink uppercase tracking-wider">What companies ask</h2>
        <p className="text-[13px] text-body max-w-3xl">Pick a company to see the topics its tests and interviews are reported to cover, linked to the matching StudyHub modules.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Company">
        {COMPANY_PROFILES.map((c) => (
          <button key={c.id} type="button" aria-pressed={selected === c.id} onClick={() => setSelected(c.id)}
            className={clsx("px-3 py-1.5 rounded-lg border text-[13px] font-medium", focusRing,
              selected === c.id ? "border-accent bg-accent text-paper" : "border-hair bg-card text-ink hover:border-accent")}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-xl border-[1.5px] border-hair bg-card flex flex-col gap-4">
        <p className="text-[15px] text-ink">{company.process}</p>

        <div className="flex flex-col gap-3">
          {company.areas.map((a) => {
            const course = getCourseBySlug(a.course);
            if (!course) return null;
            const modules = a.modules === "*" ? course.modules : course.modules.filter((m) => (a.modules as string[]).includes(m.slug));
            return (
              <div key={a.course} className="flex flex-col gap-1.5">
                <Link href={`/learn/${course.slug}`} className={`text-[13px] font-semibold text-ink hover:text-accent-ink self-start rounded ${focusRing}`}>
                  {course.title}{a.modules === "*" ? " (whole course)" : ""}
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {modules.map((m) => (
                    <Link key={m.slug} href={`/learn/${course.slug}/${m.lessons[0]?.slug ?? ""}`}
                      className={`px-2 py-0.5 rounded-md border-[1.5px] border-hair text-[12px] text-body hover:border-accent hover:text-ink ${focusRing}`}>
                      {m.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-hair pt-3 flex flex-col gap-1.5">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-mute">Sources</h3>
          <ul className="flex flex-col gap-1">
            {company.sources.map((s) => (
              <li key={s.url} className="text-[13px]">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-accent-ink underline underline-offset-2 rounded ${focusRing}`}>
                  {s.title} <ExternalLink aria-hidden="true" className="w-3 h-3" />
                </a>
                {s.official && (
                  <span className="ml-2 inline-flex items-center gap-0.5 text-[11px] font-medium text-note">
                    <BadgeCheck aria-hidden="true" className="w-3.5 h-3.5" /> Official
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-[12px] text-mute mt-1">{ASKED_IN_CAVEAT}</p>
        </div>
      </div>
    </section>
  );
}
