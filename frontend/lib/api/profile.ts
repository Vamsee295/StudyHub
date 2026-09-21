import { apiClient } from './client';

export const profileApi = {
  getProfileStatus: async () => {
    return apiClient.get('/profile/status');
  },
  
  completeOnboarding: async (data: Record<string, unknown>) => {
    return apiClient.post('/profile/onboarding/complete', data);
  },
  
  getTargetCompanies: async () => {
    return apiClient.get('/profile/target-companies');
  },

  getProfile: async () => {
    return apiClient.get('/profile');
  },

  updateProfile: async (data: Record<string, unknown>) => {
    return apiClient.put('/profile', data);
  }
};
