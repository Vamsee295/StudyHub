import { resourceService, Resource } from "./resources";

const SAVED_KEY = "studyhub_saved_resources";
const RECENT_KEY = "studyhub_recent_resources";
const COMPLETED_KEY = "studyhub_completed_resources";

export interface RecentResourceItem {
  id: string;
  viewedAt: string;
  lastPage?: number;
  maxPage?: number;   // furthest page reached: the reading progress
  pageCount?: number; // real page count, reported by the PDF reader
}

export type RecentResource = Resource & Omit<RecentResourceItem, "id">;

export const resourceStorage = {
  // --- SAVED / BOOKMARKS ---
  getSavedIds(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[resourceStorage] Failed to read saved resources:", e);
      return [];
    }
  },

  isSaved(id: string): boolean {
    const list = this.getSavedIds();
    return list.includes(id);
  },

  toggleSave(id: string): boolean {
    const list = this.getSavedIds();
    let updated: string[];
    let isNowSaved = false;

    if (list.includes(id)) {
      updated = list.filter((item) => item !== id);
      isNowSaved = false;
    } else {
      updated = [id, ...list];
      isNowSaved = true;
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("[resourceStorage] Failed to save bookmark:", e);
      }
    }
    return isNowSaved;
  },

  getSavedResources(): Resource[] {
    const savedIds = this.getSavedIds();
    return savedIds
      .map((id) => resourceService.getById(id))
      .filter((r): r is Resource => Boolean(r));
  },

  // --- RECENTLY VIEWED ---
  getRecentItems(): RecentResourceItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[resourceStorage] Failed to read recent resources:", e);
      return [];
    }
  },

  recordView(id: string, page: number = 1, pageCount?: number): void {
    if (typeof window === "undefined") return;
    const items = this.getRecentItems();
    const prev = items.find((item) => item.id === id);
    const filtered = items.filter((item) => item.id !== id);
    const updated: RecentResourceItem[] = [
      {
        id,
        viewedAt: new Date().toISOString(),
        lastPage: page,
        maxPage: Math.max(prev?.maxPage ?? prev?.lastPage ?? 0, page),
        pageCount: pageCount ?? prev?.pageCount,
      },
      ...filtered
    ].slice(0, 20); // Keep last 20

    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("[resourceStorage] Failed to record recent view:", e);
    }
  },

  clearRecent(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(RECENT_KEY);
      } catch (e) {
        console.warn("[resourceStorage] Failed to clear recent items:", e);
      }
    }
  },

  getRecentResources(): RecentResource[] {
    const result: RecentResource[] = [];
    for (const { id, ...item } of this.getRecentItems()) {
      const resource = resourceService.getById(id);
      if (resource) result.push({ ...resource, ...item, pageCount: item.pageCount || resource.pageCount || undefined });
    }
    return result;
  },

  // --- COMPLETED ---
  getCompletedIds(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[resourceStorage] Failed to read completed resources:", e);
      return [];
    }
  },

  isCompleted(id: string): boolean {
    const list = this.getCompletedIds();
    return list.includes(id);
  },

  toggleCompleted(id: string): boolean {
    const list = this.getCompletedIds();
    let updated: string[];
    let isNowCompleted = false;

    if (list.includes(id)) {
      updated = list.filter((item) => item !== id);
      isNowCompleted = false;
    } else {
      updated = [id, ...list];
      isNowCompleted = true;
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("[resourceStorage] Failed to update completed status:", e);
      }
    }
    return isNowCompleted;
  },

  // --- SUMMARY STATS ---
  getStats(): { saved: number; recent: number; completed: number } {
    return {
      saved: this.getSavedIds().length,
      recent: this.getRecentItems().length,
      completed: this.getCompletedIds().length
    };
  }
};
