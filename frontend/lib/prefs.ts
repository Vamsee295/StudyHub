// Per-device display preferences (reading size, code editor). Stored in localStorage, like the theme.
import { useSyncExternalStore } from "react";

export type ReadingSize = "sm" | "md" | "lg" | "xl";
export const READING_SCALE: Record<ReadingSize, number> = { sm: 0.92, md: 1, lg: 1.12, xl: 1.25 };

export type EditorPrefs = {
  language: "java" | "python" | "cpp";
  fontSize: number;
  tabSize: 2 | 4;
  wordWrap: boolean;
  minimap: boolean;
};
export const EDITOR_DEFAULTS: EditorPrefs = { language: "java", fontSize: 13, tabSize: 4, wordWrap: false, minimap: false };

const READING_KEY = "sh-reading-size";
const EDITOR_KEY = "sh-editor";

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
  listeners.forEach((l) => l());
};

export function useReadingSize() {
  const size = useSyncExternalStore(subscribe, () => (read(READING_KEY) as ReadingSize) || "md", () => "md" as ReadingSize);
  return [READING_SCALE[size] ? size : "md", (s: ReadingSize) => write(READING_KEY, s)] as const;
}

export type StudyPrefs = {
  /** Mark a lesson complete as soon as the reader reaches its end. */
  autoComplete: boolean;
  /** Questions per review session; 0 = everything due. */
  reviewBatch: number;
  /** Notification types hidden from the bell (system notices always show). */
  mutedNotifications: string[];
};
export const STUDY_DEFAULTS: StudyPrefs = { autoComplete: false, reviewBatch: 0, mutedNotifications: [] };

const STUDY_KEY = "sh-study";

// A JSON preference object. The snapshot must be a stable value, so parse once per stored string.
function jsonPref<T extends object>(key: string, defaults: T) {
  let cachedRaw: string | null = null;
  let cached = defaults;
  const get = () => {
    const raw = read(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cached = { ...defaults, ...(raw ? JSON.parse(raw) : {}) };
      } catch {
        cached = defaults;
      }
    }
    return cached;
  };
  const set = (patch: Partial<T>) => write(key, JSON.stringify({ ...get(), ...patch }));
  const use = () => [useSyncExternalStore(subscribe, get, () => defaults), set] as const;
  return { get, set, use };
}

const editor = jsonPref(EDITOR_KEY, EDITOR_DEFAULTS);
const study = jsonPref(STUDY_KEY, STUDY_DEFAULTS);

export const useEditorPrefs = editor.use;
export const useStudyPrefs = study.use;
