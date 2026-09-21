export interface CuratedResource {
  title: string;
  readTime: string;
  tag: string;
  href: string;
}

export interface PracticeStats {
  totalSolved: number;
  totalQuestions: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface RoadmapModule {
  id: number;
  slug: string;
  numStr: string;
  badge: string;
  title: string;
  shortTitle: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  statusText: string;
  progressPct: number;
  progressDetail: string;
  targetVelocity: string;
  clearanceEstimate: string;
  topics: string[];
  modulesSummary: string;
  resources: CuratedResource[];
  practice: PracticeStats;
  interviewQuestion: {
    companyBadge: string;
    frequency: string;
    question: string;
    answer: string;
  };
  learnUrl: string;
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
      "Master underlying memory models, pointer mechanics, data representations, and standard I/O semantics essential for building reliable code.",
    status: "upcoming",
    statusText: "Not Started",
    progressPct: 0,
    progressDetail: "0 / 93 lessons completed",
    targetVelocity: "2 lessons/day",
    clearanceEstimate: "Pending",
    topics: [
      "Arrays & Pointers",
      "Call Stack & Heap",
      "Value vs Reference",
      "Standard I/O",
      "Bitwise Ops",
      "Complexity Basics (Big-O)"
    ],
    modulesSummary: "6 core baseline modules",
    resources: [
      {
        title: "Programming Foundations Notes",
        readTime: "15 min read",
        tag: "High Yield",
        href: "/resources/programming-foundations"
      },
      {
        title: "Memory Model & Pointer Walkthrough",
        readTime: "40 min read",
        tag: "Guided Code",
        href: "/resources/memory-model"
      }
    ],
    practice: {
      totalSolved: 180,
      totalQuestions: 180,
      easy: 95,
      medium: 70,
      hard: 15
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · MICROSOFT / INFOSYS",
      frequency: "Freq: High in Round 1",
      question:
        "Explain stack vs heap memory allocation, stack frames during recursion, and when a memory leak occurs in modern runtimes.",
      answer:
        "Stack allocation is static, fast, and managed automatically via LIFO call frames; local primitives and function pointers live here. Heap allocation is dynamic, manual or garbage-collected, used for objects whose lifecycle exceeds current frame. Memory leaks occur when heap-allocated objects retain unneeded references, preventing garbage collection."
    },
    learnUrl: "/learn/programming-fundamentals"
  },
  {
    id: 2,
    slug: "oop",
    numStr: "02",
    badge: "STAGE 02 OF 12 · SOFTWARE ARCHITECTURE",
    title: "Object-Oriented Programming (OOP)",
    shortTitle: "02 OOP",
    description:
      "Deep dive into OOP pillars, SOLID design principles, clean architecture patterns, and interface segregation to design resilient modular systems.",
    status: "completed",
    statusText: "Completed",
    progressPct: 100,
    progressDetail: "65 / 65 design patterns built",
    targetVelocity: "5 patterns/day",
    clearanceEstimate: "Architecture Cleared",
    topics: [
      "Encapsulation",
      "Polymorphism & V-Tables",
      "Inheritance vs Composition",
      "Abstract Classes & Interfaces",
      "SOLID Principles",
      "Design Patterns"
    ],
    modulesSummary: "6 core architectural modules",
    resources: [
      {
        title: "Java OOP Complete Guide",
        readTime: "45 min read",
        tag: "Interview Prep",
        href: "/resources/java-oop"
      },
      {
        title: "SOLID Principles Cheatsheet",
        readTime: "25 min read",
        tag: "Clean Code",
        href: "/resources/solid-principles"
      }
    ],
    practice: {
      totalSolved: 65,
      totalQuestions: 65,
      easy: 30,
      medium: 28,
      hard: 7
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · ZOHO / ACCENTURE",
      frequency: "Freq: High in Round 1 & 2",
      question:
        "How does the Dependency Inversion Principle differ from Dependency Injection? Walk through a concrete refactoring example.",
      answer:
        "Dependency Inversion is the principle stating high-level modules should not depend on low-level modules; both should depend on abstractions. Dependency Injection is the architectural pattern (or technique) used to realize DIP by passing dependencies via constructor, setter, or framework container rather than hardcoding instantiations."
    },
    learnUrl: "/learn/oop"
  },
  {
    id: 3,
    slug: "sql",
    numStr: "03",
    badge: "STAGE 03 OF 12 · PERSISTENCE",
    title: "SQL & Relational Foundations",
    shortTitle: "03 SQL",
    description:
      "Construct efficient queries, master relational algebra, analyze query execution plans, and structure normalized schemas for scalable applications.",
    status: "completed",
    statusText: "Completed",
    progressPct: 100,
    progressDetail: "92 / 92 query challenges verified",
    targetVelocity: "6 queries/day",
    clearanceEstimate: "SQL Cleared",
    topics: [
      "Inner / Outer Joins",
      "Aggregation & GROUP BY",
      "Window Functions (RANK, LEAD)",
      "Subqueries & CTEs",
      "Indexing & B+ Trees",
      "Normalization (1NF-3NF)"
    ],
    modulesSummary: "6 core relational query modules",
    resources: [
      {
        title: "SQL Interview Handbook 2026",
        readTime: "1h 30m read",
        tag: "45 Queries",
        href: "/resources/sql-handbook"
      },
      {
        title: "B+ Tree Indexing Visualizer Guide",
        readTime: "20 min read",
        tag: "DB Engine",
        href: "/resources/indexing-guide"
      }
    ],
    practice: {
      totalSolved: 92,
      totalQuestions: 92,
      easy: 42,
      medium: 38,
      hard: 12
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · ORACLE / DELOITTE",
      frequency: "Freq: Very High in Round 1",
      question:
        "What is the mechanical difference between a Clustered and Non-Clustered index in B+ Trees, and what triggers an index scan over an index seek?",
      answer:
        "A clustered index dictates the physical sorting of table rows on disk; leaves contain actual data pages (only 1 per table). A non-clustered index creates a separate B+ tree whose leaves contain row pointers/clustering keys. The query optimizer chooses an index scan over a seek when predicates are non-sargable (e.g. leading wildcards, functions on columns) or low cardinality makes full scans faster."
    },
    learnUrl: "/learn/sql"
  },
  {
    id: 4,
    slug: "dsa",
    numStr: "04",
    badge: "STAGE 04 OF 12 · CORE ENGINEERING",
    title: "Data Structures & Algorithms (DSA)",
    shortTitle: "04 DSA",
    description:
      "Master algorithmic patterns, data structures, and company-calibrated problem types commonly required for Tier-1 technical interviews and online assessments.",
    status: "in-progress",
    statusText: "Stage 04 · In progress (68%)",
    progressPct: 68,
    progressDetail: "280 / 412 problems solved",
    targetVelocity: "8 questions/day",
    clearanceEstimate: "18 Days remaining",
    topics: [
      "Arrays & Two Pointers",
      "Strings",
      "Linked Lists",
      "Stacks & Queues",
      "Trees & Binary Search",
      "Graphs: BFS/DFS",
      "Dynamic Programming"
    ],
    modulesSummary: "7 core algorithmic modules",
    resources: [
      {
        title: "DSA Patterns Cheatsheet",
        readTime: "25 min read",
        tag: "High Yield",
        href: "/resources/dsa-patterns"
      },
      {
        title: "DSA Interview Handbook 2026",
        readTime: "1h 10m read",
        tag: "Video breakdown",
        href: "/resources/dsa-handbook"
      }
    ],
    practice: {
      totalSolved: 280,
      totalQuestions: 412,
      easy: 120,
      medium: 142,
      hard: 18
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · AMAZON / GOOGLE",
      frequency: "Freq: High in Round 1 & 2",
      question:
        "Explain the architectural difference between Breadth-First Search (BFS) and Depth-First Search (DFS), and when to prefer one over the other in cycle detection.",
      answer:
        "BFS explores level-by-level using a Queue (FIFO), ideal for finding the shortest path on unweighted graphs and detecting odd cycles (bipartite checking). DFS explores deep down a branch using a Call Stack or Explicit Stack (LIFO), which is optimal for topological sorting, Tarjan's SCC algorithm, and finding back-edges in directed graphs (indicating a cycle)."
    },
    learnUrl: "/learn/dsa"
  },
  {
    id: 5,
    slug: "dbms",
    numStr: "05",
    badge: "STAGE 05 OF 12 · BACKEND INTERNALS",
    title: "Database Management Systems (DBMS)",
    shortTitle: "05 DBMS",
    description:
      "Learn transactional safety, write-ahead logging (WAL), distributed concurrency protocols, and indexing algorithms powering enterprise datastores.",
    status: "upcoming",
    statusText: "Upcoming milestone",
    progressPct: 0,
    progressDetail: "Next Up on Milestone Completion",
    targetVelocity: "4 topics/day",
    clearanceEstimate: "Unlocks at DSA 75%",
    topics: [
      "ACID Properties",
      "Transaction Isolation",
      "2PL & Locking",
      "WAL & Recovery",
      "Buffer Pool Management",
      "Replication & Sharding"
    ],
    modulesSummary: "6 database engine modules",
    resources: [
      {
        title: "DBMS Revision Guide",
        readTime: "40 min read",
        tag: "Schema Design",
        href: "/resources/dbms-revision"
      },
      {
        title: "Concurrency Control Deep Dive",
        readTime: "30 min read",
        tag: "Systems Internals",
        href: "/resources/concurrency-control"
      }
    ],
    practice: {
      totalSolved: 0,
      totalQuestions: 85,
      easy: 0,
      medium: 0,
      hard: 0
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · SAP LABS / AMAZON",
      frequency: "Freq: High in Round 2",
      question:
        "Explain the 4 ANSI SQL isolation levels, dirty reads, non-repeatable reads, phantom reads, and how Multi-Version Concurrency Control (MVCC) resolves them.",
      answer:
        "Read Uncommitted allows dirty reads. Read Committed prevents dirty reads using short-lived read locks or snapshot reads. Repeatable Read prevents non-repeatable reads. Serializable prevents phantom reads using range/predicate locks. MVCC resolves read-write conflicts by keeping multiple historical versions of tuples, allowing readers to read snapshots without acquiring shared locks."
    },
    learnUrl: "/learn/dbms"
  },
  {
    id: 6,
    slug: "operating-systems",
    numStr: "06",
    badge: "STAGE 06 OF 12 · SYSTEMS CORE",
    title: "Operating Systems & Concurrency",
    shortTitle: "06 Operating Systems",
    description:
      "Understand CPU scheduling, process virtualization, multi-threading synchronization primitives, POSIX mutexes, and virtual memory paging.",
    status: "upcoming",
    statusText: "Upcoming",
    progressPct: 0,
    progressDetail: "Scheduled for Phase 06",
    targetVelocity: "4 topics/day",
    clearanceEstimate: "Upcoming Milestone",
    topics: [
      "Process vs Thread Lifecycle",
      "CPU Scheduling Policies",
      "Mutexes & Semaphores",
      "Virtual Memory & Paging",
      "Page Replacement (LRU)",
      "Deadlocks (Coffman Conditions)"
    ],
    modulesSummary: "6 core OS systems modules",
    resources: [
      {
        title: "Operating Systems Core Interview Notes",
        readTime: "50 min read",
        tag: "Thread Scenarios",
        href: "/resources/os-notes"
      },
      {
        title: "Virtual Memory & Paging Cheat Sheet",
        readTime: "20 min read",
        tag: "High Yield",
        href: "/resources/virtual-memory"
      }
    ],
    practice: {
      totalSolved: 0,
      totalQuestions: 95,
      easy: 0,
      medium: 0,
      hard: 0
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · QUALCOMM / MICROSOFT",
      frequency: "Freq: High in Core Rounds",
      question:
        "What are Coffman's four conditions for deadlock? Describe how a banker's algorithm or resource-ordering hierarchy prevents deadlock.",
      answer:
        "Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Breaking any one condition guarantees freedom from deadlocks. Resource ordering enforces an acyclic hierarchy, eliminating circular wait. Banker's algorithm tests for safe states before granting allocations, guaranteeing a system can satisfy at least one process to completion."
    },
    learnUrl: "/learn/operating-systems"
  },
  {
    id: 7,
    slug: "computer-networks",
    numStr: "07",
    badge: "STAGE 07 OF 12 · INFRASTRUCTURE",
    title: "Computer Networks & Protocols",
    shortTitle: "07 Computer Networks",
    description:
      "Master the OSI and TCP/IP stacks, TLS 1.3 handshake mechanics, HTTP/2 multiplexing, DNS resolution, and TCP flow/congestion control.",
    status: "upcoming",
    statusText: "Upcoming",
    progressPct: 0,
    progressDetail: "Scheduled for Phase 07",
    targetVelocity: "4 topics/day",
    clearanceEstimate: "Upcoming Milestone",
    topics: [
      "OSI & TCP/IP Stack Layers",
      "TCP 3-Way Handshake & FIN",
      "DNS Resolution Chain",
      "TLS 1.3 Handshake",
      "HTTP/1.1 vs HTTP/2 vs HTTP/3",
      "Subnetting & CIDR Notation"
    ],
    modulesSummary: "6 transport & network modules",
    resources: [
      {
        title: "Computer Networks Essentials",
        readTime: "45 min read",
        tag: "Packet Traces",
        href: "/resources/networks-essentials"
      },
      {
        title: "HTTP to HTTPS & TLS 1.3 Guide",
        readTime: "25 min read",
        tag: "Protocol Flow",
        href: "/resources/tls-guide"
      }
    ],
    practice: {
      totalSolved: 0,
      totalQuestions: 75,
      easy: 0,
      medium: 0,
      hard: 0
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · CISCO / CLOUDFLARE",
      frequency: "Freq: High in Networking Rounds",
      question:
        "Walk through step-by-step what happens at the network layer when you type https://google.com in a browser and press Enter.",
      answer:
        "1. Browser checks cache (browser, OS, router). 2. Recursive DNS resolution occurs (Root → TLD → Authoritative). 3. TCP SYN packet sent to resolved IP (SYN, SYN-ACK, ACK). 4. TLS 1.3 handshake negotiates cipher and establishes session keys via ECDHE. 5. HTTP GET sent over TLS tunnel. 6. Server responds, and browser renders HTML."
    },
    learnUrl: "/learn/computer-networks"
  },
  {
    id: 8,
    slug: "projects",
    numStr: "08",
    badge: "STAGE 08 OF 12 · APPLIED ENGINEERING",
    title: "Production Projects & Clean Code",
    shortTitle: "08 Projects",
    description:
      "Develop full-stack distributed web applications incorporating caching tiers, async background queues, relational modeling, and continuous integration.",
    status: "upcoming",
    statusText: "Upcoming",
    progressPct: 0,
    progressDetail: "Scheduled for Phase 08",
    targetVelocity: "2 project milestones/week",
    clearanceEstimate: "Upcoming Milestone",
    topics: [
      "System Architecture Defense",
      "REST & gRPC Contracts",
      "Redis Caching & Invalidation",
      "Async Worker Queues (Kafka)",
      "Database Migrations & Prisma",
      "Docker & CI/CD Pipelines"
    ],
    modulesSummary: "6 production architecture criteria",
    resources: [
      {
        title: "Project Architecture Defense Guide",
        readTime: "35 min read",
        tag: "Resume Projects",
        href: "/resources/project-defense"
      },
      {
        title: "Production Microservice Checklist",
        readTime: "30 min read",
        tag: "System Design",
        href: "/resources/microservices"
      }
    ],
    practice: {
      totalSolved: 0,
      totalQuestions: 15,
      easy: 0,
      medium: 0,
      hard: 0
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · HIGH-GROWTH STARTUPS",
      frequency: "Freq: Core Project Defense",
      question:
        "How do you design an idempotent payment processing endpoint that safely handles network retries and duplicate webhooks?",
      answer:
        "Use an Idempotency-Key header stored in Redis with a short TTL (e.g. 24h). When a request arrives: 1. Atomically insert key (SETNX). If already present and processing, return 409 Conflict. If completed, return cached response. 2. Process payment within a DB transaction. 3. Cache result and commit. 4. If failure, release idempotency lock."
    },
    learnUrl: "/learn/projects"
  },
  {
    id: 9,
    slug: "resume",
    numStr: "09",
    badge: "STAGE 09 OF 12 · PLACEMENT PACKAGING",
    title: "Technical Resume & ATS Clearance",
    shortTitle: "09 Resume",
    description:
      "Craft high-conversion bullet points using Google's X-Y-Z formula, pass through company ATS filters, and curate public open-source portfolios.",
    status: "upcoming",
    statusText: "Upcoming",
    progressPct: 0,
    progressDetail: "Scheduled for Phase 09",
    targetVelocity: "1 resume iteration/week",
    clearanceEstimate: "Upcoming Milestone",
    topics: [
      "Google XYZ Bullet Formula",
      "ATS Keyword Optimization",
      "GitHub Portfolio Polish",
      "Project Architecture Summary",
      "Cold Emailing & InMail",
      "LinkedIn Recruiter Optimization"
    ],
    modulesSummary: "6 recruitment conversion modules",
    resources: [
      {
        title: "Verified SDE Resume Template",
        readTime: "15 min read",
        tag: "LaTeX / PDF",
        href: "/resources/resume-template"
      },
      {
        title: "ATS Keyword Scoring Guide",
        readTime: "20 min read",
        tag: "Screening",
        href: "/resources/ats-guide"
      }
    ],
    practice: {
      totalSolved: 0,
      totalQuestions: 10,
      easy: 0,
      medium: 0,
      hard: 0
    },
    interviewQuestion: {
      companyBadge: "SAMPLE RESUME CRITIQUE · FAANG RECRUITERS",
      frequency: "Freq: Screening Gate",
      question:
        "How should quantified engineering impact be articulated for project contributions without confidential company revenue numbers?",
      answer:
        "Frame achievements around latency reductions, throughput scaling, test coverage, and developer velocity using the formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. Example: 'Reduced query latency by 42% across 500k daily records by introducing composite B+ tree indexes and Redis caching'."
    },
    learnUrl: "/learn/resume"
  },
  {
    id: 10,
    slug: "online-assessment",
    numStr: "10",
    badge: "STAGE 10 OF 12 · RECRUITMENT GATE",
    title: "Online Assessment (OA) Mastery",
    shortTitle: "10 Online Assessment",
    description:
      "Simulate high-pressure timed code evaluations modeled on HackerRank, CodeSignal, and proprietary recruitment test portals.",
    status: "upcoming",
    statusText: "Upcoming",
    progressPct: 0,
    progressDetail: "Scheduled for August 2026",
    targetVelocity: "3 full simulations/week",
    clearanceEstimate: "Upcoming Milestone",
    topics: [
      "Timed Problem Solving",
      "Hidden Edge Case Detection",
      "Time Allotment Heuristics",
      "Aptitude & Quantitative Rounds",
      "Logical Reasoning Patterns",
      "Platform Test Runners"
    ],
    modulesSummary: "6 test simulation drills",
    resources: [
      {
        title: "Timed Aptitude Practice Bank",
        readTime: "40 min read",
        tag: "TCS / Infosys",
        href: "/resources/aptitude-bank"
      },
      {
        title: "OA Speed & Debugging Playbook",
        readTime: "25 min read",
        tag: "Timed Rounds",
        href: "/resources/oa-playbook"
      }
    ],
    practice: {
      totalSolved: 0,
      totalQuestions: 50,
      easy: 0,
      medium: 0,
      hard: 0
    },
    interviewQuestion: {
      companyBadge: "SAMPLE OA HEURISTIC · CODESIGNAL / HACKERRANK",
      frequency: "Freq: Timed OA Strategy",
      question:
        "What time allocation and debugging strategy is optimal when facing a 70-minute 2-problem assessment with hidden test cases?",
      answer:
        "Spend first 5 minutes reading BOTH questions before typing code. Allocate 25 mins to Problem 1 and 35 mins to Problem 2, reserving 10 mins for edge case stress testing. If hidden tests fail, immediately check: 1. 64-bit integer overflow. 2. Empty/single-element inputs. 3. Recursion stack overflow limits. 4. Off-by-one boundary cases."
    },
    learnUrl: "/learn/online-assessment"
  },
  {
    id: 11,
    slug: "technical-interview",
    numStr: "11",
    badge: "STAGE 11 OF 12 · LIVE ROUNDS",
    title: "System Design & Technical Interviews",
    shortTitle: "11 Technical Interview",
    description:
      "Live problem solving, whiteboard communications, low-level design patterns, and high-level distributed systems architecture discussions.",
    status: "upcoming",
    statusText: "Upcoming",
    progressPct: 0,
    progressDetail: "Scheduled for Phase 11",
    targetVelocity: "2 mock interviews/week",
    clearanceEstimate: "Upcoming Milestone",
    topics: [
      "Thinking Out Loud Protocols",
      "Low-Level Design (LLD)",
      "High-Level Architecture (HLD)",
      "Trade-off Justifications",
      "Handling Interviewer Hints",
      "Live Whiteboard Coding"
    ],
    modulesSummary: "6 live interview capabilities",
    resources: [
      {
        title: "System Design Framework for SDE 1",
        readTime: "1h read",
        tag: "HLD Blueprint",
        href: "/resources/system-design"
      },
      {
        title: "Low-Level Design (LLD) Machine Coding",
        readTime: "45 min read",
        tag: "Object Modeling",
        href: "/resources/lld-guide"
      }
    ],
    practice: {
      totalSolved: 0,
      totalQuestions: 30,
      easy: 0,
      medium: 0,
      hard: 0
    },
    interviewQuestion: {
      companyBadge: "SAMPLE INTERVIEW QUESTION · GOOGLE / UBER",
      frequency: "Freq: High in Round 3",
      question:
        "Design a distributed rate limiter supporting 100,000 requests per second across multiple regional API gateways.",
      answer:
        "Use a Sliding Window Counter algorithm backed by Redis Cluster with Lua scripts to ensure atomic increments and boundary checks. Run rate limiting at API Gateway (Envoy/Kong) using local memory token buckets with periodic Redis synchronization to eliminate cross-region roundtrip latency on every HTTP call."
    },
    learnUrl: "/learn/technical-interview"
  },
  {
    id: 12,
    slug: "hr-interview",
    numStr: "12",
    badge: "STAGE 12 OF 12 · FINAL OFFER",
    title: "HR & Behavioral Interview Playbook",
    shortTitle: "12 HR Interview",
    description:
      "Master STAR behavioral storytelling, executive leadership principles, compensation benchmarks, and offer negotiation strategy.",
    status: "upcoming",
    statusText: "Final Step",
    progressPct: 0,
    progressDetail: "Final Stage",
    targetVelocity: "1 story bank revision/day",
    clearanceEstimate: "Final Round Target",
    topics: [
      "STAR Framework Mastery",
      "Amazon 16 Leadership Principles",
      "'Tell Me About Yourself' Pitch",
      "Handling Behavioral Traps",
      "Company Culture Alignment",
      "Compensation & Offer Negotiation"
    ],
    modulesSummary: "6 behavioral mastery tracks",
    resources: [
      {
        title: "STAR Behavioral Stories Bank",
        readTime: "30 min read",
        tag: "Leadership",
        href: "/resources/star-method"
      },
      {
        title: "CTC & Offer Negotiation Playbook",
        readTime: "25 min read",
        tag: "Compensation",
        href: "/resources/offer-negotiation"
      }
    ],
    practice: {
      totalSolved: 0,
      totalQuestions: 25,
      easy: 0,
      medium: 0,
      hard: 0
    },
    interviewQuestion: {
      companyBadge: "SAMPLE BEHAVIORAL QUESTION · AMAZON / GOOGLE",
      frequency: "Freq: Standard in Bar Raiser",
      question:
        "Describe a situation where you strongly disagreed with a technical decision made by a peer or manager. How did you handle it?",
      answer:
        "Frame using STAR: Situation (a database choice or architecture tradeoff), Task (need to deliver safely on deadline), Action (instead of arguing opinion, I gathered empirical benchmark data, tested both approaches, and presented objective trade-offs respectfully), Result (team adopted the optimal hybrid path, delivered on time, and built mutual trust)."
    },
    learnUrl: "/learn/hr-interview"
  }
];
