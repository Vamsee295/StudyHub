import { apiClient } from './client';

export const resourcesApi = {
  getResource: async (resourceId: string) => {
    return apiClient.get(`/resources/${resourceId}`);
  },
  
  getResourceUrl: async (resourceId: string) => {
    return apiClient.get(`/resources/${resourceId}/url`);
  }
};
