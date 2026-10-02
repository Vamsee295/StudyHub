import { Course } from './types';
import { programmingBasicsLessons } from './programming-fundamentals-content-basics';
import { variablesDataTypesLessons } from './programming-fundamentals-content';
import { operatorsExpressionsLessons } from './programming-fundamentals-content-operators';
import { inputOutputLessons } from './programming-fundamentals-content-io';
import { controlFlowLessons } from './programming-fundamentals-content-control';
import { loopsPatternLessons } from './programming-fundamentals-content-loops';
import { arraysLessons } from './programming-fundamentals-content-arrays';
import { stringsLessons } from './programming-fundamentals-content-strings';
import { methodsFunctionsLessons } from './programming-fundamentals-content-methods';
import { memoryExecutionLessons } from './programming-fundamentals-content-memory';
import { recursionLessons } from './programming-fundamentals-content-recursion';

function extractLessonDescription(content: any): string {
  if (content?.definition) return content.definition;
  if (content?.sections && Array.isArray(content.sections)) {
    const textSec = content.sections.find((s: any) => s.type === 'text' && s.title !== 'Prerequisites') || content.sections[0];
    if (textSec && textSec.content) {
      const plain = textSec.content.replace(/[*_#`]/g, '').trim();
      return plain.slice(0, 160) + (plain.length > 160 ? '...' : '');
    }
  }
  return '';
}

export const programmingFundamentalsCourse: Course = {
  id: "course-pf",
  slug: "programming-fundamentals",
  title: "Programming Fundamentals",
  description: "Master the building blocks of programming. Learn syntax, variables, control flow, loops, and basic algorithmic thinking.",
  category: "Technical",
  icon: "Code2",
  displayOrder: 1,
  modules: [
    {
      id: "pf-mod-1",
      slug: "programming-basics",
      title: "Programming Basics",
      description: "Understand the foundational concepts of programming languages, compilation, and basic data storage.",
      difficulty: "Beginner",
      estimatedMinutes: 90,
      lessons: programmingBasicsLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-2",
      slug: "variables-and-data-types",
      title: "Variables & Data Types",
      description: "Learn how to store and manage data using variables and primitive types.",
      difficulty: "Beginner",
      estimatedMinutes: 150,
      lessons: variablesDataTypesLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-3",
      slug: "operators",
      title: "Operators",
      description: "Master arithmetic, relational, and logical operators.",
      difficulty: "Beginner",
      estimatedMinutes: 120,
      lessons: operatorsExpressionsLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-4",
      slug: "input-and-output",
      title: "Input & Output",
      description: "Learn how to read data from the user and format output.",
      difficulty: "Beginner",
      estimatedMinutes: 75,
      lessons: inputOutputLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-5",
      slug: "control-flow",
      title: "Control Flow",
      description: "Control program execution using conditionals and loops.",
      difficulty: "Intermediate",
      estimatedMinutes: 150,
      lessons: [...controlFlowLessons, ...loopsPatternLessons].map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-6",
      slug: "arrays",
      title: "Arrays",
      description: "Store and manipulate collections of data using arrays.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: arraysLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-7",
      slug: "strings",
      title: "Strings",
      description: "Process and manipulate text data effectively.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: stringsLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-8",
      slug: "methods",
      title: "Methods",
      description: "Organize code into reusable functions with parameters and return values.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: methodsFunctionsLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-9",
      slug: "memory-and-execution",
      title: "Memory & Execution",
      description: "Understand the stack, heap, and how Java executes your code.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: memoryExecutionLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-10",
      slug: "problem-solving",
      title: "Problem Solving",
      description: "Apply your knowledge to solve classic programming challenges.",
      difficulty: "Advanced",
      estimatedMinutes: 135,
      lessons: recursionLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: extractLessonDescription(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    }
  ]
};