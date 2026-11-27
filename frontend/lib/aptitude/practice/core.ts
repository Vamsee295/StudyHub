// Practice sets for aptitude lessons: up to 30 original multiple-choice questions per lesson, Easy → Hard.
// Number-based topics are generated from templates with seeded randomness, so every answer is computed
// (correct by construction) and a lesson always shows the same set. Word-based topics draw on curated banks.

export type Level = "Easy" | "Medium" | "Hard";

export interface PracticeQ {
  id: string;
  level: Level;
  q: string;
  options: string[]; // four, shuffled
  answer: number; // index into options
  explanation: string; // the worked solution
}

/** A question before shuffling: the correct option first, then distractors. */
export interface RawQ {
  q: string;
  correct: string;
  wrong: string[];
  explanation: string;
}

export type Maker = (r: Rng) => RawQ;
/** Per level, a list of question templates; the set cycles through them. */
export type Generator = Partial<Record<Level, Maker[]>>;

export interface Rng {
  next(): number; // [0, 1)
  int(lo: number, hi: number): number; // inclusive
  pick<T>(xs: readonly T[]): T;
  shuffle<T>(xs: T[]): T[];
}

export function rng(seed: string): Rng {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const next = () => {
    // mulberry32
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r: Rng = {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (xs) => xs[Math.floor(next() * xs.length)],
    shuffle: (xs) => {
      const out = [...xs];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
  return r;
}

// ── helpers for building options ──

/** Format a number for display: integers plainly, others to at most 2 decimals. */
export const fmt = (x: number) => (Number.isInteger(x) ? x.toLocaleString("en-IN") : (Math.round(x * 100) / 100).toLocaleString("en-IN"));

/** Three plausible wrong numbers near the answer, distinct from it and from each other. */
export function near(r: Rng, ans: number, opts: { step?: number; min?: number; extra?: number[] } = {}): number[] {
  const step = opts.step ?? Math.max(1, Math.round(Math.abs(ans) * 0.1));
  const out = new Set<number>();
  for (const e of opts.extra ?? []) if (e !== ans && Number.isFinite(e) && (opts.min === undefined || e >= opts.min)) out.add(e);
  let guard = 0;
  while (out.size < 3 && guard++ < 200) {
    const k = r.pick([-3, -2, -1, 1, 2, 3]);
    const v = Math.round((ans + k * step) * 100) / 100;
    if (v !== ans && (opts.min === undefined || v >= opts.min)) out.add(v);
  }
  return [...out].slice(0, 3);
}

/** Wrap a numeric answer as a RawQ with nearby distractors. */
export function num(r: Rng, q: string, ans: number, explanation: string, o: { step?: number; min?: number; extra?: number[]; unit?: string; prefix?: string } = {}): RawQ {
  const show = (x: number) => `${o.prefix ?? ""}${fmt(x)}${o.unit ?? ""}`;
  return { q, correct: show(ans), wrong: near(r, ans, o).map(show), explanation };
}

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
export const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
export const nCr = (n: number, k: number) => Math.round(fact(n) / (fact(k) * fact(n - k)));
export const nPr = (n: number, k: number) => Math.round(fact(n) / fact(n - k));
export const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
export const frac = (p: number, q: number) => {
  const g = gcd(p, q);
  return q / g === 1 ? `${p / g}` : `${p / g}/${q / g}`;
};

/** Turn templates into up to `count` questions: a third Easy, a third Medium, a third Hard (where available). */
export function buildSet(key: string, gen: Generator, count = 30): PracticeQ[] {
  const r = rng(key);
  const levels: Level[] = ["Easy", "Medium", "Hard"];
  const present = levels.filter((l) => gen[l]?.length);
  if (!present.length) return [];
  const per = Math.ceil(count / present.length);
  const out: PracticeQ[] = [];
  const seen = new Set<string>();
  for (const level of present) {
    const makers = gen[level]!;
    let made = 0;
    for (let attempt = 0; made < per && attempt < per * 6; attempt++) {
      const raw = makers[attempt % makers.length](r);
      const opts = [raw.correct, ...raw.wrong].map((s) => s.trim());
      if (seen.has(raw.q) || new Set(opts).size !== 4) continue; // skip repeats and clashing options
      seen.add(raw.q);
      const order = r.shuffle([0, 1, 2, 3]);
      out.push({
        id: `${key}#${out.length}`,
        level,
        q: raw.q,
        options: order.map((i) => opts[i]),
        answer: order.indexOf(0),
        explanation: raw.explanation,
      });
      made++;
    }
  }
  return out.slice(0, count);
}

/** Build a set from a fixed bank of authored questions (correct option first), in bank order. */
export function bankSet(key: string, bank: { level: Level; q: string; o: string[]; e: string }[], count = 30): PracticeQ[] {
  const r = rng(key);
  return bank.slice(0, count).map((b, i) => {
    const order = r.shuffle([0, 1, 2, 3].slice(0, b.o.length));
    return { id: `${key}#${i}`, level: b.level, q: b.q, options: order.map((k) => b.o[k]), answer: order.indexOf(0), explanation: b.e };
  });
}
