import { CourseLesson } from './types';

export const defaultLessonContent = {
  definition: "This is a foundational concept.",
  whyItMatters: "Understanding this is crucial for technical interviews and professional development.",
  coreConcept: "The core mechanism involves specific syntax and rules.",
  syntax: "// Example syntax\nType variable = value;",
  codeExample: "int x = 10;\nSystem.out.println(x);",
  executionExplanation: "1. Initialization.\n2. Execution.\n3. Output.",
  realWorldUse: "Used in enterprise software systems.",
  commonMistakes: "Forgetting edge cases.",
  interviewQuestions: [
    { question: "What is the time complexity?", answer: "Depends on the operation." },
    { question: "Can you optimize this?", answer: "Yes, by using better data structures." }
  ],
  quickRevision: "Always check for null and out-of-bounds conditions.",
  practicePrompt: "Try implementing this concept in your IDE."
};

export function generateLessons(moduleSlug: string, count: number): CourseLesson[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${moduleSlug}-lesson-${i + 1}`,
    slug: `${moduleSlug}-lesson-${i + 1}`,
    title: `Lesson ${i + 1} for ${moduleSlug.replace(/-/g, ' ')}`,
    description: `Detailed explanation and examples for lesson ${i + 1}.`,
    estimatedMinutes: 15,
    content: defaultLessonContent
  }));
}
