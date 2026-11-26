// Mock interview questions, taken from real course content: every lesson's "Interview traps"
// (question, the answer interviewers hear too often, and a model answer) plus the roadmap's
// sample interview questions. Nothing is generated and nothing is scored by a machine:
// the learner compares their answer with the model answer and rates it themselves.
import { ALL_COURSES } from "@/lib/data/courses";
import { roadmapModules } from "@/lib/data/roadmapModules";
import { seededRandom, shuffle } from "@/lib/learn/study";

export interface InterviewQuestion {
  id: string;
  course: string; // course slug, or "roadmap"
  courseTitle: string;
  question: string;
  answer: string;
  /** The weak answer interviewers often hear. */
  trap?: string;
  /** Where to reread the idea. */
  lesson?: { title: string; href: string };
}

export type SelfRating = "nailed" | "partly" | "missed";

export interface InterviewResult {
  question: InterviewQuestion;
  answer: string;
  rating: SelfRating;
  seconds: number;
}

type TrapSection = { type: string; traps?: { question: string; trap: string; solution: string }[] };

const GENERAL = "general";
const GENERAL_TITLE = "Projects, tests & HR";

let cache: InterviewQuestion[] | null = null;

export function allInterviewQuestions(): InterviewQuestion[] {
  if (cache) return cache;
  const out: InterviewQuestion[] = [];
  for (const c of ALL_COURSES) {
    for (const m of c.modules) {
      for (const l of m.lessons) {
        const sections = ((l.content as { sections?: TrapSection[] }).sections ?? []).filter((s) => s.type === "interviewTraps");
        sections.forEach((s, si) =>
          (s.traps ?? []).forEach((t, ti) =>
            out.push({
              id: `${l.id}#${si}.${ti}`,
              course: c.slug,
              courseTitle: c.title,
              question: t.question,
              answer: t.solution,
              trap: t.trap,
              lesson: { title: l.title, href: `/learn/${c.slug}/${l.slug}` },
            })
          )
        );
      }
    }
  }
  // Roadmap questions join their course; projects, online tests and HR share one group.
  const withTraps = new Set(out.map((q) => q.course));
  for (const r of roadmapModules) {
    const course = r.courses.find((c) => withTraps.has(c));
    out.push({
      id: `roadmap#${r.slug}`,
      course: course ?? GENERAL,
      courseTitle: course ? r.title : GENERAL_TITLE,
      question: r.interviewQuestion.question,
      answer: r.interviewQuestion.answer,
      lesson: { title: `Roadmap: ${r.title}`, href: `/roadmaps?module=${r.slug}` },
    });
  }
  cache = out;
  return out;
}

/** Subjects that have questions, with counts, for the setup screen. */
export function interviewSubjects(): { slug: string; title: string; count: number }[] {
  const counts = new Map<string, { title: string; count: number }>();
  for (const q of allInterviewQuestions()) {
    const title = q.course === GENERAL ? GENERAL_TITLE : (ALL_COURSES.find((c) => c.slug === q.course)?.title ?? q.courseTitle);
    const prev = counts.get(q.course);
    counts.set(q.course, { title, count: (prev?.count ?? 0) + 1 });
  }
  return [...counts.entries()].map(([slug, v]) => ({ slug, ...v })).sort((a, b) => b.count - a.count);
}

/** A random set of questions for one subject ("all" mixes every subject). */
export function buildInterview(subject: string, count: number, seed = String(Date.now())): InterviewQuestion[] {
  const pool = allInterviewQuestions().filter((q) => subject === "all" || q.course === subject);
  return shuffle(pool, seededRandom(seed)).slice(0, count);
}
