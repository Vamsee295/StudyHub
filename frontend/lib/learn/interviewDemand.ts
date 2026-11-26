// How much interviews actually ask each topic, from the companies' reported questions
// (computed by scripts/import-company-data.py), joined to the lessons that teach it.
import index from "@/lib/data/companyIndex.json";
import { COMPANIES, type CompanyEntry } from "@/lib/data/companyData";
import { getCourseBySlug } from "@/lib/data/courses/index";
import { categoriesFor } from "@/lib/learn/practiceLadder";

type Raw = { total: number; topics: Record<string, { q: number; by: [number, number][] }> };
const DEMAND = (index as unknown as { demand: Raw }).demand;

export interface TopicDemand {
  topic: string; // a Practice topic, or "SQL"
  share: number; // fraction of all reported questions tagged with it
  companies: number; // how many companies ask it at all
  top: CompanyEntry[]; // the companies where it's the biggest share of their questions
}

/** Every topic, most asked first. */
export function topicDemand(): TopicDemand[] {
  return Object.entries(DEMAND.topics)
    .map(([topic, d]) => ({ topic, share: d.q / DEMAND.total, companies: d.by.length, top: companiesAsking([topic]).slice(0, 3).map((x) => x.company) }))
    .sort((a, b) => b.share - a.share);
}

export const DEMAND_TOTAL = DEMAND.total;

/**
 * Companies that focus on these topics: ranked by the share of their own reported questions that use them,
 * so a company with 50 questions isn't drowned out by one with 500. Needs a few questions to count.
 */
export function companiesAsking(topics: string[]): { company: CompanyEntry; n: number; share: number }[] {
  const sum = new Map<number, number>();
  for (const t of topics) for (const [ci, n] of DEMAND.topics[t]?.by ?? []) sum.set(ci, (sum.get(ci) ?? 0) + n);
  return [...sum]
    .map(([ci, n]) => {
      const c = COMPANIES[ci];
      return { company: c, n, share: Math.min(1, n / Math.max(1, c.counts.easy + c.counts.medium + c.counts.hard)) };
    })
    .filter((x) => x.n >= 5)
    .sort((a, b) => b.share - a.share || b.n - a.n);
}

/** The topics a course module teaches that we have interview data for. */
export function moduleTopics(course: string, module?: string): string[] {
  if (course === "sql" || course === "dbms") return ["SQL"];
  const c = getCourseBySlug(course);
  const mods = c?.modules.filter((m) => !module || m.slug === module) ?? [];
  return [...new Set(mods.flatMap((m) => m.lessons.flatMap((l) => categoriesFor(course, l.slug))))];
}

/** The lesson that teaches a topic: in the DSA module named after it when there is one, else the first lesson practising it. */
export function lessonFor(topic: string): { href: string; title: string } | null {
  if (topic === "SQL") return { href: "/learn/sql", title: "SQL course" };
  const key = topic.toLowerCase().split(/\W+/)[0].replace(/s$/, ""); // "Stack & Queue" → "stack", "Arrays" → "array"
  const candidates = ["dsa", "programming-fundamentals"].flatMap((slug) =>
    (getCourseBySlug(slug)?.modules ?? [])
      .filter((m) => m.slug !== "dsa-fundamentals") // complexity lessons, not a topic's home
      .flatMap((m) => m.lessons.map((l) => ({ slug, m, l })))
      .filter(({ l }) => (categoriesFor(slug, l.slug) as string[]).includes(topic))
  );
  const best = candidates.find(({ m }) => m.slug.includes(key)) ?? candidates[0];
  return best ? { href: `/learn/${best.slug}/${best.l.slug}`, title: best.l.title } : null;
}
