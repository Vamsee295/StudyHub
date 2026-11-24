"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  CheckSquare,
  Clock,
  Loader2,
  Mail,
  Phone,
  Printer,
  RefreshCw,
  RotateCcw,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";

import { resumeAnalysisApi } from "@/lib/resume-analyzer/client";
import { AnalysisStage, GetAnalysisResponse, ResumeAnalysisReport, ResumeAnalysisSummary } from "@/lib/resume-analyzer/types";

interface ResumeAnalysisDetailPageProps {
  analysisId: string;
}

type TabKey = "overview" | "ats" | "skills" | "company" | "action_plan";

export function ResumeAnalysisDetailPage({ analysisId }: ResumeAnalysisDetailPageProps) {
  const [analysis, setAnalysis] = useState<ResumeAnalysisSummary | null>(null);
  const [report, setReport] = useState<ResumeAnalysisReport | null>(null);
  const [stages, setStages] = useState<AnalysisStage[]>([]);
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const streamActiveRef = useRef(false);

  const startStream = useCallback(async () => {
    if (streamActiveRef.current) return;
    streamActiveRef.current = true;
    setProcessing(true);
    setError(null);

    try {
      const stream = await resumeAnalysisApi.processAnalysis(analysisId);
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done || !streamActiveRef.current) break;

        if (value.type === "stage") {
          setCurrentStageId(value.stage.id);
          setStages((prev) => {
            const index = prev.findIndex((s) => s.id === value.stage.id);
            if (index >= 0) {
              const next = [...prev];
              next[index] = { ...next[index], ...value.stage };
              return next;
            }
            return [...prev, value.stage];
          });
        } else if (value.type === "complete") {
          setAnalysis(value.analysis);
          setReport(value.report);
          setStages(value.analysis.stages || []);
          setProcessing(false);
          streamActiveRef.current = false;
          break;
        } else if (value.type === "error") {
          setError(value.error.message || "An error occurred during analysis.");
          setProcessing(false);
          streamActiveRef.current = false;
          break;
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Connection interrupted during analysis."
      );
      setProcessing(false);
      streamActiveRef.current = false;
    }
  }, [analysisId]);

  useEffect(() => {
    let isMounted = true;

    async function loadAndProcess() {
      try {
        setLoading(true);
        setError(null);

        const data: GetAnalysisResponse = await resumeAnalysisApi.getAnalysis(analysisId);
        if (!isMounted) return;

        setAnalysis(data.analysis);
        setStages(data.analysis.stages || []);
        setCurrentStageId(data.analysis.currentStage || null);

        if (data.report && data.analysis.status === "completed") {
          setReport(data.report);
          setLoading(false);
          return;
        }

        // If pending or processing, start streaming
        if (data.analysis.status === "pending" || data.analysis.status === "processing") {
          setLoading(false);
          setProcessing(true);
          await startStream();
        } else {
          setLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        setLoading(false);
        setError(
          err instanceof Error ? err.message : "Unable to load the resume analysis."
        );
      }
    }

    loadAndProcess();

    return () => {
      isMounted = false;
      streamActiveRef.current = false;
    };
  }, [analysisId, startStream]);

  const handleRetry = async () => {
    setError(null);
    setProcessing(true);
    await startStream();
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-accent-ink animate-spin mb-4" />
        <p className="text-[14px] font-medium text-ink">Loading resume analysis...</p>
        <p className="text-[12px] text-body mt-1">Connecting to evaluation service</p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="w-full max-w-3xl mx-auto py-10">
        <nav className="mb-6">
          <Link href="/tools/resume-analyzer" className="inline-flex items-center gap-2 text-[12.5px] font-medium text-body hover:text-accent-ink">
            <ArrowLeft size={15} /> Back to Resume Analyzer
          </Link>
        </nav>
        <div className="rounded-xl border border-danger/30 bg-card p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-danger/10 text-danger shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink">Analysis could not be completed</h2>
              <p className="mt-2 text-[14px] text-body leading-relaxed">{error}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleRetry}
                  className="btn btn-primary inline-flex items-center gap-2 text-[13px] px-4 py-2"
                >
                  <RefreshCw size={15} /> Retry analysis
                </button>
                <Link
                  href="/tools/resume-analyzer"
                  className="btn btn-secondary inline-flex items-center gap-2 text-[13px] px-4 py-2"
                >
                  <RotateCcw size={15} /> Start new analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Processing view (live streaming stages)
  if (processing || (!report && analysis?.status !== "completed")) {
    const completedCount = stages.filter((s) => s.status === "completed").length;
    const progressPercent = Math.min(100, Math.round((completedCount / Math.max(1, stages.length)) * 100));

    return (
      <div className="w-full max-w-3xl mx-auto py-8">
        <header className="mb-8">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-card border border-hair w-fit mb-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-accent-ink">
              Real-time Processing
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-medium text-ink">
            Analyzing your resume benchmark
          </h1>
          <p className="mt-2 text-[14px] text-body">
            Extracting text structure, matching role competencies, evaluating ATS criteria, and aligning company criteria.
          </p>
        </header>

        <div className="rounded-xl border border-hair bg-card p-6 md:p-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-[12px] font-semibold text-body mb-2">
              <span>Analysis Progress</span>
              <span className="font-mono text-accent-ink">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-paper-2 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stages checklist */}
          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const isCurrent = stage.id === currentStageId && stage.status === "processing";
              const isDone = stage.status === "completed";
              const isFailed = stage.status === "failed";

              return (
                <div
                  key={stage.id}
                  className={`flex items-start gap-3.5 p-3 rounded-lg border transition-colors ${
                    isCurrent
                      ? "border-accent/40 bg-accent/5"
                      : isDone
                      ? "border-hair/60 bg-card"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-note" />
                    ) : isCurrent ? (
                      <Loader2 size={18} className="text-accent-ink animate-spin" />
                    ) : isFailed ? (
                      <XCircle size={18} className="text-danger" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-mute opacity-40 ml-0.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-[13px] font-medium ${isCurrent ? "text-accent-ink" : "text-ink"}`}>
                        {idx + 1}. {stage.label}
                      </p>
                      {isDone && (
                        <span className="text-[11px] font-mono text-note font-medium">Done</span>
                      )}
                    </div>
                    {stage.message && (
                      <p className="text-[12px] text-body mt-0.5 truncate">
                        {stage.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  // Rating badge helper
  const score = report.overallScore;
  const ratingBadge =
    score >= 80
      ? { label: "Placement Ready", color: "text-note bg-note/10 border-note/30" }
      : score >= 65
      ? { label: "Competitive", color: "text-accent-ink bg-accent/10 border-accent/30" }
      : { label: "Needs Targeted Polish", color: "text-warning bg-warning/10 border-warning/30" };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
      {/* Navigation and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <nav aria-label="Breadcrumb">
          <Link
            href="/tools/resume-analyzer"
            className="inline-flex items-center gap-2 text-[12.5px] font-medium text-body hover:text-accent-ink transition-colors"
          >
            <ArrowLeft size={15} /> Back to Analyzer
          </Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="btn btn-secondary inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5"
            title="Print or export as PDF"
          >
            <Printer size={14} /> Print / Save
          </button>
          <Link
            href="/tools/resume-analyzer"
            className="btn btn-primary inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5"
          >
            <Sparkles size={14} /> Analyze another
          </Link>
        </div>
      </div>

      {/* Target Benchmark & Hero Header */}
      <div className="rounded-xl border border-hair bg-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-accent/10 text-accent-ink border border-accent/20">
                <Building2 size={12} /> {report.target.company}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-paper-2 text-body border border-hair">
                <Briefcase size={12} /> {report.target.role.replace(/_/g, " ").toUpperCase()}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${ratingBadge.color}`}>
                {ratingBadge.label}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-medium text-ink tracking-tight">
              Placement Benchmark Report
            </h1>
            <p className="text-[13.5px] text-body max-w-2xl">
              Targeting <span className="font-semibold text-ink">{report.target.company}</span> as a{" "}
              <span className="font-semibold text-ink">{report.target.role.replace(/_/g, " ")}</span>. Report based on verified resume content, ATS parsing criteria, and industry hiring standards.
            </p>
          </div>

          {/* Overall Score Dial */}
          <div className="flex items-center gap-4 shrink-0 rounded-xl bg-paper p-4 border border-hair">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-accent-ink tracking-tight">
                {report.overallScore}
                <span className="text-lg font-normal text-mute">/100</span>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-body mt-0.5">
                Readiness Score
              </p>
            </div>
          </div>
        </div>

        {/* Candidate Snapshot Bar */}
        <div className="mt-6 pt-5 border-t border-hair flex flex-wrap items-center gap-y-2 gap-x-6 text-[12px] text-body">
          <div className="inline-flex items-center gap-1.5 font-medium text-ink">
            <User size={14} className="text-accent-ink" />
            {report.candidate.fullName || "Candidate"}
          </div>
          {report.candidate.email && (
            <div className="inline-flex items-center gap-1.5">
              <Mail size={14} className="text-mute" />
              {report.candidate.email}
            </div>
          )}
          {report.candidate.phone && (
            <div className="inline-flex items-center gap-1.5">
              <Phone size={14} className="text-mute" />
              {report.candidate.phone}
            </div>
          )}
          {report.candidate.yearsOfExperience !== undefined && report.candidate.yearsOfExperience !== null && (
            <div className="inline-flex items-center gap-1.5">
              <Clock size={14} className="text-mute" />
              {report.candidate.yearsOfExperience} yrs experience detected
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Metric Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {report.scoreBreakdown.map((item) => {
          const pct = Math.round((item.value / item.maxValue) * 100);
          return (
            <div
              key={item.label}
              className="rounded-lg border border-hair bg-card p-3.5"
            >
              <div className="flex items-center justify-between text-[11.5px] font-semibold text-body">
                <span className="truncate">{item.label}</span>
                <span className="font-mono text-ink ml-1">
                  {item.value}/{item.maxValue}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-paper-2 mt-2 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-hair flex gap-2 overflow-x-auto pb-px">
        {[
          { key: "overview", label: "Executive Summary & Plan" },
          { key: "ats", label: `ATS Audit (${report.atsCompatibility.score}%)` },
          { key: "skills", label: `Skills & Keywords (${report.skillMatching.matched.length} Matched)` },
          { key: "company", label: "Company Fit" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabKey)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "border-accent text-accent-ink"
                : "border-transparent text-body hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}

      {/* 1. OVERVIEW & ACTION PLAN */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Prioritized Action Plan */}
          <section className="rounded-xl border border-hair bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-ink">Prioritized Action Plan</h2>
                <p className="text-[12.5px] text-body mt-0.5">
                  High-leverage recommendations to maximize shortlisting rates at {report.target.company}.
                </p>
              </div>
              <span className="text-[11px] font-mono text-mute">
                {report.actionPlan.length} actions
              </span>
            </div>

            <div className="space-y-3">
              {report.actionPlan.map((action, idx) => {
                const priorityStyles =
                  action.priority === "high"
                    ? "bg-danger/10 text-danger border-danger/20"
                    : action.priority === "medium"
                    ? "bg-warning/10 text-warning border-warning/20"
                    : "bg-accent/10 text-accent-ink border-accent/20";

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-hair bg-paper/50 hover:bg-paper transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <CheckSquare size={17} className="text-accent-ink shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[13.5px] font-medium text-ink leading-snug">
                            {action.action}
                          </p>
                          <p className="text-[12px] text-body mt-1.5 leading-relaxed">
                            <span className="font-semibold text-ink">Why: </span>
                            {action.rationale}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-semibold uppercase tracking-wider border shrink-0 ${priorityStyles}`}>
                        {action.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Critical Issues Identified */}
          {report.issues.length > 0 && (
            <section className="rounded-xl border border-hair bg-card p-6">
              <h2 className="text-base font-semibold text-ink mb-1">Detected Resume Risks</h2>
              <p className="text-[12.5px] text-body mb-4">
                Items that could negatively influence screening algorithms or recruiter impression.
              </p>
              <div className="space-y-3">
                {report.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-hair bg-card"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        size={17}
                        className={
                          issue.severity === "high"
                            ? "text-danger"
                            : "text-warning"
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-semibold text-ink">{issue.issue}</p>
                          <span
                            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${
                              issue.severity === "high"
                                ? "text-danger border-danger/30 bg-danger/5"
                                : "text-warning border-warning/30 bg-warning/5"
                            }`}
                          >
                            {issue.severity} severity
                          </span>
                        </div>
                        <p className="text-[12px] text-body mt-1">
                          <span className="font-semibold text-ink">Recommendation: </span>
                          {issue.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* 2. ATS AUDIT */}
      {activeTab === "ats" && (
        <section className="rounded-xl border border-hair bg-card p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-ink">Applicant Tracking System (ATS) Health</h2>
            <p className="text-[12.5px] text-body mt-0.5">
              {report.atsCompatibility.summary}
            </p>
          </div>

          <div className="space-y-3">
            {report.atsCompatibility.checks.map((check) => {
              const statusIcon =
                check.status === "pass" ? (
                  <CheckCircle2 size={16} className="text-note" />
                ) : check.status === "warning" ? (
                  <AlertTriangle size={16} className="text-warning" />
                ) : (
                  <XCircle size={16} className="text-danger" />
                );

              const statusBadge =
                check.status === "pass"
                  ? "bg-note/10 text-note border-note/20"
                  : check.status === "warning"
                  ? "bg-warning/10 text-warning border-warning/20"
                  : "bg-danger/10 text-danger border-danger/20";

              return (
                <div
                  key={check.id}
                  className="p-4 rounded-lg border border-hair bg-paper/40 flex items-start gap-3.5"
                >
                  <div className="mt-0.5 shrink-0">{statusIcon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-medium text-ink">{check.label}</p>
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-semibold uppercase tracking-wider border ${statusBadge}`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-body mt-1">{check.detail}</p>
                    {check.evidence && check.evidence.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {check.evidence.map((ev, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 rounded bg-card border border-hair text-[11px] font-mono text-body"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. SKILLS & KEYWORDS */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          {/* Matched & Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched */}
            <section className="rounded-xl border border-hair bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-note" /> Matched Role Skills
                </h3>
                <span className="text-[11px] font-mono text-note font-medium">
                  {report.skillMatching.matched.length} detected
                </span>
              </div>
              {report.skillMatching.matched.length === 0 ? (
                <p className="text-[12.5px] text-body">None of the target skills were found in your resume.</p>
              ) : (
                <div className="space-y-2.5">
                  {report.skillMatching.matched.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-lg border border-hair bg-paper/30"
                    >
                      <p className="text-[12.5px] font-semibold text-ink">{skill.name}</p>
                      {skill.evidence && skill.evidence.length > 0 && (
                        <p className="text-[11.5px] text-body mt-1 italic">
                          &quot;{skill.evidence[0]}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Missing Skills */}
            <section className="rounded-xl border border-hair bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                  <AlertCircle size={16} className="text-danger" /> Recommended Skills to Add
                </h3>
                <span className="text-[11px] font-mono text-danger font-medium">
                  {report.skillMatching.missing.length} missing
                </span>
              </div>
              {report.skillMatching.missing.length === 0 ? (
                <p className="text-[12.5px] text-body">Every core skill shows up in your resume.</p>
              ) : (
                <div className="space-y-2.5">
                  {report.skillMatching.missing.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-lg border border-hair bg-paper/30"
                    >
                      <p className="text-[12.5px] font-semibold text-ink">{skill.name}</p>
                      {skill.recommendation && (
                        <p className="text-[11.5px] text-body mt-1">
                          {skill.recommendation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Keyword Frequency Analysis */}
          <section className="rounded-xl border border-hair bg-card p-6">
            <h3 className="text-sm font-semibold text-ink mb-1">Keyword Match Frequency</h3>
            <p className="text-[12px] text-body mb-4">
              Screening keywords searched by ATS scanners based on your target role.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {report.keywordAnalysis.map((item) => (
                <div
                  key={item.keyword}
                  className={`p-2.5 rounded-lg border text-center ${
                    item.status === "present"
                      ? "border-note/30 bg-note/5 text-ink"
                      : "border-hair bg-paper-2 text-mute"
                  }`}
                >
                  <p className="text-[12px] font-medium truncate">{item.keyword}</p>
                  <p className="text-[11px] font-mono mt-0.5">
                    {item.status === "present" ? `${item.count}x` : "0x"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 4. COMPANY FIT */}
      {activeTab === "company" && (
        <section className="rounded-xl border border-hair bg-card p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-ink">
              {report.target.company} Alignment Factors
            </h2>
            <p className="text-[12.5px] text-body mt-0.5">
              How well the resume aligns with the hiring profile and evaluation style of {report.target.company} ({report.target.companyType.replace(/_/g, " ")}).
            </p>
          </div>

          <div className="space-y-4">
            {report.companyAlignment.map((factor, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-hair bg-paper/40"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[13.5px] font-semibold text-ink">{factor.factor}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10.5px] font-semibold uppercase tracking-wider border ${
                      factor.status === "aligned"
                        ? "bg-note/10 text-note border-note/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }`}
                  >
                    {factor.status}
                  </span>
                </div>
                <p className="text-[12.5px] text-body leading-relaxed">
                  {factor.assessment}
                </p>
                {factor.evidence && factor.evidence.length > 0 && (
                  <p className="text-[11.5px] text-mute mt-2 font-mono">
                    Evidence: {factor.evidence.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
