"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Play, 
  BookOpen, 
  Flame, 
  Layers, 
  ExternalLink,
  ChevronRight,
  TerminalSquare,
  Code2,
  Database,
  Server,
  Network
} from "lucide-react";
import { UserProfile, RoadmapGenerationResult } from "@/types";
import { ProfileNavTabs } from "@/components/profile/ProfileNavTabs";
import { useProfile } from "@/components/providers/ProfileProvider";

export default function MyLearningPathPage() {
  const { draftProfile: profile, isLoading } = useProfile();
  const [roadmap, setRoadmap] = useState<RoadmapGenerationResult | null>(null);

  useEffect(() => {
    // Dynamically generate roadmap based on current active profile state
    import("@/lib/services/onboardingService").then((mod) => {
      setRoadmap(mod.onboardingService.generateInitialRoadmap(profile));
    });
  }, [profile]);

  const primaryTrack = roadmap?.primaryTrack || profile.careerTracks?.[0] || "Software Engineer";

  const activeModules = [
    {
      id: "java-oop",
      title: "Java OOP — Inheritance & Polymorphism",
      subject: "Core Programming",
      progress: 68,
      lessonsCompleted: 14,
      totalLessons: 20,
      href: "/learn/java-oop",
      icon: TerminalSquare,
      color: "text-blue-600 bg-blue-50"
    },
    {
      id: "dsa-trees",
      title: "Binary Trees & Traversal Paradigms",
      subject: "Data Structures & Algorithms",
      progress: 45,
      lessonsCompleted: 9,
      totalLessons: 20,
      href: "/practice",
      icon: Code2,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      id: "sql-window",
      title: "SQL Window Functions & Aggregates",
      subject: "Databases & Schemas",
      progress: 80,
      lessonsCompleted: 8,
      totalLessons: 10,
      href: "/learn",
      icon: Database,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  const completedModules = [
    { name: "Time & Space Complexity Basics (Big-O)", subject: "DSA", score: "94% Mastery", completedOn: "Sep 14, 2026" },
    { name: "Arrays, Two-Pointers & Sliding Window", subject: "DSA", score: "88% Mastery", completedOn: "Sep 16, 2026" },
    { name: "Relational Algebra & Normalization (1NF–BCNF)", subject: "DBMS", score: "90% Mastery", completedOn: "Sep 18, 2026" },
  ];

  const upcomingModules = [
    { name: "Dynamic Programming: Knapsack & Grid Patterns", subject: "DSA", prerequisite: "Recursion & Trees", estTime: "4.5 hrs" },
    { name: "OS Process Synchronization & Deadlocks", subject: "Operating Systems", prerequisite: "Concurrency Intro", estTime: "3.0 hrs" },
    { name: "TCP/IP 4-Layer Stack & Socket Handshakes", subject: "Computer Networks", prerequisite: "OS Sockets", estTime: "2.5 hrs" },
  ];

  return (
    <div className="w-full min-w-0 pb-16">
      {/* SECTION TABS */}
      <ProfileNavTabs />

      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border)] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold tracking-wider border border-emerald-200">
              Active Curriculum
            </span>
          </div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
            My Learning Path
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-1.5 font-normal">
            Track your progression across required concepts, active modules, and roadmap milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/roadmaps" className="btn-secondary text-xs h-9 px-4 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5" /> Full Roadmap
          </Link>
          <Link href="/learn" className="btn-primary text-xs h-9 px-4 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> Study Modules
          </Link>
        </div>
      </div>

      {/* PATH SUMMARY METRIC STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Target Career Track</span>
          <p className="text-base font-bold text-[var(--ink)] mt-1 truncate">{primaryTrack}</p>
          <span className="text-xs text-[var(--accent)] font-medium mt-1 inline-block">16 Modules in Syllabus</span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Learning Streak</span>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-xl font-bold text-[var(--ink)]">7 Days</span>
          </div>
          <span className="text-xs text-[var(--success)] font-medium mt-1 inline-block">Streak Active • Next milestone: 10d</span>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Curriculum Completion</span>
          <p className="text-xl font-bold text-[var(--accent)] mt-1">42%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[var(--accent)] h-full w-[42%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-tertiary)]">Placement Assessment</span>
          <p className="text-base font-bold text-[var(--ink)] mt-1">{roadmap?.targetRubric || "TCS Online Assessment"}</p>
          <span className="text-xs text-slate-500 font-mono mt-1 inline-block">6 modules left to unlock mock OA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ACTIVE & COMPLETED MODULES (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Active Modules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[var(--ink)] tracking-tight flex items-center gap-2">
                <Play className="w-4 h-4 text-[var(--accent)] fill-[var(--accent)]" /> Currently Active Modules
              </h2>
              <span className="text-xs text-[var(--ink-secondary)] font-mono">3 in progress</span>
            </div>

            <div className="flex flex-col gap-4">
              {activeModules.map((module) => {
                const Icon = module.icon;
                return (
                  <div 
                    key={module.id} 
                    className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-2xl p-6 shadow-xs transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 ${module.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase text-[var(--ink-tertiary)] tracking-wider">
                            {module.subject}
                          </span>
                          <h3 className="text-base font-bold text-[var(--ink)] mt-0.5">
                            {module.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-[var(--ink-secondary)] font-mono mt-1.5">
                            <span>{module.lessonsCompleted}/{module.totalLessons} Topics Checked</span>
                            <span>•</span>
                            <span className="font-semibold text-[var(--accent)]">{module.progress}% Complete</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={module.href}
                        className="btn-primary text-xs h-9 px-4 shrink-0 flex items-center gap-2"
                      >
                        Resume Module <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border)]/70">
                      <div className="w-full bg-[var(--surface-subdued)] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[var(--accent)] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed Modules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[var(--ink)] tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> Recently Completed Topics
              </h2>
              <span className="text-xs text-[var(--ink-secondary)] font-mono">Mastery Verified</span>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] shadow-xs overflow-hidden">
              {completedModules.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-subdued)]/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--ink)]">{item.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--ink-tertiary)] mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">{item.subject}</span>
                        <span>Completed on {item.completedOn}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0 self-start sm:self-auto">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: UPCOMING & CURRICULUM OVERVIEW (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Upcoming Unlocked Modules */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[var(--ink)] uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--ink-secondary)]" /> Up Next on Roadmap
            </h3>

            <div className="flex flex-col gap-4">
              {upcomingModules.map((up, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {up.subject}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--ink-tertiary)]">{up.estTime}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--ink)] leading-snug">{up.name}</h4>
                  <span className="text-[11px] text-[var(--ink-tertiary)] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Prerequisite: {up.prerequisite}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/roadmaps"
              className="mt-5 w-full btn-secondary text-xs h-9 justify-center flex items-center gap-1.5"
            >
              Open Interactive Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Practice Jump */}
          <div className="bg-[var(--accent-soft)] border border-[var(--accent-soft-border)] rounded-2xl p-6 shadow-xs">
            <span className="text-[11px] font-mono font-bold uppercase text-[var(--accent)] tracking-wider">
              Diagnostic Reinforcement
            </span>
            <h3 className="text-base font-bold text-[var(--ink)] mt-1">
              Ready to test OOP &amp; SQL?
            </h3>
            <p className="text-xs text-[var(--ink-secondary)] mt-1.5 leading-relaxed">
              Take a 15-minute quick assessment mapped directly to questions asked in TCS and Infosys technical assessments.
            </p>
            <Link
              href="/practice"
              className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-white text-[var(--ink)] border border-[var(--border)] px-4 py-2.5 rounded-lg text-xs font-bold hover:border-[var(--border-strong)] transition-all shadow-xs"
            >
              Launch Practice Simulator <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
