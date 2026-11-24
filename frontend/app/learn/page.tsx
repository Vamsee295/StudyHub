"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { ArrowRight, Bookmark, BookOpen, Briefcase, Code, Share2, Terminal } from "lucide-react";
import { DailyCard } from "@/components/learn/DailyCard";
import { PageHeader, Section, Progress } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { learnService, LearningSubject } from "@/lib/services/learnService";

const tabs = ["All subjects", "Technical", "Placement", "Core CS", "Aptitude"];
const categoryIcon = (c: string) => (c === "Core CS" ? Terminal : c === "Technical" ? Code : c === "Placement" ? Briefcase : BookOpen);

export default function LearnPage() {
  const router = useRouter();
  // client-only render (see AppLayout), so the URL is readable on first render
  const [activeTab, setActiveTab] = useState(() => {
    const cat = new URLSearchParams(window.location.search).get("category");
    return (cat && tabs.find((t) => t.toLowerCase() === cat.toLowerCase())) || "All subjects";
  });
  const [subjects, setSubjects] = useState<LearningSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learnService
      .getSubjects()
      .then(setSubjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pickTab = (tab: string) => {
    setActiveTab(tab);
    router.push(tab === "All subjects" ? "/learn" : `/learn?category=${tab.toLowerCase()}`, { scroll: false });
  };

  const shown = activeTab === "All subjects" ? subjects : subjects.filter((s) => s.category === activeTab);
  const current = subjects.find((s) => s.progress_percentage > 0 && s.progress_percentage < 100);

  return (
    <>
      <PageHeader eyebrow={`${subjects.length || "–"} subjects`} title="Pick a" hl="subject" note="one topic a day adds up ↓">
        <Link href="/learn/map" className={buttonClass("secondary", "sm")}>
          <Share2 className="size-4" aria-hidden /> Concept map
        </Link>
        <Link href="/learn/saved" className={buttonClass("secondary", "sm")}>
          <Bookmark className="size-4" aria-hidden /> Saved
        </Link>
      </PageHeader>

      <div className="mb-12 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {current ? (
          <Link href={`/learn/${current.slug}`} className="brut brut-hover no-press group flex flex-col rounded-2xl bg-card p-6 md:p-8">
            <p className="eyebrow mb-3">
              Continue · {current.completed_topics} of {current.total_topics} topics
            </p>
            <h2 className="display text-[34px] md:text-[44px]">{current.name}</h2>
            <p className="mt-2 line-clamp-2 max-w-2xl text-[15px] text-body">{current.description}</p>
            <div className="mt-auto flex items-end gap-6 pt-6">
              <Progress value={current.progress_percentage} label="Course progress" className="flex-1" />
              <span className={clsx(buttonClass("accent"), "shrink-0")}>
                Resume <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex flex-col justify-center rounded-2xl border-[1.5px] border-dashed border-hair p-6">
            <p className="eyebrow mb-2">Start here</p>
            <p className="text-[15px] text-body">Pick any subject below. Your place is saved as you go.</p>
          </div>
        )}
        <DailyCard />
      </div>

      <Section title="The catalogue" kicker="Subjects">
        <div role="tablist" aria-label="Filter subjects" className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => pickTab(tab)}
              className={clsx(
                "label-cond h-9 shrink-0 rounded-full border-2 px-4 text-[15px] transition-colors",
                activeTab === tab ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-12 text-center font-mono text-[13px] text-mute">Loading subjects…</p>
        ) : shown.length === 0 ? (
          <p className="rounded-2xl border-[1.5px] border-dashed border-hair py-12 text-center text-mute">No subjects in this category yet.</p>
        ) : activeTab === "All subjects" ? (
          tabs.slice(1).map((cat) => {
            const list = subjects.filter((s) => s.category === cat);
            return list.length ? (
              <div key={cat} className="mb-10">
                <h3 className="label-cond mb-3 flex items-baseline gap-2 text-[20px]">
                  {cat} <span className="font-mono text-[12px] font-normal text-mute">{list.length}</span>
                </h3>
                <SubjectGrid subjects={list} />
              </div>
            ) : null;
          })
        ) : (
          <SubjectGrid subjects={shown} />
        )}
      </Section>
    </>
  );
}

function SubjectGrid({ subjects }: { subjects: LearningSubject[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((s) => {
        const Icon = categoryIcon(s.category);
        return (
          <Link key={s.id} href={`/learn/${s.slug}`} className="brut brut-hover no-press group flex flex-col rounded-2xl bg-card p-5">
            <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-mute">
              <Icon className="size-4 text-accent" aria-hidden />
              <span>
                {s.completed_topics ? `${s.completed_topics}/` : ""}
                {s.total_topics} topics
              </span>
            </span>
            <h3 className="display mt-4 text-[26px] group-hover:text-accent-ink">{s.name}</h3>
            <p className="mt-2 line-clamp-2 flex-1 text-[14px] leading-relaxed text-body">{s.description}</p>
            <Progress value={s.progress_percentage} className="mt-5" />
          </Link>
        );
      })}
    </div>
  );
}
