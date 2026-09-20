"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  BookOpen, 
  Code2, 
  Database, 
  Server, 
  Network, 
  TerminalSquare, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Award,
  Zap
} from "lucide-react";
import { onboardingService, DEFAULT_USER_PROFILE } from "@/lib/services/onboardingService";
import { ProfileNavTabs } from "@/components/profile/ProfileNavTabs";
import { UserProfile } from "@/types";

export default function ProgressReadinessPage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  useEffect(() => {
    const data = onboardingService.getProfileWithDefaults();
    setProfile(data);
  }, []);

  const subjects = [
    { name: "Java OOP", progress: 72, target: 85, icon: TerminalSquare, status: "On Track", color: "bg-blue-600" },
    { name: "DSA & Algorithms", progress: 48, target: 75, icon: Code2, status: "Needs Practice", color: "bg-emerald-600" },
    { name: "SQL & Databases", progress: 81, target: 80, icon: Database, status: "Mastered", color: "bg-purple-600" },
    { name: "DBMS Internals", progress: 55, target: 70, icon: Server, status: "In Progress", color: "bg-amber-600" },
    { name: "Operating Systems", progress: 31, target: 65, icon: TerminalSquare, status: "Lagging", color: "bg-rose-600" },
    { name: "Computer Networks", progress: 28, target: 60, icon: Network, status: "Lagging", color: "bg-cyan-600" },
    { name: "Quantitative Aptitude", progress: 65, target: 80, icon: Zap, status: "On Track", color: "bg-indigo-600" },
  ];

  const weakAreas = [
    { topic: "Binary Search Trees & LCA", subject: "DSA", reason: "Accuracy dropped to 42% on medium difficulty arrays", actionUrl: "/practice" },
    { topic: "OS Concurrency & Mutex Semaphores", subject: "Core CS", reason: "Diagnostic test scored 2/5 on race conditions", actionUrl: "/learn" },
    { topic: "SQL Self-Joins & Dense Ranking", subject: "Databases", reason: "Unfinished test cases on OA round 2", actionUrl: "/learn" },
  ];

  const recentAchievements = [
    { title: "SQL Window Functions Mastered", date: "Sep 18, 2026", badge: "Gold Mastery" },
    { title: "7-Day Consecutive Problem Solver", date: "Today", badge: "Streak Milestone" },
    { title: "TCS Prime OA Mock Simulator Cleared", date: "Sep 15, 2026", badge: "OA Qualified" },
  ];

  return (
    <div className="w-full min-w-0 pb-16">
      {/* SECTION TABS */}
      <ProfileNavTabs />

      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border)] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold tracking-wider border border-amber-200">
              Readiness Assessment Engine
            </span>
          </div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
            Progress &amp; Readiness
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-1.5 font-normal">
            Detailed performance diagnostics, topic coverage analysis, and actionable remediation targets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/practice" className="btn-primary text-xs h-9 px-4 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Start Practice Drill
          </Link>
        </div>
      </div>

      {/* TOP READINESS KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Composite Readiness</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">Campus Benchmark</span>
          </div>
          <p className="text-3xl font-extrabold text-[var(--accent)] mt-2">68%</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[var(--accent)] h-full w-[68%] rounded-full"></div>
          </div>
          <span className="text-xs text-[var(--ink-secondary)] mt-2 inline-block">74% required for Tier-1 Product OA qualification</span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Active Streak</span>
          <div className="flex items-center gap-2 mt-2">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            <span className="text-3xl font-extrabold text-[var(--ink)]">7 Days</span>
          </div>
          <p className="text-xs text-[var(--success)] font-medium mt-3">Consistent problem solver • 18 problems this week</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Topics Mastered</span>
          <p className="text-3xl font-extrabold text-[var(--ink)] mt-2">24 / 45</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full w-[53%] rounded-full"></div>
          </div>
          <span className="text-xs text-slate-500 mt-2 inline-block">53% of Core SDE Syllabus completed</span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Company Cut-off Status</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">3 of 4</span>
            <span className="text-xs text-slate-500 font-mono">Targets in Safe Range</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Microsoft &amp; Amazon require +12% DSA gain</p>
        </div>
      </div>

      {/* DETAILED SUBJECT COVERAGE GRID */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-[var(--ink)] tracking-tight">Core Curriculum Subject Breakdown</h2>
            <p className="text-xs text-[var(--ink-secondary)]">Progress measured against verified placement assessment matrices</p>
          </div>
          <span className="text-xs font-mono text-[var(--ink-tertiary)]">Updated real-time from submissions</span>
        </div>

        <div className="space-y-5">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div key={sub.name} className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[var(--ink)]">{sub.name}</span>
                      <span className="text-xs font-mono text-slate-400 ml-2">Target: {sub.target}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                      sub.status === "Mastered" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                      sub.status === "On Track" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      sub.status === "Needs Practice" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {sub.status}
                    </span>
                    <span className="font-mono text-sm font-bold text-[var(--ink)] w-12 text-right">
                      {sub.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar with target indicator */}
                <div className="relative w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${sub.color} transition-all duration-500`}
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WEAK AREAS & RECOMMENDED REMEDIATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weak Areas Diagnostics */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-[var(--ink)] uppercase font-mono tracking-wider">
              Diagnostic Weak Areas
            </h3>
          </div>
          <p className="text-xs text-[var(--ink-secondary)] mb-4">
            Topics where assessment scores fell below the 60th percentile for SDE applicants.
          </p>

          <div className="space-y-3">
            {weakAreas.map((w, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{w.topic}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-amber-800 border border-amber-200">
                      {w.subject}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{w.reason}</p>
                </div>
                <Link
                  href={w.actionUrl}
                  className="btn-secondary text-xs h-8 px-3 shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  Reinforce <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-[var(--ink)] uppercase font-mono tracking-wider">
              Verified Milestones
            </h3>
          </div>
          <p className="text-xs text-[var(--ink-secondary)] mb-4">
            Badges and mastery certificates logged on your official preparation ledger.
          </p>

          <div className="space-y-3">
            {recentAchievements.map((ach, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{ach.title}</h4>
                    <span className="text-[11px] font-mono text-slate-400">{ach.date}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {ach.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
