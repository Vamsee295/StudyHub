// Real "recently used tools", recorded per browser when a tool page opens.
import { TOOL_REGISTRY } from "@/lib/data/toolsData";
import { ContinueToolItem } from "@/types";
import { markChanged } from "@/lib/sync/userSync";

const KEY = "studyhub_recent_tools_v1";
type Visit = { href: string; at: number; count: number };

function read(): Visit[] {
  if (typeof window === "undefined") return [];
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function recordToolUse(href: string) {
  if (!TOOL_REGISTRY[href]) return;
  const list = read();
  const prev = list.find((v) => v.href === href);
  const next = [{ href, at: Date.now(), count: (prev?.count ?? 0) + 1 }, ...list.filter((v) => v.href !== href)].slice(0, 10);
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
  markChanged(KEY);
}

function timeAgo(at: number, now = Date.now()): string {
  const min = Math.round((now - at) / 60_000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "Yesterday" : `${d}d ago`;
}

/** The most recently opened tools, newest first, shaped for the "Continue using" section. */
export function recentToolItems(limit = 3): ContinueToolItem[] {
  return read().slice(0, limit).map((v) => {
    const t = TOOL_REGISTRY[v.href];
    return {
      id: v.href, title: t.title, description: t.badge, badge: t.badge,
      timeAgo: timeAgo(v.at), meta: `Opened ${v.count} time${v.count === 1 ? "" : "s"}`, href: v.href,
    };
  });
}
