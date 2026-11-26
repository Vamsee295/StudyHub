"use client";
// Motion for calculator results (Settings → Reduce motion and the OS setting both turn it off).
// Transform/opacity only; numbers tween in JS because text can't be transitioned.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

/** The strong UI ease-out (Emil Kowalski's animation guidance); mirrors --ease-out in globals.css. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const noop = () => () => {};
/** False when the OS asks for reduced motion or the learner turned it off in Settings. */
export function useMotionAllowed() {
  const osReduce = useReducedMotion();
  const appReduce = useSyncExternalStore(noop, () => document.documentElement.classList.contains("reduce-motion"), () => false);
  return !osReduce && !appReduce;
}

/** A number that tweens to each new value. `fromZero` counts up on first show (a one-time reveal). */
export function AnimatedNumber({
  value,
  decimals = 0,
  duration = 0.25,
  fromZero = false,
  delay = 0,
  format,
}: {
  value: number;
  decimals?: number;
  /** Custom display, e.g. minutes:seconds. Defaults to `toFixed(decimals)`. */
  format?: (n: number) => string;
  duration?: number;
  fromZero?: boolean;
  delay?: number;
}) {
  const allowed = useMotionAllowed();
  const [shown, setShown] = useState(fromZero && allowed ? 0 : value);
  const from = useRef(shown);

  useEffect(() => {
    if (!allowed) {
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => {
        from.current = v;
        setShown(v);
      },
    });
    return () => controls.stop();
  }, [value, duration, delay, allowed]);

  const n = allowed ? shown : value;
  return <>{format ? format(n) : n.toFixed(decimals)}</>;
}

/** A horizontal bar whose fill scales (transform, not width) to `pct` of the track. */
export function MeterBar({
  pct,
  color = "var(--accent)",
  className = "h-2",
  duration = 0.25,
  delay = 0,
  label,
}: {
  pct: number;
  color?: string;
  className?: string;
  duration?: number;
  delay?: number;
  label?: string;
}) {
  const allowed = useMotionAllowed();
  const scale = Math.max(0, Math.min(100, pct)) / 100;
  return (
    <span
      className={`block overflow-hidden rounded-full bg-ink/10 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <motion.span
        className="block h-full w-full origin-left rounded-full"
        style={{ background: color }}
        initial={allowed ? { transform: "scaleX(0)" } : false}
        animate={{ transform: `scaleX(${scale})` }}
        transition={allowed ? { duration, delay, ease: EASE_OUT } : { duration: 0 }}
      />
    </span>
  );
}

/** A ring that sweeps to `pct` once when it appears. */
export function ScoreRing({ pct, color, size = 168, stroke = 14, children }: { pct: number; color: string; size?: number; stroke?: number; children?: React.ReactNode }) {
  const allowed = useMotionAllowed();
  const r = (size - stroke) / 2;
  const value = Math.max(0, Math.min(100, pct)) / 100;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--hair)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={allowed ? { pathLength: 0 } : false}
          animate={{ pathLength: value }}
          transition={allowed ? { duration: 0.8, ease: EASE_OUT } : { duration: 0 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
