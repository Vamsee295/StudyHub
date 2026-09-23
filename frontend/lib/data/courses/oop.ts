import { Course } from './types';
import { generateLessons } from './utils';

export const oopCourse: Course = {
  id: "course-oop",
  slug: "oop",
  title: "Object-Oriented Programming",
  description: "Master Java OOP concepts including Encapsulation, Inheritance, Polymorphism, and Abstraction. Designed for technical placement rounds.",
  category: "Technical",
  icon: "Box",
  displayOrder: 2,
  modules: [
    {
      id: "oop-mod-1",
      slug: "oop-fundamentals",
      title: "OOP Fundamentals",
      description: "Introduction to objects, classes, and the object-oriented paradigm.",
      difficulty: "Beginner",
      estimatedMinutes: 75,
      lessons: generateLessons("oop-fundamentals", 5)
    },
    {
      id: "oop-mod-2",
      slug: "encapsulation",
      title: "Encapsulation",
      description: "Learn how to hide internal state and protect data integrity.",
      difficulty: "Beginner",
      estimatedMinutes: 60,
      lessons: generateLessons("encapsulation", 4)
    },
    {
      id: "oop-mod-3",
      slug: "constructors",
      title: "Constructors",
      description: "Initialize objects properly with default, parameterized, and copy constructors.",
      difficulty: "Beginner",
      estimatedMinutes: 75,
      lessons: generateLessons("constructors", 5)
    },
    {
      id: "oop-mod-4",
      slug: "inheritance",
      title: "Inheritance",
      description: "Reuse code and establish hierarchical relationships between classes.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: generateLessons("inheritance", 6)
    },
    {
      id: "oop-mod-5",
      slug: "polymorphism",
      title: "Polymorphism",
      description: "Understand method overloading and overriding for dynamic behavior.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: generateLessons("polymorphism", 5)
    },
    {
      id: "oop-mod-6",
      slug: "abstraction",
      title: "Abstraction",
      description: "Hide complex implementation details using abstract classes and interfaces.",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: generateLessons("abstraction", 4)
    },
    {
      id: "oop-mod-7",
      slug: "advanced-oop",
      title: "Advanced OOP",
      description: "Explore inner classes, anonymous classes, and advanced Java keywords.",
      difficulty: "Advanced",
      estimatedMinutes: 120,
      lessons: generateLessons("advanced-oop", 8)
    },
    {
      id: "oop-mod-8",
      slug: "solid-and-interview",
      title: "SOLID & Interview Concepts",
      description: "Master the SOLID principles and common OOP interview design questions.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: generateLessons("solid-and-interview", 4)
    }
  ]
};
