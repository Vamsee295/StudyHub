import { apiClient } from '../api/client';
import { ALL_COURSES, getCourseBySlug, getCourseStats, getUserCourseProgress, getLesson } from '../data/courses/index';

export interface LearningSubject {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  total_topics: number;
  completed_topics: number;
  progress_percentage: number;
  estimated_hours?: number;
}

export interface LearningTopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimated_minutes: number;
  status: string;
  progress: number;
}

export interface LearningModule {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  estimated_minutes: number;
  topics: LearningTopic[];
}

export interface SubjectDetails extends LearningSubject {
  modules: LearningModule[];
}

export interface TopicContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimated_minutes: number;
  content: any;
  module_title: string;
  subject_title: string;
  subject_slug: string;
  status: string;
  user_progress: number;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Session progress cache — keeps "Mark as Complete" state across in-page
// navigation for the duration of the session.
// ---------------------------------------------------------------------------
const progressCache: Record<string, { status: string; notes: string }> = {};

export const learnService = {
  // -------------------------------------------------------------------------
  // READ — always built from static course data.
  //
  // The backend Learn API currently returns placeholder data with generated
  // slugs (e.g. "variables-and-data-types-lesson-1") and wrong field types
  // (commonMistakes as a string instead of string[]) that break both routing
  // and the lesson content renderer.  All real lesson content lives in the
  // static course files under lib/data/courses/.
  // -------------------------------------------------------------------------

  async getSubjects(): Promise<LearningSubject[]> {
    return ALL_COURSES.map(course => {
      const stats = getCourseStats(course.slug);
      const completedSlugs = Object.entries(progressCache)
        .filter(([, v]) => v.status === 'completed')
        .map(([k]) => k);
      const progress = getUserCourseProgress(course.slug, completedSlugs);
      return {
        id: course.id,
        name: course.title,
        slug: course.slug,
        description: course.description,
        icon: course.icon,
        category: course.category,
        total_topics: stats?.totalLessons || 0,
        completed_topics: progress.completedCount,
        progress_percentage: progress.percentage,
        estimated_hours: stats ? Math.round(stats.totalEstimatedMinutes / 60) : 0
      };
    });
  },

  async getSubjectDetails(subjectSlug: string): Promise<SubjectDetails> {
    const course = getCourseBySlug(subjectSlug);
    if (!course) throw new Error(`Course not found: ${subjectSlug}`);

    const stats = getCourseStats(course.slug);
    const completedSlugs = Object.entries(progressCache)
      .filter(([, v]) => v.status === 'completed')
      .map(([k]) => k);
    const progress = getUserCourseProgress(course.slug, completedSlugs);

    return {
      id: course.id,
      name: course.title,
      slug: course.slug,
      description: course.description,
      icon: course.icon,
      category: course.category,
      total_topics: stats?.totalLessons || 0,
      completed_topics: progress.completedCount,
      progress_percentage: progress.percentage,
      estimated_hours: stats ? Math.round(stats.totalEstimatedMinutes / 60) : 0,
      modules: course.modules.map(mod => ({
        id: mod.id,
        title: mod.title,
        slug: mod.slug,
        description: mod.description,
        difficulty: mod.difficulty,
        estimated_minutes: mod.estimatedMinutes,
        topics: mod.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.description,
          estimated_minutes: lesson.estimatedMinutes,
          status: progressCache[lesson.slug]?.status || 'not_started',
          progress: progressCache[lesson.slug]?.status === 'completed' ? 100 : 0
        }))
      }))
    };
  },

  async getTopicContent(subjectSlug: string, topicSlug: string): Promise<TopicContent> {
    const lesson = getLesson(subjectSlug, topicSlug);
    const course = getCourseBySlug(subjectSlug);
    if (!lesson || !course) throw new Error(`Lesson not found: ${subjectSlug}/${topicSlug}`);

    const mod = course.modules.find(m => m.lessons.some(l => l.slug === topicSlug));
    const cached = progressCache[topicSlug];

    return {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      estimated_minutes: lesson.estimatedMinutes,
      content: lesson.content,
      module_title: mod?.title || '',
      subject_title: course.title,
      subject_slug: course.slug,
      status: cached?.status || 'not_started',
      user_progress: cached?.status === 'completed' ? 100 : 0,
      notes: cached?.notes || ''
    };
  },

  // -------------------------------------------------------------------------
  // WRITE — tries the backend; silently degrades to session cache on failure.
  // -------------------------------------------------------------------------

  async updateTopicProgress(
    topicId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    notes?: string
  ): Promise<{ success: boolean; status: string; progress: number }> {
    const cached = progressCache[topicId] || { status: 'not_started', notes: '' };
    progressCache[topicId] = {
      status,
      notes: notes !== undefined ? notes : cached.notes
    };

    // Best-effort backend sync.
    try {
      const payload: any = { status };
      if (notes !== undefined) payload.notes = notes;
      await apiClient.post(`/learn/topics/${encodeURIComponent(topicId)}/progress`, payload);
    } catch {
      // Silently ignored — progress is held in session cache above.
    }

    return { success: true, status, progress: status === 'completed' ? 100 : 50 };
  }
};
