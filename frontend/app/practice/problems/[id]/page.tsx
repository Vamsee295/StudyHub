"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Bookmark, Building, Target, Lightbulb, History, MessageSquare,
  Play, UploadCloud, ChevronDown, RotateCcw, CheckCircle2, XCircle, ListChecks,
  Terminal, Loader2, AlertTriangle, Clock, MemoryStick
} from "lucide-react";
import { clsx } from "clsx";
import Editor from "@monaco-editor/react";
import { getProblem, generateStarterCode } from "@/lib/problems/problemRegistry";
import { problemStorage } from "@/lib/problems/problemStorage";
import { executeCode, explainError } from "@/lib/execution/executionClient";
import type { ExecutionResult, TestCaseResult } from "@/lib/execution/executionTypes";

// ─── Status helpers ───────────────────────────────────────────────────────────
const statusLabel: Record<string, string> = {
  pending: "Pending",
  running: "Running…",
  passed: "Passed",
  failed: "Failed",
  wrong_answer: "Wrong Answer",
  compile_error: "Compile Error",
  runtime_error: "Runtime Error",
  time_limit: "Time Limit Exceeded",
};

function CaseTabIcon({ status }: { status: string }) {
  if (status === "running") return <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />;
  if (status === "passed") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
  if (status === "wrong_answer" || status === "failed") return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
  if (status === "compile_error" || status === "runtime_error" || status === "time_limit")
    return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
  return null;
}

function VerdictBanner({ 
  result, 
  explanation, 
  isExplaining, 
  onExplain 
}: { 
  result: ExecutionResult;
  explanation: string | null;
  isExplaining: boolean;
  onExplain: () => void;
}) {
  const isAccepted = result.status === "accepted";
  const isCompileError = result.status === "compile_error";
  const isRuntimeError = result.status === "runtime_error";
  const isTLE = result.status === "time_limit";
  const isWrongAnswer = result.status === "wrong_answer";

  const bannerClass = isAccepted
    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
    : isCompileError
    ? "bg-amber-50 border-amber-200 text-amber-900"
    : "bg-rose-50 border-rose-200 text-rose-900";

  const labelClass = isAccepted
    ? "bg-emerald-600 text-white"
    : isCompileError
    ? "bg-amber-600 text-white"
    : "bg-rose-600 text-white";

  const label = isAccepted
    ? "ACCEPTED"
    : isCompileError
    ? "COMPILATION ERROR"
    : isRuntimeError
    ? "RUNTIME ERROR"
    : isTLE
    ? "TIME LIMIT EXCEEDED"
    : isWrongAnswer
    ? "WRONG ANSWER"
    : result.status.toUpperCase().replace("_", " ");

  return (
    <div className={clsx("p-3 rounded-lg border space-y-3", bannerClass)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={clsx("px-2 py-0.5 rounded text-[11px] font-bold", labelClass)}>{label}</span>
          {!isCompileError && !isTLE && (
            <span className="text-sm font-medium">
              {result.passedTests} / {result.totalTests} test cases passed
            </span>
          )}
        </div>
        {isAccepted && result.runtimeMs !== undefined && (
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Runtime: <strong className="ml-1">{result.runtimeMs} ms</strong>
            </span>
            {result.memoryMb && (
              <span className="flex items-center gap-1">
                <MemoryStick className="w-3.5 h-3.5" />
                Memory: <strong className="ml-1">{result.memoryMb.toFixed(1)} MB</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Compiler error details */}
      {isCompileError && result.compilerError && (
        <div className="space-y-2">
          <pre className="font-mono text-xs whitespace-pre-wrap bg-amber-100/60 border border-amber-200 rounded p-3 overflow-auto max-h-48 text-amber-900">
            {result.compilerError}
          </pre>
          <div className="flex justify-end">
            <button 
              onClick={onExplain}
              disabled={isExplaining}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-200 text-amber-900 hover:bg-amber-300 rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isExplaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
              {isExplaining ? "Explaining..." : "Explain Error"}
            </button>
          </div>
          {explanation && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-900 prose prose-sm max-w-none">
              <div className="flex items-center gap-2 mb-2 font-semibold text-indigo-800">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                AI Explanation
              </div>
              <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br/>') }} />
            </div>
          )}
        </div>
      )}

      {/* Runtime error details */}
      {isRuntimeError && result.runtimeError && (
        <div className="space-y-2">
          <pre className="font-mono text-xs whitespace-pre-wrap bg-rose-100/60 border border-rose-200 rounded p-3 overflow-auto max-h-48 text-rose-900">
            {result.runtimeError}
          </pre>
          <div className="flex justify-end">
            <button 
              onClick={onExplain}
              disabled={isExplaining}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-200 text-rose-900 hover:bg-rose-300 rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isExplaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
              {isExplaining ? "Explaining..." : "Explain Error"}
            </button>
          </div>
          {explanation && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-900 prose prose-sm max-w-none">
              <div className="flex items-center gap-2 mb-2 font-semibold text-indigo-800">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                AI Explanation
              </div>
              <div dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br/>') }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TestCaseDetail({ tc }: { tc: TestCaseResult }) {
  const isPassed = tc.status === "passed";
  const isError = tc.status === "runtime_error" || tc.status === "compile_error" || tc.status === "time_limit";

  return (
    <div className="space-y-3 text-xs font-mono">
      {/* Input */}
      <div>
        <div className="text-[10px] font-semibold uppercase text-[var(--ink-tertiary)] mb-1 tracking-wider">
          Input
        </div>
        <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-lg p-3 space-y-1 text-[var(--ink)]">
          {Object.entries(tc.input).map(([key, val]) => (
            <div key={key}>
              <span className="text-[var(--ink-secondary)] font-semibold">{key} = </span>
              {JSON.stringify(val)}
            </div>
          ))}
        </div>
      </div>

      {/* Expected vs Actual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase text-[var(--ink-tertiary)] mb-1 tracking-wider">
            Expected Output
          </div>
          <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-lg p-3 text-[var(--ink)]">
            {JSON.stringify(tc.expectedOutput)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase text-[var(--ink-tertiary)] mb-1 tracking-wider flex items-center justify-between">
            <span>Your Output</span>
            {tc.runtimeMs !== undefined && (
              <span className="normal-case text-[var(--ink-tertiary)]">{tc.runtimeMs}ms</span>
            )}
          </div>
          <div className={clsx(
            "rounded-lg p-3 border",
            isPassed
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : isError
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          )}>
            {tc.actualOutput !== undefined
              ? JSON.stringify(tc.actualOutput)
              : tc.error
              ? <span className="italic">{tc.error}</span>
              : <span className="text-[var(--ink-tertiary)] italic">No output</span>
            }
          </div>
        </div>
      </div>

      {/* Status row */}
      <div className={clsx(
        "flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-semibold uppercase tracking-wider",
        isPassed
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : isError
          ? "bg-amber-50 border-amber-200 text-amber-700"
          : "bg-rose-50 border-rose-200 text-rose-700"
      )}>
        {isPassed
          ? <CheckCircle2 className="w-4 h-4" />
          : isError
          ? <AlertTriangle className="w-4 h-4" />
          : <XCircle className="w-4 h-4" />
        }
        {statusLabel[tc.status] || tc.status}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProblemWorkspace() {
  const params = useParams();
  const problemId = String(params?.id || "1");
  const problem = getProblem(problemId);

  const [language, setLanguage] = useState("java");
  const [hintOpen, setHintOpen] = useState(false);
  const [consoleTab, setConsoleTab] = useState<"testCases" | "testResult" | "stdout">("testCases");
  const [selectedCase, setSelectedCase] = useState(0);

  const getInitialCode = useCallback(() => {
    if (!problem) return "// Write your solution here\n";
    if (problem.starterCode?.[language]) return problem.starterCode[language];
    return generateStarterCode(problem.functionSignature, language);
  }, [problem, language]);

  const [code, setCode] = useState(() => getInitialCode());

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [execError, setExecError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);
  };

  // Synchronize starter code and state when problem or language changes
  useEffect(() => {
    if (problem) {
      const freshCode = problem.starterCode?.[language] || generateStarterCode(problem.functionSignature, language);
      setCode(freshCode);
      setExecResult(null);
      setExecError(null);
      setHasRun(false);
      setSelectedCase(0);
      setHintOpen(false);
    }
  }, [problemId, problem?.id, language]);

  // Apply monaco markers when execResult changes
  useEffect(() => {
    if (!monacoInstance || !editorInstance) return;
    const model = editorInstance.getModel();
    if (!model) return;

    if (execResult?.status === "compile_error" && execResult.compilerMarkers && execResult.compilerMarkers.length > 0) {
      const markers = execResult.compilerMarkers.map(m => ({
        severity: m.severity === "warning" ? monacoInstance.MarkerSeverity.Warning : monacoInstance.MarkerSeverity.Error,
        message: m.message,
        startLineNumber: m.line,
        startColumn: m.column,
        endLineNumber: m.line,
        endColumn: 1000,
      }));
      monacoInstance.editor.setModelMarkers(model, "compiler", markers);
    } else {
      monacoInstance.editor.setModelMarkers(model, "compiler", []);
    }
  }, [execResult, monacoInstance, editorInstance]);

  // Per case result map: id -> TestCaseResult
  const caseResults = execResult?.testResults.reduce(
    (acc, tr) => ({ ...acc, [tr.id]: tr }),
    {} as Record<string, TestCaseResult>
  ) ?? {};

  const visibleTests = problem?.visibleTests ?? [];

  const handleRun = useCallback(async () => {
    if (!problem || isRunning) return;

    setIsRunning(true);
    setExecError(null);
    setExplanation(null);
    setConsoleTab("testResult");
    setHasRun(false);

    try {
      const req = {
        code,
        problemId,
        functionSignature: { ...problem.functionSignature, language },
        testCases: problem.visibleTests,
      };
      const result = await executeCode(req, false);
      setExecResult(result);
      setHasRun(true);
      if (problemStorage.getStatus(problemId) !== "solved") {
        problemStorage.setStatus(problemId, "attempted");
      }
    } catch (err: any) {
      setExecError(err.message || "Execution service unavailable. Is the backend running?");
    } finally {
      setIsRunning(false);
    }
  }, [problem, code, problemId, isRunning, language]);

  const handleSubmit = useCallback(async () => {
    if (!problem || isSubmitting) return;

    setIsSubmitting(true);
    setExecError(null);
    setExplanation(null);
    setConsoleTab("testResult");
    setHasRun(false);

    try {
      const req = {
        code,
        problemId,
        functionSignature: { ...problem.functionSignature, language },
        testCases: problem.visibleTests,
      };
      const result = await executeCode(req, true);
      setExecResult(result);
      setHasRun(true);
      if (result.status === "accepted") {
        problemStorage.setStatus(problemId, "solved");
      } else if (problemStorage.getStatus(problemId) !== "solved") {
        problemStorage.setStatus(problemId, "attempted");
      }
    } catch (err: any) {
      setExecError(err.message || "Submission service unavailable. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, code, problemId, isSubmitting, language]);

  const handleExplainError = useCallback(async () => {
    if (!execResult) return;
    const errorMsg = execResult.compilerError || execResult.runtimeError;
    if (!errorMsg) return;

    setIsExplaining(true);
    setExplanation(null);

    try {
      const exp = await explainError(code, errorMsg, language);
      setExplanation(exp);
    } catch (err: any) {
      setExplanation(err.message || "Failed to generate explanation. Please try again.");
    } finally {
      setIsExplaining(false);
    }
  }, [execResult, code, language]);

  // Keyboard shortcut: Ctrl+Enter = Run, Ctrl+Shift+Enter = Submit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRun, handleSubmit]);

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--ink-secondary)]">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-amber-500" />
          <p className="font-semibold">Problem #{problemId} not found.</p>
          <Link href="/practice/problems" className="text-[var(--accent)] text-sm hover:underline">
            ← Return to Problem Bank
          </Link>
        </div>
      </div>
    );
  }

  const selectedTestCase = visibleTests[selectedCase];
  const selectedCaseResult = selectedTestCase ? caseResults[selectedTestCase.id] : null;

  const isExecuting = isRunning || isSubmitting;

  return (
    <div className="flex flex-col h-full bg-[var(--surface-subdued)]">
      {/* Breadcrumb Bar */}
      <div className="w-full bg-[var(--surface)] shadow-xs z-30 shrink-0 border-b border-[var(--border)]">
        <div className="w-full px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <Link
              className="flex items-center gap-1.5 text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors"
              href="/practice/problems"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Problem Bank</span>
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--surface-subdued)] text-[var(--ink)] font-semibold border border-[var(--border)]">
              #{problem.id}
            </span>
            <span className="text-[var(--ink)] font-semibold truncate max-w-[200px] sm:max-w-md">
              {problem.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-md hidden sm:flex">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Practice Sandbox (Streak Safe)
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 w-full px-2 sm:px-4 py-3 sm:py-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-full">

          {/* LEFT: Problem Spec */}
          <section className="lg:col-span-5 flex flex-col h-full overflow-y-auto rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs p-5 sm:p-6 space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-3 pb-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-[var(--ink)] font-display">
                  {problem.id}. {problem.title}
                </h1>
                <button
                  className="text-[var(--ink-secondary)] hover:text-[var(--accent)] p-1.5 rounded hover:bg-[var(--surface-subdued)] transition-colors"
                  title="Bookmark problem"
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={clsx(
                  "px-2.5 py-1 rounded-md text-xs font-semibold border",
                  problem.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : problem.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-rose-50 text-rose-700 border-rose-100"
                )}>
                  {problem.difficulty}
                </span>
                {problem.topics?.map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-1 rounded-md bg-[var(--surface-subdued)] text-[var(--ink-secondary)] text-xs font-medium border border-[var(--border)]"
                  >
                    {topic}
                  </span>
                ))}
                {problem.acceptance && (
                  <span className="ml-auto font-mono text-[11px] text-[var(--ink-tertiary)]">
                    Acceptance: <strong className="text-[var(--ink)]">{problem.acceptance}</strong>
                  </span>
                )}
              </div>

              {problem.companies && problem.companies.length > 0 && (
                <div className="flex items-center gap-2 text-[var(--ink-secondary)] text-xs font-medium flex-wrap">
                  <Building className="w-4 h-4 shrink-0" />
                  <span>Targeted in:</span>
                  {problem.companies.map((comp) => (
                    <span
                      key={comp}
                      className="px-1.5 py-0.5 rounded bg-[var(--surface-subdued)] font-mono text-[var(--ink)] border border-[var(--border)]"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Problem Body */}
            <article className="space-y-5 text-[var(--ink)] text-[14px] leading-relaxed">
              {problem.description?.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {problem.objective && (
                <div className="rounded-lg bg-[var(--accent-soft)] p-4 space-y-2 border border-[var(--accent-soft-border)]">
                  <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-semibold">
                    <Target className="w-4 h-4" />
                    <span>Algorithmic Objective</span>
                  </div>
                  <p className="text-sm text-[var(--ink-secondary)] font-mono">
                    {problem.objective}
                  </p>
                </div>
              )}

              {problem.visibleTests && problem.visibleTests.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] uppercase tracking-wider text-[var(--ink-secondary)] font-bold">Examples</h4>
                  {problem.visibleTests.map((tc, i) => (
                    <div key={tc.id} className="bg-[var(--surface-subdued)] rounded-lg p-3 font-mono text-xs space-y-1.5 border border-[var(--border)]">
                      <div className="text-[10px] text-[var(--ink-secondary)] uppercase font-semibold">Example {i + 1}</div>
                      <div><span className="text-[var(--ink-secondary)] font-semibold">Input:</span>{" "}
                        {Object.entries(tc.input).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(", ")}
                      </div>
                      <div><span className="text-[var(--ink-secondary)] font-semibold">Output:</span> {JSON.stringify(tc.expectedOutput)}</div>
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints && problem.constraints.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-[11px] uppercase tracking-wider text-[var(--ink-secondary)] font-bold">Constraints</h4>
                  <ul className="space-y-1 font-mono text-xs text-[var(--ink-secondary)] list-disc pl-5">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}><code className="text-[var(--ink)]">{c}</code></li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {/* Hint */}
            {hintOpen && problem.hint && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm space-y-2">
                <div className="font-semibold text-amber-800 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />Pattern Clue:
                </div>
                <p className="text-amber-900/80 leading-relaxed font-sans">
                  {problem.hint}
                </p>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-auto pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-subdued)] border border-[var(--border)] p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  {problem.hint && (
                    <button
                      onClick={() => setHintOpen(!hintOpen)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-gray-50 text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500" />{hintOpen ? "Hide Hint" : "View Hint"}
                    </button>
                  )}
                  <button className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-gray-50 text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 transition-colors">
                    <History className="w-4 h-4 text-[var(--ink-tertiary)]" />Submissions
                  </button>
                </div>
                <button className="text-[var(--ink-secondary)] hover:text-[var(--ink)] text-xs font-medium flex items-center gap-1.5 transition-colors px-2">
                  <MessageSquare className="w-4 h-4" />Discussion
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Monaco + Console */}
          <section className="lg:col-span-7 flex flex-col h-full rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">

            {/* Editor Toolbar */}
            <div className="h-12 px-4 bg-[var(--surface-subdued)] border-b border-[var(--border)] flex items-center justify-between gap-4 select-none shrink-0">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none h-8 pl-3 pr-8 bg-[var(--surface)] border border-[var(--border)] rounded-md font-mono text-xs font-medium text-[var(--ink)] cursor-pointer focus:outline-none focus:border-[var(--accent)] hover:bg-gray-50 transition-colors"
                >
                  <option value="java">Java (OpenJDK 21)</option>
                  <option value="python">Python 3.12</option>
                  <option value="cpp">C++ 17</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-tertiary)] pointer-events-none" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(getInitialCode())}
                  className="h-8 px-2.5 rounded-md hover:bg-gray-200 text-[var(--ink-secondary)] hover:text-[var(--ink)] text-xs font-medium flex items-center gap-1.5 transition-colors"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  onClick={handleRun}
                  disabled={isExecuting}
                  className="h-8 px-3 rounded-md bg-[var(--surface)] border border-[var(--border)] hover:bg-gray-50 text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-[var(--success)]" />}
                  <span>{isRunning ? "Running…" : "Run"}</span>
                  <kbd className="font-mono text-[10px] text-[var(--ink-tertiary)] ml-1 hidden md:inline">⌘↵</kbd>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isExecuting}
                  className="h-8 px-4 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                  <span>{isSubmitting ? "Submitting…" : "Submit"}</span>
                  <kbd className="font-mono text-[10px] text-white/70 ml-1 hidden md:inline">⌘⇧↵</kbd>
                </button>
              </div>
            </div>

            {/* Monaco */}
            <div className="flex-1 bg-[#0F172A] min-h-0">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "JetBrains Mono, monospace",
                  lineHeight: 22,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            </div>

            {/* Execution Console */}
            <div className="h-72 flex flex-col bg-[var(--surface)] shrink-0 border-t border-[var(--border)]">

              {/* Console Tabs */}
              <div className="h-10 px-4 bg-[var(--surface-subdued)] border-b border-[var(--border)] flex items-center justify-between shrink-0 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-0.5 h-full">
                  {(["testCases", "testResult", "stdout"] as const).map((tab) => {
                    const labels = { testCases: "Test Cases", testResult: "Test Result", stdout: "Stdout" };
                    const icons = {
                      testCases: <ListChecks className="w-3.5 h-3.5" />,
                      testResult: execResult
                        ? execResult.status === "accepted"
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          : <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        : <CheckCircle2 className="w-3.5 h-3.5" />,
                      stdout: <Terminal className="w-3.5 h-3.5" />,
                    };
                    return (
                      <button
                        key={tab}
                        onClick={() => setConsoleTab(tab)}
                        className={clsx(
                          "h-full px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap",
                          consoleTab === tab
                            ? "text-[var(--ink)] border-[var(--accent)] bg-[var(--surface)]"
                            : "text-[var(--ink-secondary)] border-transparent hover:text-[var(--ink)] hover:bg-gray-50"
                        )}
                      >
                        {icons[tab]}
                        {labels[tab]}
                      </button>
                    );
                  })}
                </div>

                {/* Aggregate result badge */}
                {execResult && hasRun && (
                  <div className={clsx(
                    "flex items-center gap-1.5 font-mono text-[11px] font-bold px-2 py-0.5 rounded shrink-0",
                    execResult.status === "accepted"
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-rose-700 bg-rose-50"
                  )}>
                    {execResult.status === "accepted"
                      ? <CheckCircle2 className="w-3.5 h-3.5" />
                      : <XCircle className="w-3.5 h-3.5" />
                    }
                    {execResult.passedTests}/{execResult.totalTests} Passed
                  </div>
                )}
              </div>

              {/* Console Content */}
              <div className="flex-1 p-4 overflow-y-auto">

                {/* ── ERROR state (network/service) ── */}
                {execError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Execution Service Error</p>
                      <p className="text-xs mt-1 font-mono">{execError}</p>
                    </div>
                  </div>
                )}

                {/* ── TEST CASES TAB ── */}
                {consoleTab === "testCases" && !execError && (
                  <div className="space-y-4">
                    {/* Case tabs */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {visibleTests.map((tc, i) => {
                        const r = caseResults[tc.id];
                        const status = r?.status ?? (isExecuting ? "running" : "pending");
                        return (
                          <button
                            key={tc.id}
                            onClick={() => { setSelectedCase(i); }}
                            className={clsx(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors",
                              selectedCase === i
                                ? "bg-[var(--surface-subdued)] border-[var(--border-strong)] text-[var(--ink)]"
                                : "border-transparent text-[var(--ink-secondary)] hover:bg-[var(--surface-subdued)] hover:text-[var(--ink)]"
                            )}
                          >
                            Case {i + 1}
                            <CaseTabIcon status={status} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Case details */}
                    {selectedCaseResult ? (
                      <TestCaseDetail tc={selectedCaseResult} />
                    ) : selectedTestCase ? (
                      <div className="font-mono text-xs space-y-3">
                        <div>
                          <div className="text-[10px] font-semibold uppercase text-[var(--ink-tertiary)] mb-1 tracking-wider">Input</div>
                          <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-lg p-3 space-y-1 text-[var(--ink)]">
                            {Object.entries(selectedTestCase.input).map(([key, val]) => (
                              <div key={key}>
                                <span className="text-[var(--ink-secondary)] font-semibold">{key} = </span>
                                {JSON.stringify(val)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase text-[var(--ink-tertiary)] mb-1 tracking-wider">Expected Output</div>
                          <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-lg p-3 text-[var(--ink)]">
                            {JSON.stringify(selectedTestCase.expectedOutput)}
                          </div>
                        </div>
                        {isExecuting && (
                          <div className="flex items-center gap-2 text-[var(--ink-secondary)] text-xs">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Executing…</span>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

                {/* ── TEST RESULT TAB ── */}
                {consoleTab === "testResult" && !execError && (
                  <div className="space-y-4">
                    {isExecuting ? (
                      <div className="flex items-center gap-3 text-[var(--ink-secondary)] text-sm py-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Compiling and running your code…</span>
                      </div>
                    ) : execResult && hasRun ? (
                      <>
                        <VerdictBanner 
                          result={execResult} 
                          explanation={explanation}
                          isExplaining={isExplaining}
                          onExplain={handleExplainError}
                        />

                        {/* Per-case results (visible only for non-compile-error) */}
                        {execResult.status !== "compile_error" && execResult.testResults.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              {execResult.testResults.map((tr, i) => (
                                <button
                                  key={tr.id}
                                  onClick={() => { setSelectedCase(i); setConsoleTab("testCases"); }}
                                  className={clsx(
                                    "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors",
                                    tr.status === "passed"
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                      : tr.status === "runtime_error" || tr.status === "time_limit"
                                      ? "bg-amber-50 border-amber-200 text-amber-700"
                                      : "bg-rose-50 border-rose-200 text-rose-700"
                                  )}
                                >
                                  {tr.id.startsWith("hidden") ? `Hidden #${i + 1}` : `Case ${i + 1}`}
                                  <CaseTabIcon status={tr.status} />
                                </button>
                              ))}
                            </div>

                            {/* First failing case detail */}
                            {execResult.status !== "accepted" && (() => {
                              const failedCase = execResult.testResults.find(r => r.status !== "passed");
                              return failedCase ? (
                                <div className="pt-1">
                                  <div className="text-[11px] font-semibold uppercase text-[var(--ink-tertiary)] tracking-wider mb-2">
                                    First Failing Test Case
                                  </div>
                                  <TestCaseDetail tc={failedCase} />
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-[var(--ink-tertiary)] text-sm py-4">
                        Click <strong className="text-[var(--ink)]">Run</strong> to see test results here.
                      </div>
                    )}
                  </div>
                )}

                {/* ── STDOUT TAB ── */}
                {consoleTab === "stdout" && !execError && (
                  <div className="font-mono text-xs text-[var(--ink-secondary)]">
                    {isExecuting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />Running…
                      </span>
                    ) : (
                      <span className="italic">No standard output generated.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
