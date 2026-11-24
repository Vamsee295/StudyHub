import { Course, describeLesson } from './types';
import { withTheory } from './utils';
import { oopCoreTheory } from './oop-theory-core';
import { oopPillarsTheory } from './oop-theory-pillars';
import { oopAdvancedTheory } from './oop-theory-advanced';
import { oopFundamentalsLessons } from './oop-content-fundamentals';
import { encapsulationLessons } from './oop-content-encapsulation';
import { constructorsLessons } from './oop-content-constructors';
import { inheritanceLessons } from './oop-content-inheritance';
import { polymorphismLessons } from './oop-content-polymorphism';
import { abstractionLessons } from './oop-content-abstraction';
import { advancedOopLessons } from './oop-content-advanced';
import { solidLessons } from './oop-content-solid';

const rawOopCourse: Course = {
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
      lessons: oopFundamentalsLessons.map(lesson => ({
        id: `oop-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: describeLesson(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "oop-mod-2",
      slug: "encapsulation",
      title: "Encapsulation",
      description: "Learn how to hide internal state and protect data integrity.",
      difficulty: "Beginner",
      estimatedMinutes: 60,
      lessons: encapsulationLessons.map(lesson => ({
        id: `oop-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: describeLesson(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "oop-mod-3",
      slug: "constructors",
      title: "Constructors",
      description: "Initialize objects properly with default, parameterized, and copy constructors.",
      difficulty: "Beginner",
      estimatedMinutes: 75,
      lessons: constructorsLessons.map(lesson => ({
        id: `oop-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: describeLesson(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "oop-mod-4",
      slug: "inheritance",
      title: "Inheritance",
      description: "Reuse code and establish hierarchical relationships between classes.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: inheritanceLessons.map(lesson => ({
        id: `oop-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: describeLesson(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "oop-mod-5",
      slug: "polymorphism",
      title: "Polymorphism",
      description: "Understand method overloading and overriding for dynamic behavior.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: polymorphismLessons.map(lesson => ({
        id: `oop-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: describeLesson(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "oop-mod-6",
      slug: "abstraction",
      title: "Abstraction",
      description: "Hide complex implementation details using abstract classes and interfaces.",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: abstractionLessons.map(lesson => ({
        id: `oop-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: describeLesson(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "oop-mod-7",
      slug: "advanced-oop",
      title: "Advanced OOP",
      description: "Explore inner classes, anonymous classes, and advanced Java keywords.",
      difficulty: "Advanced",
      estimatedMinutes: 120,
      lessons: advancedOopLessons.map(lesson => ({
        id: `oop-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: describeLesson(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "oop-mod-8",
      slug: "solid-and-interview",
      title: "SOLID & Interview Concepts",
      description: "Master the SOLID principles and common OOP interview design questions.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: solidLessons.map(lesson => ({
        id: `oop-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: describeLesson(lesson.content),
        estimatedMinutes: 15,
        content: lesson.content
      }))
    }
  ]
};

const oopTheory = { ...oopCoreTheory, ...oopPillarsTheory, ...oopAdvancedTheory };

export const oopCourse: Course = {
  ...rawOopCourse,
  modules: rawOopCourse.modules.map((m) => ({ ...m, lessons: withTheory(m.lessons, oopTheory) })),
};
