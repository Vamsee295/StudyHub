// Filling templates, saving the learner's work, and live GitHub data for the template repos.
import type { TemplateDef } from "@/lib/data/templatesData";

// ---------- fill ----------

export type Block =
  | { kind: "h1" | "h2" | "p"; text: string }
  | { kind: "li"; text: string }
  | { kind: "gap" };

const PLACEHOLDER = /\[([a-zA-Z0-9]+)\]/g;

/** Resolve the template body against the learner's values.
 *  - a value with several lines under "- [key]" becomes one bullet per line
 *  - a line whose placeholders are all optional and empty is dropped; a heading left with nothing under it is dropped
 *  - required fields left empty show their label in brackets so the gap is obvious */
export function fillTemplate(t: TemplateDef, values: Record<string, string>): string {
  const field = (k: string) => t.fields.find((f) => f.key === k);
  const out: string[] = [];
  for (const line of t.body.split("\n")) {
    const keys = [...line.matchAll(PLACEHOLDER)].map((m) => m[1]).filter((k) => field(k));
    if (keys.length && keys.every((k) => field(k)!.optional && !values[k]?.trim())) continue;
    const bullet = line.match(/^- \[([a-zA-Z0-9]+)\]$/);
    if (bullet && field(bullet[1])) {
      const v = values[bullet[1]]?.trim();
      if (v) v.split("\n").map((x) => x.trim().replace(/^[-•]\s*/, "")).filter(Boolean).forEach((x) => out.push(`- ${x}`));
      else out.push(`- [${field(bullet[1])!.label}]`);
      continue;
    }
    out.push(
      line.replace(PLACEHOLDER, (m, k: string) => {
        const f = field(k);
        if (!f) return m;
        const v = values[k]?.trim();
        return v ? v.replace(/\n+/g, " ") : f.optional ? "" : `[${f.label}]`;
      }).replace(/\s+·\s*$/, "").replace(/^\s*·\s+/, "").trimEnd()
    );
  }
  // drop headings with nothing under them before the next heading or the end
  const kept = out.filter((l, i) => {
    if (!/^#{1,2} /.test(l)) return true;
    for (let j = i + 1; j < out.length; j++) {
      if (/^#{1,2} /.test(out[j])) return false;
      if (out[j].trim()) return true;
    }
    return false;
  });
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Turn filled text into blocks the preview renders as React elements (no HTML injection). */
export function toBlocks(text: string): Block[] {
  return text.split("\n").map((l): Block => {
    if (!l.trim()) return { kind: "gap" };
    if (l.startsWith("# ")) return { kind: "h1", text: l.slice(2) };
    if (l.startsWith("## ")) return { kind: "h2", text: l.slice(3) };
    if (l.startsWith("- ")) return { kind: "li", text: l.slice(2) };
    return { kind: "p", text: l };
  });
}

/** Split "**bold** rest" into runs for safe rendering. */
export const boldRuns = (s: string) => s.split(/\*\*(.+?)\*\*/g).map((text, i) => ({ text, bold: i % 2 === 1 }));

/** Plain text for pasting into email or a form: no markdown markers. */
export const toPlainText = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,2} /gm, "");

// ---------- saved work ----------

const SAVED_KEY = "studyhub_templates_v1";
export interface SavedTemplate {
  values: Record<string, string>;
  updatedAt: number;
}

export function getSavedTemplates(): Record<string, SavedTemplate> {
  try {
    const v = JSON.parse(localStorage.getItem(SAVED_KEY) || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

export function saveTemplate(id: string, values: Record<string, string>) {
  const all = getSavedTemplates();
  all[id] = { values, updatedAt: Date.now() };
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(all));
  } catch {
    /* storage full or blocked */
  }
}

export function deleteSavedTemplate(id: string) {
  const all = getSavedTemplates();
  delete all[id];
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

// ---------- live GitHub data ----------

export interface RepoStats {
  stars: number;
  pushedAt: string;
  archived: boolean;
  license: string | null;
  url: string;
}

const GH_CACHE = "studyhub_gh_template_repos_v1";
const DAY = 86_400_000;

/** Public repository data from the GitHub API (no token, 60 requests an hour per IP), cached for a day. */
export async function fetchRepoStats(repos: string[]): Promise<Record<string, RepoStats>> {
  try {
    const cached = JSON.parse(localStorage.getItem(GH_CACHE) || "null");
    if (cached && Date.now() - cached.at < DAY && repos.every((r) => cached.data[r])) return cached.data;
  } catch {
    /* refetch */
  }
  const entries = await Promise.all(
    repos.map(async (r): Promise<[string, RepoStats] | null> => {
      try {
        const res = await fetch(`https://api.github.com/repos/${r}`, { headers: { Accept: "application/vnd.github+json" } });
        if (!res.ok) return null;
        const d = await res.json();
        return [r, { stars: d.stargazers_count, pushedAt: d.pushed_at, archived: !!d.archived, license: d.license?.spdx_id ?? null, url: d.html_url }];
      } catch {
        return null;
      }
    })
  );
  const data = Object.fromEntries(entries.filter((e): e is [string, RepoStats] => !!e));
  if (Object.keys(data).length) {
    try {
      localStorage.setItem(GH_CACHE, JSON.stringify({ at: Date.now(), data }));
    } catch {
      /* ignore */
    }
  }
  return data;
}
