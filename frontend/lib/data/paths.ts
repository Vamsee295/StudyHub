import { LearningPath } from "@/types";

export const paths: LearningPath[] = [
  {
    slug: "software-engineer",
    name: "Software Engineer (SWE / SDE)",
    weeks: "14 Weeks Prep",
    resourceCount: "120+ resources",
    description:
      "Full-stack, backend or frontend roles. Heavy focus on algorithms, concurrency fundamentals, and system architecture.",
    tags: ["Core CS", "Pattern-based DSA", "System Design", "Capstone Project"],
    ctaLabel: "Explore SDE Track",
  },
  {
    slug: "ai-ml-engineer",
    name: "AI / ML Engineer",
    weeks: "16 Weeks Prep",
    resourceCount: "95 resources",
    description:
      "From the math foundations to model architectures, training pipelines and inference optimization for production ML.",
    tags: ["Linear Algebra", "PyTorch", "Transformer Basics", "Model Serving"],
    ctaLabel: "Explore AI / ML Track",
  },
  {
    slug: "data-engineer",
    name: "Data Engineer",
    weeks: "12 Weeks Prep",
    resourceCount: "80 resources",
    description:
      "Design streaming and batch pipelines. Distributed query execution, dimensional modeling, and warehouse internals.",
    tags: ["Advanced SQL", "Spark Basics", "Streaming", "Data Warehousing"],
    ctaLabel: "Explore Data Track",
  },
  {
    slug: "cloud-devops-engineer",
    name: "Cloud & DevOps Engineer",
    weeks: "10 Weeks Prep",
    resourceCount: "65 resources",
    description:
      "Containerization, orchestration, GitOps workflows, Linux fundamentals, and modern cloud deployment pipelines.",
    tags: ["Linux Internals", "Docker & K8s", "IaC Basics", "CI/CD"],
    ctaLabel: "Explore Cloud Track",
  },
  {
    slug: "data-analyst",
    name: "Data Analyst",
    weeks: "8 Weeks Prep",
    resourceCount: "50 resources",
    description:
      "Turn raw metrics into decisions. Rigorous SQL drills, statistics fundamentals, and business-impact case framing.",
    tags: ["Window Functions", "Python Pandas", "Dashboarding", "Case Interviews"],
    ctaLabel: "Explore Analytics Track",
  },
  {
    slug: "cybersecurity-specialist",
    name: "Cybersecurity Specialist",
    weeks: "12 Weeks Prep",
    resourceCount: "70 resources",
    description:
      "Network defense, application security, applied cryptography, and vulnerability assessment fundamentals.",
    tags: ["Network Protocols", "Applied Crypto", "OWASP Top 10", "Security Audits"],
    ctaLabel: "Explore Cyber Track",
  },
];
