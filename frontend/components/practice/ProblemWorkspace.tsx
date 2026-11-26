"use client";

import { useEditorPrefs } from "@/lib/prefs";
import { ASKED_IN_CAVEAT } from "@/lib/data/askedIn";
import { useState, useCallback, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Building, Target, Lightbulb, Tag, Compass,
  Play, UploadCloud, ChevronDown, RotateCcw, CheckCircle2, XCircle, ListChecks,
  Terminal, Loader2, AlertTriangle, Clock, MemoryStick, ChevronLeft, ChevronRight, Shuffle, FileText, History, NotebookPen
} from "lucide-react";
import { clsx } from "clsx";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import { getProblem, generateStarterCode, problemOrder, categoryOf } from "@/lib/problems/problemRegistry";
import { PatternGuideCard } from "@/components/practice/PatternGuideCard";
import { SubmissionsPanel } from "@/components/practice/SubmissionsPanel";
import { ProblemNotes } from "@/components/practice/ProblemNotes";
import { problemStorage } from "@/lib/problems/problemStorage";
import { trackProblemSolve } from "@/lib/notify";
import { logSubmission } from "@/lib/problems/submissions";
import { executeCode, explainError } from "@/lib/execution/executionClient";
import { MONACO_THEME, defineMonacoTheme } from "@/lib/monacoTheme";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import type { ExecutionResult, TestCaseResult } from "@/lib/execution/executionTypes";
import { errorMessage } from "@/lib/utils";

function readDraft(key?: string): { language: string; code: string } | null {
  if (!key || typeof window === "undefined") return null;
  try {
    const d = JSON.parse(localStorage.getItem(key) || "null");
    return d && typeof d.code === "string" && typeof d.language === "string" ? d : null;
  } catch {
    return null;
  }
}

const chipCls = (on: boolean) =>
  clsx(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium transition-colors",
    on ? "bg-ink text-paper" : "bg-paper-2 text-body hover:text-ink"
  );

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
  if (status === "running") return <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />;
  if (status === "passed") return <CheckCircle2 className="w-3.5 h-3.5 text-note" />;
  if (status === "wrong_answer" || status === "failed") return <XCircle className="w-3.5 h-3.5 text-danger" />;
  if (status === "compile_error" || status === "runtime_error" || status === "time_limit")
    return <AlertTriangle className="w-3.5 h-3.5 text-gold" />;
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
    ? "bg-success-soft border-success-line text-note"
    : isCompileError
    ? "bg-warning-soft border-warning-line text-warning"
    : "bg-danger-soft border-danger-line text-danger";

  const labelClass = isAccepted
    ? "bg-note text-paper"
    : isCompileError
    ? "bg-gold text-paper"
    : "bg-danger text-paper";

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
          <pre className="font-mono text-xs whitespace-pre-wrap bg-warning-soft/60 border border-warning-line rounded p-3 overflow-auto max-h-48 text-warning">
            {result.compilerError}
          </pre>
          <div className="flex justify-end">
            <button 
              onClick={onExplain}
              disabled={isExplaining}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-warning-line text-warning hover:bg-warning-line rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isExplaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
              {isExplaining ? "Explaining..." : "Explain Error"}
            </button>
          </div>
          {explanation && (
            <div className="p-3 bg-accent-soft border border-accent-line rounded-md text-sm text-accent-ink prose prose-sm max-w-none">
              <div className="flex items-center gap-2 mb-2 font-semibold text-accent-ink">
                <Lightbulb className="w-4 h-4 text-accent-ink" />
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
          <pre className="font-mono text-xs whitespace-pre-wrap bg-danger-soft/60 border border-danger-line rounded p-3 overflow-auto max-h-48 text-danger">
            {result.runtimeError}
          </pre>
          <div className="flex justify-end">
            <button 
              onClick={onExplain}
              disabled={isExplaining}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-danger-line text-danger hover:bg-danger-line rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isExplaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
              {isExplaining ? "Explaining..." : "Explain Error"}
            </button>
          </div>
          {explanation && (
            <div className="p-3 bg-accent-soft border border-accent-line rounded-md text-sm text-accent-ink prose prose-sm max-w-none">
              <div className="flex items-center gap-2 mb-2 font-semibold text-accent-ink">
                <Lightbulb className="w-4 h-4 text-accent-ink" />
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
        <div className="bg-paper-2 border-[1.5px] border-hair rounded-lg p-3 space-y-1 text-ink">
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
          <div className="bg-paper-2 border-[1.5px] border-hair rounded-lg p-3 text-ink">
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
              ? "bg-success-soft border-success-line text-note"
              : isError
              ? "bg-warning-soft border-warning-line text-warning"
              : "bg-danger-soft border-danger-line text-danger"
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
          ? "bg-success-soft border-success-line text-note"
          : isError
          ? "bg-warning-soft border-warning-line text-warning"
          : "bg-danger-soft border-danger-line text-danger"
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
export interface WorkspaceEvent {
  kind: "run" | "submit";
  accepted: boolean;
  language: string;
}

/** The LeetCode-style editor: description and tests on the left, Monaco and the console on the right.
 *  Used by /practice/problems/[id] and the Daily page. */
export function ProblemWorkspace({
  problemId,
  header,
  onResult,
  draftKey,
}: {
  problemId: string;
  /** Replaces the default "Problems / title" bar. */
  header?: ReactNode;
  /** Called after every successful run or submit (not on network errors). */
  onResult?: (e: WorkspaceEvent) => void;
  /** When set, the code and language are saved under this localStorage key and restored. */
  draftKey?: string;
}) {
  const problem = getProblem(problemId);
  const draft = readDraft(draftKey);
  const router = useRouter();

  const [editorPrefs] = useEditorPrefs();
  const [language, setLanguage] = useState<string>(draft?.language ?? editorPrefs.language);
  // The saved default language (Settings > Coding) arrives after hydration; adopt it once when it does.
  const [adoptedDefault, setAdoptedDefault] = useState<string>(editorPrefs.language);
  if (editorPrefs.language !== adoptedDefault) {
    setAdoptedDefault(editorPrefs.language);
    if (!draft) setLanguage(editorPrefs.language);
  }
  const [panel, setPanel] = useState<"topics" | "companies" | "hint" | "pattern" | null>(null);
  // Left panel tabs, like LeetCode's Description / Submissions; ?submission=<id> opens one directly
  const [openSubmission, setOpenSubmission] = useState<string | null>(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("submission")
  );
  const [leftTab, setLeftTab] = useState<"description" | "submissions" | "notes">(() => (openSubmission ? "submissions" : "description"));
  const [subsRefresh, setSubsRefresh] = useState(0);
  const [latestSubmission, setLatestSubmission] = useState<string | null>(null);
  const [status, setStatus] = useState(() => problemStorage.getStatus(problemId));
  const [consoleTab, setConsoleTab] = useState<"testCases" | "testResult" | "stdout">("testCases");
  const [selectedCase, setSelectedCase] = useState(0);

  const getInitialCode = useCallback(() => {
    if (!problem) return "// Write your solution here\n";
    if (problem.starterCode?.[language]) return problem.starterCode[language];
    return generateStarterCode(problem.functionSignature, language);
  }, [problem, language]);

  const [code, setCode] = useState(() => draft?.code ?? getInitialCode());

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [execError, setExecError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null);
  const [editorInstance, setEditorInstance] = useState<Parameters<OnMount>[0] | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);
  };

  // New problem or language: fresh starter code and a clean run panel
  const editorKey = problem ? `${problem.id}|${language}` : null;
  // a restored draft counts as already loaded, so it isn't replaced by starter code
  const [loadedKey, setLoadedKey] = useState<string | null>(draft && problem ? `${problem.id}|${draft.language}` : null);
  if (problem && editorKey !== loadedKey) {
    setLoadedKey(editorKey);
    setCode(problem.starterCode?.[language] || generateStarterCode(problem.functionSignature, language));
    setExecResult(null);
    setExecError(null);
    setHasRun(false);
    setSelectedCase(0);
    setPanel(null);
  }

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
      onResult?.({ kind: "run", accepted: result.status === "accepted", language });
      if (problemStorage.getStatus(problemId) !== "solved") {
        problemStorage.setStatus(problemId, "attempted");
      }
    } catch (err) {
      setExecError(errorMessage(err) || "Execution service unavailable. Is the backend running?");
    } finally {
      setIsRunning(false);
    }
  }, [problem, code, problemId, isRunning, language, onResult]);

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
      onResult?.({ kind: "submit", accepted: result.status === "accepted", language });
      const notifySolve = trackProblemSolve(problemId); // snapshot before the submission marks it solved
      logSubmission({ id: problemId, v: result.status, l: language, p: result.passedTests, n: result.totalTests });
      if (result.submissionId) {
        // show the submissions list with the new one on top; its details load only when clicked
        setSubsRefresh((n) => n + 1);
        setOpenSubmission(null);
        setLatestSubmission(result.submissionId);
        setLeftTab("submissions");
      }
      if (result.status === "accepted") {
        problemStorage.setStatus(problemId, "solved");
      } else if (problemStorage.getStatus(problemId) !== "solved") {
        problemStorage.setStatus(problemId, "attempted");
      }
      setStatus(problemStorage.getStatus(problemId));
      notifySolve(result.status === "accepted");
    } catch (err) {
      setExecError(errorMessage(err) || "Submission service unavailable. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  }, [problem, code, problemId, isSubmitting, language, onResult]);

  const handleExplainError = useCallback(async () => {
    if (!execResult) return;
    const errorMsg = execResult.compilerError || execResult.runtimeError;
    if (!errorMsg) return;

    setIsExplaining(true);
    setExplanation(null);

    try {
      const exp = await explainError(code, errorMsg, language);
      setExplanation(exp);
    } catch (err) {
      setExplanation(errorMessage(err) || "Failed to generate explanation. Please try again.");
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

  // Daily drafts: keep the code and language so a reload or tomorrow's visit picks up where you left off
  useEffect(() => {
    if (!draftKey) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ language, code }));
      } catch {
        /* storage full or blocked */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [draftKey, language, code]);

  /** Puts a past submission's code back in the editor, switching language without loading starter code. */
  const loadCode = (c: string, lang: string) => {
    if (!problem) return;
    setLanguage(lang);
    setLoadedKey(`${problem.id}|${lang}`);
    setCode(c);
  };

  const order = problemOrder();
  const at = order.indexOf(problemId);
  const prevId = at > 0 ? order[at - 1] : null;
  const nextId = at >= 0 && at < order.length - 1 ? order[at + 1] : null;
  const goRandom = () => router.push(`/practice/problems/${order[(Math.max(at, 0) + 1 + Math.floor(Math.random() * (order.length - 1))) % order.length]}`);

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
      {header ?? (
        <div className="flex shrink-0 items-center gap-3 border-b-[1.5px] border-hair bg-paper px-4 py-2.5 sm:px-6">
          <Link className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink" href="/practice/problems">
            <ArrowLeft className="size-3.5" />
            Problems
          </Link>
          <span className="text-mute">/</span>
          <span className="truncate text-[14px] font-semibold">{problem.title}</span>
          {status !== "unsolved" && (
            <span className={clsx("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-semibold", status === "solved" ? "bg-note/15 text-note" : "bg-gold/25 text-warning")}>
              {status === "solved" ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
              {status === "solved" ? "Solved" : "Attempted"}
            </span>
          )}
          <nav aria-label="Other problems" className="ml-auto flex shrink-0 items-center gap-1">
            {prevId && (
              <Link href={`/practice/problems/${prevId}`} aria-label="Previous problem" title="Previous problem" className="tap grid size-8 place-items-center rounded-lg text-mute hover:bg-paper-2 hover:text-ink">
                <ChevronLeft className="size-4" />
              </Link>
            )}
            <button type="button" onClick={goRandom} aria-label="Random problem" title="Random problem" className="tap grid size-8 place-items-center rounded-lg text-mute hover:bg-paper-2 hover:text-ink">
              <Shuffle className="size-4" />
            </button>
            {nextId && (
              <Link href={`/practice/problems/${nextId}`} aria-label="Next problem" title="Next problem" className="tap grid size-8 place-items-center rounded-lg text-mute hover:bg-paper-2 hover:text-ink">
                <ChevronRight className="size-4" />
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 w-full px-2 sm:px-4 py-3 sm:py-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 h-full">

          {/* LEFT: Problem Spec */}
          <section className="flex h-full flex-col overflow-hidden rounded-2xl border-[1.5px] border-hair bg-card lg:col-span-5">
            <div role="tablist" aria-label="Problem panel" className="flex shrink-0 gap-1 border-b-[1.5px] border-hair bg-paper-2 px-2 pt-1.5">
              {(
                [
                  ["description", "Description", FileText],
                  ["submissions", "Submissions", History],
                  ["notes", "Notes", NotebookPen],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={leftTab === id}
                  onClick={() => setLeftTab(id)}
                  className={clsx(
                    "label-cond -mb-[1.5px] inline-flex items-center gap-1.5 rounded-t-lg border-[1.5px] px-3 py-1.5 text-[14px]",
                    leftTab === id ? "border-hair border-b-card bg-card text-ink" : "border-transparent text-body hover:text-ink"
                  )}
                >
                  <Icon className="size-3.5" /> {label}
                </button>
              ))}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            {leftTab === "submissions" && (
              <SubmissionsPanel problemId={problemId} refreshKey={subsRefresh} openId={openSubmission} onOpen={setOpenSubmission} onLoadCode={loadCode} highlightId={latestSubmission} />
            )}
            {leftTab === "notes" && <ProblemNotes key={problemId} problemId={problemId} />}
            {leftTab === "description" && (
            <div className="space-y-6">
            <header className="flex flex-col gap-3">
              <h1 className="text-[22px] font-semibold leading-snug text-ink md:text-[24px]">{problem.title}</h1>
              {/* LeetCode-style chip row: difficulty, then toggles for topics, companies and the hint */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={clsx(
                    "rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                    problem.difficulty === "Easy" ? "bg-note/15 text-note" : problem.difficulty === "Medium" ? "bg-gold/25 text-warning" : "bg-accent/15 text-accent-ink"
                  )}
                >
                  {problem.difficulty}
                </span>
                {problem.topics?.length > 0 && (
                  <button type="button" onClick={() => setPanel(panel === "topics" ? null : "topics")} aria-expanded={panel === "topics"} className={chipCls(panel === "topics")}>
                    <Tag className="size-3.5" /> Topics
                  </button>
                )}
                {problem.companies && problem.companies.length > 0 && (
                  <button type="button" onClick={() => setPanel(panel === "companies" ? null : "companies")} aria-expanded={panel === "companies"} className={chipCls(panel === "companies")}>
                    <Building className="size-3.5" /> Companies
                  </button>
                )}
                {problem.hint && (
                  <button type="button" onClick={() => setPanel(panel === "hint" ? null : "hint")} aria-expanded={panel === "hint"} className={chipCls(panel === "hint")}>
                    <Lightbulb className="size-3.5" /> Hint
                  </button>
                )}
                <button type="button" onClick={() => setPanel(panel === "pattern" ? null : "pattern")} aria-expanded={panel === "pattern"} className={chipCls(panel === "pattern")}>
                  <Compass className="size-3.5" /> Pattern: {categoryOf(problem)}
                </button>
              </div>
              {panel === "topics" && (
                <div className="fade-in flex flex-wrap gap-1.5">
                  {problem.topics.map((topic) => (
                    <Badge key={topic}>{topic}</Badge>
                  ))}
                </div>
              )}
              {panel === "companies" && problem.companies && (
                <p className="fade-in text-[13px] text-body" title={ASKED_IN_CAVEAT}>
                  Topic reported at {problem.companies.join(", ")}. <span className="text-mute">{ASKED_IN_CAVEAT}</span>
                </p>
              )}
              {panel === "pattern" && <PatternGuideCard category={categoryOf(problem)} compact />}
              {panel === "hint" && problem.hint && (
                <div className="fade-in rounded-xl border-[1.5px] border-warning-line bg-warning-soft p-3.5 text-[14px] leading-relaxed text-ink">{problem.hint}</div>
              )}
            </header>

            {/* Problem Body */}
            <article className="space-y-5 text-[16px] leading-relaxed">
              {problem.description?.map((p, idx) => (
                <p key={idx} className="whitespace-pre-wrap">{p}</p>
              ))}
              {problem.source && (
                <p className="text-[13px] text-mute">
                  Problem statement and tests from{" "}
                  <a href={problem.source.url} target="_blank" rel="noreferrer" className="underline">{problem.source.name}</a>
                  {" "}· © Exercism, {problem.source.license} License.
                </p>
              )}

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
                <div className="space-y-5 pt-1">
                  {problem.visibleTests.map((tc, i) => (
                    <div key={tc.id}>
                      <p className="mb-2 text-[15px] font-semibold text-ink">Example {i + 1}:</p>
                      <div className="space-y-1.5 border-l-2 border-hair pl-4 font-mono text-[13px] leading-relaxed">
                        <p>
                          <span className="font-sans font-semibold text-ink">Input: </span>
                          <span className="text-body">{Object.entries(tc.input).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(", ")}</span>
                        </p>
                        <p>
                          <span className="font-sans font-semibold text-ink">Output: </span>
                          <span className="text-body">{JSON.stringify(tc.expectedOutput)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints && problem.constraints.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[15px] font-semibold text-ink">Constraints:</p>
                  <ul className="space-y-1 font-mono text-xs text-body list-disc pl-5">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}><code className="text-ink">{c}</code></li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
            </div>
            )}
            </div>
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
                  minimap: { enabled: editorPrefs.minimap },
                  fontSize: editorPrefs.fontSize,
                  tabSize: editorPrefs.tabSize,
                  wordWrap: editorPrefs.wordWrap ? "on" : "off",
                  fontFamily: "JetBrains Mono, monospace",
                  lineHeight: Math.round(editorPrefs.fontSize * 1.7),
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
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-note" />
                          : <XCircle className="w-3.5 h-3.5 text-danger" />
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
                      ? "text-note bg-success-soft"
                      : "text-danger bg-danger-soft"
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
                  <div className="p-3 rounded-lg bg-danger-soft border border-danger-line text-danger text-sm flex items-start gap-2">
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
                                ? "bg-paper-2 border-ink/25 text-ink"
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
                          <div className="bg-paper-2 border-[1.5px] border-hair rounded-lg p-3 space-y-1 text-ink">
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
                          <div className="bg-paper-2 border-[1.5px] border-hair rounded-lg p-3 text-ink">
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
                                      ? "bg-success-soft border-success-line text-note"
                                      : tr.status === "runtime_error" || tr.status === "time_limit"
                                      ? "bg-warning-soft border-warning-line text-warning"
                                      : "bg-danger-soft border-danger-line text-danger"
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
