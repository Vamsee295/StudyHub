import { CompanyWorkspaceDetail } from "@/types";

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

// Directory companies: commonly reported campus processes (public placement reports and prep guides).
// Rounds vary by year, role and campus, as the page says.
Object.assign(companyWorkspaces, {
  atlassian: {
    id: "atlassian", name: "Atlassian", monogram: "AT", category: "Product Engineering",
    locations: ["Bengaluru"], targetRole: "Software Engineer (Graduate)", recruitmentWindow: "Campus Cycle",
    hiringStages: [
      { stageNumber: 1, title: "Online Assessment (OA)", description: "Timed coding problems on data structures and algorithms.", duration: "90 Mins", tags: ["Arrays", "Strings", "Graphs"] },
      { stageNumber: 2, title: "Coding Interview", description: "Problem solving with working, readable code and test cases.", duration: "60 Mins", tags: ["DSA", "Problem Solving"] },
      { stageNumber: 3, title: "Code Design", description: "Design and extend a small system in code: classes, interfaces, extensibility.", duration: "60 Mins", tags: ["LLD", "Design Patterns"] },
      { stageNumber: 4, title: "Values Interview", description: "Behavioural questions mapped to Atlassian's company values.", duration: "45 Mins", tags: ["Values", "Behavioral"] },
    ],
    questionWeights: [{ topic: "Graphs & BFS/DFS" }, { topic: "Object-Oriented Design" }, { topic: "Hash Maps" }, { topic: "Company values (STAR)" }],
    recentQuestions: [
      { id: "at-1", title: "Course Schedule", domain: "Graphs", difficulty: "Medium", description: "Decide whether all courses can be finished given prerequisite pairs: cycle detection with topological sort." },
      { id: "at-2", title: "Top K Frequent Words", domain: "Heaps / Hashing", difficulty: "Medium", description: "Return the k most frequent words, ties broken alphabetically." },
    ],
  },
  uber: {
    id: "uber", name: "Uber", monogram: "U", category: "Product Engineering",
    locations: ["Bengaluru", "Hyderabad"], targetRole: "Software Engineer 1", recruitmentWindow: "Campus Cycle",
    hiringStages: [
      { stageNumber: 1, title: "Online Assessment (OA)", description: "Medium to hard algorithmic problems under time pressure.", duration: "90 Mins", tags: ["Graphs", "DP"] },
      { stageNumber: 2, title: "DSA Interview 1", description: "Problem solving and optimisation with complexity analysis.", duration: "60 Mins", tags: ["DSA", "Heaps"] },
      { stageNumber: 3, title: "DSA Interview 2", description: "Harder problem or follow-ups on trees and graphs.", duration: "60 Mins", tags: ["Trees", "Graphs"] },
      { stageNumber: 4, title: "Design Round", description: "Low-level or light system design depending on the role.", duration: "60 Mins", tags: ["LLD", "System Design"] },
      { stageNumber: 5, title: "Hiring Manager", description: "Projects, ownership and collaboration.", duration: "45 Mins", tags: ["Behavioral", "Projects"] },
    ],
    questionWeights: [{ topic: "Graphs & Shortest Paths" }, { topic: "Dynamic Programming" }, { topic: "Heaps" }, { topic: "Design basics" }],
    recentQuestions: [
      { id: "ub-1", title: "Rotting Oranges", domain: "Graphs", difficulty: "Medium", description: "Multi-source BFS on a grid to find how long until every orange rots." },
      { id: "ub-2", title: "Meeting Rooms II", domain: "Heaps / Intervals", difficulty: "Medium", description: "Minimum number of rooms needed for a set of meetings." },
    ],
  },
  infosys: {
    id: "infosys", name: "Infosys", monogram: "IN", category: "High-Volume IT",
    locations: ["Pan-India"], targetRole: "Systems Engineer / Specialist Programmer", recruitmentWindow: "Campus Cycle",
    hiringStages: [
      { stageNumber: 1, title: "Online Test", description: "Quantitative aptitude, logical reasoning, verbal ability and pseudocode; higher roles add coding problems.", duration: "100 Mins", tags: ["Aptitude", "Logic", "Verbal", "Pseudocode"] },
      { stageNumber: 2, title: "Technical Interview", description: "Core CS, a language of your choice, SQL basics and your projects.", duration: "30 Mins", tags: ["Core CS", "SQL", "Projects"] },
      { stageNumber: 3, title: "HR Interview", description: "Communication, relocation and willingness to learn.", duration: "15 Mins", tags: ["HR"] },
    ],
    questionWeights: [{ topic: "Quantitative Aptitude" }, { topic: "Logical Reasoning" }, { topic: "OOP & SQL basics" }, { topic: "Project discussion" }],
    recentQuestions: [
      { id: "in-1", title: "Second Largest Distinct Number", domain: "Arrays", difficulty: "Easy", description: "Find the second largest distinct value in one pass." },
      { id: "in-2", title: "Palindrome Number", domain: "Basics", difficulty: "Easy", description: "Check whether an integer reads the same backwards, without converting to a string." },
    ],
  },
  cognizant: {
    id: "cognizant", name: "Cognizant", monogram: "CTS", category: "High-Volume IT",
    locations: ["Pan-India"], targetRole: "GenC / GenC Elevate", recruitmentWindow: "Campus Cycle",
    hiringStages: [
      { stageNumber: 1, title: "Aptitude + Coding Assessment", description: "Quantitative, logical and verbal sections; Elevate and higher tracks add coding problems.", duration: "120 Mins", tags: ["Aptitude", "Logic", "Verbal", "Arrays"] },
      { stageNumber: 2, title: "Technical Interview", description: "OOP, DBMS/SQL, basic data structures and your projects.", duration: "30 Mins", tags: ["Core CS", "SQL", "Projects"] },
      { stageNumber: 3, title: "HR Interview", description: "Communication and fit.", duration: "15 Mins", tags: ["HR"] },
    ],
    questionWeights: [{ topic: "Aptitude" }, { topic: "OOP concepts" }, { topic: "SQL joins & group by" }, { topic: "Basic arrays & strings" }],
    recentQuestions: [
      { id: "cts-1", title: "Missing Number", domain: "Arrays", difficulty: "Easy", description: "Find the one number missing from 0..n using a sum or XOR trick." },
      { id: "cts-2", title: "Valid Parentheses", domain: "Stack", difficulty: "Easy", description: "Check whether every bracket is closed in the right order." },
    ],
  },
  "goldman-sachs": {
    id: "goldman-sachs", name: "Goldman Sachs", monogram: "GS", category: "FinTech & Consulting",
    locations: ["Bengaluru", "Hyderabad"], targetRole: "Technology Analyst", recruitmentWindow: "Campus Cycle",
    hiringStages: [
      { stageNumber: 1, title: "Online Assessment (OA)", description: "Coding problems plus maths, probability and reasoning questions.", duration: "120 Mins", tags: ["Arrays", "Math", "Aptitude"] },
      { stageNumber: 2, title: "Technical Interview 1", description: "Data structures and problem solving.", duration: "60 Mins", tags: ["DSA", "DP"] },
      { stageNumber: 3, title: "Technical Interview 2", description: "Core CS (OS, DBMS), OOP and puzzles.", duration: "60 Mins", tags: ["Core CS", "SQL", "Puzzle"] },
      { stageNumber: 4, title: "HR / Fit", description: "Motivation, teamwork and why finance technology.", duration: "30 Mins", tags: ["Behavioral"] },
    ],
    questionWeights: [{ topic: "Dynamic Programming" }, { topic: "Probability & Maths" }, { topic: "Arrays & Strings" }, { topic: "OS & DBMS" }],
    recentQuestions: [
      { id: "gs-1", title: "Best Time to Buy and Sell Stock", domain: "Arrays", difficulty: "Easy", description: "Maximum profit from one buy and one later sell." },
      { id: "gs-2", title: "Coin Change", domain: "Dynamic Programming", difficulty: "Medium", description: "Fewest coins to make an amount, or -1 if impossible." },
    ],
  },
  razorpay: {
    id: "razorpay", name: "Razorpay", monogram: "RZ", category: "High-Growth Startup",
    locations: ["Bengaluru"], targetRole: "SDE-1", recruitmentWindow: "Campus Cycle",
    hiringStages: [
      { stageNumber: 1, title: "DSA Round", description: "Problem solving with clean code and complexity analysis.", duration: "60 Mins", tags: ["DSA", "Arrays", "Hash Maps"] },
      { stageNumber: 2, title: "Machine Coding", description: "Build a small working module end to end in limited time.", duration: "90 Mins", tags: ["Machine Coding", "LLD"] },
      { stageNumber: 3, title: "Design Discussion", description: "Extend your machine-coding solution or design a small service.", duration: "60 Mins", tags: ["System Design", "Database"] },
      { stageNumber: 4, title: "Hiring Manager", description: "Ownership, projects and culture fit.", duration: "45 Mins", tags: ["Behavioral", "Projects"] },
    ],
    questionWeights: [{ topic: "Machine coding" }, { topic: "Hash Maps & Arrays" }, { topic: "Low-level design" }, { topic: "Databases basics" }],
    recentQuestions: [
      { id: "rz-1", title: "Subarray Sum Equals K", domain: "Hashing", difficulty: "Medium", description: "Count subarrays that sum to k using prefix sums and a hash map." },
      { id: "rz-2", title: "Merge Intervals", domain: "Sorting", difficulty: "Medium", description: "Merge all overlapping intervals after sorting by start." },
    ],
  },
} satisfies Record<string, CompanyWorkspaceDetail>);
