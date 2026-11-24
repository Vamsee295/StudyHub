import { apiClient } from './client';

export type IdeaStatus = 'open' | 'planned' | 'in_progress' | 'shipped' | 'declined';
export type IdeaCategory = 'learn' | 'practice' | 'tools' | 'community' | 'other';
export type IdeaFilter = 'active' | 'all' | IdeaStatus;

export interface Idea {
  id: string;
  title: string;
  description: string | null;
  category: IdeaCategory;
  status: IdeaStatus;
  status_note: string | null;
  vote_count: number;
  author_name: string;
  created_at: string;
  has_voted: boolean;
  is_mine: boolean;
}

export interface IdeaList {
  items: Idea[];
  total: number;
  counts: Partial<Record<IdeaStatus, number>>;
  is_admin: boolean;
}

export const ideasApi = {
  list: (params: { status?: IdeaFilter; sort?: 'top' | 'new'; q?: string; limit?: number; offset?: number }): Promise<IdeaList> => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') qs.set(k, String(v)); });
    return apiClient.get(`/ideas?${qs}`);
  },
  create: (data: { title: string; description?: string; category: IdeaCategory }): Promise<Idea> => apiClient.post('/ideas', data),
  vote: (id: string): Promise<{ has_voted: boolean; vote_count: number }> => apiClient.post(`/ideas/${id}/vote`, {}),
  unvote: (id: string): Promise<{ has_voted: boolean; vote_count: number }> => apiClient.delete(`/ideas/${id}/vote`),
  setStatus: (id: string, status: IdeaStatus, status_note?: string): Promise<Idea> => apiClient.patch(`/ideas/${id}/status`, { status, status_note }),
  remove: (id: string): Promise<{ deleted: boolean }> => apiClient.delete(`/ideas/${id}`),
};
