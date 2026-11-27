// Pseudocode & Output Prediction: the "programming logic" section of campus tests, from scratch to exam level.
import { Course } from './types';
import { toLesson } from './apt-extra-types';
import { pseudocodePart1 } from './apt-pseudocode-1';
import { pseudocodePart2 } from './apt-pseudocode-2';

const [read, ops, cond, loops, nested, funcs] = pseudocodePart1.map(toLesson);
const [rec, arrays, bits, types, algos, strategy] = pseudocodePart2.map(toLesson);

export const pseudocodeLessons = [...pseudocodePart1, ...pseudocodePart2];

export const aptitudePseudocodeCourse: Course = {
  id: "course-pseudocode",
  slug: "pseudocode",
  title: "Pseudocode & Output Prediction",
  description: "Read and trace test-style pseudocode: operators, loops, functions, recursion, arrays, bitwise tricks and exam strategy.",
  category: "Aptitude",
  icon: "Code",
  displayOrder: 10.5,
  modules: [
    {
      id: "pseudo-mod-1",
      slug: "reading-pseudocode",
      title: "Reading Pseudocode",
      description: "Conventions, operators, conditions and loops, traced line by line.",
      difficulty: "Beginner",
      estimatedMinutes: 100,
      lessons: [read, ops, cond, loops],
    },
    {
      id: "pseudo-mod-2",
      slug: "core-patterns",
      title: "Core Patterns",
      description: "Nested loops, functions, recursion and arrays.",
      difficulty: "Intermediate",
      estimatedMinutes: 110,
      lessons: [nested, funcs, rec, arrays],
    },
    {
      id: "pseudo-mod-3",
      slug: "pro-level",
      title: "Pro Level",
      description: "Bitwise operations, data types, recognising algorithms and exam strategy.",
      difficulty: "Advanced",
      estimatedMinutes: 110,
      lessons: [bits, types, algos, strategy],
    },
  ],
};
