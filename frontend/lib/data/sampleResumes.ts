// Complete sample resumes, one per role. The people are fictional and written by StudyHub as worked
// examples of ATS-friendly writing: plain headings, one column, action-verb bullets with results.
// Students open one, replace the content with their own (by hand or with AI), and keep the structure.
import type { ResumeDoc } from "@/lib/resume";

export interface SampleResume {
  id: string;
  title: string;
  description: string;
  doc: ResumeDoc;
}

const edu = (college: string, degree: string, dates: string, extra: string[] = []) => ({
  title: "Education",
  entries: [{ title: college, date: dates, subtitle: degree, bullets: extra }],
});

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: "sde-resume",
    title: "Software Engineer",
    description: "Internship plus two strong projects. The classic layout for SDE roles at product companies.",
    doc: {
      name: "Aarav Mehta",
      contacts: ["aarav.mehta@example.com", "+91 98765 43210", "linkedin.com/in/aarav-mehta", "github.com/aaravmehta"],
      sections: [
        edu("National Institute of Technology, Trichy", "B.Tech, Computer Science and Engineering · CGPA 8.7 / 10", "2022 – 2026"),
        {
          title: "Experience",
          entries: [
            {
              title: "Software Engineering Intern, Zentro Payments",
              date: "May 2025 – Jul 2025",
              subtitle: "Bengaluru · Java, Spring Boot, PostgreSQL",
              bullets: [
                "Built a refund reconciliation service in Spring Boot that matched 40,000 daily transactions, replacing a manual spreadsheet process",
                "Reduced p95 latency of the merchant lookup API from 420 ms to 95 ms by adding a composite index and Redis caching",
                "Wrote 60+ JUnit tests and raised module coverage from 48% to 81%, catching two currency-rounding bugs before release",
              ],
            },
          ],
        },
        {
          title: "Projects",
          entries: [
            {
              title: "CodeArena",
              date: "Jan 2025 – Apr 2025",
              subtitle: "React, Node.js, Docker, PostgreSQL",
              bullets: [
                "Designed an online judge that runs C++, Java and Python submissions in isolated Docker containers with time and memory limits",
                "Scaled to 1,200 users during a college contest by queueing submissions with BullMQ across three worker processes",
              ],
            },
            {
              title: "Distributed Key-Value Store",
              date: "Aug 2024 – Oct 2024",
              subtitle: "Go, gRPC, Raft",
              bullets: [
                "Implemented leader election and log replication from the Raft paper; the cluster kept serving reads with one of three nodes down",
                "Benchmarked 18,000 writes per second on a 3-node local cluster and documented the trade-offs in a public README",
              ],
            },
          ],
        },
        {
          title: "Technical Skills",
          lines: [
            { label: "Languages", text: "Java, C++, Python, Go, JavaScript, SQL" },
            { label: "Frameworks", text: "Spring Boot, React, Node.js, Express" },
            { label: "Tools", text: "Git, Docker, PostgreSQL, Redis, Linux, AWS (EC2, S3)" },
            { label: "Fundamentals", text: "Data structures, algorithms, OOP, operating systems, DBMS, computer networks" },
          ],
        },
        {
          title: "Achievements",
          lines: [
            { text: "Codeforces Expert (max rating 1720); solved 650+ problems across LeetCode and Codeforces" },
            { text: "Finalist, Smart India Hackathon 2024 (top 5 of 210 teams in the software track)" },
          ],
        },
      ],
    },
  },
  {
    id: "frontend-resume",
    title: "Frontend Developer",
    description: "Leads with shipped UI work, performance numbers and accessibility. For React and web roles.",
    doc: {
      name: "Diya Sharma",
      contacts: ["diya.sharma@example.com", "+91 98765 43211", "linkedin.com/in/diya-sharma", "github.com/diyasharma", "diyasharma.dev"],
      summary: "Frontend developer who builds fast, accessible React interfaces; shipped two production apps used by 10,000+ people.",
      sections: [
        edu("Vellore Institute of Technology", "B.Tech, Information Technology · CGPA 8.9 / 10", "2022 – 2026"),
        {
          title: "Experience",
          entries: [
            {
              title: "Frontend Intern, Kirana Cloud",
              date: "Jun 2025 – Aug 2025",
              subtitle: "Remote · React, TypeScript, Tailwind CSS",
              bullets: [
                "Rebuilt the order dashboard in React and TypeScript, cutting Largest Contentful Paint from 3.8 s to 1.6 s on mid-range phones",
                "Created 24 reusable components with Storybook docs, now used across three internal apps",
                "Fixed 37 accessibility issues found with axe and screen-reader testing, bringing the checkout flow to WCAG 2.1 AA",
              ],
            },
          ],
        },
        {
          title: "Projects",
          entries: [
            {
              title: "StudyBuddy",
              date: "2025",
              subtitle: "Next.js, TypeScript, Supabase",
              bullets: [
                "Developed a shared study-planner PWA with offline support; 2,300 students signed up in the first semester",
                "Added real-time sync with Supabase channels so edits appear on every device in under a second",
              ],
            },
            {
              title: "Pixel Perfect",
              date: "2024",
              subtitle: "React, Canvas API, Vite",
              bullets: ["Built a browser image editor with layers, undo history and export, handling 20 MP images at 60 fps"],
            },
          ],
        },
        {
          title: "Technical Skills",
          lines: [
            { label: "Languages", text: "JavaScript, TypeScript, HTML, CSS, Python" },
            { label: "Frameworks", text: "React, Next.js, Redux Toolkit, Tailwind CSS" },
            { label: "Tools", text: "Git, Vite, Jest, React Testing Library, Storybook, Figma" },
          ],
        },
        {
          title: "Achievements",
          lines: [{ text: "Winner, HackVIT 2024 (best UI) out of 150 teams" }, { text: "Speaker on web accessibility at the college developer club, 120 attendees" }],
        },
      ],
    },
  },
  {
    id: "backend-resume",
    title: "Backend Developer",
    description: "APIs, databases and reliability first. For backend, platform and Java/Python service roles.",
    doc: {
      name: "Rohan Iyer",
      contacts: ["rohan.iyer@example.com", "+91 98765 43212", "linkedin.com/in/rohan-iyer", "github.com/rohaniyer"],
      sections: [
        edu("PES University, Bengaluru", "B.E., Computer Science · CGPA 8.4 / 10", "2022 – 2026"),
        {
          title: "Experience",
          entries: [
            {
              title: "Backend Engineering Intern, Shipwise Logistics",
              date: "Jan 2025 – Jun 2025",
              subtitle: "Bengaluru · Python, FastAPI, PostgreSQL, Kafka",
              bullets: [
                "Built a shipment-tracking API in FastAPI serving 1.5 million requests a day with 99.95% uptime",
                "Migrated order events from polling to Kafka, cutting database load by 60% and delivery-status lag from 5 min to 10 s",
                "Added idempotency keys to the payments webhook, eliminating duplicate charges reported by 30+ customers a month",
              ],
            },
          ],
        },
        {
          title: "Projects",
          entries: [
            {
              title: "URL Shortener at Scale",
              date: "2024",
              subtitle: "Java, Spring Boot, Redis, Docker",
              bullets: [
                "Designed a base-62 ID generator and Redis cache that served 12,000 redirects per second in a k6 load test",
                "Containerized the service with Docker Compose and set up GitHub Actions to run tests and deploy on every merge",
              ],
            },
            {
              title: "Expense Splitter API",
              date: "2024",
              subtitle: "Node.js, Express, MongoDB",
              bullets: ["Implemented a debt-simplification algorithm that reduces settlements from O(n²) to at most n − 1 transfers per group"],
            },
          ],
        },
        {
          title: "Technical Skills",
          lines: [
            { label: "Languages", text: "Python, Java, JavaScript, SQL, Bash" },
            { label: "Backend", text: "FastAPI, Spring Boot, Node.js, Express, REST, gRPC, microservices" },
            { label: "Data and infra", text: "PostgreSQL, MongoDB, Redis, Kafka, Docker, GitHub Actions, AWS" },
          ],
        },
        { title: "Achievements", lines: [{ text: "LeetCode Knight (rating 1950); 500+ problems solved" }, { text: "AWS Certified Cloud Practitioner (2025)" }] },
      ],
    },
  },
  {
    id: "fullstack-resume",
    title: "Full Stack Developer",
    description: "End-to-end products: frontend, API and deployment. Good for startups and MERN or Next.js roles.",
    doc: {
      name: "Sneha Reddy",
      contacts: ["sneha.reddy@example.com", "+91 98765 43213", "linkedin.com/in/sneha-reddy", "github.com/snehareddy"],
      sections: [
        edu("Jawaharlal Nehru Technological University, Hyderabad", "B.Tech, Computer Science · CGPA 8.2 / 10", "2022 – 2026"),
        {
          title: "Experience",
          entries: [
            {
              title: "Full Stack Intern, CampusKart",
              date: "May 2025 – Aug 2025",
              subtitle: "Hyderabad · React, Node.js, MongoDB",
              bullets: [
                "Shipped a seller onboarding flow end to end (React form, Express API, MongoDB schema) that grew active sellers from 140 to 410",
                "Cut image upload failures by 90% by moving uploads to pre-signed S3 URLs with client-side compression",
              ],
            },
          ],
        },
        {
          title: "Projects",
          entries: [
            {
              title: "EventHub",
              date: "2025",
              subtitle: "Next.js, Express, PostgreSQL, Stripe test mode",
              bullets: [
                "Built a college event ticketing app with QR check-in; handled 3,000 registrations for the annual fest",
                "Wrote role-based access control for organisers and volunteers with JWT and PostgreSQL row-level checks",
              ],
            },
            {
              title: "DevLog",
              date: "2024",
              subtitle: "MERN stack, Docker",
              bullets: ["Created a markdown blogging platform with full-text search, deployed on a single VPS behind Nginx"],
            },
          ],
        },
        {
          title: "Technical Skills",
          lines: [
            { label: "Languages", text: "JavaScript, TypeScript, Python, SQL, HTML, CSS" },
            { label: "Frameworks", text: "React, Next.js, Node.js, Express, Tailwind CSS" },
            { label: "Tools", text: "MongoDB, PostgreSQL, Docker, Git, AWS S3, Nginx, Postman" },
          ],
        },
        { title: "Achievements", lines: [{ text: "Google Developer Student Club lead, organised 8 workshops for 400+ students" }] },
      ],
    },
  },
  {
    id: "data-analyst-resume",
    title: "Data Analyst",
    description: "SQL, dashboards and business impact. For analyst, BI and data roles.",
    doc: {
      name: "Kavya Nair",
      contacts: ["kavya.nair@example.com", "+91 98765 43214", "linkedin.com/in/kavya-nair", "github.com/kavyanair"],
      summary: "Analytics student who turns messy data into decisions with SQL, Python and Power BI.",
      sections: [
        edu("Manipal Institute of Technology", "B.Tech, Electronics and Communication · Minor in Data Science · CGPA 8.6 / 10", "2022 – 2026"),
        {
          title: "Experience",
          entries: [
            {
              title: "Data Analyst Intern, FreshBasket",
              date: "May 2025 – Jul 2025",
              subtitle: "Mumbai · SQL, Python, Power BI",
              bullets: [
                "Analysed 2.4 million orders in SQL to find that late deliveries drove 31% of churn; the ops team used it to re-route two dark stores",
                "Built a Power BI dashboard for daily sales and stock-outs that replaced 6 hours a week of manual Excel reporting",
                "Automated a weekly ETL job in Python and Pandas that cleans and loads vendor data into the warehouse",
              ],
            },
          ],
        },
        {
          title: "Projects",
          entries: [
            {
              title: "IPL Win Predictor",
              date: "2025",
              subtitle: "Python, Pandas, scikit-learn, Tableau",
              bullets: ["Cleaned 15 seasons of ball-by-ball data and built a logistic regression model with 78% accuracy on held-out matches"],
            },
            {
              title: "Air Quality Explorer",
              date: "2024",
              subtitle: "SQL, Tableau Public",
              bullets: ["Published an interactive dashboard of CPCB data for 50 cities, viewed 3,000+ times on Tableau Public"],
            },
          ],
        },
        {
          title: "Technical Skills",
          lines: [
            { label: "Analysis", text: "SQL, Python, Pandas, NumPy, Excel (pivot tables, Power Query), statistics, A/B testing" },
            { label: "Visualisation", text: "Power BI, Tableau, Matplotlib, Seaborn" },
            { label: "Data", text: "PostgreSQL, MySQL, ETL, data warehouse basics, Git" },
          ],
        },
        { title: "Achievements", lines: [{ text: "Google Data Analytics Professional Certificate (2024)" }, { text: "2nd place, Kaggle Days Mumbai datathon" }] },
      ],
    },
  },
  {
    id: "ml-resume",
    title: "Machine Learning Engineer",
    description: "Models with measured results and deployment. For ML, AI and data science roles.",
    doc: {
      name: "Arjun Kapoor",
      contacts: ["arjun.kapoor@example.com", "+91 98765 43215", "linkedin.com/in/arjun-kapoor", "github.com/arjunkapoor"],
      sections: [
        edu("Indian Institute of Information Technology, Allahabad", "B.Tech, Information Technology · CGPA 9.0 / 10", "2022 – 2026"),
        {
          title: "Experience",
          entries: [
            {
              title: "Machine Learning Intern, MedScan AI",
              date: "May 2025 – Aug 2025",
              subtitle: "Pune · PyTorch, FastAPI, Docker",
              bullets: [
                "Fine-tuned a ResNet-50 classifier on 18,000 chest X-rays, raising pneumonia recall from 0.86 to 0.93 at the same precision",
                "Served the model with FastAPI and ONNX Runtime, cutting CPU inference time from 380 ms to 110 ms per image",
                "Set up experiment tracking with MLflow so the team could compare 40+ training runs",
              ],
            },
          ],
        },
        {
          title: "Projects",
          entries: [
            {
              title: "Hindi–English Code-Mix Sentiment",
              date: "2025",
              subtitle: "Python, Hugging Face Transformers",
              bullets: ["Fine-tuned a multilingual BERT on 12,000 labelled tweets, reaching 0.81 macro-F1 versus 0.69 for a TF-IDF baseline"],
            },
            {
              title: "RAG Study Assistant",
              date: "2024",
              subtitle: "LangChain, FAISS, Llama 3",
              bullets: ["Built a retrieval-augmented chatbot over 300 pages of lecture notes; answers cite the source page for every claim"],
            },
          ],
        },
        {
          title: "Technical Skills",
          lines: [
            { label: "Languages", text: "Python, C++, SQL" },
            { label: "ML", text: "PyTorch, TensorFlow, scikit-learn, Hugging Face, NLP, computer vision, LLMs" },
            { label: "MLOps", text: "MLflow, Docker, FastAPI, ONNX, Git, Linux, AWS SageMaker" },
          ],
        },
        { title: "Achievements", lines: [{ text: "Kaggle Competitions Expert; top 4% in the RSNA Screening Mammography challenge" }] },
      ],
    },
  },
  {
    id: "fresher-resume",
    title: "Fresher (no experience yet)",
    description: "No internship? Projects, coursework and activities carry the page. For first-time applicants.",
    doc: {
      name: "Priya Verma",
      contacts: ["priya.verma@example.com", "+91 98765 43216", "linkedin.com/in/priya-verma", "github.com/priyaverma"],
      summary: "Final-year computer science student who builds backend projects in Java and enjoys problem solving.",
      sections: [
        edu("Government Engineering College, Jaipur", "B.Tech, Computer Science and Engineering · CGPA 8.1 / 10", "2022 – 2026", [
          "Class XII (CBSE): 91% · Class X (CBSE): 94%",
          "Relevant coursework: Data Structures, DBMS, Operating Systems, Computer Networks, OOP",
        ]),
        {
          title: "Projects",
          entries: [
            {
              title: "Library Management System",
              date: "2025",
              subtitle: "Java, Spring Boot, MySQL",
              bullets: [
                "Built a REST API for issuing and returning books with automatic fine calculation, used by the department library",
                "Designed a normalised MySQL schema (3NF) and wrote JUnit tests for every service method",
              ],
            },
            {
              title: "Real-time Chat App",
              date: "2024",
              subtitle: "Node.js, Socket.IO, MongoDB",
              bullets: ["Developed chat rooms with typing indicators and message history; load-tested with 200 simultaneous users"],
            },
            {
              title: "Sorting Visualiser",
              date: "2023",
              subtitle: "JavaScript, HTML, CSS",
              bullets: ["Animated six sorting algorithms step by step to show comparisons and swaps; 150+ stars on GitHub"],
            },
          ],
        },
        {
          title: "Technical Skills",
          lines: [
            { label: "Languages", text: "Java, Python, C, SQL, JavaScript" },
            { label: "Tools", text: "Spring Boot, Node.js, MySQL, MongoDB, Git, Linux" },
          ],
        },
        {
          title: "Achievements and Activities",
          lines: [
            { text: "Solved 350+ problems on LeetCode; 3-star on CodeChef" },
            { text: "Coordinator, college coding club: ran weekly contests for 80 members" },
            { text: "NPTEL Elite certificate in Data Structures and Algorithms using Java" },
          ],
        },
      ],
    },
  },
];

export const getSampleResume = (id: string) => SAMPLE_RESUMES.find((s) => s.id === id);
