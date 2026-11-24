// Per-course progress from the lesson completion saved in this browser (learnService's progress store).
// Used by the profile pages; reads localStorage, so call it on the client only.
import { ALL_COURSES } from "@/lib/data/courses";
import { getStoredProgress } from "@/lib/services/learnService";

export type CourseProgress = {
  slug: string;
  title: string;
  category: string;
  done: number;
  total: number;
  pct: number;
  /** first lesson not yet completed, or null when the course is finished */
  next: { slug: string; title: string } | null;
};

export function courseProgress(): CourseProgress[] {
  const store = getStoredProgress();
  return ALL_COURSES.map((c) => {
    const lessons = c.modules.flatMap((m) => m.lessons);
    const isDone = (l: { id: string; slug: string }) => store[l.id]?.status === "completed" || store[l.slug]?.status === "completed";
    const done = lessons.filter(isDone).length;
    const next = lessons.find((l) => !isDone(l));
    return {
      slug: c.slug,
      title: c.title,
      category: c.category,
      done,
      total: lessons.length,
      pct: lessons.length ? Math.round((100 * done) / lessons.length) : 0,
      next: next ? { slug: next.slug, title: next.title } : null,
    };
  });
}
