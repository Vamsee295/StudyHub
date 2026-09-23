import { Course, CourseLesson, CourseModule } from './types';
import { programmingFundamentalsCourse } from './programming-fundamentals';
import { oopCourse } from './oop';
import { sqlCourse } from './sql';
import { dsaCourse } from './dsa';
import { dbmsCourse } from './dbms';
import { osCourse } from './os';
import { computerNetworksCourse } from './computer-networks';
import { aptitudeQuantitativeCourse } from './aptitude-quantitative';
import { aptitudeLogicalCourse } from './aptitude-logical';
import { aptitudeVerbalCourse } from './aptitude-verbal';
import { aptitudeDataCourse } from './aptitude-data';
import { aptitudePlacementCourse } from './aptitude-placement';

export const ALL_COURSES: Course[] = [
  programmingFundamentalsCourse,
  oopCourse,
  sqlCourse,
  dsaCourse,
  dbmsCourse,
  osCourse,
  computerNetworksCourse,
  aptitudeQuantitativeCourse,
  aptitudeLogicalCourse,
  aptitudeVerbalCourse,
  aptitudeDataCourse,
  aptitudePlacementCourse,
].sort((a, b) => a.displayOrder - b.displayOrder);

// Ensure all IDs and slugs are globally unique to prevent DB constraint errors
// and API routing collisions.
ALL_COURSES.forEach(course => {
  course.modules.forEach(mod => {
    if (!mod.id.startsWith(course.slug)) {
      mod.id = `${course.slug}-${mod.id}`;
      mod.slug = `${course.slug}-${mod.slug}`;
    }
    mod.lessons.forEach(lesson => {
      if (!lesson.id.startsWith(course.slug)) {
        lesson.id = `${course.slug}-${lesson.id}`;
        lesson.slug = `${course.slug}-${lesson.slug}`;
      }
    });
  });
});

export function getCourseBySlug(slug: string): Course | undefined {
  return ALL_COURSES.find(c => c.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string): CourseLesson | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;

  for (const module of course.modules) {
    const lesson = module.lessons.find(l => l.slug === lessonSlug);
    if (lesson) return lesson;
  }
  return undefined;
}

export interface CourseStats {
  totalModules: number;
  totalLessons: number;
  totalEstimatedMinutes: number;
}

export function getCourseStats(courseSlug: string): CourseStats | null {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  return course.modules.reduce((acc, mod) => {
    acc.totalModules += 1;
    acc.totalLessons += mod.lessons.length;
    acc.totalEstimatedMinutes += mod.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);
    return acc;
  }, { totalModules: 0, totalLessons: 0, totalEstimatedMinutes: 0 });
}

export function getAdjacentLessons(courseSlug: string, lessonSlug: string) {
  const course = getCourseBySlug(courseSlug);
  if (!course) return { prev: null, next: null };

  const flatLessons = course.modules.flatMap(m => m.lessons);
  const currentIndex = flatLessons.findIndex(l => l.slug === lessonSlug);

  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? flatLessons[currentIndex - 1] : null,
    next: currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null
  };
}

export function getUserCourseProgress(courseSlug: string, completedLessonSlugs: string[] = []) {
  const stats = getCourseStats(courseSlug);
  if (!stats) return { percentage: 0, completedCount: 0, total: 0 };

  const completedCount = completedLessonSlugs.length;
  const percentage = stats.totalLessons > 0 ? Math.round((completedCount / stats.totalLessons) * 100) : 0;

  return { percentage, completedCount, total: stats.totalLessons };
}
