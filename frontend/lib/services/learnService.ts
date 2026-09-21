import { apiClient } from '../api/client';

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
    const res = await apiClient.get('/learn/subjects');
    return res;
  },

  async getSubjectDetails(subjectSlug: string): Promise<SubjectDetails> {
    const res = await apiClient.get(`/learn/subjects/${encodeURIComponent(subjectSlug)}`);
    return res;
  },

  async getTopicContent(topicIdOrSlug: string): Promise<TopicContent> {
    const res = await apiClient.get(`/learn/topics/${encodeURIComponent(topicIdOrSlug)}`);
    return res;
  },

  async updateTopicProgress(
    topicId: string, 
    status: 'not_started' | 'in_progress' | 'completed',
    notes?: string
  ): Promise<{ success: boolean; status: string; progress: number }> {
    const payload: any = { status };
    if (notes !== undefined) {
      payload.notes = notes;
    }
    const res = await apiClient.post(`/learn/topics/${encodeURIComponent(topicId)}/progress`, payload);
    return res;
  }
};

