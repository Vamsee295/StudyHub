"use client";

import Link from "next/link";
import { askConfirm } from "@/components/ui/AskDialog";
import { buttonClass } from "@/components/ui/Button";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Layout, Check, Clock, MessageSquare } from "lucide-react";
import { practiceApi, PracticeSet, PracticeQuestion, AttemptAnswer } from "@/lib/api/practice";
import { AITutorChat } from "@/components/practice/AITutorChat";

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [practiceSet, setPracticeSet] = useState<PracticeSet | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"problem" | "tutor">("problem");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AttemptAnswer>>({});
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    async function loadSet() {
      try {
        const data = await practiceApi.getPracticeSet(id);
        if (data.set) setPracticeSet(data.set);
        if (data.questions) setQuestions(data.questions);
      } catch (err) {
        console.error("Failed to load practice set", err);
        setLoadError("This practice set could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }
    loadSet();
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const question = questions[current];
  const isMcq = !!question && question.options.length > 0;
  const answer = (question && answers[question.id]) || {};
  const answeredCount = questions.filter((q) => {
    const a = answers[q.id];
    return q.options.length > 0 ? !!a?.choice : !!a?.text?.trim() || !!a?.self_solved;
  }).length;

  const updateAnswer = (patch: AttemptAnswer) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: { ...prev[question.id], ...patch } }));
  };

  const handleSubmit = async () => {
    if (!practiceSet) return;
    if (answeredCount < questions.length && !(await askConfirm("Submit the sprint?", { body: `You've answered ${answeredCount} of ${questions.length} questions.`, ok: "Submit" }))) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await practiceApi.createAttempt(practiceSet.id, answers, Math.floor((Date.now() - startedAt) / 1000));
      router.push(`/practice/review/${res.attempt_id}`);
    } catch (err) {
      console.error("Failed to submit attempt", err);
      setSubmitError("Submission failed. Your answers are still here — try again.");
      setIsSubmitting(false);
    }
  };

  const title = practiceSet?.title || "Practice Session";
  const desc = practiceSet ? `${practiceSet.domain.toUpperCase()} · ${practiceSet.difficulty.toUpperCase()}` : "Interactive Workspace";

  return (
    <div className="-mx-4 -mt-6 flex min-h-[80vh] flex-col overflow-hidden border-b-[1.5px] border-hair md:-mx-8 md:-mt-8">
      {/* Session Topbar */}
      <header className="h-14 bg-card border-b border-hair flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/practice" className="text-body hover:text-ink transition-colors" aria-label="Back to Practice">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-hair"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-mute uppercase tracking-wider">{desc}</span>
            <span className="label-cond text-[17px]">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[12px] font-mono text-body">
            <Clock className="w-3.5 h-3.5" />
            {formatClock(elapsed)}
            {practiceSet && <span className="text-mute">/ {practiceSet.estimated_minutes}:00</span>}
          </span>
          <span className="text-[12px] text-body">{answeredCount}/{questions.length} answered</span>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || questions.length === 0}
            className={buttonClass("primary", "sm")}
          >
            {isSubmitting ? <span className="animate-pulse">Submitting...</span> : (
              <>
                <Check className="w-3.5 h-3.5" />
                Submit Attempt
              </>
            )}
          </button>
        </div>
      </header>

      {submitError && (
        <div role="alert" className="px-6 py-2 text-[13px] bg-[var(--error-soft)] text-danger border-b border-hair">{submitError}</div>
      )}

      {isLoading ? (
        <div className="p-10 text-mute">Loading questions...</div>
      ) : loadError || questions.length === 0 ? (
        <div className="p-10 flex flex-col gap-3">
          <p className="text-ink">{loadError ?? "This practice set has no questions yet."}</p>
          <Link href="/practice" className="text-[13px] text-accent-ink">Back to Practice</Link>
        </div>
      ) : (
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Problem Statement & Tutor */}
        <div className="w-full md:w-[45%] bg-card border-r border-hair flex flex-col h-full overflow-hidden">
          <div className="flex border-b border-hair bg-paper-2">
            <button
              onClick={() => setActiveTab("problem")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold transition-colors ${
                activeTab === "problem"
                  ? "text-ink bg-card border-b-2 border-b-[var(--accent)]"
                  : "text-body hover:text-ink hover:bg-card-2"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Problem
            </button>
            <button
              onClick={() => setActiveTab("tutor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold transition-colors ${
                activeTab === "tutor"
                  ? "text-accent-ink bg-card border-b-2 border-b-[var(--accent)]"
                  : "text-body hover:text-ink hover:bg-card-2"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              AI Tutor
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "problem" ? (
              <div className="p-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-mute">
                  Question {current + 1} of {questions.length} · {question.difficulty}
                </span>
                <h1 className="display mb-4 mt-1 text-[32px]">{question.title}</h1>
                <p className="whitespace-pre-wrap text-[16px] leading-relaxed">{question.problem_statement}</p>
              </div>
            ) : (
              <AITutorChat key={question.id} questionId={question.id} />
            )}
          </div>
        </div>

        {/* Right: Answer */}
        <div className="w-full md:w-[55%] flex flex-col">
          <div className="flex flex-wrap gap-2 p-4 border-b border-hair bg-card">
            {questions.map((q, i) => {
              const a = answers[q.id];
              const done = q.options.length > 0 ? !!a?.choice : !!a?.text?.trim() || !!a?.self_solved;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrent(i)}
                  aria-current={i === current}
                  className={`w-8 h-8 rounded-md text-[12px] font-semibold border transition-colors ${
                    i === current
                      ? "border-accent text-accent-ink bg-card"
                      : done
                        ? "border-hair bg-paper-2 text-ink"
                        : "border-hair text-mute"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {isMcq ? (
              <fieldset className="flex flex-col gap-2">
                <legend className="text-[13px] font-semibold text-ink mb-2">Choose one answer</legend>
                {question.options.map((o) => (
                  <label
                    key={o.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      answer.choice === o.id ? "border-accent bg-card" : "border-hair hover:bg-paper-2"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      checked={answer.choice === o.id}
                      onChange={() => updateAnswer({ choice: o.id })}
                    />
                    <span className="text-[14px] text-ink">{o.text}</span>
                  </label>
                ))}
              </fieldset>
            ) : (
              <>
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold text-ink">Your approach or solution</span>
                  <textarea
                    value={answer.text ?? ""}
                    onChange={(e) => updateAnswer({ text: e.target.value })}
                    rows={12}
                    maxLength={5000}
                    spellCheck={false}
                    placeholder="Write your code, query, or reasoning here."
                    className="w-full rounded-xl border-2 border-hair bg-card p-3 font-mono text-[14px] focus:border-accent"
                  />
                </label>
                <label className="flex items-center gap-2 text-[13px] text-ink">
                  <input type="checkbox" checked={!!answer.self_solved} onChange={(e) => updateAnswer({ self_solved: e.target.checked })} />
                  I solved this
                </label>
                <p className="text-[12px] text-mute">
                  Open questions have no automatic tests yet, so they count your own verdict. You&apos;ll see the reference approach in the review.
                </p>
              </>
            )}
          </div>

          <div className="flex justify-between p-4 border-t border-hair bg-card">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="px-4 py-1.5 rounded-md text-[12px] font-semibold border border-hair text-ink disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              disabled={current === questions.length - 1}
              className="px-4 py-1.5 rounded-md text-[12px] font-semibold border border-hair text-ink disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
