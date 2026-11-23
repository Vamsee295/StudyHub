import { apiClient } from './client';

export interface PracticeSet {
  id: string;
  title: string;
  domain: string;
  difficulty: string;
  estimated_minutes: number;
}

export interface PracticeOption {
  id: string;
  text: string;
}

// As served during a session: the answer key stays on the server
export interface PracticeQuestion {
  id: string;
  set_id: string;
  title: string;
  problem_statement: string;
  difficulty: string;
  options: PracticeOption[];
}

export interface AttemptAnswer {
  choice?: string | null;
  text?: string;
  self_solved?: boolean;
}

export interface GradedAnswer extends AttemptAnswer {
  is_correct: boolean;
  graded_by: "auto" | "self";
}

export interface ReviewedQuestion extends PracticeQuestion {
  correct_option: string | null;
  explanation: string | null;
  answer: GradedAnswer | null;
}

export interface AttemptReview {
  id: string;
  set_id: string;
  title: string;
  domain: string;
  score: number;
  total_questions: number;
  duration_seconds: number;
  completed_at: string;
  questions: ReviewedQuestion[];
}

export interface PracticeAttempt {
  id: string;
  set_id: string;
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

  createAttempt: async (setId: string, answers: Record<string, AttemptAnswer>, durationSeconds: number): Promise<{ status: string; attempt_id: string; score: number; total_questions: number }> => {
    return apiClient.post('/practice/attempts', {
      set_id: setId,
      answers,
      duration_seconds: durationSeconds
    });
  },

  getAttempt: async (id: string): Promise<AttemptReview> => {
    return apiClient.get(`/practice/attempts/${id}`);
  },

  getLedger: async (): Promise<{ ledger: PracticeAttempt[] }> => {
    return apiClient.get('/practice/ledger');
  }
};
