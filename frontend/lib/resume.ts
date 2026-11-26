// The structured resume. The editor, the typeset page, the LaTeX export, the ATS check and the AI
// endpoints (backend app/api/routes/assistant.py, same shape) all use this one model.

export interface ResumeEntry {
  title: string; // bold, left
  date?: string; // right-aligned
  subtitle?: string; // italic, left
  bullets: string[];
}
export interface ResumeSection {
  title: string;
  entries?: ResumeEntry[];
  lines?: { label?: string; text: string }[]; // e.g. "Languages: Java, Python"
}
export interface ResumeDoc {
  name: string;
  contacts: string[];
  summary?: string;
  sections: ResumeSection[];
}

/** All the words on the resume, for the ATS check. */
export function resumeText(doc: ResumeDoc): string {
  const parts = [doc.name, ...doc.contacts, doc.summary ?? ""];
  for (const s of doc.sections) {
    parts.push(s.title);
    for (const e of s.entries ?? []) parts.push(e.title, e.subtitle ?? "", e.date ?? "", ...e.bullets);
    for (const l of s.lines ?? []) parts.push(l.label ?? "", l.text);
  }
  return parts.join("\n");
}

export const allBullets = (doc: ResumeDoc) => doc.sections.flatMap((s) => (s.entries ?? []).flatMap((e) => e.bullets));

/** The student's edited copy is stored with their other saved templates, as JSON under `doc`. */
export function readSavedResume(values: Record<string, string> | undefined): ResumeDoc | null {
  try {
    return values?.doc ? (JSON.parse(values.doc) as ResumeDoc) : null;
  } catch {
    return null;
  }
}
