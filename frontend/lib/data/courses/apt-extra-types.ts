// One definition per lesson for the newer aptitude lessons (pseudocode, and the extra quant, reasoning and
// verbal topics). Each feeds the course page, the mock-test bank, the revision sheet and "Picture it".
import type { CourseLesson } from './types';
import type { ExtraQuestion } from '../question-bank/index';
import type { LessonVisual } from '../visuals/types';
import { withLevelUp } from './apt-level-up';

export interface FullLesson {
  slug: string;
  title: string;
  description: string;
  minutes: number;
  theory: string; // markdown notes, from scratch to exam level
  sources: { title: string; url: string }[];
  remember: string[]; // key points: shown after the notes and on the revision sheet
  quick: { question: string; options: string[]; answer: number; explanation: string };
  questions: ExtraQuestion[]; // more mock-test / review questions
  visual: LessonVisual;
}

/** The quick check with its options in a fixed order per lesson, so the right answer isn't always first. */
function shuffledQuick(slug: string, q: FullLesson['quick']): FullLesson['quick'] {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = (h >>> 16) % (i + 1); // high bits: the low bits of this generator barely vary
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
}

export function toLesson(l: FullLesson): CourseLesson {
  const quick = shuffledQuick(l.slug, l.quick);
  return {
    id: l.slug,
    slug: l.slug,
    title: l.title,
    description: l.description,
    estimatedMinutes: l.minutes,
    content: {
      theory: withLevelUp(l.slug, l.theory),
      sources: l.sources,
      sections: [
        { type: 'takeaways', title: 'Remember', items: l.remember },
        { type: 'quickCheck', title: 'Quick Check', ...quick },
      ],
    },
  };
}

/** Question bank entries, keyed by lesson slug. */
export const questionsOf = (lessons: FullLesson[]) => Object.fromEntries(lessons.map((l) => [l.slug, l.questions]));

/** "Picture it" entries, keyed "<course>/<lesson>". */
export const visualsOf = (course: string, lessons: FullLesson[]) => Object.fromEntries(lessons.map((l) => [`${course}/${l.slug}`, l.visual]));
