import { apiClient } from '../api/client';
import { ALL_COURSES, getCourseBySlug, getCourseStats, getUserCourseProgress, getLesson } from '../data/courses/index';
import type { CourseLesson } from '../data/courses/types';

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
  content: unknown; // a lesson's structured content (sections, theory…) or a markdown string
  module_title: string;
  subject_title: string;
  subject_slug: string;
  status: string;
  user_progress: number;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Local progress persistence — ensures progress is never lost across reloads
// and seamlessly syncs with the backend database.
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'studyhub_learn_progress_v2';

interface StoredTopicProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  notes?: string;
  updatedAt: string;
}

export function getStoredProgress(): Record<string, StoredTopicProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredProgress(key: string, data: StoredTopicProgress) {
  if (typeof window === 'undefined') return;
  try {
    const all = getStoredProgress();
    all[key] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

/** A lesson's saved record under any key it has had (id, slug, and the ids used before the content rewrite). */
function findFor<T>(lesson: CourseLesson, lookup: (key: string) => T | undefined): T | undefined {
  for (const k of [lesson.id, lesson.slug, lesson.legacyId, lesson.legacySlug]) {
    const hit = k ? lookup(k) : undefined;
    if (hit) return hit;
  }
  return undefined;
}

interface BackendSubject { id?: string; slug?: string; completed_topics?: number; total_topics?: number; progress_percentage?: number }
interface BackendTopic { id?: string; slug?: string; status: string; progress: number }
interface BackendTopicDetail { status?: string; user_progress?: number; notes?: string }

export const learnService = {
  // -------------------------------------------------------------------------
  // READ SUBJECTS — fetches real progress from backend and combines with course catalog.
  // -------------------------------------------------------------------------
  async getSubjects(): Promise<LearningSubject[]> {
    const localStore = getStoredProgress();
    
    // Try to get backend progress for subjects
    let backendSubjects: BackendSubject[] = [];
    try {
      backendSubjects = await apiClient.get('/learn/subjects');
    } catch (e) {
      console.warn('[LearnService] Could not reach backend /learn/subjects, using local data', e);
    }

    const backendMap = new Map<string, BackendSubject>();
    if (Array.isArray(backendSubjects)) {
      for (const s of backendSubjects) {
        if (s.slug) backendMap.set(s.slug, s);
        if (s.id) backendMap.set(s.id, s);
      }
    }

    return ALL_COURSES.map(course => {
      const stats = getCourseStats(course.slug);
      const bSubject = backendMap.get(course.slug) || backendMap.get(course.id);
      
      // Calculate completed lessons by checking both backend & localStore
      const completedSlugs = new Set<string>();
      
      course.modules.forEach(mod => {
        mod.lessons.forEach(lesson => {
          const local = findFor(lesson, (k) => localStore[k]);
          if (local?.status === 'completed') {
            completedSlugs.add(lesson.slug);
          }
        });
      });

      const localProgress = getUserCourseProgress(course.slug, Array.from(completedSlugs));
      
      // Merge: backend is authoritative, but don't let completed count decrease if local has more
      const completedCount = Math.max(bSubject?.completed_topics || 0, localProgress.completedCount);
      const totalLessons = stats?.totalLessons || bSubject?.total_topics || 0;
      const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        id: course.id,
        name: course.title,
        slug: course.slug,
        description: course.description,
        icon: course.icon,
        category: course.category,
        total_topics: totalLessons,
        completed_topics: completedCount,
        progress_percentage: Math.max(bSubject?.progress_percentage || 0, progressPercentage),
        estimated_hours: stats ? Math.round(stats.totalEstimatedMinutes / 60) : 0
      };
    });
  },

  // -------------------------------------------------------------------------
  // READ SUBJECT DETAILS — combines course content with real user progress.
  // -------------------------------------------------------------------------
  async getSubjectDetails(subjectSlug: string): Promise<SubjectDetails> {
    const course = getCourseBySlug(subjectSlug);
    if (!course) throw new Error(`Course not found: ${subjectSlug}`);

    const stats = getCourseStats(course.slug);
    const localStore = getStoredProgress();

    // Fetch backend module/topic progress if available
    const topicProgressMap = new Map<string, { status: string; progress: number }>();
    try {
      const backendDetails: { modules?: { topics?: BackendTopic[] }[] } = await apiClient.get(`/learn/subjects/${encodeURIComponent(subjectSlug)}`);
      if (backendDetails && Array.isArray(backendDetails.modules)) {
        for (const m of backendDetails.modules) {
          if (Array.isArray(m.topics)) {
            for (const t of m.topics) {
              if (t.id) topicProgressMap.set(t.id, { status: t.status, progress: t.progress });
              if (t.slug) topicProgressMap.set(t.slug, { status: t.status, progress: t.progress });
            }
          }
        }
      }
    } catch (e) {
      console.warn(`[LearnService] Could not reach backend for subject ${subjectSlug}, using local cache`, e);
    }

    const completedLessonSlugs: string[] = [];

    const modules = course.modules.map(mod => ({
      id: mod.id,
      title: mod.title,
      slug: mod.slug,
      description: mod.description,
      difficulty: mod.difficulty,
      estimated_minutes: mod.estimatedMinutes,
      topics: mod.lessons.map(lesson => {
        const bProg = findFor(lesson, (k) => topicProgressMap.get(k));
        const lProg = findFor(lesson, (k) => localStore[k]);

        let status = 'not_started';
        let progress = 0;

        if (bProg?.status === 'completed' || lProg?.status === 'completed') {
          status = 'completed';
          progress = 100;
          completedLessonSlugs.push(lesson.slug);
        } else if (bProg?.status === 'in_progress' || lProg?.status === 'in_progress') {
          status = 'in_progress';
          progress = Math.max(bProg?.progress || 0, lProg?.progress || 0);
        }

        return {
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.description,
          estimated_minutes: lesson.estimatedMinutes,
          status,
          progress
        };
      })
    }));

    const progressStats = getUserCourseProgress(course.slug, completedLessonSlugs);

    return {
      id: course.id,
      name: course.title,
      slug: course.slug,
      description: course.description,
      icon: course.icon,
      category: course.category,
      total_topics: stats?.totalLessons || 0,
      completed_topics: progressStats.completedCount,
      progress_percentage: progressStats.percentage,
      estimated_hours: stats ? Math.round(stats.totalEstimatedMinutes / 60) : 0,
      modules
    };
  },

  // -------------------------------------------------------------------------
  // READ TOPIC CONTENT — resolves lesson by clean slug, legacy slug, or ID.
  // -------------------------------------------------------------------------
  async getTopicContent(subjectSlug: string, topicSlug: string): Promise<TopicContent> {
    const lesson = getLesson(subjectSlug, topicSlug);
    const course = getCourseBySlug(subjectSlug);
    if (!lesson || !course) throw new Error(`Lesson not found: ${subjectSlug}/${topicSlug}`);

    const mod = course.modules.find(m => m.lessons.some(l => l.slug === lesson.slug || l.id === lesson.id));
    const localStore = getStoredProgress();

    const lProg = findFor(lesson, (k) => localStore[k]);

    let status = lProg?.status || 'not_started';
    let user_progress = lProg?.progress || 0;
    let notes = lProg?.notes || '';

    // Query backend for this topic's latest status
    try {
      // current ids; legacy topics were pruned from the DB
      const bRes: BackendTopicDetail | null = await apiClient.get(`/learn/topics/${encodeURIComponent(lesson.id)}`);
      if (bRes) {
        if (bRes.status === 'completed') {
          status = 'completed';
          user_progress = 100;
        } else if (bRes.status === 'in_progress' && status !== 'completed') {
          status = 'in_progress';
          user_progress = Math.max(user_progress, bRes.user_progress || 0);
        }
        if (bRes.notes && !notes) {
          notes = bRes.notes;
        }
      }
    } catch {
      // Backend lookup optional; fallback to localStore
    }

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
      status,
      user_progress: status === 'completed' ? 100 : user_progress,
      notes
    };
  },

  // -------------------------------------------------------------------------
  // WRITE TOPIC PROGRESS — updates persistent local store & backend simultaneously.
  // -------------------------------------------------------------------------
  // `readPct` is how far down the lesson the learner has scrolled; it only ever goes up, and
  // a completed lesson stays at 100 whatever is read afterwards.
  async updateTopicProgress(
    topicId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    notes?: string,
    readPct?: number
  ): Promise<{ success: boolean; status: string; progress: number }> {
    let currentId: string | null = null;
    let keys = [topicId];
    for (const c of ALL_COURSES) for (const m of c.modules) for (const l of m.lessons) {
      if (l.id === topicId || l.slug === topicId || l.legacyId === topicId || l.legacySlug === topicId) {
        currentId = l.id;
        keys = [l.id, l.slug];
      }
    }

    const all = getStoredProgress();
    const prev = all[keys[0]] || all[keys[1]];
    const progress =
      status === 'completed' ? 100
      : status === 'in_progress' ? Math.max(prev?.status === 'completed' ? 0 : prev?.progress || 0, Math.min(99, Math.round(readPct ?? 0)))
      : 0;
    const progressData: StoredTopicProgress = {
      status,
      progress,
      notes: notes ?? prev?.notes, // keep saved notes when only the status changes
      updatedAt: new Date().toISOString()
    };
    for (const k of keys) setStoredProgress(k, progressData);

    const payload: { status: string; notes?: string; progress?: number } = { status };
    if (notes !== undefined) payload.notes = notes;
    if (status === 'in_progress') payload.progress = progress;

    try {
      await apiClient.post(`/learn/topics/${encodeURIComponent(currentId || topicId)}/progress`, payload);
    } catch (e) {
      console.warn('[LearnService] Backend progress sync failed, preserved in local storage', e);
    }

    return { success: true, status, progress };
  }
};

