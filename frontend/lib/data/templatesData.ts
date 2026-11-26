// Templates on /templates. Every template opens in the editor at /templates/[id]: fill the fields,
// watch the document update, then copy, download or save it.
//
// The structure and advice in each template come from public guides credited in `sources` (checked live
// on 2026-11-26). Placeholders show what to write. Resumes are the exception: they open as complete
// sample resumes of fictional students, which the student rewrites with their own details.
//
// Body syntax (kept tiny so the preview can render it safely without HTML):
//   [fieldKey]   → replaced with the field's value
//   # / ## text  → headings,  - text → bullet,  **text** → bold,  blank line → paragraph break

import { SAMPLE_RESUMES } from "@/lib/data/sampleResumes";

export type TemplateCategory = "resume" | "outreach" | "interview" | "offer" | "projects";

export interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  optional?: boolean;
}

export interface TemplateSource {
  label: string;
  url: string;
}

export interface TemplateDef {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  minutes: number;
  /** Advice drawn from the sources, shown beside the editor. */
  tips: string[];
  sources: TemplateSource[];
  fields: TemplateField[];
  body: string;
}

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string; blurb: string }[] = [
  { id: "resume", label: "Resume", blurb: "One-page resumes that recruiters and tracking software can read." },
  { id: "outreach", label: "Applications & outreach", blurb: "Cover letters, referral requests and follow-up emails." },
  { id: "interview", label: "Interview", blurb: "Scripts for the questions every interview asks." },
  { id: "offer", label: "Offer", blurb: "Evaluating and negotiating an offer." },
  { id: "projects", label: "Projects & profile", blurb: "READMEs and profiles that make your work easy to judge." },
];

const TIH = (path: string, label: string): TemplateSource => ({ label: `Tech Interview Handbook: ${label}`, url: `https://www.techinterviewhandbook.org/${path}/` });

// Resume templates are complete sample resumes (lib/data/sampleResumes.ts) edited in place, not fill-in fields.
const RESUME_TIPS = [
  "Replace every line with your own. Keep the structure: it is what recruiters and tracking software expect.",
  "Start every bullet with a strong verb and end with a result: what changed because of your work.",
  "Use real numbers (users, time saved, percentage improved). Never invent them.",
  "Keep it to one page, one column, plain headings and no tables or images.",
];
const RESUME_SOURCES: TemplateSource[] = [
  { label: "Jake's Resume (GitHub, MIT)", url: "https://github.com/jakegut/resume" },
  TIH("resume", "Resume guide"),
  { label: "Harvard Career Services: Create a strong resume", url: "https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/" },
];
const RESUME_TEMPLATES: TemplateDef[] = SAMPLE_RESUMES.map((s) => ({
  id: s.id,
  title: `${s.title} Resume`,
  category: "resume",
  description: s.description,
  minutes: 30,
  tips: RESUME_TIPS,
  sources: RESUME_SOURCES,
  fields: [],
  body: "",
}));

export const TEMPLATES: TemplateDef[] = [
  ...RESUME_TEMPLATES,
  {
    id: "cover-letter",
    title: "Cover Letter",
    category: "outreach",
    description: "A short, specific letter in three parts: why this role, what you bring (with proof), and a clear close.",
    minutes: 30,
    tips: [
      "Address a person if you can find their name; otherwise use the hiring team.",
      "Open with the exact role and one reason you want this company specifically.",
      "Give one concrete example of your work that matches the job description, rather than repeating your resume.",
      "Keep it under a page; three or four short paragraphs is enough.",
    ],
    sources: [{ label: "Indeed: How to write a cover letter", url: "https://www.indeed.com/career-advice/resumes-cover-letters/how-to-write-a-cover-letter" }],
    fields: [
      { key: "name", label: "Your name", placeholder: "Your Name" },
      { key: "contact", label: "Your email and phone", placeholder: "you@example.com · +91 90000 00000" },
      { key: "recipient", label: "Recipient", placeholder: "Hiring Manager, Company" },
      { key: "role", label: "Role", placeholder: "Software Engineer (New Grad)" },
      { key: "company", label: "Company", placeholder: "Company" },
      { key: "why", label: "Why this company (one sentence)", placeholder: "your work on … is exactly the kind of problem I want to solve", multiline: true },
      { key: "proof", label: "Your strongest relevant example", placeholder: "In my project …, I built … which …", multiline: true },
      { key: "skills", label: "Skills that match the job description", placeholder: "Java, REST APIs and SQL" },
    ],
    body: `[name]
[contact]

Dear [recipient],

I am applying for the [role] position at [company]. I am drawn to [company] because [why].

[proof]

The role asks for [skills], which I have used in my coursework and projects. I would welcome the chance to bring the same care to your team.

Thank you for your time and consideration. I look forward to hearing from you.

Sincerely,
[name]`,
  },
  {
    id: "referral-request",
    title: "Referral Request (LinkedIn or email)",
    category: "outreach",
    description: "A short message to an alumnus or employee asking for a referral, built the way university career offices recommend: connection first, then a specific ask.",
    minutes: 10,
    tips: [
      "Keep it short. Colorado State's career office cites under 75 words for outreach messages.",
      "Say how you found the person or what you share (same college, same club) in the first line.",
      "Name the exact role and include the job link or ID so they can refer you in one step.",
      "Make it easy to say yes: attach your resume and thank them either way.",
    ],
    sources: [
      { label: "Colorado State University: Guide to writing outreach emails", url: "https://bizcareers.colostate.edu/resources/guide-to-writing-outreach-emails/" },
      { label: "University of Georgia Career Center: 5 essential email templates", url: "https://career.uga.edu/news/5_essential_e_mail_templates_for_your_job_search" },
    ],
    fields: [
      { key: "theirName", label: "Their first name", placeholder: "Priya" },
      { key: "connection", label: "How you're connected", placeholder: "a fellow alumnus of your college (2022 batch)" },
      { key: "yourName", label: "Your name", placeholder: "Your Name" },
      { key: "you", label: "One line about you", placeholder: "a final-year CSE student who builds backend services in Java" },
      { key: "role", label: "Role and job ID or link", placeholder: "Software Engineer I, job ID 12345" },
      { key: "company", label: "Company", placeholder: "Company" },
    ],
    body: `Hi [theirName],

I'm [yourName], [you]. I found your profile as [connection].

I'm applying for the [role] role at [company] and would be grateful if you'd consider referring me. My resume is attached, and I'm happy to answer any questions.

Thank you either way!
[yourName]`,
  },
  {
    id: "recruiter-email",
    title: "Email to a Recruiter",
    category: "outreach",
    description: "A cold email to a recruiter for a specific opening, with your strongest proof point in the first lines.",
    minutes: 10,
    tips: [
      "Write a subject line that says the role and who you are, so it is easy to find later.",
      "Lead with your best evidence (a project, an internship, a contest result), not your life story.",
      "Close with one clear request, such as a short call or being considered for the role.",
    ],
    sources: [
      { label: "University of Georgia Career Center: 5 essential email templates", url: "https://career.uga.edu/news/5_essential_e_mail_templates_for_your_job_search" },
      { label: "Colorado State University: Guide to writing outreach emails", url: "https://bizcareers.colostate.edu/resources/guide-to-writing-outreach-emails/" },
    ],
    fields: [
      { key: "recruiter", label: "Recruiter's first name", placeholder: "Arjun" },
      { key: "role", label: "Role", placeholder: "Software Engineer Intern (Summer 2027)" },
      { key: "company", label: "Company", placeholder: "Company" },
      { key: "yourName", label: "Your name", placeholder: "Your Name" },
      { key: "you", label: "Who you are", placeholder: "a third-year Computer Science student at your college" },
      { key: "proof", label: "Your strongest proof point", placeholder: "I built …, which is used by … students every week", multiline: true },
    ],
    body: `**Subject:** [role] application: [yourName]

Hi [recruiter],

I'm [yourName], [you], and I'm interested in the [role] position at [company].

[proof]

I've attached my resume. Would you be open to considering me for this role, or pointing me to the right person? Thank you for your time.

Best regards,
[yourName]`,
  },
  {
    id: "thank-you-email",
    title: "Thank-you Email After an Interview",
    category: "outreach",
    description: "A short, personal note to each interviewer, sent the same day or the next.",
    minutes: 10,
    tips: [
      "Send it within 24 hours, and send a separate note to each interviewer.",
      "Mention one specific thing you discussed; a generic note is barely better than none.",
      "Proofread names and titles carefully.",
    ],
    sources: [
      { label: "Northeastern University Career Design: Thank-you notes", url: "https://careers.northeastern.edu/resources/thank-you-notes-2/" },
      { label: "Dartmouth Center for Career Design: Interview and networking follow-up", url: "https://careerdesign.dartmouth.edu/resources/interview-and-networking-follow-up/" },
    ],
    fields: [
      { key: "interviewer", label: "Interviewer's name", placeholder: "Ms. Rao" },
      { key: "role", label: "Role", placeholder: "Software Engineer" },
      { key: "company", label: "Company", placeholder: "Company" },
      { key: "detail", label: "Something specific you discussed", placeholder: "how your team moved the payments service to event-driven processing", multiline: true },
      { key: "yourName", label: "Your name", placeholder: "Your Name" },
    ],
    body: `**Subject:** Thank you: [role] interview

Dear [interviewer],

Thank you for speaking with me today about the [role] role at [company]. I especially enjoyed our conversation about [detail]. It made me even more excited about the team.

Please let me know if I can share anything else. I look forward to hearing about the next steps.

Best regards,
[yourName]`,
  },
  {
    id: "follow-up-email",
    title: "Follow-up on Application Status",
    category: "outreach",
    description: "A polite check-in when the date you were given has passed and you haven't heard back.",
    minutes: 5,
    tips: [
      "Wait until the date you were told has passed, then allow a few working days.",
      "Keep it to three or four lines and stay positive.",
      "If you have another offer with a deadline, say so politely; it is useful information for them.",
    ],
    sources: [{ label: "Dartmouth Center for Career Design: Interview and networking follow-up", url: "https://careerdesign.dartmouth.edu/resources/interview-and-networking-follow-up/" }],
    fields: [
      { key: "name", label: "Recipient's name", placeholder: "Arjun" },
      { key: "role", label: "Role", placeholder: "Software Engineer" },
      { key: "date", label: "When you interviewed or applied", placeholder: "on 12 November" },
      { key: "deadline", label: "Any deadline you're facing (optional)", placeholder: "I have another offer that needs an answer by 5 December.", optional: true },
      { key: "yourName", label: "Your name", placeholder: "Your Name" },
    ],
    body: `**Subject:** Following up: [role] application

Hi [name],

I hope you're well. I interviewed for the [role] role [date] and wanted to ask whether there is any update on the next steps. [deadline]

I'm still very interested in the role. Thank you for your time.

Best,
[yourName]`,
  },
  {
    id: "self-introduction",
    title: "\"Tell Me About Yourself\" Script",
    category: "interview",
    description: "A 60–90 second answer in three parts, present, past and future, so the interviewer hears who you are and why you're here.",
    minutes: 20,
    tips: [
      "Aim for 60 to 90 seconds out loud. Time yourself.",
      "Present: who you are now. Past: the one or two things that prove it. Future: why this role is the next step.",
      "End on the role, so the conversation naturally moves to your fit.",
    ],
    sources: [TIH("self-introduction", "Self introduction")],
    fields: [
      { key: "present", label: "Present: who you are now", placeholder: "I'm a final-year Computer Science student at …, focusing on backend development.", multiline: true },
      { key: "past", label: "Past: one or two highlights", placeholder: "Last summer I interned at …, where I built …. I also led … in our coding club.", multiline: true },
      { key: "future", label: "Future: why this role", placeholder: "I'm excited about this role because …", multiline: true },
    ],
    body: `## Present (about 20 seconds)
[present]

## Past (about 40 seconds)
[past]

## Future (about 20 seconds)
[future]`,
  },
  {
    id: "star-story",
    title: "STAR Behavioural Story",
    category: "interview",
    description: "One story in Situation, Task, Action, Result, the format Amazon and most companies use for behavioural questions.",
    minutes: 20,
    tips: [
      "Spend most of the time on Action, in the first person: what you did, not what the team did.",
      "End with a Result you can measure, plus what you learned.",
      "Prepare five or six stories (conflict, failure, deadline, leadership, learning fast); most questions map to one of them.",
    ],
    sources: [
      { label: "Amazon: Interviewing at Amazon (STAR method)", url: "https://www.amazon.jobs/content/en/how-we-hire/interviewing-at-amazon" },
      TIH("behavioral-interview", "Behavioral interviews"),
    ],
    fields: [
      { key: "title", label: "Story name", placeholder: "The demo-day outage" },
      { key: "question", label: "Questions it answers", placeholder: "Tell me about a time you worked under pressure / fixed a mistake" },
      { key: "situation", label: "Situation", placeholder: "Context in one or two sentences.", multiline: true },
      { key: "task", label: "Task", placeholder: "What you were responsible for.", multiline: true },
      { key: "action", label: "Action", placeholder: "The steps you took, in the first person.", multiline: true },
      { key: "result", label: "Result", placeholder: "What happened, with a number if you have one, and what you learned.", multiline: true },
    ],
    body: `## [title]
**Use for:** [question]

**Situation:** [situation]

**Task:** [task]

**Action:** [action]

**Result:** [result]`,
  },
  {
    id: "project-walkthrough",
    title: "Project Walkthrough (two minutes)",
    category: "interview",
    description: "How to explain a project without rambling: the problem, your design, the hardest part, and the result.",
    minutes: 25,
    tips: [
      "Lead with the problem and who it was for, not the tech stack.",
      "For each technology, be ready to say why you chose it over an alternative.",
      "Interviewers often follow up on the hardest bug and on what you'd change with ten times the users.",
    ],
    sources: [TIH("behavioral-interview", "Behavioral interviews"), TIH("resume", "Resume guide")],
    fields: [
      { key: "name", label: "Project name", placeholder: "Campus Marketplace" },
      { key: "problem", label: "Problem and users", placeholder: "Students had no safe way to buy and sell used books on campus.", multiline: true },
      { key: "design", label: "Design and why", placeholder: "Next.js front end, FastAPI and PostgreSQL, because …", multiline: true },
      { key: "hardest", label: "Hardest part and how you solved it", placeholder: "Two buyers could reserve the same item; I fixed it with a database row lock …", multiline: true },
      { key: "result", label: "Result", placeholder: "Used by … students; … listings in the first month.", multiline: true },
      { key: "next", label: "What you'd improve", placeholder: "Add search indexing and move images to object storage.", multiline: true },
    ],
    body: `## [name]

**The problem (20 s):** [problem]

**My design (40 s):** [design]

**The hardest part (40 s):** [hardest]

**The result (20 s):** [result]

**What I'd change next:** [next]`,
  },
  {
    id: "questions-to-ask",
    title: "Questions to Ask the Interviewer",
    category: "interview",
    description: "A short list for the end of the interview, chosen for the person in front of you.",
    minutes: 10,
    tips: [
      "Ask two or three. Choose questions this interviewer can actually answer (an engineer about the work, a manager about growth).",
      "Avoid questions answered on the company's website.",
      "Listening to the answer and following up is worth more than a clever question.",
    ],
    sources: [TIH("final-questions", "Final questions")],
    fields: [
      { key: "team", label: "Team or product", placeholder: "the payments team" },
      { key: "role", label: "Role", placeholder: "new graduate engineer" },
    ],
    body: `## About the work
- What does a typical week look like for a [role] on [team]?
- What is the team working on right now, and what is the biggest challenge in it?

## About growth
- How do new engineers get feedback, and how is good work recognised?
- What does success look like in the first six months?

## About the team
- How does the team decide what to build and how to build it?
- What do you enjoy most about working on [team]?`,
  },
  {
    id: "negotiation-email",
    title: "Offer Negotiation Email",
    category: "offer",
    description: "A polite, specific request to revisit an offer, grounded in facts such as a competing offer or market data.",
    minutes: 15,
    tips: [
      "Thank them and confirm your enthusiasm first; negotiation works best when they know you want to join.",
      "Base the request on facts (a competing offer, published ranges), not on what you need.",
      "Ask for a specific number or change, and know which parts are negotiable (joining bonus, base pay, start date).",
    ],
    sources: [TIH("negotiation", "Negotiation"), TIH("understanding-compensation", "Understanding compensation")],
    fields: [
      { key: "name", label: "Recruiter's name", placeholder: "Arjun" },
      { key: "role", label: "Role", placeholder: "Software Engineer" },
      { key: "company", label: "Company", placeholder: "Company" },
      { key: "reason", label: "The fact behind your request", placeholder: "I have another offer with a base salary of …", multiline: true },
      { key: "ask", label: "What you're asking for", placeholder: "a base of … or a joining bonus of …" },
      { key: "yourName", label: "Your name", placeholder: "Your Name" },
    ],
    body: `**Subject:** [role] offer

Hi [name],

Thank you again for the offer for the [role] role. I'm excited about [company] and the team.

Before I decide, I wanted to share some context: [reason]

Would it be possible to revisit the offer to [ask]? If we can get there, I'd be glad to accept.

Thank you for your help.
[yourName]`,
  },
  {
    id: "project-readme",
    title: "Project README",
    category: "projects",
    description: "The section structure of Best-README-Template: what the project is, how to run it, and how it's built.",
    minutes: 20,
    tips: [
      "The first screen should answer: what is this, and why would I care? Add a screenshot or GIF.",
      "Getting started must work on a fresh machine. Test it by following your own steps.",
      "A short architecture note shows reviewers how you think.",
    ],
    sources: [
      { label: "Best-README-Template (GitHub, Unlicense)", url: "https://github.com/othneildrew/Best-README-Template" },
      { label: "Make a README", url: "https://www.makeareadme.com/" },
    ],
    fields: [
      { key: "name", label: "Project name", placeholder: "Campus Marketplace" },
      { key: "tagline", label: "One-line description", placeholder: "Buy and sell used books with students at your college." },
      { key: "demo", label: "Live demo link", placeholder: "https://your-app.vercel.app", optional: true },
      { key: "stack", label: "Built with", placeholder: "Next.js, FastAPI, PostgreSQL" },
      { key: "install", label: "Setup commands (one per line)", placeholder: "git clone https://github.com/you/repo\nnpm install\nnpm run dev", multiline: true },
      { key: "features", label: "Features (one per line)", placeholder: "Listings with photos\nChat between buyer and seller", multiline: true },
      { key: "architecture", label: "How it works", placeholder: "The front end calls a REST API; listings live in PostgreSQL …", multiline: true },
      { key: "license", label: "License", placeholder: "MIT" },
    ],
    body: `# [name]
[tagline]

**Live demo:** [demo]

## Built with
[stack]

## Features
- [features]

## Getting started
- [install]

## How it works
[architecture]

## License
Distributed under the [license] License.`,
  },
  {
    id: "linkedin-about",
    title: "LinkedIn About Section",
    category: "projects",
    description: "A short About section in the first person: what you do, what you've built, and what you're looking for.",
    minutes: 15,
    tips: [
      "Only the first two lines show before \"see more\", so put what you do and what you want there.",
      "Mention the skills and roles recruiters search for, where they are true for you.",
      "End with what you're open to and how to reach you.",
    ],
    sources: [TIH("resume", "Resume guide")],
    fields: [
      { key: "headline", label: "What you do (first line)", placeholder: "Final-year CSE student building backend systems in Java and Go." },
      { key: "built", label: "What you've built or done", placeholder: "Built … used by …; interned at … where I …", multiline: true },
      { key: "skills", label: "Skills", placeholder: "Java, Spring Boot, PostgreSQL, Docker, AWS" },
      { key: "looking", label: "What you're looking for", placeholder: "Open to software engineering roles from June 2027." },
      { key: "contact", label: "How to reach you", placeholder: "you@example.com" },
    ],
    body: `[headline]

[built]

**Skills:** [skills]

[looking] Reach me at [contact].`,
  },
];

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id);

/** Open-source template projects. Stars and last update are fetched live from the GitHub API. */
export interface GithubTemplateRepo {
  repo: string; // owner/name
  title: string;
  kind: string;
  description: string;
}

export const GITHUB_TEMPLATE_REPOS: GithubTemplateRepo[] = [
  { repo: "reactive-resume/reactive-resume", title: "Reactive Resume", kind: "Resume builder", description: "A free, open-source resume builder in the browser, with many templates and PDF export." },
  { repo: "xitanggg/open-resume", title: "OpenResume", kind: "Resume builder", description: "Builds an ATS-friendly resume and includes a parser to test how software reads yours." },
  { repo: "rendercv/rendercv", title: "RenderCV", kind: "Resume as code", description: "Write your CV in YAML and get a typeset PDF; easy to keep in Git." },
  { repo: "posquit0/Awesome-CV", title: "Awesome CV", kind: "LaTeX resume", description: "A polished LaTeX resume and cover-letter template." },
  { repo: "sb2nov/resume", title: "sb2nov/resume", kind: "LaTeX resume", description: "A widely used single-page software engineer resume in LaTeX." },
  { repo: "jakegut/resume", title: "Jake's Resume", kind: "LaTeX resume", description: "The single-column layout behind countless student resumes (the repository is archived but still used)." },
  { repo: "othneildrew/Best-README-Template", title: "Best-README-Template", kind: "README", description: "A complete README skeleton: badges, screenshots, getting started, roadmap." },
  { repo: "matiassingers/awesome-readme", title: "Awesome README", kind: "README examples", description: "A curated list of excellent READMEs to learn from." },
  { repo: "yangshun/tech-interview-handbook", title: "Tech Interview Handbook", kind: "Interview guide", description: "Resume, behavioural and negotiation guides used by many of these templates." },
];
