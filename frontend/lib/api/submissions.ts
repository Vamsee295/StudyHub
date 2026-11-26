import { apiClient } from './client';

export interface SubmissionSummary {
  id: string;
  problemId: string;
  language: string;
  status: string;
  passed: number;
  total: number;
  runtimeMs: number | null;
  note: string | null;
  createdAt: string;
}

export interface SubmissionDetail extends SubmissionSummary {
  code: string;
  failedCase: { id: string; input: Record<string, unknown>; expectedOutput: unknown; actualOutput?: unknown; error?: string | null } | null;
  error: string | null;
}

/** Your graded submissions, stored by the server on every Submit (backend app/services/submissions_service.py). */
export const submissionsApi = {
  list: (opts: { problemId?: string; limit?: number; offset?: number } = {}): Promise<{ total: number; items: SubmissionSummary[] }> => {
    const q = new URLSearchParams({ limit: String(opts.limit ?? 20), offset: String(opts.offset ?? 0) });
    if (opts.problemId) q.set('problem_id', opts.problemId);
    return apiClient.get(`/execution/submissions?${q}`);
  },
  get: (id: string): Promise<SubmissionDetail> => apiClient.get(`/execution/submissions/${encodeURIComponent(id)}`),
  setNote: (id: string, note: string): Promise<{ id: string; note: string | null }> =>
    apiClient.patch(`/execution/submissions/${encodeURIComponent(id)}`, { note }),
};

export const VERDICT_LABEL: Record<string, string> = {
  accepted: 'Accepted',
  wrong_answer: 'Wrong Answer',
  compile_error: 'Compile Error',
  runtime_error: 'Runtime Error',
  time_limit: 'Time Limit Exceeded',
};
export const LANGUAGE_LABEL: Record<string, string> = { java: 'Java', python: 'Python', cpp: 'C++' };

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
