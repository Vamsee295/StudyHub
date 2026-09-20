import { 
  CompanyTarget, 
  CompanyWorkspaceDetail, 
  DirectoryCompany, 
  CompanyRecommendation, 
  RecentCompanyLog 
} from "@/types";

export const targetCompanies: CompanyTarget[] = [
  {
    id: "google",
    name: "Google",
    monogram: "G",
    segment: "Product MNC",
    tier: "Tier-1",
    roles: ["SWE", "STEP Intern"],
    readiness: 78,
    recruiterHighlight: { title: "Q3 Campus", detail: "8.5+ CGPA / OA Active" },
  },
  {
    id: "microsoft",
    name: "Microsoft",
    monogram: "MS",
    segment: "Product MNC",
    tier: "Tier-1",
    roles: ["SDE-1", "Intern"],
    readiness: 64,
    recruiterHighlight: { title: "5 Stages", detail: "OA Rate 82%" },
  },
  {
    id: "amazon",
    name: "Amazon",
    monogram: "A",
    segment: "Product MNC",
    tier: "Tier-1",
    roles: ["SDE-1", "Intern"],
    readiness: 71,
    recruiterHighlight: { title: "LP Weight High", detail: "Mock: Ready" },
  },
  {
    id: "tcs-prime",
    name: "TCS Prime",
    monogram: "TCS",
    segment: "High-Volume IT",
    tier: "Tier-2",
    roles: ["Digital & Prime"],
    readiness: 89,
    recruiterHighlight: { title: "Diff: Medium", detail: "Focus: SQL/Aptitude" },
  },
];

export const companyWorkspaces: Record<string, CompanyWorkspaceDetail> = {
  microsoft: {
    id: "microsoft",
    name: "Microsoft",
    monogram: "MS",
    category: "Product Engineering",
    locations: ["Redmond", "Hyderabad", "Bengaluru"],
    targetRole: "Software Engineer (SDE-1)",
    recruitmentWindow: "Active Cycle '26",
    competenciesVerified: 18,
    totalCompetencies: 28,
    readinessScore: 64,
    readinessPhase: "High Competency Phase",
    hiringStages: [
      {
        stageNumber: 1,
        title: "Online Assessment (OA)",
        status: "Cleared",
        description: "Codility-style platform with 3 algorithms & data structure questions.",
        duration: "90 Mins",
        tags: ["Arrays", "Strings", "Sorting"],
      },
      {
        stageNumber: 2,
        title: "Technical Interview 1",
        status: "In-Flight",
        description: "Focuses on Data Structures, Problem Solving, and basic CS fundamentals.",
        duration: "45 Mins",
        tags: ["Binary Trees", "Linked Lists"],
      },
      {
        stageNumber: 3,
        title: "Technical Round 2 (LLD)",
        status: "Scheduled",
        description: "Low-Level Design (LLD), Object-Oriented Design (OOD) concepts.",
        duration: "60 Mins",
        tags: ["OOD", "Design Patterns", "UML"],
      },
      {
        stageNumber: 4,
        title: "Systems & Scale",
        status: "Upcoming",
        description: "High-Level Design (HLD), System Architecture, DB Scaling.",
        duration: "60 Mins",
        tags: ["Databases", "Caching", "Load Balancing"],
      },
      {
        stageNumber: 5,
        title: "As-Appropriate (AA)",
        status: "Final Bar",
        description: "Hiring Manager round focusing on behavioral aspects and culture fit.",
        duration: "45 Mins",
        tags: ["Behavioral", "Culture Fit", "Past Experience"],
      }
    ],
    competencies: [
      { name: "DSA & Algorithmic Patterns", score: 82 },
      { name: "Core Computer Science (OS/CN)", score: 71 },
      { name: "SQL & Database Engineering", score: 64 },
      { name: "Low-Level & System Design", score: 42, isGap: true },
      { name: "Aptitude & Analytical Logic", score: 88 },
      { name: "Behavioral & STAR Formulation", score: 35, isGap: true },
    ],
    questionWeights: [
      { topic: "Binary Trees & BST", frequency: 34, label: "Asked" },
      { topic: "LRU Cache & OOD", frequency: 0, label: "Very High" },
      { topic: "Dynamic Programming", frequency: 22, label: "Asked" },
      { topic: "Operating Systems", frequency: 18, label: "Asked" },
      { topic: "SQL & Schema Normalization", frequency: 15, label: "Queries" },
    ],
    recentQuestions: [
      {
        id: "ms-1",
        title: "Design an LRU Cache",
        domain: "Low-Level Design",
        difficulty: "Hard",
        recurrenceRate: "82% Recurrence",
        askedDate: "Asked 12 Days Ago",
        description: "Implement an LRU Cache with O(1) get and put operations. Focus on doubly-linked list & hash map integration.",
      },
      {
        id: "ms-2",
        title: "Serialize & Deserialize Binary Tree",
        domain: "Data Structures",
        difficulty: "Hard",
        recurrenceRate: "64% Recurrence",
        askedDate: "Asked 3 Weeks Ago",
        description: "Design an algorithm to serialize and deserialize a binary tree. Focus on handling null nodes optimally.",
      },
      {
        id: "ms-3",
        title: "Deadlock Detection in OS",
        domain: "Core CS",
        difficulty: "Medium",
        recurrenceRate: "45% Recurrence",
        askedDate: "Asked 1 Month Ago",
        description: "Explain Banker's Algorithm and write a theoretical approach to detect and prevent deadlocks.",
      },
    ]
  },
  google: {
    id: "google",
    name: "Google",
    monogram: "G",
    category: "Product Engineering",
    locations: ["Bengaluru", "Hyderabad", "Pune"],
    targetRole: "Software Engineer (SWE)",
    recruitmentWindow: "Active Cycle '26",
    competenciesVerified: 22,
    totalCompetencies: 28,
    readinessScore: 78,
    readinessPhase: "Advanced Preparation",
    hiringStages: [
      {
        stageNumber: 1,
        title: "Online Assessment (OA)",
        status: "Cleared",
        description: "Graph modeling and dynamic programming focus.",
        duration: "90 Mins",
        tags: ["Graphs", "DP"],
      },
      {
        stageNumber: 2,
        title: "Technical Interview 1",
        status: "Scheduled",
        description: "Advanced Data Structures & Problem Solving.",
        duration: "45 Mins",
        tags: ["Trees", "Tries", "Heaps"],
      },
      {
        stageNumber: 3,
        title: "Technical Interview 2",
        status: "Upcoming",
        description: "Algorithms & Logic Optimization.",
        duration: "45 Mins",
        tags: ["Algorithm Design", "Complexity"],
      },
      {
        stageNumber: 4,
        title: "Googlyness & Leadership",
        status: "Final Bar",
        description: "Behavioral round assessing culture fit and conflict resolution.",
        duration: "45 Mins",
        tags: ["Behavioral", "Culture Fit"],
      }
    ],
    competencies: [
      { name: "DSA & Algorithmic Patterns", score: 90 },
      { name: "Core Computer Science (OS/CN)", score: 85 },
      { name: "SQL & Database Engineering", score: 60 },
      { name: "Low-Level & System Design", score: 75 },
      { name: "Aptitude & Analytical Logic", score: 82 },
      { name: "Behavioral & STAR Formulation", score: 78 },
    ],
    questionWeights: [
      { topic: "Graphs & Topological Sort", frequency: 45, label: "Asked" },
      { topic: "Dynamic Programming (2D)", frequency: 38, label: "Asked" },
      { topic: "Segment Trees & Fenwick", frequency: 12, label: "Asked" },
      { topic: "System Design (Scalability)", frequency: 0, label: "Very High" },
    ],
    recentQuestions: [
      {
        id: "g-1",
        title: "Evaluate Division",
        domain: "Data Structures",
        difficulty: "Medium-Hard",
        recurrenceRate: "75% Recurrence",
        askedDate: "Asked 1 Week Ago",
        description: "Given equations (e.g., A/B = k), evaluate new queries. Requires modeling as a directed graph.",
      },
      {
        id: "g-2",
        title: "Guess the Word",
        domain: "Algorithms",
        difficulty: "Hard",
        recurrenceRate: "50% Recurrence",
        askedDate: "Asked 2 Weeks Ago",
        description: "Interactive problem to guess a 6-letter word with limited API calls using minimax strategy.",
      }
    ]
  },
  amazon: {
    id: "amazon",
    name: "Amazon",
    monogram: "A",
    category: "Product Engineering",
    locations: ["Bengaluru", "Hyderabad", "Delhi"],
    targetRole: "Software Development Engineer 1",
    recruitmentWindow: "Active Cycle '26",
    competenciesVerified: 20,
    totalCompetencies: 28,
    readinessScore: 71,
    readinessPhase: "Mid-to-High Phase",
    hiringStages: [
      {
        stageNumber: 1,
        title: "Online Assessment (OA)",
        status: "Cleared",
        description: "2 Coding questions + Work Simulation Survey.",
        duration: "120 Mins",
        tags: ["Strings", "Arrays", "Simulation"],
      },
      {
        stageNumber: 2,
        title: "Technical Interview 1",
        status: "In-Flight",
        description: "DSA with focus on Leadership Principles.",
        duration: "60 Mins",
        tags: ["DSA", "LP"],
      },
      {
        stageNumber: 3,
        title: "Technical Interview 2",
        status: "Scheduled",
        description: "Low Level Design or Object Modeling with LP.",
        duration: "60 Mins",
        tags: ["LLD", "LP"],
      },
      {
        stageNumber: 4,
        title: "Bar Raiser",
        status: "Final Bar",
        description: "System Design, Deep Dive, and intensive behavioral.",
        duration: "60 Mins",
        tags: ["System Design", "LP"],
      }
    ],
    competencies: [
      { name: "DSA & Algorithmic Patterns", score: 75 },
      { name: "Core Computer Science (OS/CN)", score: 68 },
      { name: "SQL & Database Engineering", score: 80 },
      { name: "Low-Level & System Design", score: 55, isGap: true },
      { name: "Aptitude & Analytical Logic", score: 85 },
      { name: "Behavioral & STAR Formulation", score: 62 },
    ],
    questionWeights: [
      { topic: "Leadership Principles (STAR)", frequency: 0, label: "Very High" },
      { topic: "Arrays & Strings", frequency: 40, label: "Asked" },
      { topic: "Heaps & Priority Queues", frequency: 28, label: "Asked" },
      { topic: "Object Oriented Design", frequency: 20, label: "Asked" },
    ],
    recentQuestions: [
      {
        id: "a-1",
        title: "Number of Islands",
        domain: "Data Structures",
        difficulty: "Medium",
        recurrenceRate: "85% Recurrence",
        askedDate: "Asked 5 Days Ago",
        description: "Given a 2D grid of 1s (land) and 0s (water), count the number of islands. Use DFS/BFS.",
      },
      {
        id: "a-2",
        title: "Design Amazon Locker System",
        domain: "Low-Level Design",
        difficulty: "Medium-Hard",
        recurrenceRate: "60% Recurrence",
        askedDate: "Asked 1 Month Ago",
        description: "Design the classes and interfaces for an Amazon Locker delivery and pickup system.",
      }
    ]
  },
  "tcs-prime": {
    id: "tcs-prime",
    name: "TCS Prime",
    monogram: "TCS",
    category: "High-Volume IT",
    locations: ["Pan-India"],
    targetRole: "Systems Engineer (Digital/Prime)",
    recruitmentWindow: "Active Cycle '26",
    competenciesVerified: 25,
    totalCompetencies: 28,
    readinessScore: 89,
    readinessPhase: "Ready to Interview",
    hiringStages: [
      {
        stageNumber: 1,
        title: "National Qualifier Test (NQT)",
        status: "Cleared",
        description: "Aptitude, Logical Reasoning, Verbal, and Basic Coding.",
        duration: "180 Mins",
        tags: ["Aptitude", "Logic", "Verbal"],
      },
      {
        stageNumber: 2,
        title: "Advanced Coding Round",
        status: "Cleared",
        description: "2 advanced coding problems (Medium difficulty).",
        duration: "60 Mins",
        tags: ["Arrays", "Math", "Strings"],
      },
      {
        stageNumber: 3,
        title: "Technical + MR Panel",
        status: "In-Flight",
        description: "Technical subjects, project discussion, and managerial fit.",
        duration: "45 Mins",
        tags: ["Projects", "Core CS", "HR"],
      }
    ],
    competencies: [
      { name: "DSA & Algorithmic Patterns", score: 85 },
      { name: "Core Computer Science (OS/CN)", score: 92 },
      { name: "SQL & Database Engineering", score: 88 },
      { name: "Low-Level & System Design", score: 70 },
      { name: "Aptitude & Analytical Logic", score: 95 },
      { name: "Behavioral & STAR Formulation", score: 80 },
    ],
    questionWeights: [
      { topic: "Quantitative Aptitude", frequency: 0, label: "Very High" },
      { topic: "Basic Data Structures", frequency: 50, label: "Asked" },
      { topic: "SQL Queries (Joins/Group By)", frequency: 35, label: "Asked" },
      { topic: "OOP Concepts", frequency: 40, label: "Asked" },
    ],
    recentQuestions: [
      {
        id: "tcs-1",
        title: "Rotate Array",
        domain: "Data Structures",
        difficulty: "Medium",
        recurrenceRate: "70% Recurrence",
        askedDate: "Asked 2 Weeks Ago",
        description: "Given an array, rotate the array to the right by k steps, where k is non-negative.",
      },
      {
        id: "tcs-2",
        title: "SQL: Nth Highest Salary",
        domain: "SQL",
        difficulty: "Medium",
        recurrenceRate: "90% Recurrence",
        askedDate: "Asked 3 Weeks Ago",
        description: "Write an SQL query to report the nth highest salary from the Employee table.",
      }
    ]
  }
};

export const directoryCompanies: DirectoryCompany[] = [
  {
    id: "atlassian",
    name: "Atlassian",
    monogram: "AT",
    segment: "Product MNC",
    location: "Bengaluru",
    salaryRange: "35-45 LPA",
    roles: ["SDE-1", "Backend Developer"],
    processSummary: "4 Rounds • OA, LLD, HLD, Values",
    difficulty: "Hard",
    readinessScore: 52,
    segmentFilter: "Product"
  },
  {
    id: "uber",
    name: "Uber",
    monogram: "U",
    segment: "Product MNC",
    location: "Bengaluru",
    salaryRange: "40-55 LPA",
    roles: ["Software Engineer 1"],
    processSummary: "5 Rounds • System Design focus",
    difficulty: "Hard",
    readinessScore: 48,
    segmentFilter: "Product"
  },
  {
    id: "infosys",
    name: "Infosys",
    monogram: "IN",
    segment: "High-Volume IT",
    location: "Pan-India",
    salaryRange: "3.6-9.5 LPA",
    roles: ["System Engineer", "Specialist Programmer"],
    processSummary: "3 Rounds • Aptitude, Coding, HR",
    difficulty: "Medium",
    readinessScore: 92,
    segmentFilter: "Service & IT"
  },
  {
    id: "cognizant",
    name: "Cognizant",
    monogram: "CTS",
    segment: "High-Volume IT",
    location: "Pan-India",
    salaryRange: "4-10 LPA",
    roles: ["GenC", "GenC Elevate"],
    processSummary: "3 Rounds • AMCAT, Tech, HR",
    difficulty: "Medium",
    readinessScore: 88,
    segmentFilter: "Service & IT"
  },
  {
    id: "goldman-sachs",
    name: "Goldman Sachs",
    monogram: "GS",
    segment: "FinTech & Consulting",
    location: "Bengaluru",
    salaryRange: "20-25 LPA",
    roles: ["Technology Analyst"],
    processSummary: "4 Rounds • Math/Aptitude, Coding, CS Core",
    difficulty: "Hard",
    readinessScore: 65,
    segmentFilter: "Product"
  },
  {
    id: "razorpay",
    name: "Razorpay",
    monogram: "RZ",
    segment: "High-Growth Startup",
    location: "Bengaluru",
    salaryRange: "25-30 LPA",
    roles: ["SDE-1"],
    processSummary: "4 Rounds • DSA, Machine Coding, HM",
    difficulty: "Medium-Hard",
    readinessScore: 70,
    segmentFilter: "High-Growth Startup"
  }
];

export const companyRecommendations: CompanyRecommendation[] = [
  {
    id: "cisco",
    name: "Cisco Systems",
    matchPercentage: 94,
    rationale: "Recommended because your OS and Networking module scores are in the top 10th percentile.",
    roadmapsCount: 2,
    practiceSetsCount: 14
  },
  {
    id: "oracle",
    name: "Oracle OCI",
    matchPercentage: 89,
    rationale: "Strong alignment with your SQL & Database Engineering progression and recent practice.",
    roadmapsCount: 1,
    practiceSetsCount: 8
  },
  {
    id: "adobe",
    name: "Adobe Systems",
    matchPercentage: 86,
    rationale: "Matches your proficiency in DSA and String/Array manipulation patterns.",
    roadmapsCount: 1,
    practiceSetsCount: 12
  }
];

export const initialRecentHistory: RecentCompanyLog[] = [
  {
    id: "amazon",
    name: "Amazon",
    targetRole: "SDE-1",
    lastInteraction: "Viewed 2 hours ago",
    cohortStatus: "Active",
    readinessScore: 71,
    sprintAction: "Continue Prep →"
  },
  {
    id: "tcs-prime",
    name: "TCS Prime",
    targetRole: "Digital & Prime",
    lastInteraction: "Viewed 1 day ago",
    cohortStatus: "Tracking",
    readinessScore: 89,
    sprintAction: "Take Mock →"
  }
];
