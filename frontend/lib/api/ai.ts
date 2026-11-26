import { apiClient } from './client';
import type { ResumeDoc } from '@/lib/resume';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
export interface ChatReply {
  reply: string;
  sources: { title: string; url: string }[];
}
export interface ResumeResult {
  doc: ResumeDoc;
  notes: string[];
}
export interface AiStatus {
  available: boolean;
  provider?: string;
  model?: string;
}

/** Strips nulls the backend sends for empty optional fields, so docs stay the same shape as the editor's. */
function clean(doc: ResumeDoc): ResumeDoc {
  return JSON.parse(JSON.stringify(doc, (_k, v) => (v === null ? undefined : v)));
}

export const aiApi = {
  generatePlan: async () => {
    return apiClient.post('/ai/generate-plan', {});
  },
  status: (): Promise<AiStatus> => apiClient.get('/ai/status'),
  chat: (messages: ChatMessage[], page?: string): Promise<ChatReply> => apiClient.post('/ai/chat', { messages, page }),
  resumeBuild: async (details: string, template: ResumeDoc): Promise<ResumeResult> => {
    const r: ResumeResult = await apiClient.post('/ai/resume/build', { details, template });
    return { ...r, doc: clean(r.doc) };
  },
  resumeTailor: async (doc: ResumeDoc, job: string): Promise<ResumeResult> => {
    const r: ResumeResult = await apiClient.post('/ai/resume/tailor', { doc, job });
    return { ...r, doc: clean(r.doc) };
  },
  resumeBullet: (bullet: string, context?: string, job?: string): Promise<{ options: string[] }> =>
    apiClient.post('/ai/resume/bullet', { bullet, context, job }),
};
