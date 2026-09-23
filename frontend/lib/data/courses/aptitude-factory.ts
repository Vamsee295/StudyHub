import { CourseLesson } from './types';

export function createAptitudeLesson(
  slug: string,
  title: string,
  description: string,
  definition: string,
  whyItMatters: string,
  concept: string,
  method: string,
  example: string,
  shortcut: string,
  mistakes: string[],
  placementTip: string,
  quickCheck: { question: string; options: string[]; answer: number; explanation: string }
): CourseLesson {
  return {
    id: slug,
    slug,
    title,
    description,
    estimatedMinutes: 20,
    content: {
      sections: [
        { type: 'text', title: 'Definition', content: definition },
        { type: 'text', title: 'Why it Matters', content: whyItMatters },
        { type: 'text', title: 'Core Concept', content: concept },
        { type: 'text', title: 'Standard Method', content: method },
        { type: 'text', title: 'Example', content: example },
        { type: 'text', title: 'Shortcut / Trick', content: shortcut },
        ...(mistakes.length > 0 ? [{ type: 'warning', title: 'Common Mistakes', items: mistakes }] : []),
        { type: 'takeaways', title: 'Placement Tip', items: [placementTip] },
        { type: 'quickCheck', ...quickCheck }
      ]
    }
  };
}
