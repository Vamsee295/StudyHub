"use client";
// The landing page's interactive parts. Everything else in Landing.tsx renders on the server.
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Pause, Play } from "lucide-react";
import { roadmap } from "@/lib/data/roadmap";
import { companies } from "@/lib/data/companies";
import { buttonClass } from "@/components/ui/Button";

const SIGNUP = "/login?mode=signup";
// "TCS Digital / Prime" -> "TCS", matched against roadmap testedBy entries like "TCS NQT".
const shortName = (name: string) => name.split(" ")[0];
const stagesFor = (name: string) => roadmap.filter((s) => s.testedBy.some((t) => t.startsWith(shortName(name))));
const wrap = "mx-auto w-full max-w-[1180px] px-4 md:px-8";

const ROTATE_MS = 5000;

/** Should the deck move on its own? Not with reduced motion (OS setting or the in-app toggle). */
function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !document.documentElement.classList.contains("reduce-motion");
}

function CompanyCard({
  index,
  onPick,
  playing,
  run,
  onToggle,
  onHold,
}: {
  index: number;
  onPick: (i: number) => void;
  playing: boolean;
  run: number;
  onToggle: () => void;
  onHold: (held: boolean) => void;
}) {
  const c = companies[index];
  const stages = stagesFor(c.name).slice(0, 4);
  const next = () => onPick((index + 1) % companies.length);
  return (
    <div
      className="relative mx-auto w-full max-w-[480px]"
      // hover holds the deck for a mouse only: a tap fires an enter with no leave, which would pause it for good
      onPointerEnter={(e) => e.pointerType === "mouse" && onHold(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHold(false)}
      onFocus={() => onHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onHold(false)}
    >
      {/* two sheets underneath for a hand-stacked deck */}
      <div aria-hidden className="brut absolute inset-0 translate-x-4 translate-y-3 rotate-[4deg] rounded-2xl bg-paper-2" />
      <div aria-hidden className="brut absolute inset-0 -translate-x-2 translate-y-2 -rotate-[3deg] rounded-2xl bg-card-2" />
      <div data-ui className="brut relative -rotate-1 rounded-2xl bg-card p-6 sm:p-7">
        {/* the whole card is a tap target for the next company; the Next button below is the keyboard path */}
        <div key={c.name} className="fade-in cursor-pointer select-none" onClick={next} aria-live={playing ? "off" : "polite"}>
          <div className="flex items-start justify-between gap-4 border-b-[1.5px] border-dashed border-hair pb-4">
            <div>
              <p className="eyebrow !text-[13px] !text-[13px]">
                {c.segment} · {c.roleTag}
              </p>
              <h2 className="display mt-1 text-[38px]">{c.name}</h2>
            </div>
            <span className="label-cond shrink-0 rounded-lg border-2 border-line px-2 py-0.5 text-[14px]">{c.focus.length} rounds</span>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-body">{c.description}</p>
          <p className="mt-5 font-mono text-[13px] uppercase tracking-wider text-mute">The rounds</p>
          <ol className="mt-2 space-y-1.5">
            {c.focus.map((f, i) => (
              <li key={f} className="flex gap-3 text-[15px] font-semibold">
                <span className="font-mono text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                {f}
              </li>
            ))}
          </ol>
          {stages.length > 0 && (
            <>
              <p className="mt-5 font-mono text-[13px] uppercase tracking-wider text-mute">Study these first</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {stages.map((s) => (
                  <li key={s.id} className="rounded-full border-[1.5px] border-hair bg-paper-2 px-3 py-0.5 text-[13px] font-semibold">
                    {s.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* deck controls: one tick per company (the current one fills over 5 s), pause, next */}
        <div className="mt-6 flex items-center gap-3 border-t-[1.5px] border-dashed border-hair pt-4">
          <ol className="flex flex-1 gap-1.5" aria-label="Companies">
            {companies.map((co, i) => (
              <li key={co.name} className="flex-1">
                <button
                  type="button"
                  onClick={() => onPick(i)}
                  aria-label={co.name}
                  aria-current={i === index ? "true" : undefined}
                  className="no-press block w-full py-2"
                >
                  <span className="block h-1.5 overflow-hidden rounded-full bg-ink/15">
                    {i < index && <span className="block h-full w-full bg-ink/40" />}
                    {i === index && (
                      <span
                        key={run}
                        className={playing ? "deck-tick block h-full bg-accent" : "block h-full w-full bg-accent"}
                        style={playing ? { animationDuration: `${ROTATE_MS}ms` } : undefined}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={onToggle}
            aria-label={playing ? "Pause the company tour" : "Play the company tour"}
            className="tap grid size-8 shrink-0 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper"
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next company"
            className="tap grid size-8 shrink-0 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-[13px] text-mute md:hidden">Tap the card for the next company</p>
      </div>
    </div>
  );
}

export function Hero() {
  const [picked, setPicked] = useState(Math.min(2, companies.length - 1)); // Amazon: the most-asked-about company
  const [paused, setPaused] = useState(false); // the learner pressed pause
  const [held, setHeld] = useState(false); // pointer or focus is on the card: hold still while they read
  const [canMove, setCanMove] = useState(false); // decided after mount (reduced motion is a browser setting)
  const [run, setRun] = useState(0); // restarts the 5 s tick in sync with the timer
  const playing = canMove && !paused && !held;

  useEffect(() => {
    const decide = () => setCanMove(motionAllowed() && document.visibilityState === "visible");
    decide();
    document.addEventListener("visibilitychange", decide);
    return () => document.removeEventListener("visibilitychange", decide);
  }, []);

  // One timer per shown company: picking one by hand, pausing or holding restarts the full 5 s.
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setPicked((p) => (p + 1) % companies.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [picked, playing, run]);

  const pick = (i: number) => {
    setPicked(i);
    setRun((r) => r + 1);
  };
  const hold = (h: boolean) => {
    setHeld(h);
    if (!h) setRun((r) => r + 1);
  };

  return (
    <section className={`${wrap} grid items-center gap-16 pb-20 pt-12 md:pt-20 lg:grid-cols-[1.15fr_1fr]`}>
      <div>
        <p className="note -rotate-2">free placement prep for engineering students ↓</p>
        <h1 className="display mt-3 text-[52px] sm:text-[76px] xl:text-[88px]">
          Know what <br />
          {/* static block, not <Marked>: the headline must read correctly before any animation runs */}
          <span className="hl my-1 whitespace-nowrap">your company</span>
          <br />
          will ask.
        </h1>
        <p className="mt-6 max-w-[46ch] text-[18px] leading-relaxed text-body">
          The hiring rounds at each company, the subjects those rounds test, and the order to learn them in. Then you practice on the same kind of questions.
        </p>

        <p className="label-cond mt-8 text-[16px]">Pick a company:</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Companies">
          {companies.map((c, i) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={i === picked}
              onClick={() => pick(i)}
              className={
                "label-cond h-9 rounded-full border-2 px-4 text-[15px] transition-colors " +
                (i === picked ? "border-ink bg-ink text-paper" : "border-hair hover:border-line")
              }
            >
              {shortName(c.name)}
            </button>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link prefetch={false} href={SIGNUP} className={buttonClass("accent", "lg")}>
            Prepare for {shortName(companies[picked].name)} <ArrowRight className="size-5" />
          </Link>
          <Link prefetch={false} href="/companies" className={buttonClass("secondary", "lg")}>
            All companies
          </Link>
        </div>
      </div>
      <CompanyCard
        index={picked}
        onPick={pick}
        playing={playing}
        run={run}
        onToggle={() => {
          setPaused((p) => !p);
          setRun((r) => r + 1);
        }}
        onHold={hold}
      />
    </section>
  );
}

// Click through the real roadmap: every stage's topics, an interview question and who tests it.
export function StageExplorer() {
  const [i, setI] = useState(0);
  const s = roadmap[i];
  const go = (n: number) => setI((n + roadmap.length) % roadmap.length);
  return (
    <div data-ui className="brut overflow-hidden rounded-2xl bg-card">
      <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-hair bg-paper-2 px-5 py-3">
        <span className="font-mono text-[13px] uppercase tracking-wider">
          Stage {i + 1} of {roadmap.length}
        </span>
        <span className="flex gap-1.5">
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous stage" className="tap grid size-8 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper">
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next stage" className="tap grid size-8 place-items-center rounded-full border-2 border-line bg-card hover:bg-ink hover:text-paper">
            <ArrowRight className="size-4" />
          </button>
        </span>
      </div>
      <ol className="flex flex-wrap gap-1.5 px-5 pb-1 pt-4" aria-label="Roadmap stages">
        {roadmap.map((st, n) => (
          <li key={st.id}>
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i ? "step" : undefined}
              title={st.title}
              className={
                "no-press grid h-8 min-w-8 place-items-center rounded-lg border-2 px-1.5 font-mono text-[13px] font-bold transition-colors " +
                (n === i ? "border-ink bg-ink text-paper" : n < i ? "border-line bg-paper-2" : "border-hair text-mute hover:border-line")
              }
            >
              {String(n + 1).padStart(2, "0")}
            </button>
          </li>
        ))}
      </ol>
      <div key={s.id}
          className="fade-in px-5 pb-6 pt-4"
          aria-live="polite"
        >
          <p className="eyebrow !text-[13px] !text-[13px]">{s.phase}</p>
          <h4 className="display mt-1 text-[32px]">{s.title}</h4>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-body">{s.description}</p>
          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {s.topics.map((t) => (
              <li key={t} className="flex gap-2 text-[14px] font-medium leading-snug">
                <Check className="mt-0.5 size-4 shrink-0 text-note" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-night px-4 py-3.5 text-[#f5efe6]">
            <p className="font-mono text-[13px] uppercase tracking-wider text-[#f5efe6]/55">Asked in interviews</p>
            <p className="mt-1 text-[15px] font-semibold leading-snug">&ldquo;{s.sampleQuestion}&rdquo;</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[13px] uppercase tracking-wider text-mute">Tested by</span>
            {s.testedBy.map((c) => (
              <span key={c} className="rounded-full border-[1.5px] border-hair px-2.5 py-0.5 text-[13px] font-semibold">
                {c}
              </span>
            ))}
          </div>
        </div>
      <Link prefetch={false} href="/roadmaps" className="label-cond flex items-center justify-between border-t-[1.5px] border-hair px-5 py-3.5 text-[17px] hover:bg-card-2">
        Open the full roadmap <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
