import { apiClient } from './client';

export interface PracticeSet {
  id: string;
  title: string;
  domain: string;
  difficulty: string;
  estimated_minutes: number;
}

export interface PracticeQuestion {
  id: string;
  set_id: string;
  title: string;
  problem_statement: string;
  difficulty: string;
  options: any[];
  correct_option: string;
  explanation: string;
}

export interface PracticeAttempt {
  id: string;
  title: string;
  score: number;
  total_questions: number;
  completed_at: string;
  duration_seconds: number;
  domain: string;
}

export const practiceApi = {
  getPracticeSets: async (): Promise<{ sets: PracticeSet[] }> => {
    return apiClient.get('/practice/sets');
  },

  getPracticeSet: async (id: string): Promise<{ set: PracticeSet; questions: PracticeQuestion[] }> => {
    return apiClient.get(`/practice/sets/${id}`);
  },

  createAttempt: async (setId: string, score: number, totalQuestions: number, durationSeconds: number): Promise<{ status: string; attempt_id: string }> => {
    return apiClient.post('/practice/attempts', {
      set_id: setId,
      score,
      total_questions: totalQuestions,
      duration_seconds: durationSeconds
    });
  },

  getLedger: async (): Promise<{ ledger: PracticeAttempt[] }> => {
    return apiClient.get('/practice/ledger');
  }
};
