// Question bank, revision data and spaced-repetition review queue for a subject.
// Built from each lesson's quickCheck / takeaways / interviewTraps sections.
import { getCourseBySlug } from "@/lib/data/courses/index";
import { EXTRA_QUESTIONS } from "@/lib/data/question-bank/index";
import { markChanged } from "@/lib/sync/userSync";

export interface BankQuestion {
  id: string;            // `${lessonSlug}#${index}` — stable across sessions
  moduleSlug: string;
  moduleTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  question: string;
  options: string[];
  answer: number;        // index into options
  explanation: string;
}

export interface RevisionModule {
  slug: string;
  title: string;
  lessons: { slug: string; title: string; takeaways: string[]; traps: { question: string; trap: string; solution: string }[] }[];
}

export function questionBank(subjectSlug: string): BankQuestion[] {
  const course = getCourseBySlug(subjectSlug);
  if (!course) return [];
  const out: BankQuestion[] = [];
  for (const m of course.modules) {
    for (const l of m.lessons) {
      (l.content.sections ?? []).forEach((s, i) => {
        if (s.type !== "quickCheck" || !s.question || !s.options?.length) return;
        const raw = s.answer ?? s.correctIndex;
        const answer = typeof raw === "number" ? raw : s.options.indexOf(String(raw));
        if (answer < 0 || answer >= s.options.length) return;
        out.push({
          id: `${l.slug}#${i}`, moduleSlug: m.slug, moduleTitle: m.title, lessonSlug: l.slug, lessonTitle: l.title,
          question: s.question, options: s.options, answer, explanation: s.explanation ?? "",
        });
      });
      (EXTRA_QUESTIONS[subjectSlug]?.[l.slug] ?? []).forEach((x, i) => {
        const id = `${l.slug}#x${i}`;
        // Shuffle options with a seed from the id: answer positions are spread evenly but stay stable per question.
        const order = shuffle([0, 1, 2, 3].slice(0, x.o.length), seededRandom(id));
        out.push({
          id, moduleSlug: m.slug, moduleTitle: m.title, lessonSlug: l.slug, lessonTitle: l.title,
          question: x.q, options: order.map((k) => x.o[k]), answer: order.indexOf(x.a), explanation: x.e,
        });
      });
    }
  }
  return out;
}

export function revisionData(subjectSlug: string): RevisionModule[] {
  const course = getCourseBySlug(subjectSlug);
  if (!course) return [];
  return course.modules.map((m) => ({
    slug: m.slug,
    title: m.title,
    lessons: m.lessons.map((l) => {
      const secs = l.content.sections ?? [];
      return {
        slug: l.slug,
        title: l.title,
        takeaways: secs.filter((s) => s.type === "takeaways").flatMap((s) => s.items ?? []),
        traps: secs.filter((s) => s.type === "interviewTraps").flatMap((s) => s.traps ?? []),
      };
    }),
  }));
}

// Small deterministic PRNG (FNV-1a hash seed + mulberry32) for stable per-question shuffles.
export function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- persistence (per browser) ----------
// ponytail: localStorage, like learnService's progress cache. Move to a backend table when cross-device sync matters.

export interface TestAttempt {
  at: number;
  total: number;
  correct: number;
  seconds: number;
  byModule: Record<string, { title: string; correct: number; total: number }>;
}

export interface ReviewItem { id: string; box: number; due: number }

const DAY = 86_400_000;
export const BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 14, 30]; // index = box (1..6); box 1 = due now

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
  markChanged(key);   // syncs test history and review queue to the account
}

const attemptsKey = (s: string) => `studyhub:tests:${s}`;
const reviewKey = (s: string) => `studyhub:review:${s}`;

export const getAttempts = (subject: string) => read<TestAttempt[]>(attemptsKey(subject), []);
export function saveAttempt(subject: string, a: TestAttempt) {
  write(attemptsKey(subject), [a, ...getAttempts(subject)].slice(0, 20));
}

export const getReviewItems = (subject: string) => read<ReviewItem[]>(reviewKey(subject), []);

// Leitner scheduling: a wrong answer goes to box 1 (due now); a right answer moves up a box.
// Leaving the last box with a right answer retires the item.
export function schedule(items: ReviewItem[], id: string, correct: boolean, now = Date.now()): ReviewItem[] {
  const existing = items.find((x) => x.id === id);
  const rest = items.filter((x) => x.id !== id);
  if (!correct) return [...rest, { id, box: 1, due: now + BOX_INTERVAL_DAYS[1] * DAY }];
  if (!existing) return rest;                       // right on first sight: nothing to review
  const box = existing.box + 1;
  if (box >= BOX_INTERVAL_DAYS.length) return rest; // mastered
  return [...rest, { id, box, due: now + BOX_INTERVAL_DAYS[box] * DAY }];
}

export function recordAnswers(subject: string, results: { id: string; correct: boolean }[], now = Date.now()) {
  let items = getReviewItems(subject);
  for (const r of results) items = schedule(items, r.id, r.correct, now);
  write(reviewKey(subject), items);
}

export const dueItems = (items: ReviewItem[], now = Date.now()) => items.filter((x) => x.due <= now);
