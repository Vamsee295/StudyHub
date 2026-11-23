"use client";

import Link from "next/link";
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
    if (answeredCount < questions.length && !window.confirm(`You answered ${answeredCount} of ${questions.length} questions. Submit anyway?`)) return;
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
    <div className="min-h-[80vh] flex flex-col bg-[var(--canvas)] -mt-8 -mx-6 rounded-t-xl overflow-hidden border-t border-[var(--border)]">
      {/* Session Topbar */}
      <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/practice" className="text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors" aria-label="Back to Practice">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-[var(--border)]"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">{desc}</span>
            <span className="text-[13px] font-semibold text-[var(--ink)]">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[12px] font-mono text-[var(--ink-secondary)]">
            <Clock className="w-3.5 h-3.5" />
            {formatClock(elapsed)}
            {practiceSet && <span className="text-[var(--ink-tertiary)]">/ {practiceSet.estimated_minutes}:00</span>}
          </span>
          <span className="text-[12px] text-[var(--ink-secondary)]">{answeredCount}/{questions.length} answered</span>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || questions.length === 0}
            className="flex items-center gap-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-1.5 rounded-md text-[12px] font-semibold transition-colors disabled:opacity-50"
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
        <div role="alert" className="px-6 py-2 text-[13px] bg-[var(--error-soft)] text-[var(--error)] border-b border-[var(--border)]">{submitError}</div>
      )}

      {isLoading ? (
        <div className="p-10 text-[var(--ink-tertiary)]">Loading questions...</div>
      ) : loadError || questions.length === 0 ? (
        <div className="p-10 flex flex-col gap-3">
          <p className="text-[var(--ink)]">{loadError ?? "This practice set has no questions yet."}</p>
          <Link href="/practice" className="text-[13px] text-[var(--accent)]">Back to Practice</Link>
        </div>
      ) : (
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Problem Statement & Tutor */}
        <div className="w-full md:w-[45%] bg-[var(--surface)] border-r border-[var(--border)] flex flex-col h-full overflow-hidden">
          <div className="flex border-b border-[var(--border)] bg-[var(--surface-subdued)]">
            <button
              onClick={() => setActiveTab("problem")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold transition-colors ${
                activeTab === "problem"
                  ? "text-[var(--ink)] bg-[var(--surface)] border-b-2 border-b-[var(--accent)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Problem
            </button>
            <button
              onClick={() => setActiveTab("tutor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold transition-colors ${
                activeTab === "tutor"
                  ? "text-[var(--accent)] bg-[var(--surface)] border-b-2 border-b-[var(--accent)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              AI Tutor
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "problem" ? (
              <div className="p-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">
                  Question {current + 1} of {questions.length} · {question.difficulty}
                </span>
                <h1 className="text-xl font-bold text-[var(--ink)] mt-1 mb-4">{question.title}</h1>
                <p className="text-[14px] leading-relaxed text-[var(--ink)] whitespace-pre-wrap">{question.problem_statement}</p>
              </div>
            ) : (
              <AITutorChat key={question.id} questionId={question.id} />
            )}
          </div>
        </div>

        {/* Right: Answer */}
        <div className="w-full md:w-[55%] flex flex-col">
          <div className="flex flex-wrap gap-2 p-4 border-b border-[var(--border)] bg-[var(--surface)]">
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
                      ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                      : done
                        ? "border-[var(--border)] bg-[var(--surface-subdued)] text-[var(--ink)]"
                        : "border-[var(--border)] text-[var(--ink-tertiary)]"
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
                <legend className="text-[13px] font-semibold text-[var(--ink)] mb-2">Choose one answer</legend>
                {question.options.map((o) => (
                  <label
                    key={o.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      answer.choice === o.id ? "border-[var(--accent)] bg-[var(--surface)]" : "border-[var(--border)] hover:bg-[var(--surface-subdued)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      checked={answer.choice === o.id}
                      onChange={() => updateAnswer({ choice: o.id })}
                    />
                    <span className="text-[14px] text-[var(--ink)]">{o.text}</span>
                  </label>
                ))}
              </fieldset>
            ) : (
              <>
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-semibold text-[var(--ink)]">Your approach or solution</span>
                  <textarea
                    value={answer.text ?? ""}
                    onChange={(e) => updateAnswer({ text: e.target.value })}
                    rows={12}
                    maxLength={5000}
                    spellCheck={false}
                    placeholder="Write your code, query, or reasoning here."
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-[13px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </label>
                <label className="flex items-center gap-2 text-[13px] text-[var(--ink)]">
                  <input type="checkbox" checked={!!answer.self_solved} onChange={(e) => updateAnswer({ self_solved: e.target.checked })} />
                  I solved this
                </label>
                <p className="text-[12px] text-[var(--ink-tertiary)]">
                  Open questions have no automatic tests yet, so they count your own verdict. You&apos;ll see the reference approach in the review.
                </p>
              </>
            )}
          </div>

          <div className="flex justify-between p-4 border-t border-[var(--border)] bg-[var(--surface)]">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="px-4 py-1.5 rounded-md text-[12px] font-semibold border border-[var(--border)] text-[var(--ink)] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              disabled={current === questions.length - 1}
              className="px-4 py-1.5 rounded-md text-[12px] font-semibold border border-[var(--border)] text-[var(--ink)] disabled:opacity-40"
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
