// A keyword and formatting check for a resume against a job role or a pasted job description.
// It estimates what keyword-based screening looks for; real applicant tracking systems differ by
// vendor and employer, so the page presents this as a guide, not a guaranteed score.
import { allBullets, resumeText, type ResumeDoc } from "@/lib/resume";

/** A keyword and the other spellings that count as the same thing. */
type Term = { name: string; alts?: string[] };
const T = (name: string, ...alts: string[]): Term => ({ name, alts });

// Dictionary used to pull skills out of a job description. Grouped only for readability.
const TERMS: Term[] = [
  // languages
  T("Java"), T("Python"), T("JavaScript", "JS", "ECMAScript"), T("TypeScript", "TS"), T("C++", "CPP"), T("C#", "C sharp"), T("C"),
  T("Go", "Golang"), T("Rust"), T("Kotlin"), T("Swift"), T("Ruby"), T("PHP"), T("Scala"), T("R"), T("SQL"), T("Bash", "Shell scripting"),
  // web and backend
  T("React", "React.js", "ReactJS"), T("Next.js", "NextJS"), T("Angular"), T("Vue", "Vue.js"), T("HTML", "HTML5"), T("CSS", "CSS3"),
  T("Tailwind", "Tailwind CSS"), T("Redux"), T("Node.js", "Node", "NodeJS"), T("Express", "Express.js"), T("Spring Boot", "Spring"),
  T("Django"), T("Flask"), T("FastAPI"), T(".NET", "ASP.NET", "dotnet"), T("REST", "REST API", "RESTful"), T("GraphQL"), T("gRPC"),
  T("Microservices", "microservice"), T("WebSockets", "WebSocket"),
  // data
  T("PostgreSQL", "Postgres"), T("MySQL"), T("MongoDB", "Mongo"), T("Redis"), T("Kafka"), T("Elasticsearch"), T("DynamoDB"),
  T("NoSQL"), T("Spark", "Apache Spark"), T("Hadoop"), T("Airflow"), T("ETL"), T("Data warehouse", "data warehousing"), T("Snowflake"),
  T("Pandas"), T("NumPy"), T("Excel"), T("Power BI"), T("Tableau"), T("Statistics", "statistical"),
  // ML
  T("Machine learning", "ML"), T("Deep learning"), T("TensorFlow"), T("PyTorch"), T("scikit-learn", "sklearn"), T("NLP", "natural language processing"),
  T("Computer vision"), T("LLM", "large language models"), T("MLOps"),
  // cloud and devops
  T("AWS", "Amazon Web Services"), T("Azure"), T("GCP", "Google Cloud"), T("Docker"), T("Kubernetes", "k8s"), T("Terraform"),
  T("CI/CD", "continuous integration", "continuous delivery"), T("Jenkins"), T("GitHub Actions"), T("Linux"), T("Git"), T("Ansible"),
  T("Prometheus"), T("Grafana"), T("Nginx"),
  // practices and fundamentals
  T("Data structures", "data structure", "DSA"), T("Algorithms", "algorithm"), T("OOP", "object-oriented", "object oriented"),
  T("System design"), T("Distributed systems"), T("Unit testing", "unit tests", "testing"), T("Agile", "Scrum"), T("Operating systems", "OS"),
  T("DBMS", "database management"), T("Computer networks", "networking"), T("Debugging"), T("Problem solving", "problem-solving"),
];

export interface RolePreset {
  id: string;
  label: string;
  keywords: string[]; // names from TERMS
}

// Keywords that commonly appear in entry-level postings for each role.
export const ROLE_PRESETS: RolePreset[] = [
  { id: "sde", label: "Software Engineer", keywords: ["Data structures", "Algorithms", "OOP", "Java", "Python", "C++", "SQL", "Git", "REST", "System design", "Unit testing", "Problem solving"] },
  { id: "frontend", label: "Frontend Developer", keywords: ["JavaScript", "TypeScript", "React", "HTML", "CSS", "Next.js", "Redux", "REST", "Git", "Unit testing", "Tailwind"] },
  { id: "backend", label: "Backend Developer", keywords: ["Java", "Python", "Node.js", "Spring Boot", "REST", "SQL", "PostgreSQL", "Redis", "Microservices", "Docker", "Git", "System design"] },
  { id: "fullstack", label: "Full Stack Developer", keywords: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "REST", "SQL", "MongoDB", "HTML", "CSS", "Git", "Docker"] },
  { id: "data-analyst", label: "Data Analyst", keywords: ["SQL", "Python", "Excel", "Pandas", "Statistics", "Power BI", "Tableau", "ETL", "Data warehouse"] },
  { id: "ml", label: "Machine Learning Engineer", keywords: ["Python", "Machine learning", "Deep learning", "PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "SQL", "MLOps"] },
  { id: "devops", label: "DevOps / Cloud Engineer", keywords: ["Linux", "AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Git", "Bash", "Python", "Prometheus"] },
];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Whole-word match that also works for C++, C#, .NET and Node.js. */
function has(text: string, word: string): boolean {
  const w = esc(word);
  return new RegExp(`(^|[^A-Za-z0-9+#.])${w}(?![A-Za-z0-9+#])`, word.length <= 2 ? "" : "i").test(text);
}
const termFor = (name: string) => TERMS.find((t) => t.name === name) ?? { name };
export const termPresent = (text: string, t: Term) => [t.name, ...(t.alts ?? [])].some((w) => has(text, w));

/** Skills mentioned in a job description, from the dictionary above. */
export function keywordsFromJD(jd: string): string[] {
  // single letters ("C", "R") and "OS"/"ML" are too ambiguous to pull from free text unless written in capitals
  return TERMS.filter((t) => termPresent(jd, t)).map((t) => t.name);
}

const VERBS = /^(built|designed|developed|implemented|created|led|improved|reduced|increased|optimi[sz]ed|automated|deployed|migrated|launched|wrote|engineered|architected|integrated|refactored|analy[sz]ed|managed|delivered|cut|scaled|tested|debugged|resolved|added|shipped|configured|trained|maintained|organi[sz]ed|coordinated|mentored|researched|presented|won|solved|ranked)\b/i;

export interface AtsCheck {
  label: string;
  ok: boolean;
  detail: string;
}
export interface AtsResult {
  score: number; // 0–100
  keywordScore: number;
  matched: string[];
  missing: string[];
  checks: AtsCheck[];
}

export function analyse(doc: ResumeDoc, keywords: string[]): AtsResult {
  const text = resumeText(doc);
  const terms = [...new Set(keywords)].map(termFor);
  const matched = terms.filter((t) => termPresent(text, t)).map((t) => t.name);
  const missing = terms.filter((t) => !termPresent(text, t)).map((t) => t.name);
  const keywordScore = terms.length ? Math.round((100 * matched.length) / terms.length) : 0;

  const bullets = allBullets(doc);
  const withNumbers = bullets.filter((b) => /\d/.test(b)).length;
  const withVerbs = bullets.filter((b) => VERBS.test(b)).length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const titles = doc.sections.map((s) => s.title.toLowerCase());
  const contactText = doc.contacts.join(" ");

  const checks: AtsCheck[] = [
    { label: "Email and phone", ok: /@/.test(contactText) && /\d{6,}/.test(contactText.replace(/[\s+()-]/g, "")), detail: "Recruiters and parsers look for both in the header." },
    { label: "LinkedIn or GitHub link", ok: /linkedin|github/i.test(contactText), detail: "A profile link lets reviewers check your work." },
    { label: "Standard section headings", ok: ["education", "skills"].every((s) => titles.some((t) => t.includes(s))) && titles.some((t) => t.includes("project") || t.includes("experience")), detail: "Education, Skills and Projects or Experience, named plainly so software can find them." },
    { label: "Bullets start with an action verb", ok: bullets.length > 0 && withVerbs / bullets.length >= 0.6, detail: `${withVerbs} of ${bullets.length} bullets start with a verb like Built, Designed or Reduced.` },
    { label: "Results with numbers", ok: bullets.length > 0 && withNumbers / bullets.length >= 0.4, detail: `${withNumbers} of ${bullets.length} bullets include a number (users, %, time).` },
    { label: "Length fits one page", ok: words >= 150 && words <= 650, detail: `About ${words} words; one page is usually 300 to 600.` },
    { label: "No first-person \"I\"", ok: !/\b(I|my|me)\b/.test(bullets.join(" ")), detail: "Resume bullets conventionally drop \"I\" and \"my\"." },
  ];
  const checkScore = (100 * checks.filter((c) => c.ok).length) / checks.length;
  const score = Math.round(keywordScore * 0.7 + checkScore * 0.3);
  return { score, keywordScore, matched, missing, checks };
}
