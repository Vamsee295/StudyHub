import { LearningPath } from "@/types";

// Only the software engineer track has a roadmap and courses today. The others are listed as planned
// so nobody picks "AI / ML" and lands on Java fundamentals.

export const paths: LearningPath[] = [
  {
    slug: "software-engineer",
    name: "Software Engineer (SWE / SDE)",
    available: true,
    description:
      "Full-stack, backend or frontend roles. Heavy focus on algorithms, concurrency fundamentals, and system architecture.",
    tags: ["Core CS", "Pattern-based DSA", "System Design", "Capstone Project"],
    ctaLabel: "Explore SDE Track",
  },
  {
    slug: "ai-ml-engineer",
    name: "AI / ML Engineer",
    available: false,
    description:
      "From the math foundations to model architectures, training pipelines and inference optimization for production ML.",
    tags: ["Linear Algebra", "PyTorch", "Transformer Basics", "Model Serving"],
    ctaLabel: "Explore AI / ML Track",
  },
  {
    slug: "data-engineer",
    name: "Data Engineer",
    available: false,
    description:
      "Design streaming and batch pipelines. Distributed query execution, dimensional modeling, and warehouse internals.",
    tags: ["Advanced SQL", "Spark Basics", "Streaming", "Data Warehousing"],
    ctaLabel: "Explore Data Track",
  },
  {
    slug: "cloud-devops-engineer",
    name: "Cloud & DevOps Engineer",
    available: false,
    description:
      "Containerization, orchestration, GitOps workflows, Linux fundamentals, and modern cloud deployment pipelines.",
    tags: ["Linux Internals", "Docker & K8s", "IaC Basics", "CI/CD"],
    ctaLabel: "Explore Cloud Track",
  },
  {
    slug: "data-analyst",
    name: "Data Analyst",
    available: false,
    description:
      "Turn raw metrics into decisions. Rigorous SQL drills, statistics fundamentals, and business-impact case framing.",
    tags: ["Window Functions", "Python Pandas", "Dashboarding", "Case Interviews"],
    ctaLabel: "Explore Analytics Track",
  },
  {
    slug: "cybersecurity-specialist",
    name: "Cybersecurity Specialist",
    available: false,
    description:
      "Network defense, application security, applied cryptography, and vulnerability assessment fundamentals.",
    tags: ["Network Protocols", "Applied Crypto", "OWASP Top 10", "Security Audits"],
    ctaLabel: "Explore Cyber Track",
  },
];
