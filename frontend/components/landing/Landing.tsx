import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { categoryOf, problems } from "@/lib/problems/problemRegistry";
import { companies } from "@/lib/data/companies";
import { ASKED_IN_CAVEAT, COMPANY_PROFILES } from "@/lib/data/askedIn";
import { companyWorkspaces } from "@/lib/data/companiesData";
import type { PlanStage } from "./plan";
import { ALL_COURSES } from "@/lib/data/courses";
import { BOX_INTERVAL_DAYS } from "@/lib/learn/study";
import { ProductTour, type TourData } from "./ProductTour";
import { roadmap } from "@/lib/data/roadmap";
import { lastVerified } from "@/lib/data/companies";
import { paths } from "@/lib/data/paths";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";
import { buttonClass } from "@/components/ui/Button";
import { Marked, Reveal, SpinSticker, Ticker } from "./motion";
import { Hero, Planner, StageExplorer, type TopAsked } from "./islands";

export type LandingStats = { courses: number; lessons: number; quiz: number; problems: number; labs: number; companies: number; subjects: string[] };

// Landing links skip prefetch: every target is the signed-in app or /login, whose code (auth client,
// app shell) a first-time visitor on this page doesn't need yet.
const SIGNUP = "/login?mode=signup";
const wrap = "mx-auto w-full max-w-[1180px] px-4 md:px-8";

/* ---------- Nav ---------- */

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b-[2.4px] border-line bg-paper/95 backdrop-blur">
      <div className={`${wrap} flex h-16 items-center gap-4`}>
        <StudyHubLogo href="/" size="md" prefetch={false} />
        <span className="label-cond hidden -rotate-3 rounded-md border-2 border-line bg-gold px-2 py-0.5 text-[13px] text-[#191614] sm:inline">Free</span>
        <nav aria-label="Sections" className="label-cond ml-auto hidden items-center gap-7 text-[16px] md:flex">
          <a href="#plan" className="hover:text-accent-ink">
            Your plan
          </a>
          <a href="#inside" className="hover:text-accent-ink">
            Inside
          </a>
          <a href="#how" className="hover:text-accent-ink">
            How it works
          </a>
          <a href="#day-one" className="hover:text-accent-ink">
            Day one
          </a>
          <a href="#faq" className="hover:text-accent-ink">
            FAQ
          </a>
        </nav>
        <Link prefetch={false} href="/login" className="label-cond ml-auto whitespace-nowrap text-[16px] hover:text-accent-ink md:ml-3">
          Sign in
        </Link>
        <Link prefetch={false} href={SIGNUP} className={buttonClass("primary", "sm")}>
          Start free
        </Link>
      </div>
    </header>
  );
}

/* ---------- The problem: three things that go wrong in placement prep ---------- */

const firstRound = (name: string) => companies.find((c) => c.name.startsWith(name))?.focus[0].replace(/^Round 1:\s*/, "") ?? "";

function Problem() {
  const pains = [
    {
      t: "Random playlists, no order",
      d: "A DP video, then an OS video, then a mock test. Hours go in, and you still can't say which subject comes next.",
    },
    {
      t: "Every company starts somewhere else",
      d: `TCS opens with ${firstRound("TCS")}. Amazon opens with ${firstRound("Amazon")}. Preparing the same way for both wastes weeks.`,
    },
    {
      t: "Solved in June, blank in placement week",
      d: "You got the problem right once. Months later the pattern is gone, because nothing brought it back.",
    },
  ];
  return (
    <section aria-labelledby="problem-h" className={`${wrap} py-20 md:py-28`}>
      <Reveal>
        <p className="eyebrow">The problem</p>
        <h2 id="problem-h" className="display mt-3 max-w-[22ch] text-[44px] leading-[0.92] md:text-[64px]">
          Most prep fails before the <span className="hl">first round</span>
        </h2>
      </Reveal>
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {pains.map((p, i) => (
          <li key={p.t}>
            <Reveal delay={i * 0.06} className="h-full">
              <div className="h-full border-t-[2.4px] border-line pt-5">
                <p className="font-mono text-[13px] text-accent-ink">0{i + 1}</p>
                <h3 className="mt-2 text-[21px] font-bold leading-snug">{p.t}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-body">{p.d}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- What changes: outcomes, each with a small real visual ---------- */

function CategoryBars() {
  const counts = new Map<string, number>();
  for (const p of Object.values(problems)) counts.set(categoryOf(p), (counts.get(categoryOf(p)) ?? 0) + 1);
  const rows = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = rows[0]?.[1] ?? 1;
  return (
    <ul className="space-y-2.5">
      {rows.map(([cat, n]) => (
        <li key={cat} className="grid grid-cols-[124px_1fr_32px] items-center gap-3 text-[13px]">
          <span className="font-semibold leading-tight">{cat}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-ink/10">
            <span className="block h-full rounded-full bg-accent" style={{ width: `${(n / max) * 100}%` }} />
          </span>
          <span className="text-right font-mono tabular-nums text-mute">{n}</span>
        </li>
      ))}
    </ul>
  );
}

function ReviewLadder() {
  const days = BOX_INTERVAL_DAYS.filter((n) => n > 0);
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      <li className="rounded-full border-2 border-line bg-ink px-2.5 py-1 font-mono text-[12px] text-paper">miss</li>
      {days.map((d) => (
        <li key={d} className="flex items-center gap-1.5">
          <ArrowRight className="size-3 text-mute" aria-hidden />
          <span className="rounded-full border-[1.5px] border-hair bg-paper-2 px-2.5 py-1 font-mono text-[12px]">{d}d</span>
        </li>
      ))}
    </ol>
  );
}

function AskedInChips() {
  const rows = [
    { course: "dsa", label: "DSA" },
    { course: "sql", label: "SQL" },
    { course: "online-assessment", label: "Aptitude" },
  ].map((r) => ({ ...r, names: COMPANY_PROFILES.filter((p) => p.areas.some((a) => a.course === r.course)).map((p) => p.name) }));
  return (
    <ul className="space-y-3">
      {rows
        .filter((r) => r.names.length)
        .map((r) => (
          <li key={r.course}>
            <p className="font-mono text-[12px] uppercase tracking-wider text-mute">{r.label} · asked in</p>
            <p className="mt-1 flex flex-wrap gap-1.5">
              {r.names.slice(0, 5).map((n) => (
                <span key={n} className="rounded-full border-[1.5px] border-hair bg-paper-2 px-2.5 py-0.5 text-[12px] font-semibold">
                  {n}
                </span>
              ))}
              {r.names.length > 5 && <span className="px-1 py-0.5 text-[12px] text-mute">+{r.names.length - 5}</span>}
            </p>
          </li>
        ))}
    </ul>
  );
}

function Changes() {
  const cards = [
    {
      t: "Every lesson says who asks it",
      d: "Lessons carry the companies reported to test that subject, so you know why you're reading it.",
      v: <AskedInChips />,
    },
    {
      t: "Practice sorted by pattern",
      d: `${Object.keys(problems).length} coding problems grouped the way rounds test them, each runnable in the browser.`,
      v: <CategoryBars />,
    },
    {
      t: "What you miss comes back",
      d: `A wrong answer goes into your review queue and returns after ${BOX_INTERVAL_DAYS.filter((n) => n > 0)
        .join(", ")
        .replace(/, (\d+)$/, " and $1")} days until it sticks.`,
      v: <ReviewLadder />,
    },
  ];
  return (
    <section aria-labelledby="changes-h" className="border-y-[2.4px] border-line bg-paper-2 py-20 md:py-28">
      <div className={wrap}>
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <Reveal>
            <p className="eyebrow">What changes</p>
            <h2 id="changes-h" className="display mt-3 text-[44px] leading-[0.92] md:text-[64px]">
              A plan you can <span className="hl">follow</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[46ch] text-[18px] leading-relaxed text-body">
              Each subject tied to the companies that test it, practice grouped by pattern, and a queue that won&apos;t let you forget.
            </p>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <li key={c.t}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="brut flex h-full flex-col rounded-2xl bg-card">
                  <div className="flex min-h-[150px] items-center border-b-[1.5px] border-dashed border-hair p-5">
                    <div className="w-full">{c.v}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[19px] font-bold leading-snug">{c.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-body">{c.d}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Try it: a week-by-week plan for your company ---------- */

function PlanSection({ plans }: { plans: Record<string, PlanStage[]> }) {
  return (
    <section id="plan" aria-labelledby="plan-h" className={`${wrap} scroll-mt-20 py-20 md:py-28`}>
      <div className="mb-10 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <Reveal>
          <p className="note -rotate-2 text-[1.5rem]">try it, no account needed</p>
          <h2 id="plan-h" className="display mt-2 text-[44px] leading-[0.92] md:text-[64px]">
            Your plan, <span className="hl">week by week</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-[46ch] text-[18px] leading-relaxed text-body">
            Pick a company and how long you have. You get the modules it&apos;s reported to test, in roadmap order, spread over your weeks.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.12}>
        <Planner plans={plans} />
      </Reveal>
      <p className="mt-6 text-[13px] text-mute">{ASKED_IN_CAVEAT}</p>
    </section>
  );
}

// ---------- Inside StudyHub: the product window, filled from real content ----------
function tourData(): TourData {
  const course = ALL_COURSES.find((c) => c.slug === "dsa")!;
  const mod = course.modules[0];
  const lesson = mod.lessons.find((l) => l.slug === "big-o-notation") ?? mod.lessons[0];
  const firstPara = (lesson.content.theory ?? lesson.description ?? "").split("\n\n")[0].trim();
  const checks = course.modules.flatMap((m) => m.lessons).flatMap((l) => (l.content.sections ?? []).filter((s) => s.type === "quickCheck" && s.question));
  const question = checks[0]?.question ?? lesson.content.quickCheck?.question ?? "What does Big-O notation describe?";
  return {
    course: course.title,
    module: mod.title,
    lessons: mod.lessons.slice(0, 4).map((l) => ({ title: l.title.split(":")[0], minutes: l.estimatedMinutes })),
    lesson: { title: lesson.title.split(":")[0], minutes: lesson.estimatedMinutes, intro: firstPara },
    problem: {
      id: featured.id,
      title: featured.title,
      difficulty: featured.difficulty,
      statement: featured.description[0],
      tests: featured.visibleTests.slice(0, 3).map((t) => ({
        input: `nums = ${JSON.stringify((t.input as { nums: number[] }).nums)}`,
        output: JSON.stringify(t.expectedOutput),
      })),
    },
    review: { question, days: BOX_INTERVAL_DAYS.filter((n) => n > 0) },
  };
}

function Inside() {
  return (
    <section id="inside" className={`${wrap} scroll-mt-20 py-20 md:py-28`}>
      <div className="mb-10 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <Reveal>
          <h2 className="display text-[48px] leading-[0.92] md:text-[72px]">
            Read it. Practice it. <span className="hl">Keep it.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-[46ch] text-[18px] leading-relaxed text-body">
            Lessons that remember where you stopped, problems you run in the browser, and a review queue that brings back what you missed until it sticks.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.12}>
        <ProductTour data={tourData()} />
      </Reveal>
      <p className="mt-4 text-[13px] text-mute">The learner&apos;s progress here is a sample. The lessons, the problem, its tests and the review intervals are the real ones.</p>
    </section>
  );
}

/* ---------- How it works ---------- */

function Step({ n, title, children, aside }: { n: number; title: string; children: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-10 border-t-[2.4px] border-line py-14 md:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Reveal className="lg:sticky lg:top-28">
        <p className="display text-[72px] leading-none text-accent">0{n}</p>
        <h3 className="display mt-3 text-[40px] md:text-[52px]">{title}</h3>
        <div className="mt-5 max-w-[46ch] space-y-4 text-[17px] leading-relaxed text-body">{children}</div>
      </Reveal>
      <Reveal delay={0.1}>{aside}</Reveal>
    </div>
  );
}

function TrackList() {
  return (
    <ul className="brut divide-y-[1.5px] divide-hair rounded-2xl bg-card">
      {paths.map((p) => (
        <li key={p.slug}>
          {p.available ? (
            <Link prefetch={false} href="/roadmaps" className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-card-2">
              <span className="label-cond text-[19px]">{p.name}</span>
              <span className="flex items-center gap-2 font-mono text-[13px] uppercase text-accent-ink">
                Open roadmap
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ) : (
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <span className="label-cond text-[19px] text-ink/60">{p.name}</span>
              <span className="font-mono text-[13px] uppercase text-mute">Planned</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

// A real problem from the problem set (lib/problems/problemRegistry.ts), used by the product tour.
const featured = problems["15"]; // 3Sum

function HowItWorks() {
  return (
    <section id="how" className={`${wrap} scroll-mt-20 pb-12 pt-8`}>
      <div className="mb-12 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <Reveal>
          <p className="note -rotate-2 text-[1.5rem]">not another random playlist. a plan.</p>
          <h2 className="display mt-2 text-[48px] leading-[0.92] md:text-[72px]">
            How it <span className="hl">works</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-[46ch] text-[18px] leading-relaxed text-body">
            Pick the job you want, then learn the subjects it needs in the order they build on each other.
          </p>
        </Reveal>
      </div>

      <Step n={1} title="Choose the role you want." aside={<TrackList />}>
        <p>The Software Engineer track is ready today: twelve stages from programming basics to the HR round, with the courses, practice and tools for each.</p>
        <p>More roles are planned. They will share the same core CS stages, so anything you finish now still counts.</p>
      </Step>
      <Step n={2} title="Learn the stages in order." aside={<StageExplorer />}>
        <p>Placement prep in {roadmap.length} stages, from programming basics to system design. Each one builds on the last.</p>
        <p>Every stage has notes, a sample interview question and the companies that test it, so you know why you&apos;re studying it.</p>
      </Step>
    </section>
  );
}

/* ---------- Day one: the dashboard a new account opens on (the one night section) ---------- */

// Mirrors app/dashboard/page.tsx for a brand-new account: no progress yet, so every number is zero
// except the real lesson totals. The daily problem title is left out: it changes at midnight and this
// page is pre-rendered.
const MASS_HIRERS = Object.values(companyWorkspaces).filter((c) => c.category === "High-Volume IT");
const quickTools = ["SQL Lab", "DSA Visualizer", "Resume Analyzer", "Interview Simulator"];

function DashboardPreview() {
  const lessonsTotal = ALL_COURSES.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);
  const subjects = ALL_COURSES.slice(0, 6).map((c) => ({ title: c.title, total: c.modules.reduce((m, mod) => m + mod.lessons.length, 0) }));
  const bar = <span className="block h-1.5 rounded-full bg-ink/10" />;
  return (
    <div aria-label="Preview of the StudyHub dashboard for a new account" className="brut overflow-hidden rounded-2xl bg-paper text-ink">
      <div className="flex items-center gap-1.5 border-b-[1.5px] border-hair bg-paper-2 px-4 py-2.5 font-mono text-[13px] text-mute">
        <i className="size-2.5 rounded-full bg-[#ff5f56]" />
        <i className="size-2.5 rounded-full bg-[#ffbd2e]" />
        <i className="size-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 truncate">studyhub / dashboard</span>
      </div>
      <div className="p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-[2.4px] border-line pb-5">
          <div>
            <p className="eyebrow">Software Development Engineer</p>
            <p className="display mt-1 text-[34px] md:text-[44px]">
              Good morning, <span className="hl">Learner</span>
            </p>
          </div>
          <div className="text-right max-md:text-left">
            <p className="display text-[40px] leading-none">0%</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-mute">0 of {lessonsTotal} lessons done</p>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <div className="brut rounded-2xl bg-card p-5">
              <p className="eyebrow">Pick up where you left off</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="display text-[26px] md:text-[32px]">Start your first module</p>
                  <p className="mt-1 text-[14px] text-body">Begin your Software Development Engineer path</p>
                </div>
                <span className={buttonClass("accent", "default")}>
                  Start learning <ArrowRight className="size-4" />
                </span>
              </div>
            </div>
            <p className="eyebrow mt-6">Your subjects</p>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {subjects.map((s, i) => (
                <li key={s.title} className={`flex-col rounded-xl border-2 border-line bg-card p-3 ${i > 3 ? "hidden sm:flex" : "flex"}`}>
                  <span className="display self-end text-[22px] leading-none">0%</span>
                  <span className="label-cond mt-2 text-[14px] leading-tight">{s.title}</span>
                  <span className="mb-2 mt-1 font-mono text-[11px] text-mute">0 of {s.total} lessons</span>
                  <span className="mt-auto">{bar}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="brut rounded-2xl bg-card p-4">
              <p className="flex items-center justify-between font-mono text-[12px]">
                <span className="eyebrow">Daily problem</span>
                <span>0-day streak</span>
              </p>
              <p className="mt-2 text-[13px] text-mute">A new problem every day at midnight.</p>
            </div>
            <div className="hidden rounded-2xl bg-night p-4 text-[#f5efe6] lg:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#e07a52]">Mass hiring</p>
              <p className="display mt-1 text-[22px]">Big fresher recruiters</p>
              <ul className="mt-2 divide-y divide-[#f5efe6]/15">
                {MASS_HIRERS.slice(0, 3).map((c) => (
                  <li key={c.id} className="flex items-center gap-2.5 py-2">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f5efe6]/10 font-mono text-[10px] font-bold">{c.monogram}</span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold">{c.name}</span>
                      <span className="block truncate text-[11px] text-[#f5efe6]/60">{c.hiringStages?.[0]?.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block">
              <p className="eyebrow">Quick tools</p>
              <ul className="mt-1 border-t-[1.5px] border-hair">
                {quickTools.map((t) => (
                  <li key={t} className="flex items-center justify-between border-b-[1.5px] border-hair py-2 text-[13px] font-medium">
                    {t} <ArrowRight className="size-3.5 text-mute" aria-hidden />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DayOne() {
  return (
    <section id="day-one" aria-labelledby="day-one-h" className="scroll-mt-16 bg-night py-24 text-[#f5efe6] md:py-28">
      <div className={wrap}>
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          <Reveal>
            <p className="font-mono text-[13px] uppercase tracking-wider text-[#e07a52]">Day one</p>
            <h2 id="day-one-h" className="display mt-3 text-[44px] leading-[0.92] md:text-[64px]">
              What you open after signing up
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[46ch] text-[18px] leading-relaxed text-[#f5efe6]/75">
              Your first lesson, every subject with its lesson count, a daily problem and the tools, on one screen. Progress starts at zero and fills in as you go.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="mt-12">
          <DashboardPreview />
        </Reveal>
        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
          <span className="font-mono text-[13px] uppercase tracking-wider text-[#f5efe6]/55">Tools, nothing to install:</span>
          {tools.map((x) => (
            <Link
              key={x.t}
              prefetch={false}
              href={x.href}
              title={x.d}
              className="label-cond rounded-full border-2 border-[#f5efe6]/25 px-4 py-1.5 text-[15px] transition-colors hover:border-[#e07a52] hover:text-[#e07a52]"
            >
              {x.t}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Tools (folded into Day one) ---------- */

const tools = [
  { t: "SQL lab", d: "Run real queries on the same tables the SQL lessons use.", href: "/practice/sql" },
  { t: "Resume analyser", d: "Upload your resume, get specific fixes.", href: "/tools/resume-analyzer" },
  { t: "Interview simulator", d: "Answer technical questions against the clock.", href: "/tools/interview-simulator" },
  { t: "DSA visualiser", d: "Watch sorting and searching algorithms run, one comparison at a time.", href: "/tools/dsa-visualizer" },
  { t: "STAR builder", d: "Shape your behavioural answers before the HR round.", href: "/tools/star-builder" },
  { t: "Community", d: "Ask questions, share wins, and vote up what helps.", href: "/community" },
];

/* ---------- FAQ ---------- */

const faqs = [
  { q: "Does StudyHub cost anything?", a: "No. Creating an account and following the roadmap is free." },
  { q: "I'm in my first or second year. Is it too early?", a: "No, it's the best time. The roadmap starts at programming fundamentals, so you can begin at stage one and go at your own pace." },
  { q: "Which track should I pick?", a: "Software Engineer is the track available today, and it covers the core CS subjects most campus drives test. Other roles are planned and will build on the same stages." },
  { q: "Do I need to install anything?", a: "No. Lessons, practice, the SQL playground and every other tool run in the browser." },
  { q: "Where does the company information come from?", a: `It's compiled from recent hiring rounds and reviewed periodically. Last checked: ${lastVerified}.` },
];

function Faq() {
  return (
    <section id="faq" className={`${wrap} grid scroll-mt-20 gap-10 py-24 md:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`}>
      <Reveal>
        <h2 className="display text-[48px] md:text-[64px]">Questions</h2>
      </Reveal>
      <div className="border-t-[2.4px] border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group border-b-[1.5px] border-hair">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[18px] font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-line transition-transform group-open:rotate-45">
                <Plus className="size-4" aria-hidden />
              </span>
            </summary>
            <p className="max-w-[62ch] pb-6 text-[16px] leading-relaxed text-body">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------- Closing + footer ---------- */

function Closing() {
  return (
    <footer className="border-t-[2.4px] border-line">
      <div className={`${wrap} grid items-end gap-10 py-24 md:py-32 lg:grid-cols-[1fr_auto]`}>
        <div>
          <p className="note -rotate-1">placement season comes faster than you think</p>
          <h2 className="display mt-3 text-[56px] md:text-[88px]">
            Start with <Marked>stage one</Marked>
            <br />
            today.
          </h2>
          <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-body">Free account. Open the roadmap and your first lesson is ready in under a minute.</p>
          <Link prefetch={false} href={SIGNUP} className={`${buttonClass("accent", "lg")} mt-8`}>
            Create your free account <ArrowRight className="size-5" />
          </Link>
        </div>
        <Link prefetch={false} href={SIGNUP} aria-label="Start free" className="hidden justify-self-end lg:block">
          <SpinSticker text="START FREE · START FREE · " />
        </Link>
      </div>
      <div className="border-t-[1.5px] border-hair">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-4 py-6 font-mono text-[13px] uppercase tracking-wider text-mute`}>
          <span>© {new Date().getFullYear()} StudyHub</span>
          <nav className="flex flex-wrap gap-6" aria-label="Footer">
            <Link prefetch={false} href="/learn" className="hover:text-ink">
              Learn
            </Link>
            <Link prefetch={false} href="/practice" className="hover:text-ink">
              Practice
            </Link>
            <Link prefetch={false} href="/companies" className="hover:text-ink">
              Companies
            </Link>
            <Link prefetch={false} href="/help" className="hover:text-ink">
              Help
            </Link>
            <Link prefetch={false} href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link prefetch={false} href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function Landing({ stats, topAsked, plans }: { stats: LandingStats; topAsked: Record<string, TopAsked>; plans: Record<string, PlanStage[]> }) {
  return (
    <div className="landing">
      <Nav />
      <main className="overflow-x-clip">
        <Hero stats={stats} topAsked={topAsked} />
        <Ticker items={stats.subjects} />
        <Problem />
        <Changes />
        <PlanSection plans={plans} />
        <Inside />
        <HowItWorks />
        <DayOne />
        <Faq />
      </main>
      <Closing />
    </div>
  );
}
