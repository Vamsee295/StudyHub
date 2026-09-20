import {
  TemplateCategoryItem,
  TemplateItem,
  TemplateDraft,
  SavedTemplateRecord,
  TemplateWorkspaceData,
} from "@/types";

export const templatesTelemetry = {
  totalTemplates: 24,
  categories: 8,
  customized: 6,
  ready: 4,
};

export const templateCategories: TemplateCategoryItem[] = [
  { id: "all", label: "All Templates", count: 24 },
  { id: "resume", label: "Resume", count: 4 },
  { id: "cover-letter", label: "Cover Letter", count: 3 },
  { id: "interview", label: "Interview Script", count: 5 },
  { id: "hr", label: "HR & Behavioral", count: 4 },
  { id: "star", label: "STAR Matrix", count: 2 },
  { id: "outreach", label: "Cold Outreach", count: 3 },
  { id: "projects", label: "Project Docs", count: 3 },
];

export const inFlightDrafts: TemplateDraft[] = [
  {
    id: "draft-sde-resume",
    title: "SDE 1-Page Resume",
    description: "Tailored for Product MNC applications. Needs updated project metrics.",
    targetRole: "Software Engineer",
    progress: 75,
    lastEdited: "2 hours ago",
    href: "/templates/sde-resume",
  },
  {
    id: "draft-star-matrix",
    title: "STAR Behavioral Matrix",
    description: "Mapping core stories to conflict and deadline scenarios.",
    targetRole: "All Roles",
    progress: 40,
    lastEdited: "Yesterday",
    href: "/templates/star-matrix",
  },
  {
    id: "draft-linkedin-outreach",
    title: "Alumni Coffee Chat Outreach",
    description: "Cold message template for referring engineers.",
    targetRole: "SDE / Analyst",
    progress: 90,
    lastEdited: "3 days ago",
    href: "/templates/cold-outreach-pack",
  },
];

export const templateLibrary: TemplateItem[] = [
  {
    id: "sde-resume",
    title: "ATS Software Engineer 1-Page Resume",
    description: "A clean LaTeX-style resume base with machine-readable structure and metrics-driven bullet formatting.",
    category: "resume",
    targetRole: "Software Engineer",
    estimatedTime: "45 mins",
    tags: ["ATS-Optimized", "LaTeX Style"],
    badge: "Most Used",
    content: "sde-resume",
  },
  {
    id: "cold-outreach-pack",
    title: "Recruiter & Engineer Cold Messages",
    description: "Three outreach variants: a direct recruiter pitch, a technical inquiry to an engineer, and an alumni coffee-chat request.",
    category: "outreach",
    targetRole: "Any Role",
    estimatedTime: "15 mins",
    tags: ["LinkedIn", "Email"],
    content: "outreach-pack",
  },
  {
    id: "project-walkthrough",
    title: "2-Minute Project Walkthrough Script",
    description: "A structure for explaining a project without rambling: the problem, the architecture, the hardest bug, the measured result.",
    category: "interview",
    targetRole: "Software Engineer",
    estimatedTime: "30 mins",
    tags: ["Verbal", "System Design"],
    content: "project-walkthrough",
  },
  {
    id: "star-matrix",
    title: "STAR Method Behavioral Matrix",
    description: "Maps a handful of core stories to the classic behavioral prompts — conflict, deadlines, outages, disagreements.",
    category: "star",
    targetRole: "Any Role",
    estimatedTime: "60 mins",
    tags: ["Behavioral", "HR"],
    badge: "Highly Recommended",
    content: "star-matrix",
  },
  {
    id: "github-readme",
    title: "Production README Specification",
    description: "A documentation template with an architecture diagram slot, quickstart instructions, and coverage badges.",
    category: "projects",
    targetRole: "Software Engineer",
    estimatedTime: "20 mins",
    tags: ["GitHub", "Portfolio"],
    content: "github-readme",
  },
  {
    id: "offer-review",
    title: "CTC & Compensation Breakdown Sheet",
    description: "Demystifies a campus offer letter — base vs bonus, ESOP vesting, deductions, and an in-hand monthly estimate.",
    category: "hr",
    targetRole: "Any Role",
    estimatedTime: "10 mins",
    tags: ["Negotiation", "Offer"],
    content: "offer-review",
  },
  {
    id: "fresher-resume",
    title: "Fresher / Internship Compact Resume",
    description: "A one-page format built for candidates with limited work history but strong academic and personal projects.",
    category: "resume",
    targetRole: "Intern / Fresher",
    estimatedTime: "40 mins",
    tags: ["Entry Level", "Compact"],
    content: "fresher-resume",
  },
  {
    id: "linkedin-about",
    title: "Recruiter-Optimized About Section",
    description: "A short-form About template written to surface in recruiter keyword searches and highlight technical stack.",
    category: "outreach",
    targetRole: "Software Engineer",
    estimatedTime: "15 mins",
    tags: ["LinkedIn", "Personal Branding"],
    content: "linkedin-about",
  },
];

export const recommendedTemplates: TemplateItem[] = [
  {
    id: "sde-resume",
    title: "ATS Software Engineer 1-Page Resume",
    description: "You are applying for SDE roles. This LaTeX-style template ensures maximum ATS parsability.",
    category: "resume",
    targetRole: "Software Engineer",
    estimatedTime: "45 mins",
    tags: ["Role Match"],
    content: "sde-resume",
  },
  {
    id: "project-walkthrough",
    title: "2-Minute Project Walkthrough Script",
    description: "Essential for your upcoming technical interviews to articulate your MERN stack projects clearly.",
    category: "interview",
    targetRole: "Software Engineer",
    estimatedTime: "30 mins",
    tags: ["Interview Prep"],
    content: "project-walkthrough",
  },
];

export const myTemplatesList: SavedTemplateRecord[] = [
  {
    id: "st-1",
    templateName: "ATS Software Engineer 1-Page Resume",
    type: "Resume",
    targetRole: "SDE - Product MNC",
    lastUpdated: "Today, 10:45 AM",
    status: "Draft",
    href: "/templates/sde-resume",
  },
  {
    id: "st-2",
    templateName: "2-Minute Project Walkthrough Script",
    type: "Interview Script",
    targetRole: "SDE",
    lastUpdated: "Sep 15, 2026",
    status: "Ready",
    href: "/templates/project-walkthrough",
  },
  {
    id: "st-3",
    templateName: "STAR Method Behavioral Matrix",
    type: "Behavioral Grid",
    targetRole: "All Roles",
    lastUpdated: "Sep 10, 2026",
    status: "Draft",
    href: "/templates/star-matrix",
  },
  {
    id: "st-4",
    templateName: "Recruiter & Engineer Cold Messages",
    type: "Outreach Scripts",
    targetRole: "Networking",
    lastUpdated: "Aug 22, 2026",
    status: "Archived",
    href: "/templates/cold-outreach-pack",
  },
];

export const templateWorkspaces: Record<string, TemplateWorkspaceData> = {
  "sde-resume": {
    id: "sde-resume",
    title: "ATS Software Engineer 1-Page Resume",
    category: "Resume",
    fields: [
      { key: "fullName", label: "Full Name", placeholder: "e.g., Aditya Sharma", value: "Aditya Sharma" },
      { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210", value: "+91 98765 43210" },
      { key: "email", label: "Email Address", placeholder: "aditya@example.com", value: "aditya@example.com" },
      { key: "linkedin", label: "LinkedIn URL", placeholder: "linkedin.com/in/aditya", value: "linkedin.com/in/aditya" },
      { key: "github", label: "GitHub URL", placeholder: "github.com/aditya", value: "github.com/aditya" },
      { key: "university", label: "University Name", placeholder: "NIT Surathkal", value: "NIT Surathkal" },
      { key: "degree", label: "Degree", placeholder: "B.Tech in Computer Science", value: "B.Tech in Computer Science" },
      { key: "gradYear", label: "Graduation Year", placeholder: "2027", value: "2027" },
      { key: "cgpa", label: "CGPA", placeholder: "9.2", value: "9.2" },
      { key: "skills", label: "Technical Skills (Comma separated)", placeholder: "Java, React, SQL, AWS", value: "Java, TypeScript, React, Next.js, Node.js, SQL, AWS" },
      { key: "project1Name", label: "Project 1 Name", placeholder: "StudyHub Platform", value: "StudyHub Placement Engine" },
      { key: "project1Desc", label: "Project 1 Description", placeholder: "Built a learning platform", value: "Engineered a placement preparation platform serving 5,000+ students with real-time analytics and roadmap tracking." },
      { key: "project1Tech", label: "Project 1 Tech Stack", placeholder: "React, Node.js, MongoDB", value: "Next.js, TailwindCSS, TypeScript, Vercel" },
    ],
    structure: [
      { section: "Header", body: "[fullName]\n[email] | [phone]\n[linkedin] | [github]" },
      { section: "Education", body: "**[university]**\n[degree] | CGPA: [cgpa] | Expected [gradYear]" },
      { section: "Skills", body: "**Languages & Technologies:** [skills]" },
      { section: "Projects", body: "**[project1Name]** | *[project1Tech]*\n- [project1Desc]\n- Improved page load speed by 40% through server-side rendering and edge caching.\n- Designed responsive UI components adopted by 3 other internal tools." }
    ]
  },
  "project-walkthrough": {
    id: "project-walkthrough",
    title: "2-Minute Project Walkthrough Script",
    category: "Interview",
    fields: [
      { key: "projectName", label: "Project Name", placeholder: "e.g., E-commerce API", value: "" },
      { key: "problem", label: "The Problem", placeholder: "What did you solve?", value: "" },
      { key: "architecture", label: "Core Architecture", placeholder: "Key tech choices", value: "" },
      { key: "challenge", label: "Hardest Challenge", placeholder: "What was difficult?", value: "" },
      { key: "result", label: "Impact / Result", placeholder: "Metrics or outcome", value: "" }
    ],
    structure: [
      { section: "1. The Context (20s)", body: "I built **[projectName]** to solve **[problem]**." },
      { section: "2. The Architecture (30s)", body: "For the tech stack, I chose **[architecture]** because it allowed for rapid scaling and reliable data handling." },
      { section: "3. The Challenge (40s)", body: "The hardest technical challenge I faced was **[challenge]**. I solved this by implementing..." },
      { section: "4. The Result (30s)", body: "Ultimately, the project resulted in **[result]**. If I were to build it again, I would optimize the database queries further." }
    ]
  },
  "star-matrix": {
    id: "star-matrix",
    title: "STAR Method Behavioral Matrix",
    category: "Behavioral",
    fields: [
      { key: "story1Name", label: "Story 1 Name", placeholder: "e.g., Database Migration", value: "" },
      { key: "situation1", label: "Situation", placeholder: "Context of the story", value: "" },
      { key: "task1", label: "Task", placeholder: "What was your responsibility?", value: "" },
      { key: "action1", label: "Action", placeholder: "What steps did you take?", value: "" },
      { key: "result1", label: "Result", placeholder: "What was the measurable outcome?", value: "" }
    ],
    structure: [
      { section: "Story: [story1Name]", body: "**Situation:** [situation1]\n\n**Task:** [task1]\n\n**Action:** [action1]\n\n**Result:** [result1]" }
    ]
  }
};
