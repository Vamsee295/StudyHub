"use client";
// Landing-page motion, ported from the portfolio (Vamsee295/Portfolio app/Components/common/motion.tsx).
// App pages appear instantly; only the landing reveals on scroll (DESIGN §7).
// No animation library: an IntersectionObserver adds a class and CSS does the rest (globals.css "landing reveal").
// Content renders visible on the server; only things that start below the fold are hidden and then revealed,
// so the first screen paints at once and nothing depends on JS to show up.
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";

/** Below the fold at mount: hide it (`waitClass`), then add `reveal-in` once it scrolls into view. */
function useRevealOnScroll(ref: RefObject<HTMLElement | null>, waitClass: string, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return; // already visible: leave it be
    if (window.location.hash) return; // opened on an anchor (/#faq): the browser jumps there, so show everything
    el.classList.add(waitClass);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.transitionDelay = `${delay}s`;
        el.classList.add("reveal-in");
        io.disconnect();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, waitClass, delay]);
}

/** Rises into view once, when scrolled to. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useRevealOnScroll(ref, "reveal-wait", delay);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Rust block that sweeps in behind a word when it scrolls into view. */
export function Marked({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useRevealOnScroll(ref, "mark-wait", 0.25);
  return (
    <span className="relative mx-[0.06em] inline-block whitespace-nowrap px-[0.14em]">
      <span ref={ref} aria-hidden className="mark-block absolute -inset-x-[0.04em] -inset-y-[0.04em] origin-left -rotate-1 rounded-lg bg-accent" />
      <span className="relative text-paper">{children}</span>
    </span>
  );
}

/** Counts from 0 to `to` with an ease-out cubic when it scrolls into view. */
export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Starts at the real number (server HTML, no-JS, paused tabs all show it); the first animation frame resets it to 0.
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return <span ref={ref}>{n.toLocaleString("en-IN")}</span>;
}

/** Round rust sticker with text circling a centre glyph. */
export function SpinSticker({ text, glyph = "↗" }: { text: string; glyph?: string }) {
  const id = useId();
  return (
    <span className="relative grid size-32 place-items-center rounded-full border-[2.5px] border-line bg-accent text-paper shadow-[4px_5px_0_var(--hard)]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_12s_linear_infinite]" aria-hidden>
        <defs>
          <path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-paper font-cond text-[11.5px] font-bold tracking-[0.18em]">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="display text-[34px]" aria-hidden>
        {glyph}
      </span>
    </span>
  );
}

/** Rotated ink strip that scrolls a list forever (pauses on hover). */
export function Ticker({ items }: { items: string[] }) {
  const track = [...items, ...items]; // two copies so the -50% translate loops seamlessly
  return (
    <div aria-hidden className="ticker -mx-[5vw] w-[110vw] -rotate-[1.5deg] overflow-hidden border-y-[2.5px] border-line bg-ink py-3 text-paper">
      <div className="ticker-track flex w-max">
        {track.map((item, i) => (
          <span key={i} className="display flex shrink-0 items-center gap-6 whitespace-nowrap px-6 text-[26px] sm:text-[32px]">
            {item}
            <span aria-hidden className="size-3 rotate-45 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
