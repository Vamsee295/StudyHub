// Interactive labs: browser-only simulators linked from Learn lessons.
export interface LabEntry {
  slug: string;
  title: string;
  description: string;
  icon: "chart" | "cpu" | "layers" | "network" | "gauge";
  course: string;
  lessons: { subject: string; slug: string; title: string }[];
}

export const LABS: LabEntry[] = [
  {
    slug: "big-o", title: "Big-O Growth Visualizer", icon: "chart", course: "DSA",
    description: "Compare how O(1) to O(2ⁿ) grow as input size rises, and see which complexities fit a time limit.",
    lessons: [
      { subject: "dsa", slug: "big-o-notation", title: "Big-O Notation" },
      { subject: "dsa", slug: "problem-solving-framework", title: "How to Approach Any DSA Problem" },
    ],
  },
  {
    slug: "cpu-scheduling", title: "CPU Scheduling Simulator", icon: "cpu", course: "Operating Systems",
    description: "Run FCFS, SJF, SRTF, Round Robin and Priority on your own processes, with a Gantt chart and timing table.",
    lessons: [
      { subject: "os", slug: "fcfs-sjf-srtf", title: "FCFS, SJF and SRTF" },
      { subject: "os", slug: "round-robin-and-priority", title: "Round Robin and Priority Scheduling" },
    ],
  },
  {
    slug: "page-replacement", title: "Page Replacement Simulator", icon: "layers", course: "Operating Systems",
    description: "Step through FIFO, LRU and Optimal on any reference string, count faults, and reproduce Belady's anomaly.",
    lessons: [
      { subject: "os", slug: "page-replacement-algorithms", title: "Page Replacement Algorithms" },
      { subject: "os", slug: "demand-paging-page-faults", title: "Demand Paging and Page Faults" },
    ],
  },
  {
    slug: "subnet-calculator", title: "Subnet Calculator", icon: "network", course: "Computer Networks",
    description: "Turn any IPv4 CIDR into its mask, network, broadcast and host range, and split it into equal subnets.",
    lessons: [
      { subject: "computer-networks", slug: "subnet-masks-and-cidr", title: "Subnet Masks and CIDR" },
      { subject: "computer-networks", slug: "subnetting-and-vlsm", title: "Subnetting and VLSM" },
    ],
  },
  {
    slug: "capacity-estimator", title: "Capacity Estimator", icon: "gauge", course: "System Design",
    description: "Back-of-the-envelope maths for system design: QPS, storage, bandwidth and server counts from a few inputs.",
    lessons: [
      { subject: "system-design", slug: "back-of-the-envelope-estimation", title: "Back-of-the-Envelope Estimation" },
      { subject: "system-design", slug: "design-url-shortener", title: "Design a URL Shortener" },
    ],
  },
];

export const labForLesson = (subject: string, lessonSlug: string) =>
  LABS.filter((l) => l.lessons.some((x) => x.subject === subject && x.slug === lessonSlug));
