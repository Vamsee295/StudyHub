import { apiClient } from './client';

export const dashboardApi = {
  getDashboard: async () => {
    return apiClient.get('/dashboard');
  },
  toggleTaskStatus: async (taskId: number) => {
    return apiClient.patch(`/dashboard/plan/tasks/${taskId}`, {});
  }
};
