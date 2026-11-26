// How to get the most from each tool (shown at the top of every tool page), which tool fits which stage
// of placement prep (on /tools), and free tools elsewhere. External links checked live on 2026-11-26.

export interface ToolGuide {
  plain: string;
  diagram: string;
  steps: string[];
  pairsWith: { label: string; href: string }[];
}

export const TOOL_GUIDES: Record<string, ToolGuide> = {
  "/tools/interview-simulator": {
    plain:
      "Interviews test how you explain, not just what you know. Answer each question out loud as if an interviewer were listening, then compare with the model answer and the trap interviewers look for. The gap between the two is what to study next.",
    diagram: `flowchart LR
  Q["Read the question"] --> A["Answer out loud<br/>1–2 minutes"] --> R["Reveal model answer<br/>+ the trap"] --> S["Rate yourself"] --> L["Reread the lesson<br/>for anything you missed"]
  L -.-> Q`,
    steps: ["Pick one course you're preparing for", "Speak your answer before revealing anything", "Rate honestly: 'partly' is useful information", "Open the linked lesson for every weak answer"],
    pairsWith: [{ label: "Question Drill", href: "/tools/tech-questions" }, { label: "STAR Answer Builder", href: "/tools/star-builder" }],
  },
  "/tools/tech-questions": {
    plain:
      "Short, frequent quizzes beat long, rare study sessions. This drill asks quick multiple-choice questions, and anything you miss joins your review queue so it comes back just before you'd forget it.",
    diagram: `flowchart LR
  D["Daily drill<br/>10 questions"] --> C{"correct?"}
  C -->|"yes"| N["comes back later<br/>1 → 3 → 7 → 14 days"]
  C -->|"no"| Q["joins review queue<br/>back tomorrow"]
  Q --> D`,
    steps: ["Do a short drill every day rather than one long session", "Read the explanation even when you got it right", "Clear your review queue first, then do new questions"],
    pairsWith: [{ label: "Mock Interview", href: "/tools/interview-simulator" }, { label: "Placement Readiness", href: "/tools/readiness-calculator" }],
  },
  "/tools/star-builder": {
    plain:
      "Behavioural questions ('tell me about a time you…') are answered with stories. STAR keeps a story tight: the Situation, your Task, the Actions you took, and the Result. Five or six good stories can answer most HR questions.",
    diagram: `flowchart LR
  S["Situation<br/>where, when"] --> T["Task<br/>what you had to do"] --> A["Action<br/>what YOU did<br/>(most of the answer)"] --> R["Result<br/>numbers, what you learned"]`,
    steps: ["Pick real moments: a project deadline, a team conflict, a bug you fixed", "Spend most of the answer on your Actions, using 'I', not 'we'", "End with a measurable result or a lesson", "Keep each story under two minutes when spoken"],
    pairsWith: [{ label: "Mock Interview", href: "/tools/interview-simulator" }, { label: "Company Prep Sheet", href: "/tools/company-prep" }],
  },
  "/tools/resume-analyzer": {
    plain:
      "Recruiters and screening software skim a resume in seconds. The analyser checks yours against a target company and role: which required skills are missing, whether the format is easy to scan, and where your bullet points need impact.",
    diagram: `flowchart LR
  U["Upload PDF<br/>or paste text"] --> T["Pick company<br/>and role"] --> A["Analysis<br/>skills · format · gaps"] --> F["Fix the top issues"] --> U`,
    steps: ["Tailor to one role at a time; a resume for everything fits nothing", "Fix missing skills you actually have first: they're the quickest wins", "Rewrite bullets as action + result ('Built X, cutting load time 40%')", "Re-run after edits to see the change"],
    pairsWith: [{ label: "Company Prep Sheet", href: "/tools/company-prep" }, { label: "STAR Answer Builder", href: "/tools/star-builder" }],
  },
  "/tools/company-prep": {
    plain:
      "Each company tests a slightly different mix. The prep sheet puts one company's reported process, the topics it covers and your progress on them onto a single page you can print or keep open while you study.",
    diagram: `flowchart LR
  C["Pick a company"] --> P["See its rounds<br/>and topics"] --> G["Find weak topics<br/>from your progress"] --> S["Study those first"] --> C`,
    steps: ["Shortlist 3–5 companies you'll actually apply to", "Start with topics shared by most of them", "Print the sheet and tick topics off as you finish them"],
    pairsWith: [{ label: "Companies page", href: "/companies" }, { label: "Resume Analyzer", href: "/tools/resume-analyzer" }],
  },
  "/tools/dsa-visualizer": {
    plain:
      "Algorithms are much easier to understand when you watch them move. Step through each comparison and swap at your own pace, predict the next step before clicking, and you'll remember how the algorithm works rather than just its code.",
    diagram: `flowchart LR
  P["Pick an algorithm"] --> G["Guess the next step"] --> S["Step forward"] --> C{"guessed right?"}
  C -->|"no"| W["work out why"] --> G
  C -->|"yes"| G`,
    steps: ["Start with a small array of 5–6 numbers", "Predict each step before you click", "Try sorted, reversed and duplicate-heavy inputs to see best and worst cases", "Then code it yourself in a practice problem"],
    pairsWith: [{ label: "Practice: Sorting", href: "/practice/problems?topic=Sorting" }, { label: "Big-O lab", href: "/labs/big-o" }],
  },
  "/tools/cgpa-converter": {
    plain:
      "Application forms often ask for a percentage while your marksheet shows CGPA. Universities use different formulas, so pick the one your university prints on its transcripts, or enter its own multiplier.",
    diagram: `flowchart LR
  C["Your CGPA<br/>e.g. 8.2"] --> F{"which formula?"}
  F -->|"× 9.5 (CBSE style)"| A["77.9%"]
  F -->|"your university's"| B["custom result"]`,
    steps: ["Check your transcript or university website for its official formula", "Use the same formula on every application", "Keep a screenshot of the conversion in case you're asked"],
    pairsWith: [{ label: "Placement Readiness", href: "/tools/readiness-calculator" }],
  },
  "/tools/readiness-calculator": {
    plain:
      "Readiness turns what you've actually done (lessons completed, mock tests, your review queue) into a score per subject. It shows where you're strong and, more usefully, the one subject to work on next.",
    diagram: `flowchart LR
  L["Lessons done"] --> S["Readiness per subject"]
  M["Mock test scores"] --> S
  R["Review queue health"] --> S
  S --> N["Weakest subject → study it next"]`,
    steps: ["Check it once a week, not every day", "Spend the next week on your lowest subject", "Take a mock test in that subject at the end of the week"],
    pairsWith: [{ label: "Learn path", href: "/learn" }, { label: "Question Drill", href: "/tools/tech-questions" }],
  },
  "/tools/aptitude-timer": {
    plain:
      "Aptitude tests are mostly about pacing: about a minute per question. Lap the timer on every question during practice and you'll see exactly which question types eat your time, so you know what to drill or skip.",
    diagram: `flowchart LR
  S["Start section"] --> Q["Solve a question"] --> L["Lap"] --> Q
  L --> R["Review: slowest question types"] --> D["Drill those, or skip them in the test"]`,
    steps: ["Practise full sections with the timer, not single questions", "Set a cut-off (say 90 seconds) and move on when you hit it", "After each section, drill the topic of your slowest laps"],
    pairsWith: [{ label: "Quantitative aptitude", href: "/learn/quantitative-aptitude" }, { label: "Logical reasoning", href: "/learn/logical-reasoning" }],
  },
};

/** Which tools help at which stage of placement prep. */
export const TOOL_PATH: { stage: string; when: string; hrefs: string[] }[] = [
  { stage: "1 · Take stock", when: "Starting out", hrefs: ["/tools/readiness-calculator", "/tools/cgpa-converter"] },
  { stage: "2 · Build skills", when: "Months before placements", hrefs: ["/tools/dsa-visualizer", "/tools/tech-questions"] },
  { stage: "3 · Get application-ready", when: "Weeks before applying", hrefs: ["/tools/resume-analyzer", "/tools/company-prep", "/tools/star-builder"] },
  { stage: "4 · Interview season", when: "Tests and interviews", hrefs: ["/tools/aptitude-timer", "/tools/interview-simulator"] },
];

export const TOOL_PATH_DIAGRAM = `flowchart LR
  A["Take stock<br/>readiness · CGPA"] --> B["Build skills<br/>visualiser · drills · labs"] --> C["Get application-ready<br/>resume · company sheets · STAR"] --> D["Interview season<br/>aptitude pacing · mock interviews"] --> O(["Offer"])`;

/** Free tools elsewhere that pair well with StudyHub. */
export const EXTERNAL_TOOLS: { title: string; url: string; why: string }[] = [
  { title: "Pramp", url: "https://www.pramp.com/", why: "Free peer-to-peer mock interviews with other candidates." },
  { title: "interviewing.io", url: "https://www.interviewing.io/", why: "Anonymous mock interviews and recordings of real ones." },
  { title: "Excalidraw", url: "https://excalidraw.com/", why: "Sketch system designs quickly, like a whiteboard round." },
  { title: "Overleaf CV templates", url: "https://www.overleaf.com/latex/templates/tagged/cv", why: "Clean, ATS-friendly resume templates." },
  { title: "Python Tutor (Java)", url: "https://pythontutor.com/java.html", why: "See your Java code run line by line, with memory." },
  { title: "JDoodle Java compiler", url: "https://www.jdoodle.com/online-java-compiler", why: "Run a quick Java snippet without installing anything." },
];
