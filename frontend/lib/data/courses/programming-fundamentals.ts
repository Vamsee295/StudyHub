import { Course } from './types';
import { generateLessons } from './utils';

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
      lessons: generateLessons("programming-basics", 6)
    },
    {
      id: "pf-mod-2",
      slug: "variables-and-data-types",
      title: "Variables & Data Types",
      description: "Learn how to store and manage data using variables and primitive types.",
      difficulty: "Beginner",
      estimatedMinutes: 150,
      lessons: generateLessons("variables-and-data-types", 10)
    },
    {
      id: "pf-mod-3",
      slug: "operators",
      title: "Operators",
      description: "Master arithmetic, relational, and logical operators.",
      difficulty: "Beginner",
      estimatedMinutes: 120,
      lessons: generateLessons("operators", 8)
    },
    {
      id: "pf-mod-4",
      slug: "input-and-output",
      title: "Input & Output",
      description: "Learn how to read data from the user and format output.",
      difficulty: "Beginner",
      estimatedMinutes: 75,
      lessons: generateLessons("input-and-output", 5)
    },
    {
      id: "pf-mod-5",
      slug: "control-flow",
      title: "Control Flow",
      description: "Control program execution using conditionals and loops.",
      difficulty: "Intermediate",
      estimatedMinutes: 150,
      lessons: generateLessons("control-flow", 10)
    },
    {
      id: "pf-mod-6",
      slug: "arrays",
      title: "Arrays",
      description: "Store and manipulate collections of data using arrays.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: generateLessons("arrays", 7)
    },
    {
      id: "pf-mod-7",
      slug: "strings",
      title: "Strings",
      description: "Process and manipulate text data effectively.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: generateLessons("strings", 7)
    },
    {
      id: "pf-mod-8",
      slug: "methods",
      title: "Methods",
      description: "Organize code into reusable functions with parameters and return values.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: generateLessons("methods", 7)
    },
    {
      id: "pf-mod-9",
      slug: "memory-and-execution",
      title: "Memory & Execution",
      description: "Understand the stack, heap, and how Java executes your code.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: generateLessons("memory-and-execution", 6)
    },
    {
      id: "pf-mod-10",
      slug: "problem-solving",
      title: "Problem Solving",
      description: "Apply your knowledge to solve classic programming challenges.",
      difficulty: "Advanced",
      estimatedMinutes: 135,
      lessons: generateLessons("problem-solving", 9)
    }
  ]
};
