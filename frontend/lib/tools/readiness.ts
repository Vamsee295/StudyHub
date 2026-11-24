// Placement readiness, computed only from the learner's own saved data in this browser:
// lesson completion, mock test scores and the spaced-repetition review queue.
import { ALL_COURSES } from "@/lib/data/courses/index";
import { getStoredProgress } from "@/lib/services/learnService";
import { dueItems, getAttempts, getReviewItems } from "@/lib/learn/study";

export interface SubjectReadiness {
  course: string;
  title: string;
  lessons: number;
  completed: number;
  coverage: number;          // 0..1 share of lessons completed
  tests: number;
  bestTest: number | null;   // 0..1 best mock test score, null if no test taken
  recentTest: number | null; // 0..1 latest mock test score
  reviewTotal: number;
  reviewDue: number;
  score: number;             // 0..100
  next: string;              // one concrete next step
}

// Weights: completing lessons matters most, test scores show retention, an overdue review queue drags down.
const W_COVERAGE = 0.55, W_TEST = 0.35, W_REVIEW = 0.1;

export function subjectReadiness(now = Date.now()): SubjectReadiness[] {
  const store = getStoredProgress();
  return ALL_COURSES.map((c) => {
    const all = c.modules.flatMap((m) => m.lessons);
    const completed = all.filter((l) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed").length;
    const coverage = all.length ? completed / all.length : 0;

    const attempts = getAttempts(c.slug);
    const pct = attempts.map((a) => (a.total ? a.correct / a.total : 0));
    const bestTest = pct.length ? Math.max(...pct) : null;
    const recentTest = attempts.length ? pct[pct.length - 1] : null;

    const review = getReviewItems(c.slug);
    const due = dueItems(review, now).length;
    // A clear queue scores 1; a fully overdue queue scores 0. No queue yet is neutral (0.5),
    // but only once some studying has happened, so an untouched subject scores 0.
    const reviewHealth = review.length ? 1 - due / review.length : completed > 0 ? 0.5 : 0;

    // Without a test, retention is unknown: count it as half of coverage rather than zero or full marks.
    const testPart = recentTest ?? coverage * 0.5;
    const score = Math.round(100 * (W_COVERAGE * coverage + W_TEST * testPart + W_REVIEW * reviewHealth));

    let next: string;
    if (completed === 0) next = "Start the first lesson";
    else if (coverage < 0.5) next = `Complete more lessons (${all.length - completed} left)`;
    else if (!attempts.length) next = "Take a mock test to measure retention";
    else if (due > 0) next = `Clear ${due} due review card${due === 1 ? "" : "s"}`;
    else if ((recentTest ?? 0) < 0.7) next = "Revise weak modules, then retake the mock test";
    else if (coverage < 1) next = `Finish the remaining ${all.length - completed} lessons`;
    else next = "Keep reviewing to stay sharp";

    return {
      course: c.slug, title: c.title, lessons: all.length, completed, coverage,
      tests: attempts.length, bestTest, recentTest, reviewTotal: review.length, reviewDue: due, score, next,
    };
  });
}

export function overallReadiness(subjects: SubjectReadiness[], selected: string[]): number {
  const picked = subjects.filter((s) => selected.includes(s.course));
  if (!picked.length) return 0;
  // Weight by lesson count so a 78-lesson course counts more than a 4-lesson one.
  const lessons = picked.reduce((n, s) => n + s.lessons, 0);
  return Math.round(picked.reduce((n, s) => n + s.score * s.lessons, 0) / lessons);
}
