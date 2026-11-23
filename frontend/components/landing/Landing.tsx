"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { featuredProblem, practiceCategories } from "@/lib/data/practice";
import { roadmap } from "@/lib/data/roadmap";
import { companies } from "@/lib/data/companies";
import { paths } from "@/lib/data/paths";
import { Motif } from "./Motif";

const SIGNUP = "/login?mode=signup";
const ease = [0.16, 1, 0.3, 1] as const;
const totalQuestions = practiceCategories.reduce((n, c) => n + c.questions, 0);

// "TCS Digital / Prime" -> "TCS", matched against roadmap testedBy entries like "TCS NQT".
const shortName = (name: string) => name.split(" ")[0];
const stagesFor = (name: string) =>
  roadmap.filter((s) => s.testedBy.some((t) => t.startsWith(shortName(name))));

/* ---------- Nav ---------- */

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-strong)] bg-[var(--x-paper)]/92 backdrop-blur">
      <div className="x-wrap flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-[800] text-[1.35rem] tracking-[-0.03em]">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--x-deep)] text-white text-[15px]">S</span>
          StudyHub
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-7 text-[15px] font-semibold" aria-label="Sections">
          <a href="#how" className="hover:text-[var(--x-deep)]">How it works</a>
          <a href="#tracks" className="hover:text-[var(--x-deep)]">Tracks</a>
          <a href="#tools" className="hover:text-[var(--x-deep)]">Tools</a>
          <a href="#faq" className="hover:text-[var(--x-deep)]">FAQ</a>
        </nav>
        <Link href="/login" className="ml-auto md:ml-3 text-[15px] font-semibold whitespace-nowrap">Sign in</Link>
        <Link href={SIGNUP} className="x-btn x-btn-sm whitespace-nowrap">Start free</Link>
      </div>
    </header>
  );
}

/* ---------- Hero: pick a company, see its paper ---------- */

function CompanyPaper({ index }: { index: number }) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 16 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 16 });
  const c = companies[index];
  const stages = stagesFor(c.name).slice(0, 4);

  return (
    <div
      className="relative [perspective:1400px]"
      onPointerMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }} className="relative">
        {/* sheet underneath, for paper depth */}
        <div className="x-sheet absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] !bg-[var(--x-sky-soft)]" style={{ transform: "translateZ(-40px) rotate(2.5deg)" }} aria-hidden="true" />
        <div className="x-sheet relative p-6 sm:p-8" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={c.name}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-dashed border-[var(--border-strong)]/40 pb-4">
                <div>
                  <p className="x-label">{c.segment} · {c.roleTag}</p>
                  <h2 className="mt-1 text-[1.75rem] x-dhead">{c.name}</h2>
                </div>
                <span className="x-label shrink-0 border border-[var(--border-strong)] rounded px-2 py-1 !text-[var(--x-ink)]">
                  {c.focus.length} rounds
                </span>
              </div>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--x-soft)]">{c.description}</p>

              <p className="x-label mt-6">The rounds</p>
              <ol className="mt-2 space-y-2">
                {c.focus.map((f, i) => (
                  <li key={f} className="flex gap-3 text-[15px] font-semibold">
                    <span className="x-mono text-[var(--x-deep)]">{String(i + 1).padStart(2, "0")}</span>{f}
                  </li>
                ))}
              </ol>

              {stages.length > 0 && (
                <>
                  <p className="x-label mt-6">Study these stages first</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {stages.map((s) => (
                      <li key={s.id} className="rounded border border-[var(--border-strong)] bg-[var(--x-sky-soft)] px-2.5 py-1 text-[13.5px] font-semibold">
                        {s.title}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function Hero() {
  const [picked, setPicked] = useState(2); // Amazon: the most-asked-about company

  return (
    <section className="x-wrap pt-14 md:pt-20 pb-28 grid gap-14 lg:grid-cols-[1.1fr_1fr] items-start">
      <div>
        <p className="x-pen rv -rotate-2">free placement prep for engineering students</p>
        <h1 className="x-display rv d1 mt-4">
          Know what <span className="x-mark">your company</span> will ask.
        </h1>
        <p className="x-lead rv d2 mt-6 max-w-[46ch]">
          StudyHub shows you the hiring rounds at each company, the subjects those rounds test, and
          the order to learn them in. Then you practise on the same kind of questions.
        </p>

        <div className="rv d3 mt-9">
          <p className="text-[15px] font-semibold">Pick a company to see its rounds:</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Companies">
            {companies.map((c, i) => (
              <button
                key={c.name}
                type="button"
                className="x-chip"
                aria-pressed={i === picked}
                onClick={() => setPicked(i)}
              >
                {shortName(c.name)}
              </button>
            ))}
          </div>
        </div>

        <div className="rv d3 mt-10 flex flex-wrap items-center gap-5">
          <Link href={SIGNUP} className="x-btn">
            Prepare for {shortName(companies[picked].name)} <ArrowRight size={19} />
          </Link>
          <Link href="/companies" className="font-semibold underline underline-offset-4 decoration-[1.5px] hover:text-[var(--x-deep)]">
            See all companies
          </Link>
        </div>
      </div>

      <div className="rv d2">
        <CompanyPaper index={picked} />
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

function Step({ n, title, children, aside }: { n: number; title: string; children: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start py-14 md:py-20 border-t-[1.5px] border-[var(--x-line-soft)]">
      <div className="lg:sticky lg:top-28">
        <span className="x-circle rv" aria-label={`Step ${n}`}>
          0{n}
          <svg viewBox="0 0 58 58" aria-hidden="true"><path pathLength="1" d="M29 4C14 3 4 14 5 29s12 25 26 24 24-11 23-26S40 3 25 6" /></svg>
        </span>
        <h3 className="x-head rv d1 mt-5 !text-[clamp(2rem,1.4rem+2vw,3.2rem)]">{title}</h3>
        <div className="x-lead rv d2 mt-5 max-w-[46ch] space-y-4">{children}</div>
      </div>
      <div className="rv d2">{aside}</div>
    </div>
  );
}

function TrackList() {
  return (
    <ul className="x-sheet divide-y-[1.5px] divide-[var(--x-ink)]/15">
      {paths.map((p) => (
        <li key={p.slug} className="flex items-center justify-between gap-4 px-5 py-4">
          <span className="font-semibold text-[15.5px]">{p.name}</span>
          <span className="x-label shrink-0">{p.weeks.replace(" Prep", "")}</span>
        </li>
      ))}
    </ul>
  );
}

// Click through the real roadmap: every stage's topics, an interview question and who tests it.
function StageExplorer() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const s = roadmap[i];
  const go = (n: number) => setI((n + roadmap.length) % roadmap.length);

  return (
    <div className="x-sheet overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-strong)] bg-[var(--x-paper-2)] px-5 py-3">
        <span className="x-label !text-[var(--x-ink)]">Stage {i + 1} of {roadmap.length}</span>
        <span className="flex gap-1.5">
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous stage" className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border-strong)] bg-[var(--x-card)] hover:bg-[var(--x-ink)] hover:text-[var(--x-paper)]">
            <ArrowLeft size={15} strokeWidth={2.5} />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next stage" className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border-strong)] bg-[var(--x-card)] hover:bg-[var(--x-ink)] hover:text-[var(--x-paper)]">
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </span>
      </div>

      {/* stage rail: one numbered stop per stage */}
      <ol className="flex gap-1.5 overflow-x-auto px-5 pt-4 pb-1" aria-label="Roadmap stages">
        {roadmap.map((st, n) => (
          <li key={st.id}>
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i ? "step" : undefined}
              title={st.title}
              className={`x-mono grid h-8 min-w-8 place-items-center rounded-md border-[1.5px] px-1.5 text-[12.5px] font-bold transition-colors ${
                n === i
                  ? "border-[var(--x-ink)] bg-[var(--x-ink)] text-[var(--x-paper)]"
                  : n < i
                    ? "border-[var(--x-ink)] bg-[var(--x-paper-2)]"
                    : "border-[var(--x-line-soft)] text-[var(--x-mute)] hover:border-[var(--x-ink)]"
              }`}
            >
              {String(n + 1).padStart(2, "0")}
            </button>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={s.id}
          initial={reduced ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -12 }}
          transition={{ duration: 0.22, ease }}
          className="px-5 pt-4 pb-6"
          aria-live="polite"
        >
          <p className="x-label">{s.phase}</p>
          <h4 className="x-dhead mt-1 text-[1.6rem]">{s.title}</h4>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--x-soft)]">{s.description}</p>

          <p className="x-label mt-5">What you&apos;ll learn</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {s.topics.map((t) => (
              <li key={t} className="flex gap-2 text-[14.5px] font-medium leading-snug">
                <Check size={16} strokeWidth={3} className="mt-0.5 shrink-0" />{t}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-lg bg-[var(--x-night)] px-4 py-3.5 text-[var(--x-paper)]">
            <p className="x-label !text-[rgba(245,239,230,0.55)]">Asked in interviews</p>
            <p className="mt-1 text-[15px] font-semibold leading-snug">&ldquo;{s.sampleQuestion}&rdquo;</p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="x-label mr-1">Tested by</span>
            {s.testedBy.map((c) => (
              <span key={c} className="rounded-full border border-[var(--border-strong)] px-2.5 py-0.5 text-[13px] font-semibold">{c}</span>
            ))}
          </div>

          <p className="mt-5 text-[14px] text-[var(--x-soft)]">
            Start with <span className="font-semibold text-[var(--x-ink)]">{s.resourceHighlight.title}</span> · {s.resourceHighlight.detail}
          </p>
        </motion.div>
      </AnimatePresence>

      <Link href="/roadmaps" className="flex items-center justify-between border-t border-[var(--border-strong)] px-5 py-3.5 font-semibold hover:bg-[var(--x-paper-2)]">
        Open the full roadmap <ArrowRight size={18} />
      </Link>
    </div>
  );
}

function ProblemCard() {
  return (
    <div className="space-y-5">
      <div className="x-term">
        <div className="x-term-bar x-mono"><i /><i /><i /><span className="ml-2">practice · {featuredProblem.difficulty}</span></div>
        <div className="p-5 sm:p-6 x-mono text-[13.5px] leading-relaxed">
          <p className="text-white font-bold text-[15.5px]">{featuredProblem.title}</p>
          <p className="mt-2 text-[#a3a3a3]">{featuredProblem.statement}</p>
          <p className="mt-4"><span className="text-[var(--x-sky)]">in  </span>{featuredProblem.example.input}</p>
          <p><span className="text-[var(--x-sky)]">out </span>{featuredProblem.example.output}</p>
          <p className="mt-4 text-[#8a8a8a]">seen at {featuredProblem.seenAt.join(", ")}</p>
        </div>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {practiceCategories.map((c) => (
          <li key={c.name} className="x-sheet !shadow-none px-4 py-3">
            <span className="block text-[1.5rem] x-dhead">{c.questions}</span>
            <span className="text-[14px] text-[var(--x-soft)]">{c.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="x-wrap pb-12 scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <h2 className="x-head rv max-w-[16ch]">How StudyHub works</h2>
        <p className="x-strike rv d1 text-[1.35rem] font-semibold text-[var(--x-soft)]">
          Not <span>another random playlist<svg viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 18 C 80 8, 160 22, 240 12 S 360 10, 396 14" /></svg></span>. A plan.
        </p>
      </div>

      <Step n={1} title="Choose the role you want." aside={<TrackList />}>
        <p>
          Each track is built for one job: software engineer, AI/ML, data, cloud, analytics or
          security. It tells you how many weeks to plan for and which subjects matter for that role.
        </p>
        <p>Not sure yet? Start with Software Engineer. Every track shares the same core CS stages, so switching later costs you nothing.</p>
      </Step>

      <Step n={2} title="Learn the stages in order." aside={<StageExplorer />}>
        <p>
          The roadmap breaks placement prep into {roadmap.length} stages, from programming basics to
          system design. Finish one, and the next one builds on it.
        </p>
        <p>
          Every stage has notes, a sample interview question and the list of companies that test
          it, so you always know why you&apos;re studying something.
        </p>
      </Step>

      <Step n={3} title="Practise what the rounds actually test." aside={<ProblemCard />}>
        <p>
          {totalQuestions.toLocaleString("en-IN")} practice questions across DSA, SQL, aptitude and
          core CS. Each problem shows where it has been asked, with hints when you&apos;re stuck and a
          review once you&apos;re done.
        </p>
        <p>When you feel ready, run a full placement simulation for your target company.</p>
      </Step>
    </section>
  );
}

/* ---------- Tracks ---------- */

function Tracks() {
  return (
    <section id="tracks" className="x-wrap py-24 md:py-28 scroll-mt-20 border-t border-[var(--border-strong)]">
      <div className="grid gap-6 lg:grid-cols-12 items-end">
        <h2 className="x-head rv lg:col-span-7">Six tracks, one for each role</h2>
        <p className="x-lead rv d1 lg:col-span-5">Open a track to see every stage, the weeks it takes and the resources for each one.</p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p) => (
          <motion.div key={p.slug} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 320, damping: 20 }}>
            <Link href="/roadmaps" className="x-sheet group flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="x-label">{p.weeks} · {p.resourceCount}</span>
                <span className="text-[var(--x-deep)]"><Motif slug={p.slug} /></span>
              </div>
              <h3 className="mt-4 text-[1.35rem] x-dhead leading-tight">{p.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--x-soft)]">{p.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.tags.slice(0, 3).map((t) => (
                  <li key={t} className="rounded border border-[var(--x-ink)]/30 px-2.5 py-0.5 text-[13px] font-medium">{t}</li>
                ))}
              </ul>
              <span className="mt-auto pt-6 flex items-center gap-2 font-semibold text-[var(--x-deep)]">
                Open track <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Tools ---------- */

const tools = [
  { t: "SQL playground", d: "Write and run real queries against sample databases. Nothing to install.", href: "/tools/sql-playground" },
  { t: "Resume analyser", d: "Upload your resume and get specific fixes before you apply.", href: "/tools/resume-analyzer" },
  { t: "Interview simulator", d: "Practise answering technical questions under interview conditions.", href: "/tools/interview-simulator" },
  { t: "DSA visualiser", d: "Watch arrays, trees and graphs change step by step as an algorithm runs.", href: "/tools/dsa-visualizer" },
  { t: "Subject notes", d: "Interview-focused notes for DSA, Java, Python, DBMS, OS and networks.", href: "/learn" },
  { t: "Study with me", d: "Focused study sessions with a timer, so the hours actually add up.", href: "/study-with-me" },
];

function Tools() {
  return (
    <section id="tools" className="x-wrap py-24 md:py-28 scroll-mt-20 border-t border-[var(--border-strong)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="x-head rv max-w-[18ch]">Free tools that run in your browser</h2>
        <p className="x-label rv d1">no setup needed</p>
      </div>
      <ul className="rv d1 mt-12 grid gap-px bg-[var(--x-line-soft)] border border-[var(--x-line-soft)] rounded-xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((x) => (
          <li key={x.t} className="bg-[var(--x-card)]">
            <Link href={x.href} className="group flex h-full flex-col p-6 hover:bg-[var(--x-sky-soft)] transition-colors">
              <span className="flex items-center justify-between font-bold text-[1.1rem]">
                {x.t}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 text-[15px] leading-relaxed text-[var(--x-soft)]">{x.d}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- FAQ ---------- */

const faqs = [
  { q: "Does StudyHub cost anything?", a: "No. Creating an account and following any track is free." },
  { q: "I'm in my first or second year. Is it too early?", a: "No, it's the best time. The roadmap starts at programming fundamentals, so you can begin at stage one and go at your own pace." },
  { q: "Which track should I pick?", a: "Pick the role you plan to apply for. If you're unsure, start with Software Engineer. Every track shares the same core CS stages, so switching later doesn't throw away your progress." },
  { q: "Do I need to install anything?", a: "No. Notes, practice, the SQL playground and every other tool run in the browser." },
  { q: "Where does the company information come from?", a: "It's compiled from recent hiring rounds and reviewed periodically. Each company page shows when it was last checked." },
];

function Faq() {
  return (
    <section id="faq" className="x-wrap py-24 md:py-28 scroll-mt-20 border-t border-[var(--border-strong)] grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <h2 className="x-head rv">Questions</h2>
      <div>
        {faqs.map((f) => (
          <details key={f.q} className="x-faq x-row">
            <summary className="flex items-center justify-between gap-6 py-5 text-[17px] sm:text-[18px] font-semibold">
              {f.q}
              <span className="x-plus grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] bg-[var(--x-card)]">
                <Plus size={16} strokeWidth={2.5} />
              </span>
            </summary>
            <p className="pb-6 max-w-[62ch] text-[16px] leading-relaxed text-[var(--x-soft)]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------- Closing + footer ---------- */

function Closing() {
  return (
    <footer className="x-night">
      <div className="x-wrap py-24 md:py-32 grid gap-10 lg:grid-cols-12 items-end">
        <div className="lg:col-span-8">
          <p className="x-label rv !text-[#cfc6b8]">placement season comes faster than you think</p>
          <h2 className="x-display rv d1 mt-4">Start with <span className="x-mark x-mark-paper">stage one</span> today.</h2>
        </div>
        <div className="lg:col-span-4">
          <p className="text-[17px] leading-relaxed text-white/75">Free account. Pick a track and your first stage is ready in under a minute.</p>
          <Link href={SIGNUP} className="x-btn x-btn-light mt-7 !shadow-[var(--x-shadow)]">
            Create your free account <ArrowRight size={19} />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="x-wrap flex flex-wrap items-center justify-between gap-4 py-6 text-[14px] text-white/70">
          <span className="font-bold text-white">StudyHub</span>
          <nav className="flex flex-wrap gap-6" aria-label="Footer">
            <Link href="/learn" className="hover:text-white">Learn</Link>
            <Link href="/practice" className="hover:text-white">Practice</Link>
            <Link href="/companies" className="hover:text-white">Companies</Link>
            <Link href="/help" className="hover:text-white">Help</Link>
          </nav>
          <span>© {new Date().getFullYear()} StudyHub</span>
        </div>
      </div>
    </footer>
  );
}

// Fade-and-rise each .rv block the first time it scrolls into view.
// Blocks already on screen at mount are marked .in immediately so first paint is never blank.
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px 10% 0px" },
    );
    document.querySelectorAll(".x .rv").forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
      else io.observe(el);
    });
    document.documentElement.classList.add("rv-on");
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("rv-on");
    };
  }, []);
}

export function Landing() {
  useReveal();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Tracks />
        <Tools />
        <Faq />
      </main>
      <Closing />
    </>
  );
}
