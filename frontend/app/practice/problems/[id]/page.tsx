"use client";

import { ASKED_IN_CAVEAT } from "@/lib/data/askedIn";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Building, Target, Lightbulb,
  Play, UploadCloud, ChevronDown, RotateCcw, CheckCircle2, XCircle, ListChecks,
  Terminal, Loader2, AlertTriangle, Clock, MemoryStick
} from "lucide-react";
import { clsx } from "clsx";
import Editor from "@monaco-editor/react";
import { getProblem, generateStarterCode } from "@/lib/problems/problemRegistry";
import { problemStorage } from "@/lib/problems/problemStorage";
import { executeCode, explainError } from "@/lib/execution/executionClient";
import { MONACO_THEME, defineMonacoTheme } from "@/lib/monacoTheme";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
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
        <div className="text-[10px] font-semibold uppercase text-mute mb-1 tracking-wider">
          Input
        </div>
        <div className="bg-paper-2 border border-hair rounded-lg p-3 space-y-1 text-ink">
          {Object.entries(tc.input).map(([key, val]) => (
            <div key={key}>
              <span className="text-body font-semibold">{key} = </span>
              {JSON.stringify(val)}
            </div>
          ))}
        </div>
      </div>

      {/* Expected vs Actual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase text-mute mb-1 tracking-wider">
            Expected Output
          </div>
          <div className="bg-paper-2 border border-hair rounded-lg p-3 text-ink">
            {JSON.stringify(tc.expectedOutput)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase text-mute mb-1 tracking-wider flex items-center justify-between">
            <span>Your Output</span>
            {tc.runtimeMs !== undefined && (
              <span className="normal-case text-mute">{tc.runtimeMs}ms</span>
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
              : <span className="text-mute italic">No output</span>
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
      <div className="flex items-center justify-center h-full text-body">
        <div className="text-center space-y-2">
          <p className="eyebrow">Not found</p>
          <p className="display text-[40px]">No problem #{problemId}</p>
          <Link href="/practice/problems" className="text-[14px] font-semibold text-accent-ink hover:underline">
            ← All problems
          </Link>
        </div>
      </div>
    );
  }

  const selectedTestCase = visibleTests[selectedCase];
  const selectedCaseResult = selectedTestCase ? caseResults[selectedTestCase.id] : null;

  const isExecuting = isRunning || isSubmitting;

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="flex shrink-0 items-center gap-3 border-b-[1.5px] border-hair bg-paper px-4 py-2.5 sm:px-6">
        <Link className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink" href="/practice/problems">
          <ArrowLeft className="size-3.5" />
          Problems
        </Link>
        <span className="text-mute">/</span>
        <span className="truncate text-[14px] font-semibold">{problem.title}</span>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 w-full px-2 sm:px-4 py-3 sm:py-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-full">

          {/* LEFT: Problem Spec */}
          <section className="flex h-full flex-col space-y-6 overflow-y-auto rounded-2xl border-[1.5px] border-hair bg-card p-5 sm:p-6 lg:col-span-5">

            <header className="flex flex-col gap-3 border-b-[1.5px] border-hair pb-5">
              <p className="eyebrow">Problem {String(problem.id).padStart(2, "0")}</p>
              <h1 className="display text-[34px] md:text-[40px]">{problem.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={problem.difficulty === "Easy" ? "success" : problem.difficulty === "Medium" ? "warning" : "danger"}>{problem.difficulty}</Badge>
                {problem.topics?.map((topic) => (
                  <Badge key={topic}>{topic}</Badge>
                ))}
              </div>
              {problem.companies && problem.companies.length > 0 && (
                <p className="flex flex-wrap items-center gap-1.5 text-[13px] text-mute" title={ASKED_IN_CAVEAT}>
                  <Building className="size-4 shrink-0" />
                  Topic reported at {problem.companies.join(", ")}
                </p>
              )}
            </header>

            {/* Problem Body */}
            <article className="space-y-5 text-[16px] leading-relaxed">
              {problem.description?.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {problem.objective && (
                <div className="space-y-1.5 rounded-xl border-[1.5px] border-hair bg-paper-2 p-4">
                  <p className="eyebrow flex items-center gap-1.5">
                    <Target className="size-3.5" /> Goal
                  </p>
                  <p className="font-mono text-[13px] text-ink">
                    {problem.objective}
                  </p>
                </div>
              )}

              {problem.visibleTests && problem.visibleTests.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] uppercase tracking-wider text-body font-bold">Examples</h4>
                  {problem.visibleTests.map((tc, i) => (
                    <div key={tc.id} className="bg-paper-2 rounded-lg p-3 font-mono text-xs space-y-1.5 border border-hair">
                      <div className="text-[10px] text-body uppercase font-semibold">Example {i + 1}</div>
                      <div><span className="text-body font-semibold">Input:</span>{" "}
                        {Object.entries(tc.input).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(", ")}
                      </div>
                      <div><span className="text-body font-semibold">Output:</span> {JSON.stringify(tc.expectedOutput)}</div>
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints && problem.constraints.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-[11px] uppercase tracking-wider text-body font-bold">Constraints</h4>
                  <ul className="space-y-1 font-mono text-xs text-body list-disc pl-5">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}><code className="text-ink">{c}</code></li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {/* Hint */}
            {hintOpen && problem.hint && (
              <div className="fade-in space-y-1.5 rounded-xl border-[1.5px] border-[var(--warning-soft-border)] bg-[var(--warning-soft)] p-4">
                <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--warning)]">
                  <Lightbulb className="size-3.5" /> Hint
                </p>
                <p className="text-[15px] leading-relaxed">
                  {problem.hint}
                </p>
              </div>
            )}

            {problem.hint && (
              <div className="mt-auto pt-2">
                <button onClick={() => setHintOpen(!hintOpen)} className={buttonClass("secondary", "sm")} aria-expanded={hintOpen}>
                  <Lightbulb className="size-4" />
                  {hintOpen ? "Hide hint" : "Show hint"}
                </button>
              </div>
            )}
          </section>

          {/* RIGHT: Monaco + Console */}
          <section className="brut flex h-full flex-col overflow-hidden rounded-2xl bg-card lg:col-span-7">

            {/* Editor Toolbar */}
            <div className="h-14 px-3 bg-paper-2 border-b-[1.5px] border-hair flex items-center justify-between gap-4 select-none shrink-0">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  aria-label="Language"
                  className="h-9 cursor-pointer appearance-none rounded-xl border-2 border-hair bg-card pl-3 pr-8 font-mono text-[12px] focus:border-accent"
                >
                  <option value="java">Java (OpenJDK 21)</option>
                  <option value="python">Python 3.12</option>
                  <option value="cpp">C++ 17</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(getInitialCode())}
                  className={buttonClass("ghost", "sm")}
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  onClick={handleRun}
                  disabled={isExecuting}
                  className={buttonClass("secondary", "sm")}
                >
                  {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="size-3.5" />}
                  <span>{isRunning ? "Running…" : "Run"}</span>
                  <kbd className="ml-1 hidden font-mono text-[10px] normal-case opacity-60 md:inline">⌘↵</kbd>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isExecuting}
                  className={buttonClass("primary", "sm")}
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                  <span>{isSubmitting ? "Submitting…" : "Submit"}</span>
                  <kbd className="ml-1 hidden font-mono text-[10px] normal-case opacity-60 md:inline">⌘⇧↵</kbd>
                </button>
              </div>
            </div>

            {/* Monaco */}
            <div className="min-h-0 flex-1 bg-night">
              <Editor
                height="100%"
                language={language}
                theme={MONACO_THEME}
                beforeMount={defineMonacoTheme}
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
            <div className="h-72 flex flex-col bg-card shrink-0 border-t border-hair">

              {/* Console Tabs */}
              <div className="h-11 px-3 bg-paper-2 border-b-[1.5px] border-hair flex items-center justify-between shrink-0 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-0.5 h-full">
                  {(["testCases", "testResult", "stdout"] as const).map((tab) => {
                    const labels = { testCases: "Test cases", testResult: "Result", stdout: "Output" };
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
                          "label-cond flex h-full items-center gap-1.5 whitespace-nowrap border-b-2 px-3 text-[14px] transition-colors",
                          consoleTab === tab ? "border-accent bg-card text-ink" : "border-transparent text-body hover:text-ink"
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
                                ? "bg-paper-2 border-[var(--border-strong)] text-ink"
                                : "border-transparent text-body hover:bg-paper-2 hover:text-ink"
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
                          <div className="text-[10px] font-semibold uppercase text-mute mb-1 tracking-wider">Input</div>
                          <div className="bg-paper-2 border border-hair rounded-lg p-3 space-y-1 text-ink">
                            {Object.entries(selectedTestCase.input).map(([key, val]) => (
                              <div key={key}>
                                <span className="text-body font-semibold">{key} = </span>
                                {JSON.stringify(val)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase text-mute mb-1 tracking-wider">Expected Output</div>
                          <div className="bg-paper-2 border border-hair rounded-lg p-3 text-ink">
                            {JSON.stringify(selectedTestCase.expectedOutput)}
                          </div>
                        </div>
                        {isExecuting && (
                          <div className="flex items-center gap-2 text-body text-xs">
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
                      <div className="flex items-center gap-3 text-body text-sm py-4">
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
                                  <div className="text-[11px] font-semibold uppercase text-mute tracking-wider mb-2">
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
                      <div className="text-mute text-sm py-4">
                        Click <strong className="text-ink">Run</strong> to see test results here.
                      </div>
                    )}
                  </div>
                )}

                {/* ── STDOUT TAB ── */}
                {consoleTab === "stdout" && !execError && (
                  <div className="font-mono text-xs text-body">
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
