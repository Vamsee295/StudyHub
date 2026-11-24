"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { lastVerified } from "@/lib/data/companies";

// Answers describe what the app actually does today; update them when behaviour changes.
const faqs: { q: string; a: string }[] = [
  {
    q: "Where is my progress saved?",
    a: "When you're signed in, your lesson progress and study data sync to your account, so they follow you to other devices. Theme and a few display choices stay on the device you set them on.",
  },
  {
    q: "Can I change my target role or companies?",
    a: "Yes. Edit them any time under Profile: About you for your role, Targets for companies. You can also redo the setup from the About you page.",
  },
  {
    q: "Why do some lessons list prerequisites?",
    a: "Lessons that build on earlier ones show a \"Before this lesson\" list so you can fill gaps first. Nothing is locked; you can open any lesson.",
  },
  {
    q: "How does the review queue work?",
    a: "Questions you miss in quizzes, mock tests or the daily question are due straight away. Each correct answer pushes a question further out: 1, 3, 7, 14, then 30 days. A miss starts it over.",
  },
  {
    q: "Where do the practice problems come from?",
    a: "They're classic interview problems with tests, hints and a review after you submit. Company tags mean the company is reported to test that topic, not that it asked this exact question.",
  },
  {
    q: "How current is the company information?",
    a: `Rounds and topics are compiled from public sources such as company prep pages and candidate reports, and reviewed periodically. Last checked: ${lastVerified}. Formats change by year and role, so check the official listing too.`,
  },
  {
    q: "How do I reset my password?",
    a: "Go to Settings, then Password, and we'll email you a link to set a new one.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = faqs.filter((f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));

  return (
    <div className="w-full min-w-0">
      <PageHeader eyebrow="Help" title="How can we" hl="help?" />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <label className="relative mb-6 block max-w-xl">
            <span className="sr-only">Search questions</span>
            <Search aria-hidden className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mute" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions" className="field w-full pl-10" />
          </label>

          {shown.length ? (
            <div className="border-t-[2.4px] border-line">
              {shown.map((f, i) => (
                <details key={f.q} className="group border-b-[1.5px] border-hair" open={!q && i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-line transition-transform group-open:rotate-45">
                      <Plus className="size-4" aria-hidden />
                    </span>
                  </summary>
                  <p className="max-w-[65ch] pb-5 text-[16px] leading-relaxed text-body">{f.a}</p>
                </details>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border-[1.5px] border-dashed border-hair p-8 text-center text-body">No question matches &ldquo;{query}&rdquo;.</p>
          )}
        </div>

        <aside className="brut rounded-2xl bg-card p-6">
          <Lightbulb className="size-6 text-accent" aria-hidden />
          <h2 className="display mt-3 text-[28px]">Something broken or missing?</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-body">
            Post it on the ideas board. Bugs and feature requests go to the same place, and you can see what&apos;s planned and shipped.
          </p>
          <Link href="/ideas" className={`${buttonClass("primary", "sm")} mt-5`}>
            Open the ideas board <ArrowRight className="size-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
