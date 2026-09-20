"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { clsx } from "clsx";

type Step = 1 | 2 | 3 | 4 | 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("");
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState("");

  const roles = [
    "Software Engineer",
    "AI / ML Engineer",
    "Data Engineer",
    "Data Analyst",
    "Cloud / DevOps",
    "Cybersecurity",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const languages = ["Java", "Python", "C++", "JavaScript"];

  const goals = [
    "Campus placements",
    "Off-campus jobs",
    "Internships",
    "General interview preparation",
  ];

  const timelines = ["30 days", "60 days", "90 days", "6 months"];

  const handleNext = () => {
    if (step < 5) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleGenerate = () => {
    // In a real app, we would save this to the backend
    router.push("/dashboard");
  };

  const renderOptions = (
    options: string[],
    selected: string,
    onSelect: (val: string) => void
  ) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={clsx(
              "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
              selected === opt
                ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--ink)] hover:border-[var(--border-strong)] hover:shadow-sm"
            )}
          >
            <span className="font-medium text-[15px]">{opt}</span>
            {selected === opt && <Check className="w-5 h-5 text-[var(--accent)]" />}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)] auth-grid-light text-[var(--ink)] font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 auth-ambient-glow pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-center sm:justify-start">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-newsreader font-bold text-lg shadow-sm">
            P
          </div>
          <span className="font-sans font-bold text-[var(--ink)] tracking-tight text-[17px]">
            PATHWARD
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-2xl mx-auto z-10 py-24">
        
        {/* Progress bar */}
        <div className="w-full flex items-center gap-2 mb-12">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={clsx(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                step >= idx ? "bg-[var(--accent)]" : "bg-[var(--border-strong)]/30"
              )}
            />
          ))}
        </div>

        <div className="w-full bg-[var(--surface)] p-8 sm:p-10 rounded-2xl border border-[var(--border)] shadow-lg shadow-[rgba(15,23,42,0.04)]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                Step 1 of 5
              </span>
              <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
                What role are you preparing for?
              </h1>
              <p className="text-[var(--ink-secondary)] text-[15px] mt-2 font-normal">
                We'll map your roadmap to the exact skills required for this role.
              </p>
              {renderOptions(roles, role, setRole)}
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                Step 2 of 5
              </span>
              <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
                What is your current level?
              </h1>
              <p className="text-[var(--ink-secondary)] text-[15px] mt-2 font-normal">
                This helps us calibrate the difficulty of your starting resources.
              </p>
              {renderOptions(levels, level, setLevel)}
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                Step 3 of 5
              </span>
              <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
                Preferred programming language?
              </h1>
              <p className="text-[var(--ink-secondary)] text-[15px] mt-2 font-normal">
                Code examples, DSA questions, and snippets will be tailored to this.
              </p>
              {renderOptions(languages, language, setLanguage)}
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                Step 4 of 5
              </span>
              <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
                What are you preparing for?
              </h1>
              <p className="text-[var(--ink-secondary)] text-[15px] mt-2 font-normal">
                We'll adjust the priority of aptitude vs core technical rounds.
              </p>
              {renderOptions(goals, goal, setGoal)}
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                Final Step
              </span>
              <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
                What is your timeline?
              </h1>
              <p className="text-[var(--ink-secondary)] text-[15px] mt-2 font-normal">
                We'll calculate your target velocity (questions per day).
              </p>
              {renderOptions(timelines, timeline, setTimeline)}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 text-[14px] font-medium transition-colors",
                step === 1 
                  ? "text-[var(--ink-tertiary)] cursor-not-allowed opacity-50" 
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink)]"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !role) ||
                  (step === 2 && !level) ||
                  (step === 3 && !language) ||
                  (step === 4 && !goal)
                }
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!timeline}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(29,78,216,0.25)]"
              >
                <Sparkles className="w-4 h-4" />
                Generate My Path
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
