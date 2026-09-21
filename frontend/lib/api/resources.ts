import { apiClient } from './client';

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category_id: string;
  subject: string;
  file_path: string;
  file_type: string;
  file_size_bytes: number;
  page_count: number;
  author: string;
  is_featured: boolean;
  created_at: string;
}

export interface UserResourceProgress {
  user_id: string;
  resource_id: string;
  last_page_read: number;
  completion_percentage: number;
  updated_at: string;
}

export interface UserSavedResource {
  user_id: string;
  resource_id: string;
  saved_at: string;
}

export interface ResourcesResponse {
  categories: ResourceCategory[];
  resources: Resource[];
}

export interface ResourceHistoryResponse {
  recent: UserResourceProgress[];
  saved: UserSavedResource[];
}

export const resourcesApi = {
  getResources: async (): Promise<ResourcesResponse> => {
    return apiClient.get('/resources');
  },

  getHistory: async (): Promise<ResourceHistoryResponse> => {
    return apiClient.get('/resources/history');
  },

  toggleSave: async (resourceId: string): Promise<{ status: 'saved' | 'unsaved' }> => {
    return apiClient.post(`/resources/${resourceId}/save`, {});
  },

  updateProgress: async (resourceId: string, lastPageRead: number, completionPercentage: number): Promise<{ status: string }> => {
    return apiClient.post(`/resources/${resourceId}/progress`, {
      last_page_read: lastPageRead,
      completion_percentage: completionPercentage
    });
  },

  getResource: async (resourceId: string): Promise<any> => {
    return apiClient.get(`/resources/${resourceId}`);
  },

  getResourceUrl: async (resourceId: string): Promise<{ url: string }> => {
    return apiClient.get(`/resources/${resourceId}/url`);
  }
};
