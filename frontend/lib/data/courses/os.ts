import { Course } from './types';
import { generateLessons } from './utils';

export const osCourse: Course = {
  id: "course-os",
  slug: "os",
  title: "Operating Systems",
  description: "Learn how the OS manages hardware, runs processes, and handles concurrency.",
  category: "Core CS",
  icon: "Cpu",
  displayOrder: 6,
  modules: [
    {
      id: "os-mod-1",
      slug: "os-introduction",
      title: "OS Introduction",
      description: "What is an OS, types of OS, and system calls.",
      difficulty: "Beginner",
      estimatedMinutes: 60,
      lessons: generateLessons("os-introduction", 4)
    },
    {
      id: "os-mod-2",
      slug: "processes",
      title: "Processes",
      description: "Process Control Block (PCB), states, and context switching.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: generateLessons("processes", 5)
    },
    {
      id: "os-mod-3",
      slug: "threads",
      title: "Threads",
      description: "User vs Kernel threads, multithreading, and Thread Control Block (TCB).",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: generateLessons("threads", 4)
    },
    {
      id: "os-mod-4",
      slug: "cpu-scheduling",
      title: "CPU Scheduling",
      description: "FCFS, SJF, Round Robin, and Priority scheduling algorithms.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: generateLessons("cpu-scheduling", 6)
    },
    {
      id: "os-mod-5",
      slug: "synchronization",
      title: "Process Synchronization",
      description: "Critical section problem, Mutexes, and Semaphores.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: generateLessons("synchronization", 6)
    },
    {
      id: "os-mod-6",
      slug: "deadlocks",
      title: "Deadlocks",
      description: "Coffman conditions, Banker's algorithm, prevention, and avoidance.",
      difficulty: "Advanced",
      estimatedMinutes: 75,
      lessons: generateLessons("deadlocks", 5)
    },
    {
      id: "os-mod-7",
      slug: "memory-management",
      title: "Memory Management",
      description: "Contiguous vs non-contiguous allocation, fragmentation, and paging.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: generateLessons("memory-management", 6)
    },
    {
      id: "os-mod-8",
      slug: "virtual-memory",
      title: "Virtual Memory",
      description: "Demand paging, page faults, and page replacement algorithms (LRU, FIFO).",
      difficulty: "Advanced",
      estimatedMinutes: 75,
      lessons: generateLessons("virtual-memory", 5)
    },
    {
      id: "os-mod-9",
      slug: "file-systems",
      title: "File & I/O Systems",
      description: "File attributes, directories, disk scheduling, and I/O management.",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: generateLessons("file-systems", 4)
    }
  ]
};
