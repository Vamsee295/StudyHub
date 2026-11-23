// "Reported in interviews at" tags. Each company lists the course modules its interviews and tests
// are reported to cover, with the sources behind that claim. Official company pages are thin, so most
// detail comes from prep guides and candidate reports; the UI always shows this caveat and the sources.
// Tags are module-level on purpose: per-question company data isn't publicly verifiable.

export interface CompanySource { title: string; url: string; official?: boolean }
export interface CompanyProfile {
  id: string;                 // matches ids in lib/data/companiesData.ts where the company exists there
  name: string;
  process: string;            // one-line summary of the reported process
  areas: { course: string; modules: string[] | "*" }[];
  sources: CompanySource[];
}

const DSA_CORE = ["dsa-fundamentals", "arrays", "strings", "linked-list", "stack", "queue", "hashing", "trees", "heaps", "graphs", "recursion-and-backtracking", "dynamic-programming"];

export const COMPANY_PROFILES: CompanyProfile[] = [
  {
    id: "amazon", name: "Amazon",
    process: "Coding rounds on data structures and algorithms, Leadership Principles questions, and system design for SDE II and above.",
    areas: [{ course: "dsa", modules: "*" }, { course: "system-design", modules: "*" }],
    sources: [
      { title: "Amazon: Software development topics", url: "https://amazon.jobs/software-development-topics", official: true },
      { title: "Amazon: SDE II interview prep", url: "https://amazon.jobs/content/en/how-we-hire/sde-ii-interview-prep", official: true },
      { title: "Amazon: System design interview prep (SDE III)", url: "https://amazon.jobs/content/en/how-we-hire/sde-iii-interview-prep", official: true },
    ],
  },
  {
    id: "google", name: "Google",
    process: "Several coding interviews on data structures, algorithms and complexity; system design mainly for experienced hires.",
    areas: [{ course: "dsa", modules: "*" }, { course: "system-design", modules: "*" }],
    sources: [
      { title: "Google: Preparing for technical internship interviews (PDF)", url: "https://services.google.com/fh/files/misc/preparing_for_google_technical_internship_interviews.pdf", official: true },
      { title: "interviewing.io: Google interview process guide", url: "https://interviewing.io/guides/hiring-process/google" },
    ],
  },
  {
    id: "microsoft", name: "Microsoft",
    process: "Online assessment and coding interviews, easy to medium, with emphasis on explaining your approach.",
    areas: [{ course: "dsa", modules: ["dsa-fundamentals", "arrays", "strings", "linked-list", "hashing", "trees", "stack", "queue"] }],
    sources: [
      { title: "Microsoft Careers: Student interviewing tips", url: "https://careers.microsoft.com/v2/global/en/hiring-tips/student-interviewing", official: true },
      { title: "Microsoft: How to ace a technical interview", url: "https://news.microsoft.com/life/how-to-ace-a-technical-interview-at-microsoft/", official: true },
      { title: "IGotAnOffer: Microsoft SDE interview guide", url: "https://igotanoffer.com/blogs/tech/microsoft-software-development-engineer-interview" },
    ],
  },
  {
    id: "tcs-prime", name: "TCS",
    process: "TCS NQT: numerical, verbal and reasoning ability, then advanced aptitude and coding (arrays, strings, sorting, functions).",
    areas: [
      { course: "quantitative-aptitude", modules: "*" }, { course: "logical-reasoning", modules: "*" }, { course: "verbal-ability", modules: "*" },
      { course: "programming-fundamentals", modules: "*" }, { course: "dsa", modules: ["arrays", "strings"] },
    ],
    sources: [
      { title: "PlacementPreparation: TCS NQT syllabus and test pattern", url: "https://www.placementpreparation.io/tcs-nqt/syllabus-and-test-pattern/" },
      { title: "PrepInsta: TCS NQT syllabus", url: "https://prepinsta.com/tcs-nqt/syllabus/" },
      { title: "Testbook: TCS NQT syllabus and exam pattern", url: "https://testbook.com/tcs-nqt/syllabus-exam-pattern" },
    ],
  },
  {
    id: "infosys", name: "Infosys",
    process: "Specialist Programmer / DSE: a coding test (strings, linked lists, trees, graphs, DP), then interviews on DSA, OOP, DBMS, SQL and OS.",
    areas: [
      { course: "dsa", modules: ["arrays", "strings", "linked-list", "trees", "graphs", "dynamic-programming"] },
      { course: "dbms", modules: ["transactions", "normalization"] },
      { course: "sql", modules: ["joins", "placement-sql"] },
      { course: "oop", modules: "*" }, { course: "os", modules: "*" },
    ],
    sources: [
      { title: "Great Learning: Infosys SP and DSE interview guide", url: "https://www.mygreatlearning.com/blog/infosys-sp-dse-interview-guide-2026/" },
      { title: "Talent Battle: Infosys syllabus and exam pattern", url: "https://www.talentbattle.in/infosys/syllabus-pattern" },
      { title: "Naukri Code360: Infosys SP interview experience", url: "https://www.naukri.com/code360/interview-experiences/infosys/infosys-interview-experience-specialist-programmer-jul-2024-exp-0-2-years" },
    ],
  },
  {
    id: "cognizant", name: "Cognizant",
    process: "GenC: quantitative, logical and verbal aptitude; GenC Next/Pro add a technical round with coding and SQL.",
    areas: [
      { course: "quantitative-aptitude", modules: "*" }, { course: "logical-reasoning", modules: "*" }, { course: "verbal-ability", modules: "*" },
      { course: "sql", modules: "*" }, { course: "programming-fundamentals", modules: "*" },
    ],
    sources: [
      { title: "PlacementPreparation: Cognizant GenC syllabus and test pattern", url: "https://www.placementpreparation.io/cognizant-genc/syllabus-and-test-pattern/" },
      { title: "PrepInsta: Cognizant GenC syllabus", url: "https://prepinsta.com/cognizant-syllabus" },
    ],
  },
];

export const ASKED_IN_CAVEAT = "Based on companies' prep pages, public prep guides and candidate reports. Formats change by year, role and campus, so check your own assessment notice.";

const covers = (p: CompanyProfile, course: string, module?: string) =>
  p.areas.some((a) => a.course === course && (a.modules === "*" || (module !== undefined && a.modules.includes(module))));

/** Companies reported to cover a course module (or the whole course when module is omitted). */
export const companiesForModule = (course: string, module?: string) => COMPANY_PROFILES.filter((p) => covers(p, course, module));

// Map free-form problem topics ("Two Pointers", "HASHMAP / HASHSET", "Binary Tree") to DSA modules.
const TOPIC_RULES: [RegExp, string][] = [
  [/linked/i, "linked-list"],
  [/stack/i, "stack"],
  [/queue|deque/i, "queue"],
  [/hash/i, "hashing"],
  [/heap|priority/i, "heaps"],
  [/tree|trie|bst|segment/i, "trees"],
  [/graph|bfs|dfs|topolog|shortest|union|dijkstra/i, "graphs"],
  [/recurs|backtrack/i, "recursion-and-backtracking"],
  [/dynamic|\bdp\b/i, "dynamic-programming"],
  [/string|palindrome|anagram/i, "strings"],
  [/array|two pointer|sliding|prefix|sort|matrix|interval|binary search/i, "arrays"],
];

export function dsaModulesForTopics(topics: string[]): string[] {
  const found = new Set<string>();
  for (const t of topics) for (const [re, mod] of TOPIC_RULES) if (re.test(t)) { found.add(mod); break; }
  return [...found];
}

/** Company names reported to cover a DSA problem, from its topics. Falls back to whole-course coverage. */
export function companiesForProblem(topics: string[]): string[] {
  const mods = dsaModulesForTopics(topics);
  const list = mods.length
    ? COMPANY_PROFILES.filter((p) => mods.some((m) => covers(p, "dsa", m)))
    : COMPANY_PROFILES.filter((p) => p.areas.some((a) => a.course === "dsa" && a.modules === "*"));
  return list.map((p) => p.name);
}

export { DSA_CORE };
