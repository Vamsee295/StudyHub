import { 
  QuickPracticeSprint, 
  RecommendedDiagnostic, 
  PracticeCurriculumBank, 
  PlacementSimulation, 
  PracticeAttemptLedger 
} from "@/types";

export const quickSprints: QuickPracticeSprint[] = [
  {
    id: "sprint-dsa-1",
    tag: "ALGORITHMS · TIMED",
    title: "DSA Sprint",
    questionsCount: 10,
    estimatedMinutes: 20,
    difficulty: "Intermediate",
    topics: ["Arrays", "Sliding Window", "String Matching"],
    avgTime: "18m",
    targetAccuracy: "85%",
    engineNote: "",
    track: "dsa"
  },
  {
    id: "sprint-sql-1",
    tag: "DATABASES · SANDBOX",
    title: "SQL Challenge",
    questionsCount: 15,
    estimatedMinutes: 25,
    difficulty: "Advanced",
    topics: ["Multi-table Joins", "CTEs", "Window Functions"],
    avgTime: "24m",
    targetAccuracy: "80%",
    engineNote: "PostgreSQL v15",
    track: "sql"
  },
  {
    id: "sprint-java-1",
    tag: "OBJECT-ORIENTED · SYNTAX",
    title: "Java Fundamentals",
    questionsCount: 10,
    estimatedMinutes: 15,
    difficulty: "Core SDE",
    topics: ["Polymorphism", "Virtual Methods", "Collections"],
    avgTime: "12m",
    targetAccuracy: "90%",
    engineNote: "JDK 21 Verified",
    track: "java"
  }
];

export const recommendedDiagnostics: RecommendedDiagnostic[] = [
  {
    id: "diag-sql-1",
    badge: "WEAK AREA DETECTED · ACCURACY 60%",
    accentColor: "red",
    title: "SQL — Correlated Subqueries & CTEs",
    description: "Your last 2 SQL attempts showed repeated syntax timeouts on nested correlated queries. Strengthen CTE decomposition before moving to window functions.",
    metricLabel: "Subquery Execution Score",
    metricValueText: "60% (Below 80% Benchmark)",
    metricPercent: 60,
    questionCount: 12,
    estimatedMinutes: 20,
    difficulty: "Med",
    ctaText: "Strengthen Topic",
    track: "sql"
  },
  {
    id: "diag-dsa-1",
    badge: "ROADMAP SYNC · STAGE 04 DSA",
    accentColor: "blue",
    title: "DSA — Binary Search on Answer Spaces",
    description: "Directly aligned with your active Placement Roadmap milestone. Practice monotonic condition verification, search bounds calibration, and extreme boundary cases.",
    metricLabel: "Roadmap Milestone Progress",
    metricValueText: "Stage 4 / 6 in progress",
    metricPercent: 75,
    questionCount: 8,
    estimatedMinutes: 25,
    difficulty: "Inter",
    ctaText: "Start Practice",
    track: "dsa"
  },
  {
    id: "diag-os-1",
    badge: "INTERVIEW RECURRENCE · HIGH",
    accentColor: "slate",
    title: "Operating Systems — Deadlock & Philosophers",
    description: "Frequent question in Amazon, TCS Prime, and Cisco technical rounds. Practice semaphore implementations, banker's algorithm, and resource hierarchy solutions.",
    metricLabel: "Recurrence in 2025–26 MNC Rounds",
    metricValueText: "91% Probability",
    metricPercent: 91,
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Inter",
    ctaText: "Start Practice",
    track: "cs"
  }
];

export const curriculumBanks: PracticeCurriculumBank[] = [
  {
    id: "bank-dsa",
    bankCode: "BANK 01",
    title: "Data Structures & Algorithms",
    problemCount: 420,
    categoriesCount: 12,
    iconName: "network",
    topics: ["Arrays & Two Pointers", "Strings", "Linked Lists", "Stacks & Queues", "Trees & BST", "Graphs", "Dynamic Prog", "Heap & Greedy"],
    track: "dsa"
  },
  {
    id: "bank-sql",
    bankCode: "BANK 02",
    title: "SQL & Query Engineering",
    problemCount: 180,
    categoriesCount: 6,
    iconName: "database", 
    topics: ["SELECT & Filtering", "Joins & Unions", "Aggregations & GROUP", "Subqueries & CTEs", "Window Functions", "Indexing & Tuning"],
    track: "sql"
  },
  {
    id: "bank-cs",
    bankCode: "BANK 03",
    title: "Core Computer Science",
    problemCount: 140,
    categoriesCount: 5,
    iconName: "cpu",
    topics: ["OOP Principles", "DBMS & ACID", "OS Threading & Memory", "Computer Networks", "TCP/IP & Protocols", "System Design Basics"],
    track: "cs"
  },
  {
    id: "bank-apt",
    bankCode: "BANK 04",
    title: "Placement Aptitude",
    problemCount: 210,
    categoriesCount: 3,
    iconName: "brain",
    topics: ["Quantitative Aptitude", "Logical Reasoning", "Analytical Deduction", "Verbal Ability", "Reading Comprehension", "Data Interpretation"],
    track: "aptitude"
  }
];

export const placementSimulations: PlacementSimulation[] = [
  {
    id: "sim-tcs",
    companyTag: "TCS · RECRUITMENT SPECIFIC",
    cycleBadge: "NQT 2026",
    title: "TCS Digital & Prime Suite",
    description: "Advanced algorithmic challenges, pseudo-code analysis, and SQL query optimization matching recent NQT patterns.",
    questionsCount: 24,
    timeMinutes: 60,
    difficulty: "Medium-Hard"
  },
  {
    id: "sim-infosys",
    companyTag: "INFOSYS · SPECIALIST",
    cycleBadge: "SP / DSE",
    title: "Infosys SP & DSE Track",
    description: "Graph traversals, Dynamic Programming, and complex data structures designed specifically for Specialist Programmer rounds.",
    questionsCount: 3,
    timeMinutes: 90,
    difficulty: "Hard"
  },
  {
    id: "sim-cognizant",
    companyTag: "COGNIZANT · GENC NEXT",
    cycleBadge: "Skill-Check",
    title: "Cognizant GenC Next",
    description: "Hands-on coding sprints, debugging exercises, and core CS mcqs calibrated for product engineering and cloud profiles.",
    questionsCount: 18,
    timeMinutes: 45,
    difficulty: "Intermediate"
  },
  {
    id: "sim-accenture",
    companyTag: "ACCENTURE · TECHNICAL",
    cycleBadge: "ASE / FSE",
    title: "Accenture Assessment Suite",
    description: "Critical thinking, technical reasoning, cloud fundamentals, pseudo-code analysis, and core coding simulations.",
    questionsCount: 20,
    timeMinutes: 40,
    difficulty: "Intermediate"
  },
  {
    id: "sim-general-sde1",
    companyTag: "UNIVERSAL SDE-1",
    cycleBadge: "Full Round Sim",
    title: "General SDE-1 Mixed Technical Simulation",
    description: "Balanced full-round simulation spanning 2 LeetCode-style medium algorithms, 1 complex SQL analytical query, and 5 OS/Networking scenario architectural questions. Formatted like actual screening rounds at high-growth engineering firms.",
    questionsCount: 8,
    timeMinutes: 75,
    difficulty: "Mixed Difficulty",
    components: [
      { name: "Component 01", detail: "2 Coding Problems" },
      { name: "Component 02", detail: "1 PostgreSQL Sandbox" },
      { name: "Component 03", detail: "5 System Architecture MCQs" }
    ],
    isFeaturedSpan: true
  }
];

export const practiceLedger: PracticeAttemptLedger[] = [
  {
    id: "att-1",
    title: "DSA — Arrays & Two Pointers",
    sessionType: "Timed Sprint · 15 Items",
    totalQuestions: 15,
    correctQuestions: 12,
    accuracyPercent: 80,
    timeElapsed: "19m 30s",
    completedAt: "Yesterday, 4:15 PM",
    track: "dsa"
  },
  {
    id: "att-2",
    title: "SQL — Multi-Table JOINs & Aggregation",
    sessionType: "Interactive Sandbox · 20 Queries",
    totalQuestions: 20,
    correctQuestions: 14,
    accuracyPercent: 70,
    timeElapsed: "23m 10s",
    completedAt: "2 days ago",
    track: "sql"
  },
  {
    id: "att-3",
    title: "Java Core — OOP & Virtual Method Dispatch",
    sessionType: "Syntax Drill · 20 Items",
    totalQuestions: 20,
    correctQuestions: 18,
    accuracyPercent: 90,
    timeElapsed: "14m 45s",
    completedAt: "3 days ago",
    track: "java"
  },
  {
    id: "att-4",
    title: "OS — Process Scheduling & Virtual Memory",
    sessionType: "Conceptual Scenarios · 10 Items",
    totalQuestions: 10,
    correctQuestions: 9,
    accuracyPercent: 90,
    timeElapsed: "11m 20s",
    completedAt: "4 days ago",
    track: "cs"
  }
];
