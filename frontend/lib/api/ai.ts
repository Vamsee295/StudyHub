import { apiClient } from './client';

export const aiApi = {
  generatePlan: async () => {
    return apiClient.post('/ai/generate-plan', {});
  }
};
