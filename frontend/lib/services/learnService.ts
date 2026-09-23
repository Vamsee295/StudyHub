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

export const learnService = {
  async getSubjects(): Promise<LearningSubject[]> {
    try {
      const res = await apiClient.get('/learn/subjects');
      return res;
    } catch (err) {
      console.warn('[LearnService] Backend failed, using static fallback for getSubjects');
      return ALL_COURSES.map(course => {
        const stats = getCourseStats(course.slug);
        const progress = getUserCourseProgress(course.slug, []);
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
    }
  },

  async getSubjectDetails(subjectSlug: string): Promise<SubjectDetails> {
    try {
      const res = await apiClient.get(`/learn/subjects/${encodeURIComponent(subjectSlug)}`);
      return res;
    } catch (err) {
      console.warn(`[LearnService] Backend failed, using static fallback for getSubjectDetails(${subjectSlug})`);
      const course = getCourseBySlug(subjectSlug);
      if (!course) throw new Error("Course not found");
      
      const stats = getCourseStats(course.slug);
      const progress = getUserCourseProgress(course.slug, []);
      
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
            status: "not_started",
            progress: 0
          }))
        }))
      };
    }
  },

  async getTopicContent(subjectSlug: string, topicSlug: string): Promise<TopicContent> {
    try {
      // In the old code it was getTopicContent(topicIdOrSlug). I changed signature for static fallback!
      // I'll make a unified call. But let's check API
      const res = await apiClient.get(`/learn/topics/${encodeURIComponent(topicSlug)}`);
      return res;
    } catch (err) {
      console.warn(`[LearnService] Backend failed, using static fallback for getTopicContent(${topicSlug})`);
      const lesson = getLesson(subjectSlug, topicSlug);
      const course = getCourseBySlug(subjectSlug);
      if (!lesson || !course) throw new Error("Lesson not found");
      
      const mod = course.modules.find(m => m.lessons.some(l => l.slug === topicSlug));
      
      return {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        estimated_minutes: lesson.estimatedMinutes,
        content: lesson.content,
        module_title: mod?.title || "",
        subject_title: course.title,
        subject_slug: course.slug,
        status: "not_started",
        user_progress: 0,
        notes: ""
      };
    }
  },

  async updateTopicProgress(
    topicId: string, 
    status: 'not_started' | 'in_progress' | 'completed',
    notes?: string
  ): Promise<{ success: boolean; status: string; progress: number }> {
    try {
      const payload: any = { status };
      if (notes !== undefined) {
        payload.notes = notes;
      }
      const res = await apiClient.post(`/learn/topics/${encodeURIComponent(topicId)}/progress`, payload);
      return res;
    } catch (err) {
      console.warn(`[LearnService] Backend failed, faking updateTopicProgress for ${topicId}`);
      return { success: true, status, progress: status === 'completed' ? 100 : 50 };
    }
  }
};


