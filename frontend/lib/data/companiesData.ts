import { CompanyTarget, CompanyWorkspaceDetail, DirectoryCompany } from "@/types";

export const targetCompanies: CompanyTarget[] = [
  {
    id: "google",
    name: "Google",
    monogram: "G",
    segment: "Product MNC",
    tier: "Tier-1",
    roles: ["SWE", "STEP Intern"],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    monogram: "MS",
    segment: "Product MNC",
    tier: "Tier-1",
    roles: ["SDE-1", "Intern"],
  },
  {
    id: "amazon",
    name: "Amazon",
    monogram: "A",
    segment: "Product MNC",
    tier: "Tier-1",
    roles: ["SDE-1", "Intern"],
  },
  {
    id: "tcs-prime",
    name: "TCS Prime",
    monogram: "TCS",
    segment: "High-Volume IT",
    tier: "Tier-2",
    roles: ["Digital & Prime"],
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
    hiringStages: [
      {
        stageNumber: 1,
        title: "Online Assessment (OA)",
        description: "Codility-style platform with 3 algorithms & data structure questions.",
        duration: "90 Mins",
        tags: ["Arrays", "Strings", "Sorting"],
      },
      {
        stageNumber: 2,
        title: "Technical Interview 1",
        description: "Focuses on Data Structures, Problem Solving, and basic CS fundamentals.",
        duration: "45 Mins",
        tags: ["Binary Trees", "Linked Lists"],
      },
      {
        stageNumber: 3,
        title: "Technical Round 2 (LLD)",
        description: "Low-Level Design (LLD), Object-Oriented Design (OOD) concepts.",
        duration: "60 Mins",
        tags: ["OOD", "Design Patterns", "UML"],
      },
      {
        stageNumber: 4,
        title: "Systems & Scale",
        description: "High-Level Design (HLD), System Architecture, DB Scaling.",
        duration: "60 Mins",
        tags: ["Databases", "Caching", "Load Balancing"],
      },
      {
        stageNumber: 5,
        title: "As-Appropriate (AA)",
        description: "Hiring Manager round focusing on behavioral aspects and culture fit.",
        duration: "45 Mins",
        tags: ["Behavioral", "Culture Fit", "Past Experience"],
      }
    ],
    questionWeights: [
      { topic: "Binary Trees & BST" },
      { topic: "LRU Cache & OOD" },
      { topic: "Dynamic Programming" },
      { topic: "Operating Systems" },
      { topic: "SQL & Schema Normalization" },
    ],
    recentQuestions: [
      {
        id: "ms-1",
        title: "Design an LRU Cache",
        domain: "Low-Level Design",
        difficulty: "Hard",
        description: "Implement an LRU Cache with O(1) get and put operations. Focus on doubly-linked list & hash map integration.",
      },
      {
        id: "ms-2",
        title: "Serialize & Deserialize Binary Tree",
        domain: "Data Structures",
        difficulty: "Hard",
        description: "Design an algorithm to serialize and deserialize a binary tree. Focus on handling null nodes optimally.",
      },
      {
        id: "ms-3",
        title: "Deadlock Detection in OS",
        domain: "Core CS",
        difficulty: "Medium",
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
    hiringStages: [
      {
        stageNumber: 1,
        title: "Online Assessment (OA)",
        description: "Graph modeling and dynamic programming focus.",
        duration: "90 Mins",
        tags: ["Graphs", "DP"],
      },
      {
        stageNumber: 2,
        title: "Technical Interview 1",
        description: "Advanced Data Structures & Problem Solving.",
        duration: "45 Mins",
        tags: ["Trees", "Tries", "Heaps"],
      },
      {
        stageNumber: 3,
        title: "Technical Interview 2",
        description: "Algorithms & Logic Optimization.",
        duration: "45 Mins",
        tags: ["Algorithm Design", "Complexity"],
      },
      {
        stageNumber: 4,
        title: "Googlyness & Leadership",
        description: "Behavioral round assessing culture fit and conflict resolution.",
        duration: "45 Mins",
        tags: ["Behavioral", "Culture Fit"],
      }
    ],
    questionWeights: [
      { topic: "Graphs & Topological Sort" },
      { topic: "Dynamic Programming (2D)" },
      { topic: "Segment Trees & Fenwick" },
      { topic: "System Design (Scalability)" },
    ],
    recentQuestions: [
      {
        id: "g-1",
        title: "Evaluate Division",
        domain: "Data Structures",
        difficulty: "Medium-Hard",
        description: "Given equations (e.g., A/B = k), evaluate new queries. Requires modeling as a directed graph.",
      },
      {
        id: "g-2",
        title: "Guess the Word",
        domain: "Algorithms",
        difficulty: "Hard",
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
    hiringStages: [
      {
        stageNumber: 1,
        title: "Online Assessment (OA)",
        description: "2 Coding questions + Work Simulation Survey.",
        duration: "120 Mins",
        tags: ["Strings", "Arrays", "Simulation"],
      },
      {
        stageNumber: 2,
        title: "Technical Interview 1",
        description: "DSA with focus on Leadership Principles.",
        duration: "60 Mins",
        tags: ["DSA", "LP"],
      },
      {
        stageNumber: 3,
        title: "Technical Interview 2",
        description: "Low Level Design or Object Modeling with LP.",
        duration: "60 Mins",
        tags: ["LLD", "LP"],
      },
      {
        stageNumber: 4,
        title: "Bar Raiser",
        description: "System Design, Deep Dive, and intensive behavioral.",
        duration: "60 Mins",
        tags: ["System Design", "LP"],
      }
    ],
    questionWeights: [
      { topic: "Leadership Principles (STAR)" },
      { topic: "Arrays & Strings" },
      { topic: "Heaps & Priority Queues" },
      { topic: "Object Oriented Design" },
    ],
    recentQuestions: [
      {
        id: "a-1",
        title: "Number of Islands",
        domain: "Data Structures",
        difficulty: "Medium",
        description: "Given a 2D grid of 1s (land) and 0s (water), count the number of islands. Use DFS/BFS.",
      },
      {
        id: "a-2",
        title: "Design Amazon Locker System",
        domain: "Low-Level Design",
        difficulty: "Medium-Hard",
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
    hiringStages: [
      {
        stageNumber: 1,
        title: "National Qualifier Test (NQT)",
        description: "Aptitude, Logical Reasoning, Verbal, and Basic Coding.",
        duration: "180 Mins",
        tags: ["Aptitude", "Logic", "Verbal"],
      },
      {
        stageNumber: 2,
        title: "Advanced Coding Round",
        description: "2 advanced coding problems (Medium difficulty).",
        duration: "60 Mins",
        tags: ["Arrays", "Math", "Strings"],
      },
      {
        stageNumber: 3,
        title: "Technical + MR Panel",
        description: "Technical subjects, project discussion, and managerial fit.",
        duration: "45 Mins",
        tags: ["Projects", "Core CS", "HR"],
      }
    ],
    questionWeights: [
      { topic: "Quantitative Aptitude" },
      { topic: "Basic Data Structures" },
      { topic: "SQL Queries (Joins/Group By)" },
      { topic: "OOP Concepts" },
    ],
    recentQuestions: [
      {
        id: "tcs-1",
        title: "Rotate Array",
        domain: "Data Structures",
        difficulty: "Medium",
        description: "Given an array, rotate the array to the right by k steps, where k is non-negative.",
      },
      {
        id: "tcs-2",
        title: "SQL: Nth Highest Salary",
        domain: "SQL",
        difficulty: "Medium",
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
    segmentFilter: "High-Growth Startup"
  }
];
