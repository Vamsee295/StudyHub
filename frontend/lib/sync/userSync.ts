// Syncs study data that lives in localStorage (streaks, mock tests, review queue, bookmarks,
// tool data) to the signed-in user's account, and hydrates lesson progress from the server.
//
// Merge rules per key:
// - "union": append-only data (daily question history, mock test attempts). Both devices'
//   entries are kept, so nothing is lost when two devices were used offline.
// - "lww": last write wins by change timestamp. Used where removals matter (bookmarks,
//   review queue, STAR stories, settings), because a union would bring removed items back.
//   The trade-off: if two devices edit the same key while offline, the later edit wins.
import { apiClient } from "@/lib/api/client";
import { mergeSubmissions, type Submission } from "@/lib/problems/submissions";

type Strategy = "union-daily" | "union-daily-code" | "union-tests" | "union-submissions" | "lww";
const RULES: [RegExp, Strategy][] = [
  [/^studyhub:daily$/, "union-daily"],
  [/^studyhub:daily-code$/, "union-daily-code"],
  [/^studyhub:tests:[a-z0-9-]{1,60}$/, "union-tests"],
  [/^studyhub:submissions$/, "union-submissions"],
  [/^studyhub:review:[a-z0-9-]{1,60}$/, "lww"],
  [/^studyhub_lesson_bookmarks_v1$/, "lww"],
  [/^studyhub_star_stories_v1$/, "lww"],
  [/^studyhub_readiness_subjects_v1$/, "lww"],
  [/^studyhub_recent_tools_v1$/, "lww"],
  [/^studyhub_problem_notes_v1$/, "lww"],
];
const strategyFor = (key: string) => RULES.find(([re]) => re.test(key))?.[1];

const META_KEY = "studyhub_sync_meta_v1";         // { [key]: last local change, ms }
const PROGRESS_KEY = "studyhub_learn_progress_v2";  // learnService's lesson progress cache
export const SYNCED_EVENT = "studyhub:synced";
const PUSH_DELAY_MS = 2000;

let enabled = false;                 // true only while a user is signed in
const dirty = new Set<string>();
let timer: ReturnType<typeof setTimeout> | null = null;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}
function writeRaw(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
}
const meta = () => readJSON<Record<string, number>>(META_KEY, {});
function setMeta(key: string, t: number) {
  const m = meta();
  m[key] = t;
  writeRaw(META_KEY, m);
}

/** Call after writing a synced key locally. Records the change time and schedules a push. */
export function markChanged(key: string) {
  if (typeof window === "undefined" || !strategyFor(key)) return;
  setMeta(key, Date.now());
  if (!enabled) return;           // signed out: kept locally, pushed on next sign-in
  dirty.add(key);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { void flush(); }, PUSH_DELAY_MS);
}

type Item = { key: string; value: unknown; updated_at: number };

async function push(items: Item[]): Promise<Item[]> {
  const out: Item[] = [];
  for (let i = 0; i < items.length; i += 30) {   // server accepts up to 30 per request
    const res: { items: Item[] } = await apiClient.put("/sync", { items: items.slice(i, i + 30) });
    out.push(...res.items);
  }
  return out;
}

/** Push every key changed since the last push. */
export async function flush() {
  if (!enabled || !dirty.size) return;
  const keys = [...dirty];
  dirty.clear();
  const m = meta();
  try {
    const results = await push(keys.map((key) => ({ key, value: readJSON(key, null), updated_at: m[key] ?? Date.now() })));
    adoptNewer(results);
  } catch {
    keys.forEach((k) => dirty.add(k));   // retry on the next change or pull
  }
}

// If the server kept a newer value than ours (another device won), adopt it locally.
function adoptNewer(results: Item[]) {
  const m = meta();
  let changed = false;
  for (const r of results) {
    if (r.updated_at > (m[r.key] ?? 0)) {
      writeRaw(r.key, r.value);
      setMeta(r.key, r.updated_at);
      changed = true;
    }
  }
  if (changed) notify();
}

// --- merge helpers ---------------------------------------------------------

type Attempt = { at: number };
type DailyEntry = Record<string, unknown>;

export function mergeTests(a: Attempt[] | null, b: Attempt[] | null): Attempt[] {
  const byAt = new Map<number, Attempt>();
  for (const x of [...(a ?? []), ...(b ?? [])]) if (x && typeof x.at === "number") byAt.set(x.at, x);
  return [...byAt.values()].sort((x, y) => y.at - x.at).slice(0, 20);   // same cap as saveAttempt
}

export function mergeDaily(a: Record<string, DailyEntry> | null, b: Record<string, DailyEntry> | null) {
  // One entry per date; an answered day is the same answer on any device, so either copy works.
  return { ...(b ?? {}), ...(a ?? {}) };
}

type DailyCodeEntry = { status: "solved" | "attempted"; attempts?: number; [k: string]: unknown };
/** Daily coding: per date, "solved" beats "attempted" so a solve on one device is never lost. */
export function mergeDailyCode(a: Record<string, DailyCodeEntry> | null, b: Record<string, DailyCodeEntry> | null) {
  const out: Record<string, DailyCodeEntry> = { ...(b ?? {}) };
  for (const [date, x] of Object.entries(a ?? {})) {
    const y = out[date];
    if (!y) out[date] = x;
    else {
      const base = x.status === "solved" ? x : y.status === "solved" ? y : x;
      out[date] = { ...base, status: x.status === "solved" || y.status === "solved" ? "solved" : "attempted", attempts: Math.max(x.attempts ?? 0, y.attempts ?? 0) };
    }
  }
  return out;
}

const same = (x: unknown, y: unknown) => JSON.stringify(x) === JSON.stringify(y);

// --- lesson progress -------------------------------------------------------

type ServerProgress = Record<string, { status: string; progress: number; updated_at: string | null }>;
type LocalProgress = Record<string, { status: string; progress: number; notes?: string; updatedAt: string }>;

/** Fill the lesson progress cache from the server, keeping whichever side changed last. */
export function mergeProgress(local: LocalProgress, server: ServerProgress): { merged: LocalProgress; changed: boolean } {
  const merged = { ...local };
  let changed = false;
  for (const [slug, sp] of Object.entries(server)) {
    const lp = merged[slug];
    const serverTime = sp.updated_at ? Date.parse(sp.updated_at) : 0;
    const localTime = lp?.updatedAt ? Date.parse(lp.updatedAt) : 0;
    if (!lp || serverTime > localTime) {
      merged[slug] = { ...lp, status: sp.status, progress: sp.progress, updatedAt: sp.updated_at ?? new Date(0).toISOString() };
      changed = true;
    }
  }
  return { merged, changed };
}

// --- pull ------------------------------------------------------------------

function notify() {
  window.dispatchEvent(new Event(SYNCED_EVENT));
  window.dispatchEvent(new Event("studyhub:bookmarks"));   // bookmark controls listen for this
}

let pulling: Promise<void> | null = null;

/** Pull the account's data, merge with this browser's, and push anything the server lacks. */
export function pull(): Promise<void> {
  if (!enabled) return Promise.resolve();
  pulling ??= (async () => {
    try {
      const res: { items: Item[]; learn_progress: ServerProgress } = await apiClient.get("/sync");
      const server = new Map(res.items.map((i) => [i.key, i]));
      const m = meta();
      const toPush: Item[] = [];
      let changed = false;

      // Every synced key known on either side.
      const localKeys = Object.keys(localStorage).filter((k) => strategyFor(k));
      for (const key of new Set([...localKeys, ...server.keys()])) {
        const strategy = strategyFor(key);
        if (!strategy) continue;
        const s = server.get(key);
        const local = readJSON<unknown>(key, null);
        const localTime = m[key] ?? 0;

        if (strategy === "lww") {
          if (s && s.updated_at > localTime) {
            if (!same(local, s.value)) { writeRaw(key, s.value); changed = true; }
            setMeta(key, s.updated_at);
          } else if (local !== null && (!s || localTime > s.updated_at)) {
            toPush.push({ key, value: local, updated_at: localTime || Date.now() });
          }
          continue;
        }

        const merged = strategy === "union-submissions"
          ? mergeSubmissions(local as Submission[] | null, (s?.value as Submission[] | null) ?? null)
          : strategy === "union-tests"
          ? mergeTests(local as Attempt[] | null, (s?.value as Attempt[] | null) ?? null)
          : strategy === "union-daily-code"
            ? mergeDailyCode(local as Record<string, DailyCodeEntry> | null, (s?.value as Record<string, DailyCodeEntry> | null) ?? null)
            : mergeDaily(local as Record<string, DailyEntry> | null, (s?.value as Record<string, DailyEntry> | null) ?? null);
        if (!same(merged, local)) { writeRaw(key, merged); changed = true; }
        if (!s || !same(merged, s.value)) {
          const t = Date.now();
          setMeta(key, t);
          toPush.push({ key, value: merged, updated_at: t });
        }
      }

      const progress = mergeProgress(readJSON<LocalProgress>(PROGRESS_KEY, {}), res.learn_progress ?? {});
      if (progress.changed) { writeRaw(PROGRESS_KEY, progress.merged); changed = true; }

      if (toPush.length) adoptNewer(await push(toPush));
      if (changed) notify();
    } catch {
      // Offline or signed out on the server: local data stays as it is; the next pull retries.
    } finally {
      pulling = null;
    }
  })();
  return pulling;
}

const OWNER_KEY = "studyhub_sync_owner";   // account the synced local data belongs to

/** Removes every synced key, the change log and the progress cache from this browser. */
function clearLocalStudyData() {
  for (const k of Object.keys(localStorage)) if (strategyFor(k)) localStorage.removeItem(k);
  localStorage.removeItem(META_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}

/**
 * Turn sync on for a signed-in user, or off on sign-out. If this browser's data belongs to a
 * different account (a shared computer), it is cleared rather than merged into the new
 * account; the previous account already has its copy on the server. Data created while
 * signed out has no owner and is adopted by whoever signs in next.
 */
export function setSyncEnabled(userId: string | null) {
  enabled = !!userId;
  if (!userId) {
    dirty.clear();
    if (timer) clearTimeout(timer);
    return;
  }
  try {
    const owner = localStorage.getItem(OWNER_KEY);
    if (owner && owner !== userId) clearLocalStudyData();
    localStorage.setItem(OWNER_KEY, userId);
  } catch { /* storage blocked: nothing local to protect */ }
}
