// Client-side full-text search over every lesson: titles, module and course names, and theory notes.
import { ALL_COURSES } from "@/lib/data/courses/index";

export interface SearchResult {
  course: string;
  courseTitle: string;
  module: string;
  lesson: string;
  title: string;
  heading?: string;   // matching section heading inside the notes, if any
  snippet: string;
  score: number;
}

interface Doc {
  course: string; courseTitle: string; module: string; lesson: string; title: string;
  titleL: string; metaL: string; headings: string[]; headingsL: string[]; body: string; bodyL: string;
}

let index: Doc[] | null = null;

// Strip markdown syntax so snippets read as plain text.
function plain(md: string): string {
  return md
    .replace(/~~~[\s\S]*?~~~|```[\s\S]*?```/g, " ")
    .replace(/^#+\s.*$/gm, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/-{3,}/g, " ")
    .replace(/[*`>|#]/g, " ")
    .replace(/\\/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function build(): Doc[] {
  const docs: Doc[] = [];
  for (const c of ALL_COURSES) for (const m of c.modules) for (const l of m.lessons) {
    const theory = l.content.theory ?? "";
    const headings = [...theory.matchAll(/^#{2,3}\s+(.+)$/gm)].map((h) => h[1].trim());
    const body = plain(theory) || l.description || "";
    docs.push({
      course: c.slug, courseTitle: c.title, module: m.slug, lesson: l.slug, title: l.title,
      titleL: l.title.toLowerCase(), metaL: `${m.title} ${c.title} ${l.description ?? ""}`.toLowerCase(),
      headings, headingsL: headings.map((h) => h.toLowerCase()), body, bodyL: body.toLowerCase(),
    });
  }
  return docs;
}

function snippetAround(body: string, bodyL: string, term: string): string {
  const at = bodyL.indexOf(term);
  if (at < 0) return body.slice(0, 140) + (body.length > 140 ? "…" : "");
  const start = Math.max(0, at - 60);
  const end = Math.min(body.length, at + term.length + 90);
  return (start > 0 ? "…" : "") + body.slice(start, end).trim() + (end < body.length ? "…" : "");
}

/** Every query word must appear somewhere in the lesson; title matches rank highest. */
export function searchLessons(query: string, limit = 20): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  if (!index) index = build();

  const results: SearchResult[] = [];
  for (const d of index) {
    let score = 0;
    let heading: string | undefined;
    let ok = true;
    for (const t of terms) {
      let s = 0;
      if (d.titleL.includes(t)) s += d.titleL.startsWith(t) ? 14 : 10;
      const hi = d.headingsL.findIndex((h) => h.includes(t));
      if (hi >= 0) { s += 5; heading ??= d.headings[hi]; }
      if (d.metaL.includes(t)) s += 3;
      if (d.bodyL.includes(t)) s += 1 + Math.min(4, d.bodyL.split(t).length - 2); // repeated mentions add a little
      if (!s) { ok = false; break; }
      score += s;
    }
    if (!ok) continue;
    if (d.titleL.includes(query.toLowerCase().trim())) score += 8; // whole phrase in the title
    results.push({
      course: d.course, courseTitle: d.courseTitle, module: d.module, lesson: d.lesson, title: d.title,
      heading, snippet: snippetAround(d.body, d.bodyL, terms[0]), score,
    });
  }
  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
