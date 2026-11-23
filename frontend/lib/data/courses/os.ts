import { Course, CourseLesson, CourseModule } from './types';
import { withTheory } from './utils';
import { osProcessesTheory } from './os-theory-processes';
import { osSchedulingTheory } from './os-theory-scheduling';
import { osSyncTheory } from './os-theory-sync';
import { osMemoryTheory } from './os-theory-memory';
import { osIntroductionLessons, processLessons, threadLessons } from './os-content-processes';
import { cpuSchedulingLessons, synchronizationLessons, deadlockLessons } from './os-content-scheduling';
import { memoryManagementLessons, virtualMemoryLessons, fileSystemLessons } from './os-content-memory';

const osTheory = { ...osProcessesTheory, ...osSchedulingTheory, ...osSyncTheory, ...osMemoryTheory };

const minutes = (lessons: CourseLesson[]) => lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);

function osModule(
  id: string,
  slug: string,
  title: string,
  description: string,
  difficulty: CourseModule["difficulty"],
  lessons: CourseLesson[]
): CourseModule {
  const withNotes = withTheory(lessons, osTheory);
  return { id, slug, title, description, difficulty, estimatedMinutes: minutes(withNotes), lessons: withNotes };
}

export const osCourse: Course = {
  id: "course-os",
  slug: "os",
  title: "Operating Systems",
  description: "How the OS runs programs and shares hardware: processes and threads, CPU scheduling numericals, synchronization, deadlocks and Banker's algorithm, paging and virtual memory, file systems and disk scheduling. Aligned with the GATE CS syllabus and placement interviews.",
  category: "Core CS",
  icon: "Cpu",
  displayOrder: 6,
  modules: [
    osModule("os-mod-1", "os-introduction", "OS Introduction",
      "What an OS does, types of OS, user vs kernel mode, system calls and kernel architectures.",
      "Beginner", osIntroductionLessons),
    osModule("os-mod-2", "processes", "Processes",
      "Process memory layout, the PCB, process states and schedulers, context switching, fork/exec, and IPC.",
      "Beginner", processLessons),
    osModule("os-mod-3", "threads", "Threads",
      "Threads vs processes, user vs kernel threads, threading models, concurrency vs parallelism and Amdahl's law.",
      "Intermediate", threadLessons),
    osModule("os-mod-4", "cpu-scheduling", "CPU Scheduling",
      "Scheduling criteria, FCFS, SJF, SRTF, Round Robin, priority, multilevel feedback queues and Linux CFS.",
      "Intermediate", cpuSchedulingLessons),
    osModule("os-mod-5", "synchronization", "Process Synchronization",
      "Race conditions, the critical-section problem, Peterson's solution, atomic instructions, semaphores, classic problems and monitors.",
      "Advanced", synchronizationLessons),
    osModule("os-mod-6", "deadlocks", "Deadlocks",
      "Coffman conditions, resource allocation graphs, prevention, Banker's algorithm, detection and recovery.",
      "Advanced", deadlockLessons),
    osModule("os-mod-7", "memory-management", "Memory Management",
      "Address binding, contiguous allocation and fragmentation, paging, the TLB, multilevel page tables and segmentation.",
      "Advanced", memoryManagementLessons),
    osModule("os-mod-8", "virtual-memory", "Virtual Memory",
      "Demand paging, page faults, FIFO / OPT / LRU replacement, Belady's anomaly and thrashing.",
      "Advanced", virtualMemoryLessons),
    osModule("os-mod-9", "file-systems", "File & I/O Systems",
      "Allocation methods, inodes, free-space management, disk scheduling, DMA and RAID.",
      "Intermediate", fileSystemLessons),
  ]
};
