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

function getStoredProgress(): Record<string, StoredTopicProgress> {
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

export const learnService = {
  // -------------------------------------------------------------------------
  // READ SUBJECTS — fetches real progress from backend and combines with course catalog.
  // -------------------------------------------------------------------------
  async getSubjects(): Promise<LearningSubject[]> {
    const localStore = getStoredProgress();
    
    // Try to get backend progress for subjects
    let backendSubjects: any[] = [];
    try {
      backendSubjects = await apiClient.get('/learn/subjects');
    } catch (e) {
      console.warn('[LearnService] Could not reach backend /learn/subjects, using local data', e);
    }

    const backendMap = new Map<string, any>();
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
          const lId = lesson.id;
          const lSlug = lesson.slug;
          const legSlug = (lesson as any).legacySlug;
          const legId = (lesson as any).legacyId;

          const local = localStore[lId] || localStore[lSlug] || (legSlug && localStore[legSlug]) || (legId && localStore[legId]);
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
      const backendDetails: any = await apiClient.get(`/learn/subjects/${encodeURIComponent(subjectSlug)}`);
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
        const lId = lesson.id;
        const lSlug = lesson.slug;
        const legSlug = (lesson as any).legacySlug;
        const legId = (lesson as any).legacyId;

        // Check backend progress first, then localStore
        const bProg = topicProgressMap.get(lId) || 
                      topicProgressMap.get(lSlug) || 
                      (legId && topicProgressMap.get(legId)) || 
                      (legSlug && topicProgressMap.get(legSlug));

        const lProg = localStore[lId] || 
                      localStore[lSlug] || 
                      (legId && localStore[legId]) || 
                      (legSlug && localStore[legSlug]);

        let status = 'not_started';
        let progress = 0;

        if (bProg?.status === 'completed' || lProg?.status === 'completed') {
          status = 'completed';
          progress = 100;
          completedLessonSlugs.push(lesson.slug);
        } else if (bProg?.status === 'in_progress' || lProg?.status === 'in_progress') {
          status = 'in_progress';
          progress = Math.max(bProg?.progress || 0, lProg?.progress || 0, 50);
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
    // Try to load MDX content first
    try {
      const mdxSource = await this.loadMdxContent(subjectSlug, topicSlug);
      if (mdxSource) {
        // Parse frontmatter from MDX content
        const parsed = this.parseMdxContent(mdxSource, subjectSlug, topicSlug);
        // Return the parsed content with MDX body
        return {
          ...parsed,
          content: mdxSource // Return raw MDX content to be serialized and rendered by MdxRenderer
        };
      }
    } catch (mdxError) {
      console.warn(`MDX load failed for ${subjectSlug}/${topicSlug}:`, mdxError);
      // Fall back to existing TypeScript content
    }

    // Existing TypeScript content loading logic...
    const lesson = getLesson(subjectSlug, topicSlug);
    const course = getCourseBySlug(subjectSlug);
    if (!lesson || !course) throw new Error(`Lesson not found: ${subjectSlug}/${topicSlug}`);

    const mod = course.modules.find(m => m.lessons.some(l => l.slug === lesson.slug || l.id === lesson.id));
    const localStore = getStoredProgress();

    const lId = lesson.id;
    const lSlug = lesson.slug;
    const legSlug = (lesson as any).legacySlug;
    const legId = (lesson as any).legacyId;

    const lProg = localStore[lId] || localStore[lSlug] || (legId && localStore[legId]) || (legSlug && localStore[legSlug]);

    let status = lProg?.status || 'not_started';
    let user_progress = lProg?.progress || 0;
    let notes = lProg?.notes || '';

    // Query backend for this topic's latest status
    try {
      const targetQuery = legId || legSlug || lId || lSlug;
      const bRes: any = await apiClient.get(`/learn/topics/${encodeURIComponent(targetQuery)}`);
      if (bRes) {
        if (bRes.status === 'completed') {
          status = 'completed';
          user_progress = 100;
        } else if (bRes.status === 'in_progress' && status !== 'completed') {
          status = 'in_progress';
          user_progress = Math.max(user_progress, bRes.user_progress || 50);
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
  // MDX CONTENT LOADING AND PARSING
  // -------------------------------------------------------------------------
  async loadMdxContent(subjectSlug: string, topicSlug: string): Promise<string | null> {
    // Only run in browser environment
    if (typeof window === 'undefined') return null;

    try {
      const contentPath = `/content/learn/${subjectSlug}/${topicSlug}/index.mdx`;
      const response = await fetch(contentPath);
      if (response.ok) {
        return await response.text();
      }
      return null;
    } catch (error) {
      console.error(`Failed to load MDX content from /content/learn/${subjectSlug}/${topicSlug}/index.mdx:`, error);
      return null;
    }
  },

  parseMdxContent(mdxContent: string, subjectSlug: string, topicSlug: string): TopicContent {
    // Parse frontmatter
    const frontmatterMatch = mdxContent.match(/^---\n([\s\S]*?)\n---/);
    let frontmatter: Record<string, any> = {};
    let contentBody = mdxContent;

    if (frontmatterMatch) {
      try {
        const frontmatterText = frontmatterMatch[1];
        // Simple YAML parsing for basic fields
        frontmatterText.split('\n').forEach(line => {
          const match = line.match(/^(\w+):\s*(.+)$/);
          if (match) {
            const key = match[1].trim();
            let value: any = match[2].trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
              value = value.substring(1, value.length - 1);
            }
            // Handle arrays
            if (value.startsWith('[') && value.endsWith(']')) {
              try {
                value = JSON.parse(value);
              } catch {
                // If not valid JSON, split by commas
                value = value.slice(1, -1).split(',').map((item: string) => item.trim());
              }
            }
            // Handle numbers
            if (!isNaN(Number(value)) && value !== '') {
              value = Number(value);
            }
            frontmatter[key] = value;
          }
        });
        // Remove frontmatter from content
        contentBody = mdxContent.replace(frontmatterMatch[0], '').trim();
      } catch (error) {
        console.warn('Failed to parse MDX frontmatter:', error);
        // Continue with empty frontmatter
      }
    }

    // Get course and lesson info for fallback
    const lesson = getLesson(subjectSlug, topicSlug);
    const course = getCourseBySlug(subjectSlug);
    const mod = course?.modules.find(m => m.lessons.some(l => l.slug === lesson?.slug || l.id === lesson?.id));

    // Get user progress from local storage
    const localStore = getStoredProgress();
    const lId = lesson?.id || '';
    const lSlug = lesson?.slug || '';
    const legSlug = (lesson as any)?.legacySlug;
    const legId = (lesson as any)?.legacyId;

    const lProg = localStore[lId] || localStore[lSlug] || (legId && localStore[legId]) || (legSlug && localStore[legSlug]);

    let status = lProg?.status || 'not_started';
    let user_progress = lProg?.progress || 0;
    let notes = lProg?.notes || '';

    // Query backend for this topic's latest status
    try {
      const targetQuery = legId || legSlug || lId || lSlug;
      // Note: In a real implementation, we would make an API call here
      // For now, we'll rely on local storage
    } catch {
      // Backend lookup optional; fallback to localStore
    }

    const estimatedDuration = typeof frontmatter.duration === 'number' 
      ? frontmatter.duration 
      : (Number(frontmatter.duration) || lesson?.estimatedMinutes || 15);

    return {
      id: frontmatter.id || (lesson?.id || `mdx-${subjectSlug}-${topicSlug}`),
      title: frontmatter.title || (lesson?.title || 'Untitled Lesson'),
      slug: frontmatter.slug || topicSlug,
      description: frontmatter.description || (lesson?.description || ''),
      estimated_minutes: estimatedDuration,
      content: contentBody, // This is the body without frontmatter
      module_title: frontmatter.module || (mod?.title || ''),
      subject_title: frontmatter.course || (course?.title || ''),
      subject_slug: frontmatter.course_slug || subjectSlug,
      status,
      user_progress: status === 'completed' ? 100 : user_progress,
      notes
    }
  },

  // -------------------------------------------------------------------------
  // WRITE TOPIC PROGRESS — updates persistent local store & backend simultaneously.
  // -------------------------------------------------------------------------
  async updateTopicProgress(
    topicId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    notes?: string
  ): Promise<{ success: boolean; status: string; progress: number }> {
    const progress = status === 'completed' ? 100 : (status === 'in_progress' ? 50 : 0);
    const progressData: StoredTopicProgress = {
      status,
      progress,
      notes,
      updatedAt: new Date().toISOString()
    };

    // 1. Immediately persist to localStorage
    setStoredProgress(topicId, progressData);

    // Also look up if there is an associated legacyId/cleanSlug for this topic
    let legacyTargetId: string | null = null;
    let cleanSlugTarget: string | null = null;

    for (const c of ALL_COURSES) {
      for (const m of c.modules) {
        for (const l of m.lessons) {
          if (l.id === topicId || l.slug === topicId || (l as any).legacyId === topicId || (l as any).legacySlug === topicId) {
            legacyTargetId = (l as any).legacyId || null;
            cleanSlugTarget = l.slug || null;
            setStoredProgress(l.id, progressData);
            setStoredProgress(l.slug, progressData);
            if (legacyTargetId) setStoredProgress(legacyTargetId, progressData);
            break;
          }
        }
      }
    }

    // 2. Sync to backend (try primary topicId, and also legacy topicId if different)
    const payload: any = { status };
    if (notes !== undefined) payload.notes = notes;

    try {
      await apiClient.post(`/learn/topics/${encodeURIComponent(legacyTargetId || topicId)}/progress`, payload);
      if (legacyTargetId && legacyTargetId !== topicId) {
        apiClient.post(`/learn/topics/${encodeURIComponent(topicId)}/progress`, payload).catch(() => {});
      }
    } catch (e) {
      console.warn('[LearnService] Backend progress sync failed, preserved in local storage', e);
    }

    return { success: true, status, progress };
  }
};

