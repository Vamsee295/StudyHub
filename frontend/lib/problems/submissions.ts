// Every Submit on a coding problem, newest first. Synced to the account (union by time + problem),
// so the heatmap, streak and solved list agree on every device.
import { markChanged } from "@/lib/sync/userSync";

export const SUBMISSIONS_KEY = "studyhub:submissions";
export const SUBMISSIONS_EVENT = "studyhub:submission";
export const MAX_SUBMISSIONS = 2000; // ~70 bytes each, well inside the sync server's 200 KB per key

export interface Submission {
  at: number; // ms
  id: string; // problem id
  v: string; // verdict: accepted, wrong_answer, compile_error, runtime_error, time_limit
  l: string; // language
  p?: number; // tests passed
  n?: number; // tests run
}

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function logSubmission(s: Omit<Submission, "at">) {
  const list = [{ at: Date.now(), ...s }, ...getSubmissions()].slice(0, MAX_SUBMISSIONS);
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  } catch {
    return; // storage full or blocked: the submission still ran, it just isn't logged
  }
  markChanged(SUBMISSIONS_KEY);
  window.dispatchEvent(new Event(SUBMISSIONS_EVENT));
}

/** Union of two devices' logs: one entry per (time, problem), newest first, capped. */
export function mergeSubmissions(a: Submission[] | null, b: Submission[] | null): Submission[] {
  const seen = new Map<string, Submission>();
  for (const s of [...(a ?? []), ...(b ?? [])]) if (s && typeof s.at === "number" && typeof s.id === "string") seen.set(`${s.at}|${s.id}`, s);
  return [...seen.values()].sort((x, y) => y.at - x.at).slice(0, MAX_SUBMISSIONS);
}

/** First accepted time per problem, from the log. */
export function acceptedAt(list = getSubmissions()): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of list) if (s.v === "accepted" && (!out[s.id] || s.at < out[s.id])) out[s.id] = s.at;
  return out;
}
