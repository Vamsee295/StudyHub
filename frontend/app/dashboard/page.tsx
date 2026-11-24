"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Circle,
  CodeXml,
  Database,
  FileText,
  Network,
  PlaySquare,
  Server,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";
import { DailyCard } from "@/components/learn/DailyCard";
import { PageHeader, Section, Progress } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";

/* eslint-disable @typescript-eslint/no-explicit-any -- the /dashboard payload is untyped on the API side */

const CACHE_KEY = "pathward-dashboard-cache";
const subjectIcons: Record<string, LucideIcon> = {
  TerminalSquare,
  Code2: CodeXml,
  Database,
  Server,
  Network,
};
const quickTools = [
  { name: "SQL Playground", icon: Database, href: "/tools/sql-playground" },
  { name: "DSA Visualizer", icon: PlaySquare, href: "/tools/dsa-visualizer" },
  { name: "Resume Analyzer", icon: FileText, href: "/tools/resume-analyzer" },
  { name: "Interview Simulator", icon: Briefcase, href: "/tools/interview-simulator" },
];

const greeting = () => {
  const h = new Date().getHours();
  return h < 5 ? "Up late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { draftProfile: profile } = useProfile();
  // Rendered only on the client (AppLayout holds children until mounted), so browser values are safe to read here.
  const [data, setData] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    } catch {
      return null;
    }
  });
  const [hello] = useState(greeting);

  useEffect(() => {
    dashboardApi
      .getDashboard()
      .then((d) => {
        if (!d) return;
        setData(d);
        localStorage.setItem(CACHE_KEY, JSON.stringify(d));
      })
      .catch((err) => console.warn("Backend dashboard fetch failed, using cached record:", err));
  }, []);

  const fullName = profile?.identity?.fullName || (user?.email ? user.email.split("@")[0] : "Learner");
  const firstName = fullName.split(" ")[0];
  const track = data?.current_track || profile?.identity?.targetRole || profile?.careerTracks?.[0] || "Software Development Engineer";
  const readiness = data?.metrics?.readiness > 0 ? data.metrics.readiness : profile?.completionPercentage || 0;

  const cont = data?.continue_learning || { module: "Start your first module", topic: `Begin your ${track} path`, progress: 0, has_started: false };
  const contHref = cont.has_started && cont.subject_slug && cont.topic_slug ? `/learn/${cont.subject_slug}/${cont.topic_slug}` : "/learn";
  const subjects: any[] = data?.learning_progress || [
    { name: "Programming", progress: 0, icon: "TerminalSquare" },
    { name: "DSA", progress: 0, icon: "Code2" },
    { name: "SQL", progress: 0, icon: "Database" },
    { name: "Core CS", progress: 0, icon: "Server" },
    { name: "Aptitude", progress: 0, icon: "Network" },
  ];
  const plan = data?.today_plan || { tasks: [], completion: 0 };
  const company = profile?.targets?.companies?.[0];
  const target = data?.upcoming_target || {
    title: company ? `${company} prep` : "Pick your target companies",
    subtitle: company ? `Preparation calibrated for ${company}.` : "Track companies to tailor your interview prep.",
  };

  const toggleTask = async (taskId: number) => {
    setData((prev: any) => {
      if (!prev?.today_plan?.tasks) return prev;
      const tasks = prev.today_plan.tasks.map((t: any) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      const done = tasks.filter((t: any) => t.completed).length;
      const next = { ...prev, today_plan: { ...prev.today_plan, tasks, completion: tasks.length ? Math.floor((done / tasks.length) * 100) : 0 } };
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      return next;
    });
    try {
      await dashboardApi.toggleTaskStatus(taskId);
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  return (
    <>
      <PageHeader eyebrow={track} title={`${hello},`} hl={firstName}>
        <div className="text-right max-md:text-left">
          <p className="display text-[56px] leading-none">{readiness}%</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-mute">Placement readiness</p>
        </div>
      </PageHeader>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {/* continue: the one thing to do next */}
          <div className="brut mb-12 rounded-2xl bg-card p-6 md:p-8">
            <p className="eyebrow mb-3">Pick up where you left off</p>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="min-w-0">
                <h2 className="display text-[34px] md:text-[44px]">{cont.module}</h2>
                <p className="mt-2 text-[15px] text-body">{cont.topic}</p>
              </div>
              <Link href={contHref} className={buttonClass("accent", "lg")}>
                {cont.has_started ? "Continue" : "Start learning"} <ArrowRight className="size-5" />
              </Link>
            </div>
            <Progress value={cont.progress} label="Module progress" className="mt-6" />
          </div>

          <Section title="Your subjects" kicker="Progress" href="/learn">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {subjects.map((s) => {
                const Icon = subjectIcons[s.icon] || TerminalSquare;
                return (
                  <Link key={s.name} href="/learn" className="brut brut-hover no-press flex flex-col rounded-2xl bg-card p-4">
                    <span className="flex items-center justify-between">
                      <Icon className="size-5 text-accent" aria-hidden />
                      <span className="display text-[28px]">{s.progress}%</span>
                    </span>
                    <span className="label-cond mb-3 mt-4 text-[17px]">{s.name}</span>
                    <Progress value={s.progress} className="mt-auto" />
                  </Link>
                );
              })}
            </div>
          </Section>
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <DailyCard />

          <section className="rounded-2xl border-[1.5px] border-hair bg-card p-5">
            <h3 className="eyebrow mb-3">Today&apos;s plan</h3>
            {plan.tasks?.length ? (
              <ul className="-mx-2">
                {plan.tasks.map((t: any) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => toggleTask(t.id)}
                      aria-pressed={t.completed}
                      className="no-press flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left hover:bg-card-2"
                    >
                      {t.completed ? (
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-note" aria-hidden />
                      ) : (
                        <Circle className="mt-0.5 size-5 shrink-0 text-mute" aria-hidden />
                      )}
                      <span className={t.completed ? "text-[14px] text-mute line-through" : "text-[14px] font-medium"}>{t.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-body">
                Nothing scheduled.{" "}
                <Link href="/practice" className="font-semibold text-accent-ink hover:underline">
                  Start a practice session →
                </Link>
              </p>
            )}
            <Progress value={plan.completion} label="Done" className="mt-4 border-t-[1.5px] border-hair pt-4" />
          </section>

          <section className="rounded-2xl bg-night p-5 text-[#f5efe6]">
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#e07a52]">Upcoming target</p>
            <h3 className="display mt-2 text-[28px]">{target.title}</h3>
            <p className="mt-1 text-[14px] text-[#f5efe6]/70">{target.subtitle}</p>
            <Link
              href={company ? "/roadmaps" : "/profile/target-companies"}
              className="label-cond mt-4 inline-flex items-center gap-1 text-[16px] text-[#e07a52] hover:underline"
            >
              {company ? "View roadmap" : "Choose companies"} <ArrowRight className="size-4" />
            </Link>
          </section>

          <section>
            <h3 className="eyebrow mb-2">Quick tools</h3>
            <ul className="border-t-[1.5px] border-hair">
              {quickTools.map(({ name, icon: Icon, href }) => (
                <li key={name} className="border-b-[1.5px] border-hair">
                  <Link href={href} className="group flex items-center gap-3 px-1 py-3 text-[14px] font-medium hover:text-accent-ink">
                    <Icon className="size-4 text-accent" aria-hidden />
                    <span className="flex-1">{name}</span>
                    <ArrowRight className="size-4 text-mute transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
