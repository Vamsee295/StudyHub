// What the notification bell gets told about. Each helper takes a snapshot *before* the change and
// compares after, so milestones fire exactly once, when they're crossed.
import { ALL_COURSES } from "@/lib/data/courses";
import { getStoredProgress } from "@/lib/services/learnService";
import { problemStorage } from "@/lib/problems/problemStorage";
import { problems } from "@/lib/problems/problemRegistry";
import { notificationService } from "@/lib/services/notificationService";

const PROBLEM_MARKS = [10, 25, 50, 100, 200, 300, 400, 500];

/** Highest mark that `before < mark <= after`, if any. */
export const crossed = (before: number, after: number, marks: number[]) => marks.filter((m) => before < m && m <= after).pop();

// ── lessons ──
const courseOf = (lessonId: string) => ALL_COURSES.find((c) => c.modules.some((m) => m.lessons.some((l) => l.id === lessonId || l.slug === lessonId)));

function lessonState(lessonId: string) {
  const store = getStoredProgress();
  const course = courseOf(lessonId);
  const lessons = course?.modules.flatMap((m) => m.lessons) ?? [];
  const isDone = (id: string, slug: string) => (store[id] ?? store[slug])?.status === "completed";
  const me = lessons.find((l) => l.id === lessonId || l.slug === lessonId);
  return {
    course,
    total: lessons.length,
    done: lessons.filter((l) => isDone(l.id, l.slug)).length,
    wasDone: me ? isDone(me.id, me.slug) : false,
  };
}

/** Call before marking a lesson complete; call the returned function after it's saved. */
export function trackLessonCompletion(lessonId: string, title: string, link: string) {
  const before = lessonState(lessonId);
  return () => {
    if (before.wasDone) return; // re-completing a lesson isn't news
    notificationService.notify({ type: "LESSON_COMPLETED", title: "Lesson completed", message: `You completed "${title}".`, link });
    const { course, total, done } = lessonState(lessonId);
    if (!course || !total) return;
    const href = `/learn/${course.slug}`;
    if (before.done < total && done >= total)
      notificationService.notify({ type: "COURSE_MILESTONE", title: "Course finished 🎉", message: `You finished all ${total} lessons of ${course.title}.`, link: href });
    else if (crossed(before.done, done, [Math.ceil(total / 2)]))
      notificationService.notify({ type: "COURSE_MILESTONE", title: "Halfway there", message: `${done} of ${total} lessons done in ${course.title}.`, link: href });
  };
}

// ── problems ──
const solvedCount = () => Object.values(problemStorage.getAllStatuses()).filter((s) => s === "solved").length;

/** Call before recording a submission; call the returned function with whether it was accepted. */
export function trackProblemSolve(problemId: string) {
  const wasSolved = problemStorage.getStatus(problemId) === "solved";
  const before = solvedCount();
  return (accepted: boolean) => {
    if (!accepted || wasSolved) return; // only the first accepted submission counts
    const title = problems[problemId]?.title ?? problemId;
    notificationService.notify({ type: "DSA_PROBLEM_SOLVED", title: "Problem solved", message: `Accepted: "${title}".`, link: `/practice/problems/${problemId}` });
    const after = solvedCount();
    const total = Object.keys(problems).length;
    const mark = crossed(before, after, [...PROBLEM_MARKS.filter((m) => m < total), total]);
    if (mark)
      notificationService.notify({
        type: "DSA_MILESTONE",
        title: mark === total ? "Every problem solved 🏆" : `${mark} problems solved`,
        message: mark === total ? `You've solved all ${total} problems.` : `You've now solved ${after} of ${total} problems. Keep going!`,
        link: "/practice/problems",
      });
  };
}
