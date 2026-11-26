// Real company data for /companies, produced by scripts/import-company-data.py:
// interview questions reported per company (LeetCode company tags, via github.com/liquidslr/leetcode-company-wise-problems),
// facts from Wikidata/Wikipedia, and which companies have a public job board we can read live.
import index from "./companyIndex.json";

export type Segment = "Product" | "FinTech & Trading" | "Startup" | "Service & IT";
export const SEGMENTS: Segment[] = ["Product", "FinTech & Trading", "Startup", "Service & IT"];

export interface CompanyEntry {
  id: string;
  name: string;
  segment: Segment;
  careers: string;
  jobs: { type: "greenhouse" | "lever"; slug: string } | null;
  facts: {
    summary?: string;
    wikipedia?: string;
    founded?: string;
    hq?: string;
    employees?: number;
    employeesYear?: string;
    website?: string;
    logo?: string; // Wikimedia Commons file name
  };
  counts: { total: number; easy: number; medium: number; hard: number; d30: number; d90: number };
  topTopics: string[];
}

export interface CompanyQuestion {
  t: string; // title
  s: string; // LeetCode slug
  d: "E" | "M" | "H";
  f: number; // how often it's reported, 0–100
  r: 0 | 1 | 2 | 3; // most recently reported: last 30 days, 3 months, 6 months, older
  tp: string[]; // topics
}

export const COMPANY_DATA_AS_OF: string = index.asOf;
export const COMPANY_DATA_SOURCE: string = index.source;
export const COMPANIES = index.companies as CompanyEntry[];
export const companyById = (id: string) => COMPANIES.find((c) => c.id === id);
export const companyByName = (name: string) => {
  const n = name.trim().toLowerCase();
  return COMPANIES.find((c) => c.name.toLowerCase() === n || c.id === n || n.startsWith(c.name.toLowerCase()));
};

export const monogram = (name: string) =>
  name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** The company's logo from Wikimedia Commons, rendered at the given width. */
export const logoUrl = (file: string, width = 96) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export const PERIODS = ["Last 30 days", "Last 3 months", "Last 6 months", "All time"] as const;
export const DIFFICULTY = { E: "Easy", M: "Medium", H: "Hard" } as const;

const cache = new Map<string, Promise<{ asOf: string; questions: CompanyQuestion[] }>>();
/** A company's questions, most often reported first. Loaded on demand (a few kB to ~60 kB each). */
export function loadCompanyQuestions(id: string) {
  if (!cache.has(id)) {
    const p = fetch(`/data/companies/${id}.json`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
    p.catch(() => cache.delete(id)); // let a later visit retry
    cache.set(id, p);
  }
  return cache.get(id)!;
}

export interface OpenRole {
  title: string;
  location: string;
  team?: string;
  url: string;
  updated?: number; // ms
}

/** Public job-board page for a company's openings. */
export const boardUrl = (jobs: NonNullable<CompanyEntry["jobs"]>) =>
  jobs.type === "greenhouse" ? `https://job-boards.greenhouse.io/${jobs.slug}` : `https://jobs.lever.co/${jobs.slug}`;

/** Every opening on the company's public board, newest first. Both APIs allow browser requests. */
export async function fetchOpenRoles(jobs: NonNullable<CompanyEntry["jobs"]>): Promise<OpenRole[]> {
  if (jobs.type === "greenhouse") {
    const d = await fetch(`https://boards-api.greenhouse.io/v1/boards/${jobs.slug}/jobs`).then((r) => r.json());
    return (d.jobs ?? [])
      .map((j: { title: string; location?: { name?: string }; absolute_url: string; updated_at?: string; departments?: { name: string }[] }) => ({
        title: j.title.trim(),
        location: j.location?.name ?? "",
        team: j.departments?.[0]?.name,
        url: j.absolute_url,
        updated: j.updated_at ? Date.parse(j.updated_at) : undefined,
      }))
      .sort((a: OpenRole, b: OpenRole) => (b.updated ?? 0) - (a.updated ?? 0));
  }
  const d = await fetch(`https://api.lever.co/v0/postings/${jobs.slug}?mode=json`).then((r) => r.json());
  return (Array.isArray(d) ? d : [])
    .map((j: { text: string; categories?: { location?: string; team?: string }; hostedUrl: string; createdAt?: number }) => ({
      title: j.text.trim(),
      location: j.categories?.location ?? "",
      team: j.categories?.team,
      url: j.hostedUrl,
      updated: j.createdAt,
    }))
    .sort((a: OpenRole, b: OpenRole) => (b.updated ?? 0) - (a.updated ?? 0));
}

/** Roles a CS student would apply for: engineering, data, internships, graduate programmes. */
export const isTechRole = (r: OpenRole) =>
  /engineer|developer|sde|software|data|intern|graduate|fresher|analyst|backend|frontend|full.?stack|devops|sre|machine learning|ml |qa|test/i.test(`${r.title} ${r.team ?? ""}`);
