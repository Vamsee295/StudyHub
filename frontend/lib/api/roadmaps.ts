import { apiClient } from './client';

export interface RoadmapProgressData {
  slug: string;
  progressPct: number;
  status: "completed" | "in-progress" | "upcoming";
  statusText: string;
}

export interface DsaOverallStats {
  solved_ids: number[];
  attempted_ids: number[];
  total_solved: number;
  total_attempted: number;
}

export interface DsaProblemProgress {
  status: string;
  notes: string | null;
  attempts: number;
  solved_at: string | null;
  attempted_at: string | null;
}

export interface DsaProgressResponse {
  progress: Record<number, DsaProblemProgress>;
  stats: {
    total_solved: number;
    total_attempted: number;
    solved_ids: number[];
    attempted_ids: number[];
  };
}

export interface DsaUpdateResponse {
  success: boolean;
  problem_id: number;
  progress: DsaProblemProgress;
  stats: {
    total_solved: number;
    total_attempted: number;
    solved_ids: number[];
    attempted_ids: number[];
  };
}

export interface RoadmapResponse {
  roadmaps: RoadmapProgressData[];
}

export interface PfItemProgress {
  status: string;
  notes: string | null;
  attempts: number;
  solved_at: string | null;
  attempted_at: string | null;
}

export interface PfProgressResponse {
  progress: Record<string, PfItemProgress>;
  stats: {
    total_solved: number;
    total_attempted: number;
    solved_ids: string[];
    attempted_ids: string[];
  };
}

export interface PfUpdateResponse {
  success: boolean;
  item_id: string;
  progress: PfItemProgress;
  stats: {
    total_solved: number;
    total_attempted: number;
    solved_ids: string[];
    attempted_ids: string[];
  };
}

export const roadmapApi = {
  getRoadmapProgress: async (): Promise<RoadmapResponse> => {
    return apiClient.get('/roadmaps');
  },
  
  getDsaRoadmap: async (): Promise<DsaOverallStats> => {
    return apiClient.get('/roadmaps/dsa');
  },
  
  getDsaProgress: async (): Promise<DsaProgressResponse> => {
    return apiClient.get('/roadmaps/dsa/progress');
  },
  
  updateDsaProblemProgress: async (problemId: number, status?: string, notes?: string): Promise<DsaUpdateResponse> => {
    return apiClient.patch(`/roadmaps/dsa/problems/${problemId}`, { status, notes });
  },

  getProgrammingProgress: async (): Promise<PfProgressResponse> => {
    return apiClient.get('/roadmaps/programming-fundamentals/progress');
  },

  updateProgrammingItemProgress: async (itemId: string, status?: string, notes?: string): Promise<PfUpdateResponse> => {
    return apiClient.patch(`/roadmaps/programming-fundamentals/items/${itemId}`, { status, notes });
  }
};
