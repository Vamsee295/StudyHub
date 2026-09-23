import { LearnSubject, LearnPath } from "@/types";

export const learnSubjects: LearnSubject[] = [
  {
    id: "subj-01",
    slug: "data-structures",
    title: "Data Structures",
    description: "Master arrays, linked lists, trees, and graphs for technical interviews.",
    category: "Core CS",
    progress: 35,
    totalModules: 12,
    completedModules: 4,
    modules: [
      { id: "mod-01", title: "Arrays & Strings", description: "Fundamentals of array manipulation and string algorithms.", type: "video", duration: "45m", completed: true },
      { id: "mod-02", title: "Linked Lists", description: "Singly and doubly linked lists, reversal techniques.", type: "reading", duration: "30m", completed: true },
      { id: "mod-03", title: "Stacks & Queues", description: "LIFO and FIFO data structures.", type: "exercise", duration: "60m", completed: true },
      { id: "mod-04", title: "Trees & BST", description: "Hierarchical data structures, traversals.", type: "video", duration: "1h 15m", completed: true },
      { id: "mod-05", title: "Graphs", description: "BFS, DFS, shortest path algorithms.", type: "video", duration: "2h", completed: false },
      { id: "mod-06", title: "Dynamic Programming", description: "Memoization and tabulation techniques.", type: "exercise", duration: "2h", completed: false }
    ]
  },
  {
    id: "subj-02",
    slug: "system-design",
    title: "System Design",
    description: "Learn to design scalable, distributed, and highly available systems.",
    category: "Technical",
    progress: 10,
    totalModules: 8,
    completedModules: 1,
    modules: [
      { id: "mod-01", title: "Introduction to Scalability", description: "Vertical vs Horizontal scaling, load balancers.", type: "reading", duration: "20m", completed: true },
      { id: "mod-02", title: "Database Sharding", description: "Partitioning data across multiple machines.", type: "video", duration: "40m", completed: false },
      { id: "mod-03", title: "Caching Strategies", description: "Memcached, Redis, LRU cache.", type: "reading", duration: "30m", completed: false },
    ]
  },
  {
    id: "subj-03",
    slug: "quantitative-aptitude",
    title: "Quantitative Aptitude",
    description: "Improve problem-solving speed for preliminary screening rounds.",
    category: "Aptitude",
    progress: 80,
    totalModules: 5,
    completedModules: 4,
    modules: [
      { id: "mod-01", title: "Number Systems", description: "LCM, HCF, remainders.", type: "video", duration: "30m", completed: true },
      { id: "mod-02", title: "Time & Work", description: "Efficiency and man-days concepts.", type: "exercise", duration: "45m", completed: true },
      { id: "mod-03", title: "Probability", description: "Permutations, combinations, probability distributions.", type: "reading", duration: "30m", completed: true },
      { id: "mod-04", title: "Data Interpretation", description: "Reading charts and graphs quickly.", type: "exercise", duration: "40m", completed: true },
      { id: "mod-05", title: "Speed, Distance, Time", description: "Trains, boats, streams.", type: "video", duration: "35m", completed: false }
    ]
  },
  {
    id: "subj-04",
    slug: "react-js",
    title: "React.js Framework",
    description: "Build modern web interfaces using React, Hooks, and Next.js.",
    category: "Technical",
    progress: 0,
    totalModules: 6,
    completedModules: 0,
    modules: [
      { id: "mod-01", title: "Components & Props", description: "Building blocks of React applications.", type: "video", duration: "40m", completed: false },
      { id: "mod-02", title: "State & Lifecycle", description: "Managing data within components.", type: "reading", duration: "25m", completed: false },
    ]
  }
];

export const learnPaths: LearnPath[] = [
  {
    id: "path-01",
    title: "SDE Role Preparation",
    description: "The complete journey to becoming a Software Development Engineer at top tech companies.",
    subjects: ["data-structures", "system-design", "react-js"]
  },
  {
    id: "path-02",
    title: "Campus Placements",
    description: "Structured preparation for university placements, focusing on aptitude and core CS concepts.",
    subjects: ["quantitative-aptitude", "data-structures"]
  }
];

export const continueLearningSubjects = [
  "data-structures",
  "system-design"
];

export const recommendedSubjects = [
  "react-js"
];

export const recentlyViewedSubjects = [
  "quantitative-aptitude",
  "system-design"
];

export const aptitudeLearningPaths: LearnPath[] = [
  {
    id: "path-aptitude-01",
    title: "Placement Aptitude Mastery",
    description: "The complete journey to mastering all aptitude sections for campus placements.",
    subjects: ["quantitative-aptitude", "logical-reasoning", "verbal-ability", "data-interpretation", "placement-aptitude"]
  },
  {
    id: "path-aptitude-02",
    title: "Quantitative Mastery",
    description: "Focus entirely on mathematical concepts, arithmetic, and advanced algebra.",
    subjects: ["quantitative-aptitude", "data-interpretation"]
  },
  {
    id: "path-aptitude-03",
    title: "Reasoning & Problem Solving",
    description: "Build strong logical deduction skills for puzzles, patterns, and syllogisms.",
    subjects: ["logical-reasoning"]
  },
  {
    id: "path-aptitude-04",
    title: "Verbal & Communication",
    description: "Enhance vocabulary, grammar, and reading comprehension for written tests.",
    subjects: ["verbal-ability"]
  }
];

