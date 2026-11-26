// The 12-stage placement roadmap shown on /roadmaps.
//
// Only content goes here. Everything that can be measured is computed on the page from real data:
// progress from the learner's lesson completions, topics and lesson counts from the Learn courses,
// quiz counts from the question bank. Nothing here claims a learner has solved or read anything.
//
// External links were checked live on 2026-11-26. Facts in the sample answers cite a source where
// one exists. Hiring-test patterns change every drive, so stages say so instead of quoting counts.

export interface RoadmapResource {
  title: string;
  href: string; // in-app path or an external https URL (opens in a new tab)
  kind: string; // "Free book", "Official docs", ...
  source: string; // who publishes it
}

export interface RoadmapStep {
  title: string;
  detail: string;
  link?: { label: string; href: string };
}

export type RoadmapPhase = "Foundations" | "Core CS" | "Get hired";

export interface PracticeLink {
  label: string;
  href: string;
}

export interface RoadmapModule {
  id: number;
  slug: string; // ?module= value
  numStr: string;
  badge: string;
  title: string;
  shortTitle: string;
  description: string;
  phase: RoadmapPhase;
  /** Why this stage matters for placements. Plain advice, no invented statistics. */
  why: string;
  /** How to work through it. */
  howTo: string[];
  /** The path for stages with no course behind them. Course stages show their real modules instead. */
  steps?: RoadmapStep[];
  /** Learn courses that count towards this stage's progress (and supply its topics). */
  courses: string[];
  /** For stages without a course behind them. Course stages use their real module titles. */
  topics?: string[];
  resources: RoadmapResource[];
  practice: PracticeLink[];
  learn: { label: string; href: string };
  interviewQuestion: {
    question: string;
    answer: string;
    source?: { label: string; href: string };
  };
}

export const roadmapModules: RoadmapModule[] = [
  {
    id: 1,
    slug: "programming-fundamentals",
    numStr: "01",
    badge: "STAGE 01 OF 12 · FOUNDATION",
    title: "Programming Fundamentals",
    shortTitle: "01 Programming Fundamentals",
    description:
      "Write and reason about small Java programs: variables and types, operators, input and output, control flow, arrays, strings and methods, plus how code runs in memory (stack, heap, recursion).",
    phase: "Foundations",
    why: "Every later stage assumes you can write and trace a small program without help. Coding rounds and online-test questions are built on loops, arrays, strings and methods.",
    howTo: ["Work through the modules in order; each one builds on the last.", "Type out and run every code example instead of only reading it.", "Answer each module's quiz before moving on. Anything you miss goes to your review queue."],
    courses: ["programming-fundamentals"],
    resources: [
      { title: "Learn Java", href: "https://dev.java/learn/", kind: "Official tutorial", source: "dev.java (Oracle)" },
      { title: "Java Tutorials: Language Basics", href: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html", kind: "Official docs", source: "Oracle" },
    ],
    practice: [
      { label: "Warm-up problems (W01–W75)", href: "/practice/problems" },
      { label: "Course mock test", href: "/learn/programming-fundamentals/test" },
    ],
    learn: { label: "Open the course", href: "/learn/programming-fundamentals" },
    interviewQuestion: {
      question: "Is Java pass-by-value or pass-by-reference? What happens when a method changes an object it was given?",
      answer:
        "Java is always pass-by-value. For a primitive, the method gets a copy of the value. For an object, it gets a copy of the reference, so both the caller and the method point at the same object: changing a field (list.add(x)) is visible to the caller, but reassigning the parameter (list = new ArrayList<>()) is not.",
      source: { label: "Oracle Java Tutorials: Passing information to a method", href: "https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html" },
    },
  },
  {
    id: 2,
    slug: "oop",
    numStr: "02",
    badge: "STAGE 02 OF 12 · DESIGN",
    title: "Object-Oriented Programming (OOP)",
    shortTitle: "02 OOP",
    description:
      "Classes and objects, the four pillars (encapsulation, inheritance, polymorphism, abstraction), constructors, interfaces versus abstract classes, and the SOLID principles interviewers ask about.",
    phase: "Foundations",
    why: "Interviews regularly ask you to explain the four pillars and compare interfaces with abstract classes, often with code. It is also how every Java project is organised.",
    howTo: ["Learn each pillar with one example you can write from memory.", "For every concept, know when you would not use it (inheritance versus composition).", "Finish with SOLID: explain each principle with a before-and-after class."],
    courses: ["oop"],
    resources: [
      { title: "Object-Oriented Programming Concepts", href: "https://docs.oracle.com/javase/tutorial/java/concepts/index.html", kind: "Official docs", source: "Oracle" },
      { title: "Design Patterns catalogue", href: "https://refactoring.guru/design-patterns", kind: "Free guide", source: "Refactoring.Guru" },
    ],
    practice: [{ label: "Course mock test", href: "/learn/oop/test" }],
    learn: { label: "Open the course", href: "/learn/oop" },
    interviewQuestion: {
      question: "How does the Dependency Inversion Principle differ from Dependency Injection?",
      answer:
        "Dependency Inversion is a design principle: high-level code should depend on abstractions (an interface such as PaymentGateway), not on concrete low-level classes (StripeClient). Dependency Injection is one technique for achieving it: the concrete object is passed in through a constructor or setter (or by a framework) instead of the class creating it with new. You can inject dependencies without inverting them (injecting a concrete class), so they are related but not the same thing.",
    },
  },
  {
    id: 3,
    slug: "sql",
    numStr: "03",
    badge: "STAGE 03 OF 12 · DATA",
    title: "SQL & Relational Databases",
    shortTitle: "03 SQL",
    description:
      "Query relational data: filtering, functions, GROUP BY, joins, subqueries and window functions, then schema design and the query patterns that show up in placement tests.",
    phase: "Foundations",
    why: "Many online assessments include SQL questions, and backend and data roles test joins, grouping and subqueries in interviews.",
    howTo: ["Run every query in the SQL Lab on the sample employees and departments tables.", "Write each query yourself before you look at the answer.", "End with the placement SQL module: second-highest salary, duplicates, top N per group."],
    courses: ["sql"],
    resources: [
      { title: "SQLBolt interactive lessons", href: "https://sqlbolt.com/", kind: "Free interactive course", source: "SQLBolt" },
      { title: "Use The Index, Luke!", href: "https://use-the-index-luke.com/", kind: "Free book", source: "Markus Winand" },
    ],
    practice: [
      { label: "SQL Lab (runs in your browser)", href: "/practice/sql" },
      { label: "Course mock test", href: "/learn/sql/test" },
    ],
    learn: { label: "Open the course", href: "/learn/sql" },
    interviewQuestion: {
      question: "You added an index on a column, but the query still scans the whole table. What are the usual reasons?",
      answer:
        "The predicate can't use the index as written: a function or expression on the column (WHERE UPPER(name) = 'A'), a LIKE with a leading wildcard ('%son'), or an implicit type conversion. Or the optimizer decided a scan is cheaper: the condition matches a large share of rows (low selectivity), the table is small, or statistics are stale. A composite index also only helps when the query filters on its leading column(s). Check with EXPLAIN.",
      source: { label: "Use The Index, Luke: functions in the WHERE clause", href: "https://use-the-index-luke.com/sql/where-clause/functions" },
    },
  },
  {
    id: 4,
    slug: "dsa",
    numStr: "04",
    badge: "STAGE 04 OF 12 · CORE",
    title: "Data Structures & Algorithms (DSA)",
    shortTitle: "04 DSA",
    description:
      "The data structures and patterns behind coding rounds: arrays, strings, linked lists, stacks, queues, hashing, trees, heaps and graphs, then recursion, backtracking and dynamic programming.",
    phase: "Foundations",
    why: "Coding rounds are mostly data-structure and algorithm problems. Recognising the pattern behind a problem matters more than memorising solutions.",
    howTo: ["Learn a data structure in the course, then solve its problems in the problem roadmap below.", "Say the time and space complexity of every solution out loud.", "Retry problems you couldn't solve a few days later, without looking at your old answer."],
    courses: ["dsa"],
    resources: [
      { title: "Algorithms for Competitive Programming", href: "https://cp-algorithms.com/", kind: "Free reference", source: "cp-algorithms.com" },
      { title: "Algorithm study cheatsheets", href: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", kind: "Free guide", source: "Tech Interview Handbook" },
      { title: "NeetCode roadmap", href: "https://neetcode.io/roadmap", kind: "Free problem list", source: "NeetCode" },
    ],
    practice: [
      { label: "Problem set (run and submit in the browser)", href: "/practice/problems" },
      { label: "DSA visualiser", href: "/tools/dsa-visualizer" },
      { label: "Big-O lab", href: "/labs/big-o" },
    ],
    learn: { label: "Open the course", href: "/learn/dsa" },
    interviewQuestion: {
      question: "When would you use BFS instead of DFS, and how do you detect a cycle with each?",
      answer:
        "BFS visits nodes level by level with a queue, so on an unweighted graph the first time it reaches a node is along a shortest path; use it for shortest paths and 'minimum steps' problems. DFS goes deep with a stack or recursion; use it for topological sort, connected components and backtracking. Cycle detection: in an undirected graph either traversal finds a cycle when it meets a visited node that isn't the current node's parent; in a directed graph, DFS finds a cycle when it reaches a node still on the recursion stack (a back edge), and Kahn's BFS-based topological sort leaves nodes unprocessed if there is one.",
      source: { label: "cp-algorithms: Breadth-first search", href: "https://cp-algorithms.com/graph/breadth-first-search.html" },
    },
  },
  {
    id: 5,
    slug: "dbms",
    numStr: "05",
    badge: "STAGE 05 OF 12 · DATABASE INTERNALS",
    title: "Database Management Systems (DBMS)",
    shortTitle: "05 DBMS",
    description:
      "How databases work underneath SQL: ER modelling, the relational model, normalization, transactions and ACID, concurrency control, recovery, B+ tree indexes, and NoSQL trade-offs.",
    phase: "Core CS",
    why: "Core-subject rounds often cover normalization, transactions and indexing, and they come up again when you explain the database in your project.",
    howTo: ["Draw ER diagrams and normalize small schemas by hand.", "Tie each concept back to SQL you have written: an index, a transaction.", "Take the mock test to find weak modules, then reread only those."],
    courses: ["dbms"],
    resources: [
      { title: "CMU 15-445/645 Database Systems", href: "https://15445.courses.cs.cmu.edu/", kind: "Free university course", source: "Carnegie Mellon University" },
      { title: "PostgreSQL: Transaction Isolation", href: "https://www.postgresql.org/docs/current/transaction-iso.html", kind: "Official docs", source: "PostgreSQL" },
    ],
    practice: [{ label: "Course mock test", href: "/learn/dbms/test" }],
    learn: { label: "Open the course", href: "/learn/dbms" },
    interviewQuestion: {
      question: "Explain the four SQL isolation levels and the anomalies each one allows. Where does MVCC fit?",
      answer:
        "The SQL standard defines them by which anomalies they rule out. Read Uncommitted may allow dirty reads (seeing another transaction's uncommitted change). Read Committed prevents dirty reads, but a row read twice can change (non-repeatable read). Repeatable Read prevents that, but the standard still allows phantoms (new rows matching a query appear on a re-run). Serializable rules out all of them: the result must match some serial order. MVCC keeps multiple versions of rows so readers see a consistent snapshot without blocking writers; databases use it to implement these levels, and real systems often exceed the minimum (PostgreSQL's Repeatable Read also prevents phantoms).",
      source: { label: "PostgreSQL docs: Transaction isolation", href: "https://www.postgresql.org/docs/current/transaction-iso.html" },
    },
  },
  {
    id: 6,
    slug: "os",
    numStr: "06",
    badge: "STAGE 06 OF 12 · SYSTEMS",
    title: "Operating Systems",
    shortTitle: "06 Operating Systems",
    description:
      "Processes and threads, CPU scheduling, synchronization (locks, semaphores, monitors), deadlocks, memory management, virtual memory and paging, and file systems.",
    phase: "Core CS",
    why: "Processes, threads, scheduling, deadlocks and memory are standard core-subject questions, especially for product companies and systems roles.",
    howTo: ["Use the CPU scheduling and page replacement labs to watch each algorithm run step by step.", "Solve scheduling and paging numericals by hand; written tests use them.", "For each synchronization tool, know one bug it prevents."],
    courses: ["os"],
    resources: [
      { title: "Operating Systems: Three Easy Pieces", href: "https://pages.cs.wisc.edu/~remzi/OSTEP/", kind: "Free book", source: "Arpaci-Dusseau, University of Wisconsin" },
    ],
    practice: [
      { label: "CPU scheduling lab", href: "/labs/cpu-scheduling" },
      { label: "Page replacement lab", href: "/labs/page-replacement" },
      { label: "Course mock test", href: "/learn/os/test" },
    ],
    learn: { label: "Open the course", href: "/learn/os" },
    interviewQuestion: {
      question: "What are the four conditions for deadlock, and how does the Banker's algorithm avoid it?",
      answer:
        "Deadlock needs all four Coffman conditions at once: mutual exclusion, hold and wait, no preemption, and circular wait. Prevention breaks one of them, for example acquiring locks in a fixed global order removes circular wait. The Banker's algorithm avoids deadlock instead: each process declares its maximum need, and a request is granted only if the resulting state is safe, meaning there is some order in which every process can still get its maximum and finish. Otherwise the process waits.",
      source: { label: "Banker's algorithm (Wikipedia)", href: "https://en.wikipedia.org/wiki/Banker%27s_algorithm" },
    },
  },
  {
    id: 7,
    slug: "computer-networks",
    numStr: "07",
    badge: "STAGE 07 OF 12 · NETWORKS",
    title: "Computer Networks",
    shortTitle: "07 Computer Networks",
    description:
      "The OSI and TCP/IP models layer by layer: data link, IP addressing and subnetting, TCP and UDP, application protocols (DNS, HTTP), and network security basics.",
    phase: "Core CS",
    why: "OSI layers, TCP versus UDP, DNS and 'what happens when you open a URL' are common core-subject questions, and subnetting shows up in some written tests.",
    howTo: ["Learn the layers with one protocol you can explain for each.", "Practise subnetting in the subnet lab until you can do it on paper.", "Be able to walk through loading a web page, from the DNS lookup to the rendered page."],
    courses: ["computer-networks"],
    resources: [
      { title: "High Performance Browser Networking", href: "https://hpbn.co/", kind: "Free book", source: "Ilya Grigorik (O'Reilly)" },
      { title: "Beej's Guide to Network Programming", href: "https://beej.us/guide/bgnet/", kind: "Free book", source: "Brian Hall" },
    ],
    practice: [
      { label: "Subnet calculator lab", href: "/labs/subnet-calculator" },
      { label: "Course mock test", href: "/learn/computer-networks/test" },
    ],
    learn: { label: "Open the course", href: "/learn/computer-networks" },
    interviewQuestion: {
      question: "What happens, step by step, when you type https://example.com into a browser and press Enter?",
      answer:
        "1. The browser checks its caches, then asks a DNS resolver, which (if it has no cached answer) queries a root server, the .com TLD servers and the domain's authoritative server to get the IP address. 2. The browser opens a TCP connection (SYN, SYN-ACK, ACK) to port 443, or for HTTP/3 uses QUIC over UDP. 3. A TLS 1.3 handshake agrees keys (usually ECDHE) and verifies the server's certificate, taking one round trip. 4. The browser sends the HTTP request, the server responds, and the browser parses the HTML and fetches the other resources it references.",
      source: { label: "RFC 8446: TLS 1.3", href: "https://datatracker.ietf.org/doc/html/rfc8446" },
    },
  },
  {
    id: 8,
    slug: "projects",
    numStr: "08",
    badge: "STAGE 08 OF 12 · APPLIED",
    title: "Projects You Can Explain",
    shortTitle: "08 Projects",
    description:
      "Build one or two projects end to end and be ready to defend them: why you chose the stack, how data flows, what broke and how you fixed it, and what you'd change at ten times the users.",
    phase: "Get hired",
    why: "Interviewers spend a large part of most rounds on your projects. A small project you understand completely beats a big one you can't explain.",
    howTo: [],
    steps: [
      { title: "Pick a problem you care about", detail: "Something with real users or real data, even if the only user is you." },
      { title: "Build the smallest working version", detail: "One feature end to end: interface, API and database. Commit to Git from the first day." },
      { title: "Add what interviewers ask about", detail: "Sign-in, input validation and error handling, a few tests, and a deployed link." },
      { title: "Write it up", detail: "A README covering the architecture, your decisions and trade-offs, and what you would change at ten times the users.", link: { label: "Project documentation templates", href: "/templates" } },
      { title: "Rehearse the explanation", detail: "Explain it in two minutes, then answer 'why did you choose this?' for every major decision." },
    ],
    courses: [],
    topics: [
      "Version control with Git",
      "REST API design",
      "Database schema and migrations",
      "Authentication",
      "Testing and debugging",
      "Deploying and configuration",
    ],
    resources: [
      { title: "The Missing Semester of Your CS Education", href: "https://missing.csail.mit.edu/", kind: "Free course", source: "MIT" },
      { title: "The Twelve-Factor App", href: "https://12factor.net/", kind: "Free guide", source: "12factor.net" },
    ],
    practice: [
      { label: "Project documentation templates", href: "/templates" },
    ],
    learn: { label: "Project documentation templates", href: "/templates" },
    interviewQuestion: {
      question: "How would you make a payment endpoint safe to retry, so a network timeout never charges a customer twice?",
      answer:
        "Make it idempotent. The client sends a unique Idempotency-Key with each logical payment. The server stores the key with the request's outcome (a unique constraint in the database, or an atomic set-if-absent in a cache). A repeat request with the same key returns the stored result instead of charging again; if the first attempt is still running, the server tells the client to retry later. Keys expire after a window such as 24 hours.",
      source: { label: "Stripe API: Idempotent requests", href: "https://docs.stripe.com/api/idempotent_requests" },
    },
  },
  {
    id: 9,
    slug: "resume",
    numStr: "09",
    badge: "STAGE 09 OF 12 · APPLICATIONS",
    title: "Resume & Applications",
    shortTitle: "09 Resume",
    description:
      "A one-page resume that a recruiter and an applicant tracking system can both read: clear sections, measurable bullet points, relevant keywords, and links to your projects.",
    phase: "Get hired",
    why: "Your resume decides whether you get an interview at all. Recruiters skim it quickly and many companies screen it with software first.",
    howTo: [],
    steps: [
      { title: "Start from a one-page template", detail: "Education, skills, projects and experience in a simple layout that tracking software can read: no tables of skill bars, no photos.", link: { label: "Resume templates", href: "/templates" } },
      { title: "Write results, not duties", detail: "Start each bullet with what you did and end with what changed, with a number where you can share one." },
      { title: "Match the job description", detail: "Use the same names for skills and tools that the posting uses, where they are true for you." },
      { title: "Check it", detail: "Run it through the resume analyser and fix what it flags.", link: { label: "Resume analyser", href: "/tools/resume-analyzer" } },
      { title: "Get one honest review", detail: "Ask a senior, a placement cell member or a friend in the industry to read it for two minutes and tell you what stood out." },
    ],
    courses: [],
    topics: [
      "One-page layout",
      "Measurable bullet points",
      "Keywords from the job description",
      "Projects section",
      "GitHub and LinkedIn",
    ],
    resources: [
      { title: "Resume guide for software engineers", href: "https://www.techinterviewhandbook.org/resume/", kind: "Free guide", source: "Tech Interview Handbook" },
    ],
    practice: [
      { label: "Resume analyser", href: "/tools/resume-analyzer" },
      { label: "Resume templates", href: "/templates" },
    ],
    learn: { label: "Analyse your resume", href: "/tools/resume-analyzer" },
    interviewQuestion: {
      question: "How do you write a strong resume bullet when you can't share confidential numbers?",
      answer:
        "Laszlo Bock, Google's former head of people operations, suggests the form 'Accomplished [X] as measured by [Y], by doing [Z]'. Measure what you can share: latency, test coverage, users, time saved, or a percentage instead of an absolute figure. Example: 'Cut report generation time by 60% for 500k daily rows by adding a composite index and caching the hot query.' It is his personal advice rather than an official Google rule, so use it where it fits instead of on every line.",
      source: { label: "Quartz: Google's Laszlo Bock on the resume formula", href: "https://qz.com/201088/google-just-revealed-the-incredibly-simple-formula-for-killer-resumes" },
    },
  },
  {
    id: 10,
    slug: "online-assessment",
    numStr: "10",
    badge: "STAGE 10 OF 12 · ONLINE TESTS",
    title: "Aptitude & Online Assessments",
    shortTitle: "10 Online Assessment",
    description:
      "The first filter in most campus drives: quantitative aptitude, logical reasoning, verbal ability and coding under a timer. Formats differ by company and change between drives (TCS NQT has Foundation and Advanced parts; Wipro's test includes an essay), so always read the current drive's notice.",
    phase: "Get hired",
    why: "Most campus drives start with an online test that filters candidates before any interview. Aptitude and timed coding both improve with regular timed practice.",
    howTo: ["Do one aptitude module a day and time yourself with the aptitude timer.", "Practise coding against the clock in a timed problem session.", "Before each drive, read that company's latest test pattern; formats change between drives."],
    courses: ["quantitative-aptitude", "logical-reasoning", "verbal-ability", "data-interpretation", "placement-aptitude"],
    resources: [
      { title: "Quantitative aptitude course", href: "/learn/quantitative-aptitude", kind: "Course", source: "StudyHub" },
      { title: "Logical reasoning course", href: "/learn/logical-reasoning", kind: "Course", source: "StudyHub" },
      { title: "Verbal ability course", href: "/learn/verbal-ability", kind: "Course", source: "StudyHub" },
    ],
    practice: [
      { label: "Aptitude timer", href: "/tools/aptitude-timer" },
      { label: "Timed practice sessions", href: "/practice" },
      { label: "Company prep plans", href: "/tools/company-prep" },
    ],
    learn: { label: "Start with aptitude", href: "/learn/quantitative-aptitude" },
    interviewQuestion: {
      question: "How should you split your time in a timed online test with two coding problems and hidden test cases?",
      answer:
        "Read both problems first (a few minutes) and start with the one you can finish. Get a correct, simple solution passing the visible tests before optimising. Keep the last ten minutes for edge cases, because hidden tests usually target them: empty or single-element input, the largest constraints (integer overflow, so use long), duplicates and negatives, and off-by-one boundaries. Partial credit often comes per test case, so a working brute force beats an unfinished optimal one.",
    },
  },
  {
    id: 11,
    slug: "technical-interview",
    numStr: "11",
    badge: "STAGE 11 OF 12 · INTERVIEWS",
    title: "Technical Interviews & System Design",
    shortTitle: "11 Technical Interview",
    description:
      "Live coding while explaining your thinking, follow-up questions on your projects and core subjects, and for many roles an introductory system design round: requirements, components, data storage and trade-offs.",
    phase: "Get hired",
    why: "Live rounds test whether you can solve a problem while explaining your thinking, and answer follow-ups on your projects and core subjects. System design is asked more of experienced hires, but introductory questions do appear.",
    howTo: ["Practise thinking aloud: give the brute-force idea first, then improve it.", "Run mock interviews in the interview simulator and review your answers.", "Work through the design walkthroughs, then redraw each design from memory."],
    courses: ["system-design"],
    resources: [
      { title: "The System Design Primer", href: "https://github.com/donnemartin/system-design-primer", kind: "Free guide", source: "Donne Martin (GitHub)" },
      { title: "System design interview guide", href: "https://www.techinterviewhandbook.org/system-design/", kind: "Free guide", source: "Tech Interview Handbook" },
    ],
    practice: [
      { label: "Interview simulator", href: "/tools/interview-simulator" },
      { label: "Tech question drills", href: "/tools/tech-questions" },
      { label: "Capacity estimation lab", href: "/labs/capacity-estimator" },
    ],
    learn: { label: "Open system design", href: "/learn/system-design" },
    interviewQuestion: {
      question: "Design a rate limiter for an API that runs on many servers.",
      answer:
        "Clarify first: limit per user or per IP, the limit (say 100 requests a minute), and what happens when it's exceeded (HTTP 429 with a Retry-After header). Pick an algorithm: a token bucket allows short bursts; a sliding-window counter is smoother than a fixed window. Because requests for one user land on different servers, keep the counters in a shared store such as Redis and update them atomically (INCR with an expiry, or a Lua script). Discuss trade-offs: a central store adds a network hop per request; local counters synced periodically are faster but less exact; and decide whether to fail open or closed if the store is down.",
    },
  },
  {
    id: 12,
    slug: "hr-interview",
    numStr: "12",
    badge: "STAGE 12 OF 12 · FINAL ROUND",
    title: "HR & Behavioural Interviews",
    shortTitle: "12 HR Interview",
    description:
      "Tell your story clearly: introduce yourself, answer behavioural questions with STAR (Situation, Task, Action, Result), know the company's values, and handle questions about relocation, bonds and offers.",
    phase: "Get hired",
    why: "The final round checks how you communicate, how you work with others and whether you fit the role. Prepared stories make the difference between a vague answer and a clear one.",
    howTo: [],
    steps: [
      { title: "Write your introduction", detail: "60 to 90 seconds: who you are, what you have built, and why this role. Say it out loud until it sounds natural." },
      { title: "Build five or six STAR stories", detail: "A conflict, a failure, a deadline, leading something, and learning something fast. Most behavioural questions map onto one of them.", link: { label: "STAR story builder", href: "/tools/star-builder" } },
      { title: "Learn the company's values", detail: "Read its careers and values pages, and connect one of your stories to each value you can.", link: { label: "Amazon's Leadership Principles, as an example", href: "https://www.aboutamazon.com/about-us/leadership-principles" } },
      { title: "Prepare questions to ask", detail: "Two or three about the team, the first months in the role, or how success is measured." },
      { title: "Understand the offer before you accept", detail: "Ask what the CTC includes (fixed pay, variable pay, benefits), whether there is a service bond, and the joining location and date." },
    ],
    courses: [],
    topics: [
      "Tell me about yourself",
      "STAR answers",
      "Company values",
      "Strengths and weaknesses",
      "Questions to ask the interviewer",
      "Understanding an offer letter",
    ],
    resources: [
      { title: "Behavioral interview guide", href: "https://www.techinterviewhandbook.org/behavioral-interview/", kind: "Free guide", source: "Tech Interview Handbook" },
      { title: "Amazon's 16 Leadership Principles", href: "https://www.aboutamazon.com/about-us/leadership-principles", kind: "Official page", source: "Amazon" },
    ],
    practice: [
      { label: "STAR story builder", href: "/tools/star-builder" },
      { label: "HR and behavioural templates", href: "/templates" },
    ],
    learn: { label: "Build your STAR stories", href: "/tools/star-builder" },
    interviewQuestion: {
      question: "Tell me about a time you disagreed with a teammate's technical decision. What did you do?",
      answer:
        "Answer with STAR. Situation: one sentence of context (a team project choosing a database). Task: what you were responsible for. Action: what you did, in the first person; the strong pattern is to test the options and bring evidence instead of arguing opinions, then commit fully once a decision is made even if it wasn't yours. Result: the outcome, with a number if you have one, and what you learned. Amazon names this behaviour 'Have Backbone; Disagree and Commit'.",
      source: { label: "Amazon Leadership Principles", href: "https://www.aboutamazon.com/about-us/leadership-principles" },
    },
  },
];
