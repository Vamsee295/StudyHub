import { apiClient } from './client';

export interface LogLesson { subject_slug: string; subject_title: string; topic_slug: string; title: string; minutes: number }
export interface StudyLog {
  id: string; user_id: string; author_name: string; avatar_url: string | null; log_date: string;
  note: string | null; lessons: LogLesson[]; lesson_count: number; minutes: number; updated_at: string; is_mine: boolean;
}
export interface LogDraft { log_date: string; lessons: LogLesson[]; minutes: number; published: StudyLog | null }
export interface LogDay { log_date: string; logs: StudyLog[]; total: number }

// JavaScript's offset: minutes to add to local time to get UTC (India is -330). The server uses it
// to find lessons completed on the learner's own calendar day.
const tz = () => new Date().getTimezoneOffset();

/** Local calendar date as YYYY-MM-DD (not UTC). */
export function localDate(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const studyLogsApi = {
  draft: (date: string): Promise<LogDraft> => apiClient.get(`/community/logs/draft?date=${date}&tz=${tz()}`),
  publish: (date: string, note: string): Promise<StudyLog> => apiClient.put(`/community/logs/${date}?tz=${tz()}`, { note }),
  unpublish: (date: string): Promise<{ deleted: boolean }> => apiClient.delete(`/community/logs/${date}`),
  day: (date: string, offset = 0): Promise<LogDay> => apiClient.get(`/community/logs?date=${date}&limit=20&offset=${offset}`),
  dates: (): Promise<{ dates: { log_date: string; count: number }[] }> => apiClient.get('/community/logs/dates'),
};
