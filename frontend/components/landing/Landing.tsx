import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { featuredProblem } from "@/lib/data/practice";
import { roadmap } from "@/lib/data/roadmap";
import { lastVerified } from "@/lib/data/companies";
import { paths } from "@/lib/data/paths";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";
import { buttonClass } from "@/components/ui/Button";
import { CountUp, Marked, Reveal, SpinSticker, Ticker } from "./motion";
import { Hero, StageExplorer } from "./islands";

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
        <StudyHubLogo href="/" size="md" />
        <span className="label-cond hidden -rotate-3 rounded-md border-2 border-line bg-gold px-2 py-0.5 text-[12px] text-[#191614] sm:inline">Free</span>
        <nav aria-label="Sections" className="label-cond ml-auto hidden items-center gap-7 text-[16px] md:flex">
          <a href="#how" className="hover:text-accent-ink">
            How it works
          </a>
          <a href="#tools" className="hover:text-accent-ink">
            Tools
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

/* ---------- Hero: pick a company, see its rounds ---------- */

/* ---------- Real numbers ---------- */

function Numbers({ stats }: { stats: LandingStats }) {
  const items = [
    { n: stats.courses, label: "courses" },
    { n: stats.lessons, label: "lessons" },
    { n: stats.quiz, label: "quiz questions" },
    { n: stats.problems, label: "coding problems" },
    { n: stats.labs, label: "interactive labs" },
    { n: stats.companies, label: "company playbooks" },
  ];
  return (
    <section aria-label="What's inside" className={`${wrap} py-16`}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((it) => (
          <div key={it.label}>
            <dd className="display text-[52px] leading-none tabular-nums">
              <CountUp to={it.n} />
            </dd>
            <dt className="mt-2 font-mono text-[12px] uppercase tracking-wider text-mute">{it.label}</dt>
          </div>
        ))}
      </dl>
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
          <Link prefetch={false} href="/roadmaps" className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-card-2">
            <span className="label-cond text-[19px]">{p.name}</span>
            <span className="flex items-center gap-2 font-mono text-[12px] uppercase text-mute">
              {p.weeks.replace(" Prep", "")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ProblemCard({ stats }: { stats: LandingStats }) {
  return (
    <div className="space-y-5">
      <div className="brut overflow-hidden rounded-2xl bg-night text-[#f5efe6]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5 font-mono text-[12px] text-[#f5efe6]/60">
          <i className="size-2.5 rounded-full bg-[#ff5f56]" />
          <i className="size-2.5 rounded-full bg-[#ffbd2e]" />
          <i className="size-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2">practice · {featuredProblem.difficulty}</span>
        </div>
        <div className="p-5 font-mono text-[13.5px] leading-relaxed sm:p-6">
          <p className="text-[15.5px] font-bold">{featuredProblem.title}</p>
          <p className="mt-2 text-[#f5efe6]/65">{featuredProblem.statement}</p>
          <p className="mt-4">
            <span className="text-[#e07a52]">in </span>
            {featuredProblem.example.input}
          </p>
          <p>
            <span className="text-[#e07a52]">out </span>
            {featuredProblem.example.output}
          </p>
          <p className="mt-4 text-[#f5efe6]/50">seen at {featuredProblem.seenAt.join(", ")}</p>
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-3">
        {[
          { n: stats.problems, l: "coding problems" },
          { n: stats.quiz, l: "quiz questions" },
          { n: stats.labs, l: "labs" },
        ].map((x) => (
          <li key={x.l} className="rounded-2xl border-[1.5px] border-hair bg-card px-4 py-3">
            <span className="display block text-[30px]">{x.n.toLocaleString("en-IN")}</span>
            <span className="text-[13px] text-body">{x.l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HowItWorks({ stats }: { stats: LandingStats }) {
  return (
    <section id="how" className={`${wrap} scroll-mt-20 pb-12 pt-8`}>
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <h2 className="display text-[48px] md:text-[64px]">
          How it <span className="hl">works</span>
        </h2>
        <p className="note -rotate-2 text-[1.5rem]">not another random playlist. a plan.</p>
      </Reveal>

      <Step n={1} title="Choose the role you want." aside={<TrackList />}>
        <p>Each track is built for one job and says how many weeks to plan for and which subjects matter for it.</p>
        <p>Not sure yet? Start with Software Engineer. Every track shares the same core CS stages, so switching later costs you nothing.</p>
      </Step>
      <Step n={2} title="Learn the stages in order." aside={<StageExplorer />}>
        <p>Placement prep in {roadmap.length} stages, from programming basics to system design. Each one builds on the last.</p>
        <p>Every stage has notes, a sample interview question and the companies that test it, so you know why you&apos;re studying it.</p>
      </Step>
      <Step n={3} title="Practise what the rounds test." aside={<ProblemCard stats={stats} />}>
        <p>
          Coding problems with hints and a review, a quiz after every lesson, timed mock tests per subject, and labs where you can watch an algorithm run.
        </p>
        <p>Every question you miss goes into a review queue that brings it back until you know it.</p>
      </Step>
    </section>
  );
}

/* ---------- Tools (the one night section) ---------- */

const tools = [
  { t: "SQL playground", d: "Run real queries against sample databases.", href: "/tools/sql-playground" },
  { t: "Resume analyser", d: "Upload your resume, get specific fixes.", href: "/tools/resume-analyzer" },
  { t: "Interview simulator", d: "Answer technical questions against the clock.", href: "/tools/interview-simulator" },
  { t: "DSA visualiser", d: "Watch arrays, trees and graphs change step by step.", href: "/tools/dsa-visualizer" },
  { t: "STAR builder", d: "Shape your behavioural answers before the HR round.", href: "/tools/star-builder" },
  { t: "Study with me", d: "Timed focus sessions, so the hours add up.", href: "/study-with-me" },
];

function Tools() {
  return (
    <section id="tools" className="scroll-mt-16 bg-night py-24 text-[#f5efe6] md:py-28">
      <div className={wrap}>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display text-[48px] md:text-[64px]">
            Tools that run <br />
            in your browser
          </h2>
          <p className="font-mono text-[12px] uppercase tracking-wider text-[#f5efe6]/55">nothing to install</p>
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((x, i) => (
            <li key={x.t}>
            <Reveal delay={i * 0.04} className="h-full">
              <Link prefetch={false} href={x.href} className="group flex h-full flex-col rounded-2xl border-[2.4px] border-[#f5efe6]/20 p-6 transition-colors hover:border-[#e07a52]">
                <span className="label-cond flex items-center justify-between text-[22px]">
                  {x.t}
                  <ArrowRight className="size-5 text-[#e07a52] transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
                <span className="mt-2 text-[15px] leading-relaxed text-[#f5efe6]/70">{x.d}</span>
              </Link>
            </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const faqs = [
  { q: "Does StudyHub cost anything?", a: "No. Creating an account and following any track is free." },
  { q: "I'm in my first or second year. Is it too early?", a: "No, it's the best time. The roadmap starts at programming fundamentals, so you can begin at stage one and go at your own pace." },
  { q: "Which track should I pick?", a: "The role you plan to apply for. If you're unsure, start with Software Engineer: every track shares the same core CS stages." },
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
          <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-body">Free account. Pick a track and your first lesson is ready in under a minute.</p>
          <Link prefetch={false} href={SIGNUP} className={`${buttonClass("accent", "lg")} mt-8`}>
            Create your free account <ArrowRight className="size-5" />
          </Link>
        </div>
        <Link prefetch={false} href={SIGNUP} aria-label="Start free" className="hidden justify-self-end lg:block">
          <SpinSticker text="START FREE · START FREE · " />
        </Link>
      </div>
      <div className="border-t-[1.5px] border-hair">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-4 py-6 font-mono text-[12px] uppercase tracking-wider text-mute`}>
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
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function Landing({ stats }: { stats: LandingStats }) {
  return (
    <>
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <Ticker items={stats.subjects} />
        <Numbers stats={stats} />
        <HowItWorks stats={stats} />
        <Tools />
        <Faq />
      </main>
      <Closing />
    </>
  );
}
