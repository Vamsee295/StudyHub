"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, ExternalLink, Printer } from "lucide-react";
import { ToolWorkspaceHeader } from "@/components/tools/shared/ToolWorkspaceHeader";
import { ASKED_IN_CAVEAT, COMPANY_PROFILES } from "@/lib/data/askedIn";
import { ALL_COURSES } from "@/lib/data/courses/index";
import { getStoredProgress } from "@/lib/services/learnService";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default function CompanyPrepPage() {
  // AppLayout renders pages only on the client, so the URL and localStorage can be read up front.
  const [companyId, setCompanyId] = useState(() => {
    const q = new URLSearchParams(window.location.search).get("company");
    return q && COMPANY_PROFILES.some((p) => p.id === q) ? q : (COMPANY_PROFILES[0]?.id ?? "");
  });
  const [store] = useState(getStoredProgress);

  const profile = COMPANY_PROFILES.find((p) => p.id === companyId);

  // Expand "*" to every module of the course, then attach progress per module.
  const sections = useMemo(() => {
    if (!profile) return [];
    return profile.areas.flatMap((a) => {
      const course = ALL_COURSES.find((c) => c.slug === a.course);
      if (!course) return [];
      const modules = course.modules.filter((m) => a.modules === "*" || a.modules.includes(m.slug)).map((m) => {
        const done = m.lessons.filter((l) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed").length;
        const nextLesson = m.lessons.find((l) => !(store[l.id]?.status === "completed" || store[l.slug]?.status === "completed"));
        return { slug: m.slug, title: m.title, total: m.lessons.length, done, next: nextLesson?.slug ?? m.lessons[0]?.slug };
      });
      return [{ course: course.slug, title: course.title, whole: a.modules === "*", modules }];
    });
  }, [profile, store]);

  const totals = sections.flatMap((s) => s.modules).reduce((t, m) => ({ done: t.done + m.done, total: t.total + m.total }), { done: 0, total: 0 });

  const choose = (id: string) => {
    setCompanyId(id);
    window.history.replaceState(null, "", `?company=${id}`);
  };

  return (
    <div className="w-full max-w-[900px] mx-auto pb-20">
      <div className="print:hidden">
        <ToolWorkspaceHeader
          title="Company Prep Sheet"
          description="One page per company: the reported interview process, the topics to cover with your progress on each, and the sources behind it. Print it or save it as PDF before a drive."
          icon={<Building2 className="w-5 h-5" />}
          actions={
            <button type="button" onClick={() => window.print()} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-paper text-[13px] font-semibold hover:bg-ink/85 ${focusRing}`}>
              <Printer aria-hidden="true" className="w-4 h-4" /> Print / save PDF
            </button>
          }
        />
        <label className="flex flex-col gap-1.5 mb-8 max-w-sm">
          <span className="text-[12px] font-bold uppercase tracking-wider text-ink">Company</span>
          <select value={companyId} onChange={(e) => choose(e.target.value)}
            className={`px-3 py-2 rounded-lg border-[1.5px] border-hair bg-card text-[14px] text-ink ${focusRing}`}>
            {[...COMPANY_PROFILES].sort((a, b) => a.name.localeCompare(b.name)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
      </div>

      {profile && (
        <article className="p-6 sm:p-8 rounded-xl border-[1.5px] border-hair bg-card flex flex-col gap-6 print:border-0 print:p-0">
          <header className="flex flex-col gap-2">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-ink">Prep sheet</p>
            <h2 className="text-3xl text-ink">{profile.name}</h2>
            <p className="text-[15px] text-body leading-relaxed">{profile.process}</p>
            {totals.total > 0 && (
              <p className="text-[13px] text-mute tabular-nums">
                Your coverage: {totals.done} of {totals.total} lessons ({Math.round((100 * totals.done) / totals.total)}%)
              </p>
            )}
          </header>

          <section aria-labelledby="topics" className="flex flex-col gap-4">
            <h3 id="topics" className="text-[12px] font-bold uppercase tracking-wider text-ink">Topics to cover</h3>
            {sections.map((s) => (
              <div key={s.course} className="flex flex-col gap-2">
                <h4 className="text-[14px] font-semibold text-ink">
                  {s.title} <span className="font-normal text-mute">{s.whole ? "· whole course" : `· ${s.modules.length} module${s.modules.length === 1 ? "" : "s"}`}</span>
                </h4>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {s.modules.map((m) => (
                    <li key={m.slug} className="flex items-center gap-2 text-[13px]">
                      <span className="w-12 h-1.5 rounded-full bg-hair overflow-hidden shrink-0" aria-hidden="true">
                        <span className="block h-full bg-accent" style={{ width: `${m.total ? (100 * m.done) / m.total : 0}%` }} />
                      </span>
                      <Link href={`/learn/${s.course}/${m.next}`} className={`text-ink hover:text-accent-ink rounded truncate ${focusRing}`}>{m.title}</Link>
                      <span className="ml-auto text-mute tabular-nums shrink-0">{m.done}/{m.total}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section aria-labelledby="sources" className="flex flex-col gap-2">
            <h3 id="sources" className="text-[12px] font-bold uppercase tracking-wider text-ink">Sources</h3>
            <ul className="flex flex-col gap-1">
              {profile.sources.map((src) => (
                <li key={src.url} className="text-[13px]">
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-accent-ink hover:underline rounded ${focusRing}`}>
                    {src.title} <ExternalLink aria-hidden="true" className="w-3 h-3" /><span className="sr-only">(opens in a new tab)</span>
                  </a>
                  {src.official && <span className="ml-2 text-[11px] font-semibold uppercase text-note">Official</span>}
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-mute">{ASKED_IN_CAVEAT}</p>
          </section>
        </article>
      )}
    </div>
  );
}
