// "How this page works" for every page that has no guide of its own yet (Learn, Practice, Companies, Tools,
// Dashboard and Roadmaps have richer, page-specific ones). Matched by pathname; shown under the page title,
// open on the first visit and folded after that. Workspaces (daily, SQL, code) show it from a floating button.

export interface PageGuideEntry {
  title: string; // "How the review queue works"
  plain: string; // one or two sentences for someone brand new
  diagram?: string; // Mermaid
  steps: string[];
  related: { label: string; href: string }[];
}

const SUBJECT = "[^/]+";

export const PAGE_GUIDES: { match: RegExp; guide: (m: RegExpMatchArray) => PageGuideEntry }[] = [
  {
    match: new RegExp(`^/learn/(${SUBJECT})/review$`),
    guide: (m) => ({
      title: "How the review queue works",
      plain:
        "You forget most of what you learn within days unless you see it again at the right moment. This queue brings each question back just before you would forget it: get it right and the gap grows, get it wrong and it starts again tomorrow. This is called spaced repetition.",
      diagram: `flowchart LR
  N["New question"] --> D["Due now"]
  D -->|"right"| B1["1 day"] -->|"right"| B3["3 days"] -->|"right"| B7["7 days"] -->|"right"| B14["14 days"] -->|"right"| B30["30 days"] -->|"right"| M["Mastered"]
  B1 & B3 & B7 & B14 & B30 -->|"wrong"| D`,
      steps: [
        "Clear the queue once a day: it takes five to ten minutes",
        "Answer before you look at the options' explanations",
        "Read the explanation even when you were right",
        "A question you keep missing means: reread that lesson",
      ],
      related: [
        { label: "Revision sheet", href: `/learn/${m[1]}/revise` },
        { label: "Mock test", href: `/learn/${m[1]}/test` },
      ],
    }),
  },
  {
    match: new RegExp(`^/learn/(${SUBJECT})/revise$`),
    guide: (m) => ({
      title: "How to use the revision sheet",
      plain:
        "This is the whole course squeezed onto one page: the key points of every lesson in order. It is for refreshing what you already studied, the night before an interview or test, not for learning a topic the first time.",
      diagram: `flowchart LR
  L["Study the lessons"] --> R["Skim this sheet"] --> G{"anything<br/>unclear?"}
  G -->|"yes"| O["Open that lesson again"] --> R
  G -->|"no"| T["Take the mock test"]`,
      steps: [
        "Read a section, close your eyes, and say the points out loud",
        "Anything you can't explain: open the lesson link next to it",
        "Finish with a mock test to check yourself",
      ],
      related: [
        { label: "Mock test", href: `/learn/${m[1]}/test` },
        { label: "Reading order", href: `/learn/${m[1]}/reading-order` },
      ],
    }),
  },
  {
    match: new RegExp(`^/learn/(${SUBJECT})/test$`),
    guide: (m) => ({
      title: "How mock tests work",
      plain:
        "A short, timed test drawn from this course's questions, like the multiple-choice round in a real online assessment. Your score shows what you know under time pressure, and every question you miss goes into your review queue.",
      diagram: `flowchart LR
  S["Start test"] --> A["Answer within the timer"] --> R["See your score<br/>+ every explanation"] --> Q["Missed questions<br/>join the review queue"]`,
      steps: [
        "Take it after you've finished most lessons, not before",
        "Don't look anything up: the point is to find gaps",
        "Read every explanation at the end, right and wrong",
        "Aim for 80% before calling the course done",
      ],
      related: [
        { label: "Review queue", href: `/learn/${m[1]}/review` },
        { label: "Revision sheet", href: `/learn/${m[1]}/revise` },
      ],
    }),
  },
  {
    match: new RegExp(`^/learn/(${SUBJECT})/reading-order$`),
    guide: (m) => ({
      title: "Why this order",
      plain:
        "Each lesson builds on earlier ones. This list orders the whole course so you never meet an idea before the ideas it depends on. If you are new to the subject, go top to bottom.",
      diagram: `flowchart LR
  B["Basics"] --> C["Core ideas"] --> A["Advanced topics"] --> I["Interview questions"]`,
      steps: [
        "Start at the first unticked lesson",
        "Do each lesson's practice before moving on",
        "Skip ahead only if you can already explain a lesson's topic",
      ],
      related: [
        { label: "Course page", href: `/learn/${m[1]}` },
        { label: "Concept map", href: "/learn/map" },
      ],
    }),
  },
  {
    match: /^\/learn\/saved$/,
    guide: () => ({
      title: "What saved lessons are for",
      plain: "Tap the bookmark on any lesson to keep it here: lessons to finish later, or ones worth rereading before an interview. They are kept in this browser.",
      steps: ["Save while you read, without stopping", "Come back here before an interview to reread", "Remove a lesson once you can explain it without notes"],
      related: [
        { label: "All courses", href: "/learn" },
        { label: "Concept map", href: "/learn/map" },
      ],
    }),
  },
  {
    match: /^\/learn\/map$/,
    guide: () => ({
      title: "How to read the concept map",
      plain:
        "Every module of every course, and the links between them. An arrow means 'this helps you understand that'. Use it to see why a topic matters, or what to learn first when something doesn't make sense.",
      diagram: `flowchart LR
  P["Programming basics"] --> D["Data structures"] --> A["Algorithms"]
  P --> S["SQL"] --> DB["DBMS"]
  P --> O["Operating systems"] --> N["Networks"]`,
      steps: ["Tap a module to see what it needs and what it unlocks", "Stuck on a lesson? Look at what its module depends on", "Follow the arrows to plan what to learn next"],
      related: [
        { label: "Roadmap", href: "/roadmaps" },
        { label: "All courses", href: "/learn" },
      ],
    }),
  },
  {
    match: /^\/learn\/daily$/,
    guide: () => ({
      title: "How the daily question works",
      plain:
        "One coding problem a day, the same for everyone, new at midnight. A small daily habit builds problem-solving faster than an occasional marathon, and each day you solve lights up your activity heatmap.",
      diagram: `flowchart LR
  R["Read the problem<br/>and examples"] --> P["Plan in plain words"] --> C["Write code"] --> T["Run on examples"] --> S["Submit"]
  T -.->|"fails"| P
  S --> H["Day counted on<br/>your heatmap"]`,
      steps: [
        "Read the examples first: work one out by hand",
        "Say your plan in one sentence before coding",
        "Use Run to test, then Submit for the full tests",
        "Stuck for 20 minutes? Ask the assistant for a hint, not the answer",
      ],
      related: [
        { label: "Practice by pattern", href: "/practice" },
        { label: "Your submissions", href: "/practice/submissions" },
      ],
    }),
  },
  {
    match: /^\/practice\/sql$/,
    guide: () => ({
      title: "How the SQL lab works",
      plain:
        "A real database running inside your browser, with two small tables to practise on. Write a query, run it, and see the rows come back. Nothing you do here can break anything: reload to start fresh.",
      diagram: `erDiagram
  employees {
    int id PK
    text name
    text department
    int salary
    text hire_date
  }
  departments {
    int id PK
    text name
    int budget
  }
  employees }o--|| departments : "department = name"`,
      steps: [
        "Start with SELECT * FROM employees; to see the data",
        "Add one clause at a time: WHERE, then ORDER BY, then GROUP BY",
        "Join the tables on employees.department = departments.name",
        "Stuck? The SQL course explains each clause with pictures",
      ],
      related: [
        { label: "SQL course", href: "/learn/sql" },
        { label: "DBMS course", href: "/learn/dbms" },
      ],
    }),
  },
  {
    match: /^\/practice\/code$/,
    guide: () => ({
      title: "How the code playground works",
      plain:
        "A scratchpad for trying code in several languages: no problem to solve, no grading. Use it to test a small idea, check how a function behaves, or practise syntax before a coding round.",
      diagram: `flowchart LR
  L["Pick a language"] --> W["Write code"] --> I["Add input<br/>(optional)"] --> R["Run"] --> O["Read the output<br/>or the error"]
  O -.-> W`,
      steps: ["Keep experiments small: one idea at a time", "Read error messages from the top: the first line is usually the real cause", "Move to real problems once the syntax feels easy"],
      related: [
        { label: "Practice problems", href: "/practice/problems" },
        { label: "Programming basics", href: "/learn/programming-fundamentals" },
      ],
    }),
  },
  {
    match: /^\/practice\/submissions$/,
    guide: () => ({
      title: "What each result means",
      plain: "Every time you press Submit, your code runs against hidden tests and gets one result. Each result points to a different kind of fix.",
      diagram: `flowchart LR
  S["Submit"] --> C["1 · Compiles?<br/>else Compile error"] --> R["2 · Runs without crashing?<br/>else Runtime error"] --> T["3 · Fast enough?<br/>else Time limit"] --> A["4 · Right output?<br/>else Wrong answer"] --> OK["Accepted"]`,
      steps: [
        "Open a submission to see the exact code you sent",
        "Compile error: a typo or missing bracket; read the first error line",
        "Runtime error: the code crashed, often on empty input or an index out of range",
        "Wrong answer: test empty input, one element, duplicates, negatives",
        "Time limit: count your loops; nested loops on big input are too slow",
        "Re-solve old accepted problems a week later without looking",
      ],
      related: [
        { label: "Practice by pattern", href: "/practice" },
        { label: "Big-O lab", href: "/labs/big-o" },
      ],
    }),
  },
  {
    match: /^\/resources$/,
    guide: () => ({
      title: "How to use the library",
      plain:
        "Free books, guides and cheat sheets, picked for placement prep. Read them alongside the courses when you want another explanation of a topic, or a deeper one. Your reading position is remembered.",
      steps: ["Search or filter by category", "Bookmark what you want to read later", "Mark a resource done when you finish it", "Prefer one good resource read fully over five skimmed"],
      related: [
        { label: "Courses", href: "/learn" },
        { label: "Templates", href: "/templates" },
      ],
    }),
  },
  {
    match: /^\/templates$/,
    guide: () => ({
      title: "How templates work",
      plain: "Ready-made documents for placement season: resumes, cover letters, cold emails, follow-ups. Fill in your details once, then copy or download the result.",
      diagram: `flowchart LR
  P["Pick a template"] --> F["Fill in your details"] --> V["Preview"] --> C["Copy or download"]
  F --> S["Saved in<br/>Your work"]`,
      steps: ["Start with the resume template if you have none", "Replace every example line with your own facts and numbers", "Run your resume through the Resume Analyzer afterwards"],
      related: [
        { label: "Resume Analyzer", href: "/tools/resume-analyzer" },
        { label: "Free resources", href: "/resources" },
      ],
    }),
  },
  {
    match: /^\/labs$/,
    guide: () => ({
      title: "How labs work",
      plain:
        "Small interactive simulations of ideas that are hard to picture from text: how fast algorithms grow, how a CPU schedules processes, how memory pages are swapped, how subnets split an address. Each lab explains the idea first, then lets you play with it.",
      diagram: `flowchart LR
  T["Read the short theory"] --> P["Change the inputs"] --> W["Watch what happens"] --> E["Explain why<br/>in your own words"]`,
      steps: ["Do a lab right after the matching lesson", "Predict the result before you press run", "Try the extreme cases: tiny input, huge input"],
      related: [
        { label: "Operating systems", href: "/learn/os" },
        { label: "Computer networks", href: "/learn/computer-networks" },
      ],
    }),
  },
  {
    match: /^\/help$/,
    guide: () => ({
      title: "How StudyHub fits together",
      plain: "Learn a topic, practise it, check yourself, then prepare for specific companies. Every part of the app feeds your dashboard.",
      diagram: `flowchart LR
  L["Learn<br/>lessons"] --> P["Practice<br/>problems"] --> T["Tools<br/>mock interviews"] --> C["Companies<br/>targeted prep"]
  L & P & T --> D["Dashboard<br/>progress + next steps"]
  R["Roadmap"] -.-> L`,
      steps: ["New here? Start on the Dashboard's getting-started list", "Follow the Roadmap for what to learn in what order", "Ask in Community when you're stuck"],
      related: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Community", href: "/community" },
      ],
    }),
  },
  {
    match: /^\/settings$/,
    guide: () => ({
      title: "What lives here",
      plain: "Your account, password, theme and data. Progress on lessons and practice is saved in this browser as well as your account, so export a backup before clearing browser data.",
      steps: ["Change your theme to whatever is easiest on your eyes", "Export your data before switching devices or clearing the browser", "Deleting your account cannot be undone"],
      related: [
        { label: "Profile", href: "/profile/preferences" },
        { label: "Privacy policy", href: "/privacy" },
      ],
    }),
  },
  {
    match: /^\/profile\/preferences$/,
    guide: () => ({
      title: "Why your profile matters",
      plain: "Your target role, companies and skills shape the dashboard's next steps, the roadmap and company prep. A complete profile means better suggestions.",
      diagram: `flowchart LR
  P["Your profile<br/>role, companies, skills"] --> D["Dashboard next steps"]
  P --> R["Roadmap focus"]
  P --> C["Company prep plans"]`,
      steps: ["Fill in your target role and graduation year", "Add the companies you're aiming for", "Keep your skills honest: they decide what's suggested first"],
      related: [
        { label: "Target companies", href: "/profile/target-companies" },
        { label: "Your progress", href: "/profile/progress" },
      ],
    }),
  },
  {
    match: /^\/profile\/progress$/,
    guide: () => ({
      title: "How progress is counted",
      plain: "Only from what you've actually done: lessons completed, problems solved, questions answered and tests taken. A course counts as done at 80%, so you don't need everything perfect to move on.",
      steps: ["Look for the course with the lowest bar: that's your next focus", "Clear anything due for review first", "Retake a mock test after reviewing to see the change"],
      related: [
        { label: "Learning path", href: "/profile/learning-path" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    }),
  },
  {
    match: /^\/profile\/learning-path$/,
    guide: () => ({
      title: "How your path is ordered",
      plain: "Your courses split into in progress, up next and finished. Finishing what you started beats starting something new, so the in-progress courses come first.",
      diagram: `flowchart LR
  U["Up next"] --> I["In progress"] --> F["Finished<br/>80% or more"]`,
      steps: ["Keep at most two courses in progress at once", "Pick the next course from the roadmap order", "Revisit finished courses with their review queue"],
      related: [
        { label: "Roadmap", href: "/roadmaps" },
        { label: "Your progress", href: "/profile/progress" },
      ],
    }),
  },
  {
    match: /^\/profile\/target-companies$/,
    guide: () => ({
      title: "Why track companies",
      plain: "Companies test different things. Tracking the ones you're aiming for puts their hiring rounds, frequently asked topics and prep plans on your dashboard.",
      steps: ["Track three to five companies, not twenty", "Open each one's prep plan in Companies", "Practise their most-asked topics first"],
      related: [
        { label: "Companies", href: "/companies" },
        { label: "Company Prep Sheet", href: "/tools/company-prep" },
      ],
    }),
  },
];

export function pageGuideFor(pathname: string): PageGuideEntry | null {
  for (const g of PAGE_GUIDES) {
    const m = pathname.match(g.match);
    if (m) return g.guide(m);
  }
  return null;
}
