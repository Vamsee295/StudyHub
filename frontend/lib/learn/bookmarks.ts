// Lesson bookmarks, stored in the browser and synced to the account. Components listen for BOOKMARKS_EVENT.
import { markChanged } from "@/lib/sync/userSync";

export interface LessonBookmark { course: string; lesson: string; at: string }

const KEY = "studyhub_lesson_bookmarks_v1";
export const BOOKMARKS_EVENT = "studyhub:bookmarks";

export function getBookmarks(): LessonBookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function isBookmarked(course: string, lesson: string): boolean {
  return getBookmarks().some((b) => b.course === course && b.lesson === lesson);
}

/** Toggles a bookmark and returns whether the lesson is now bookmarked. */
export function toggleBookmark(course: string, lesson: string): boolean {
  const list = getBookmarks();
  const exists = list.some((b) => b.course === course && b.lesson === lesson);
  const next = exists
    ? list.filter((b) => !(b.course === course && b.lesson === lesson))
    : [{ course, lesson, at: new Date().toISOString() }, ...list];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    markChanged(KEY);
  } catch {
    // Storage full or blocked: the toggle simply doesn't persist.
  }
  window.dispatchEvent(new Event(BOOKMARKS_EVENT));
  return !exists;
}
