import { Company } from "@/types";

export const companies: Company[] = [
  {
    name: "Google",
    roleTag: "SWE / STEP",
    segment: "Product MNC",
    description:
      "Two coding rounds with graph modeling and dynamic programming, plus a culture-fit scenario round.",
    focus: [
      "Round 1: OA — hard difficulty",
      "Round 2–3: 45-min technical rounds",
      "Round 4: Behavioral & culture fit",
    ],
  },
  {
    name: "Microsoft",
    roleTag: "SDE-1",
    segment: "Product MNC",
    description:
      "Codility-style online assessment, then a mix of data structures, low-level design and a hiring-manager loop.",
    focus: [
      "Round 1: Codility OA — 3 tasks",
      "Round 2: Data structures & LLD",
      "Round 3: Hiring manager round",
    ],
  },
  {
    name: "Amazon",
    roleTag: "SDE-1",
    segment: "Product MNC",
    description:
      "A coding OA plus a work-simulation survey, followed by technical rounds anchored on leadership principles.",
    focus: [
      "Round 1: OA — coding + survey",
      "Round 2–3: DSA + object design",
      "Round 4: Bar raiser round",
    ],
  },
  {
    name: "TCS Digital / Prime",
    roleTag: "Digital & Prime",
    segment: "High-Volume IT",
    description:
      "A national qualifier test with coding and reasoning, followed by a panel technical interview.",
    focus: [
      "Round 1: NQT — cognitive & tech",
      "Round 2: Two coding challenges",
      "Round 3: Technical + HR panel",
    ],
  },
  {
    name: "Infosys",
    roleTag: "Specialist Progr.",
    segment: "High-Volume IT",
    description:
      "Online screening followed by algorithmic puzzles and a technical deep-dive for the specialist track.",
    focus: [
      "Round 1: Online screening round",
      "Round 2: Algorithmic puzzles",
      "Round 3: Technical deep-dive",
    ],
  },
  {
    name: "Accenture",
    roleTag: "Advanced ASE",
    segment: "High-Volume IT",
    description:
      "Cognitive and technical assessments, pseudocode tracing, and timed algorithmic questions.",
    focus: [
      "Round 1: Cognitive assessment",
      "Round 2: Technical & pseudocode",
      "Round 3: Coding + interview",
    ],
  },
  {
    name: "Deloitte USI",
    roleTag: "Analyst & Tech",
    segment: "FinTech & Consulting",
    description:
      "An English proficiency test, quantitative aptitude, case studies and a DBMS/SQL design interview.",
    focus: [
      "Round 1: Aptitude & English test",
      "Round 2: Technical assessment",
      "Round 3: Case study & HR",
    ],
  },
  {
    name: "Zoho Corp",
    roleTag: "Software Dev",
    segment: "Product MNC",
    description:
      "A written coding test on paper, dry-running code by hand, and an application-design round.",
    focus: [
      "Round 1: C flowcharts & pointers",
      "Round 2: Written coding test",
      "Round 3: Application design",
    ],
  },
];

export const companySegments: Company["segment"][] = [
  "Product MNC",
  "High-Volume IT",
  "FinTech & Consulting",
];

export const lastVerified = "September 2026";
