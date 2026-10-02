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

// Ensure all IDs are globally unique to prevent DB constraint errors.
// Also assign legacySlug and legacyId to maintain full compatibility with
// previous database records and URLs.
ALL_COURSES.forEach(course => {
  course.modules.forEach(mod => {
    if (!mod.id.startsWith(course.slug)) {
      mod.id = `${course.slug}-${mod.id}`;
    }
    mod.lessons.forEach((lesson, lessonIdx) => {
      if (!lesson.id.startsWith(course.slug)) {
        lesson.id = `${course.slug}-${lesson.id}`;
      }
      // Populate legacy slug and ID patterns used by database seeders
      // e.g. "programming-fundamentals-variables-and-data-types-lesson-1"
      // or "programming-fundamentals-programming-basics-lesson-1"
      lesson.legacySlug = `${course.slug}-${mod.slug}-lesson-${lessonIdx + 1}`;
      lesson.legacyId = `${course.slug}-${mod.slug}-lesson-${lessonIdx + 1}`;
    });
  });
});

export function getCourseBySlug(slug: string): Course | undefined {
  return ALL_COURSES.find(c => c.slug === slug || c.id === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string): CourseLesson | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;

  for (const module of course.modules) {
    // 1. Direct slug, legacySlug, legacyId, or id match
    const lesson = module.lessons.find(l => 
      l.slug === lessonSlug || 
      l.id === lessonSlug ||
      l.legacySlug === lessonSlug ||
      l.legacyId === lessonSlug
    );
    if (lesson) return lesson;

    // 2. Pattern match for legacy "-lesson-N"
    const match = lessonSlug.match(/-lesson-(\d+)$/i);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      // If the lessonSlug contains module slug or matches module
      if (
        (lessonSlug.includes(module.slug) || module.slug.includes(lessonSlug.replace(/-lesson-\d+$/i, ''))) &&
        idx >= 0 && 
        idx < module.lessons.length
      ) {
        return module.lessons[idx];
      }
    }
  }

  // 3. Fallback: check all modules in course for direct match across all lessons
  for (const module of course.modules) {
    const fallback = module.lessons.find(l => 
      lessonSlug.endsWith(l.slug) || 
      (l.legacySlug && lessonSlug.endsWith(l.legacySlug))
    );
    if (fallback) return fallback;
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

  const currentLesson = getLesson(courseSlug, lessonSlug);
  if (!currentLesson) return { prev: null, next: null };

  const flatLessons = course.modules.flatMap(m => m.lessons);
  const currentIndex = flatLessons.findIndex(l => l.slug === currentLesson.slug || l.id === currentLesson.id);

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

// ---------------------------------------------------------------------------
// DEV-ONLY: Validate that every lesson slug round-trips through getLesson().
// This catches slug mismatches at startup rather than at click-time.
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV === 'development') {
  let invalid = 0;
  ALL_COURSES.forEach(course => {
    course.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        const resolved = getLesson(course.slug, lesson.slug);
        if (!resolved) {
          console.error(
            `[LearnData] SLUG MISMATCH: getLesson("${course.slug}", "${lesson.slug}") returned undefined. ` +
            `URL /learn/${course.slug}/${lesson.slug} will 404.`
          );
          invalid++;
        }
      });
    });
  });
  if (invalid === 0) {
    console.info(`[LearnData] ✓ All lesson slugs validated OK (${ALL_COURSES.reduce((s, c) => s + c.modules.reduce((ms, m) => ms + m.lessons.length, 0), 0)} lessons across ${ALL_COURSES.length} courses)`);
  }
}

