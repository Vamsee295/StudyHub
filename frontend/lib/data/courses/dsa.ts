import { Course } from './types';
import { generateLessons } from './utils';

export const dsaCourse: Course = {
  id: "course-dsa",
  slug: "dsa",
  title: "Data Structures & Algorithms",
  description: "The core of software engineering interviews. Master arrays, trees, graphs, and dynamic programming.",
  category: "Placement",
  icon: "Binary",
  displayOrder: 4,
  modules: [
    {
      id: "dsa-mod-1",
      slug: "dsa-fundamentals",
      title: "DSA Fundamentals",
      description: "Big-O notation, time and space complexity, and algorithmic thinking.",
      difficulty: "Beginner",
      estimatedMinutes: 105,
      lessons: generateLessons("dsa-fundamentals", 7)
    },
    {
      id: "dsa-mod-2",
      slug: "arrays",
      title: "Arrays",
      description: "1D/2D arrays, sliding window, and two-pointer techniques.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: generateLessons("arrays", 6)
    },
    {
      id: "dsa-mod-3",
      slug: "strings",
      title: "Strings",
      description: "String manipulation, pattern matching, and anagrams.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: generateLessons("strings", 5)
    },
    {
      id: "dsa-mod-4",
      slug: "linked-list",
      title: "Linked List",
      description: "Singly, doubly, and circular linked lists implementations and problems.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: generateLessons("linked-list", 5)
    },
    {
      id: "dsa-mod-5",
      slug: "stack",
      title: "Stack",
      description: "LIFO principle, valid parentheses, and monotonic stacks.",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: generateLessons("stack", 4)
    },
    {
      id: "dsa-mod-6",
      slug: "queue",
      title: "Queue",
      description: "FIFO principle, standard queues, and circular queues.",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: generateLessons("queue", 4)
    },
    {
      id: "dsa-mod-7",
      slug: "hashing",
      title: "Hashing",
      description: "Hash maps, hash sets, and solving problems in O(1) time.",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: generateLessons("hashing", 4)
    },
    {
      id: "dsa-mod-8",
      slug: "trees",
      title: "Trees",
      description: "Binary Trees, BSTs, traversals (inorder, preorder, postorder), and views.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: generateLessons("trees", 6)
    },
    {
      id: "dsa-mod-9",
      slug: "heaps",
      title: "Heaps / Priority Queues",
      description: "Min-heap, max-heap, and the Top-K pattern.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: generateLessons("heaps", 4)
    },
    {
      id: "dsa-mod-10",
      slug: "graphs",
      title: "Graphs",
      description: "BFS, DFS, topological sort, and shortest path algorithms.",
      difficulty: "Advanced",
      estimatedMinutes: 105,
      lessons: generateLessons("graphs", 7)
    },
    {
      id: "dsa-mod-11",
      slug: "recursion-and-backtracking",
      title: "Recursion & Backtracking",
      description: "Solving problems by breaking them down into smaller subproblems.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: generateLessons("recursion-and-backtracking", 6)
    },
    {
      id: "dsa-mod-12",
      slug: "dynamic-programming",
      title: "Dynamic Programming",
      description: "Memoization, tabulation, knapsack, and LCS patterns.",
      difficulty: "Advanced",
      estimatedMinutes: 105,
      lessons: generateLessons("dynamic-programming", 7)
    }
  ]
};
