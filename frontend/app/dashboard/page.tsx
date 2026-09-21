"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  BookOpen, 
  Code2, 
  Database, 
  TerminalSquare, 
  Network, 
  Server, 
  PlaySquare, 
  FileText, 
  Clock, 
  Briefcase 
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserProfile, RoadmapGenerationResult } from "@/types";
import { dashboardApi } from "@/lib/api/dashboard";
import { profileApi } from "@/lib/api/profile";
import { onboardingService } from "@/lib/services/onboardingService";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";

export default function DashboardPage() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { draftProfile: profile, isLoading } = useProfile();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Read cached dashboard data on mount (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('pathward-dashboard-cache');
        if (cached) {
          setDashboardData(JSON.parse(cached));
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      try {
        let data: any = null;
        try {
          data = await dashboardApi.getDashboard();
          if (data) {
            setDashboardData(data);
            if (typeof window !== 'undefined') {
              localStorage.setItem('pathward-dashboard-cache', JSON.stringify(data));
            }
          }
        } catch (apiErr) {
          console.warn("Backend dashboard fetch failed, using cached/profile record:", apiErr);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    }

    loadDashboard();
    setMounted(true);
  }, []);

  let displayName = "Learner";
  if (!mounted || isLoading) {
    displayName = "Loading...";
  } else if (profile?.identity?.fullName) {
    displayName = profile.identity.fullName;
  } else {
    displayName = user?.email ? user.email.split("@")[0] : "Learner";
  }

  const firstName = displayName.split(" ")[0] || "Learner";

  const currentTrack = mounted 
    ? (dashboardData?.current_track || profile?.identity?.targetRole || profile?.careerTracks?.[0] || "Software Development Engineer")
    : "Software Development Engineer";

  const readiness = mounted 
    ? (dashboardData?.metrics?.readiness !== undefined && dashboardData?.metrics?.readiness > 0
      ? `${dashboardData.metrics.readiness}%` 
      : (profile?.completionPercentage ? `${profile.completionPercentage}%` : "0%"))
    : "0%";

  const streak = mounted ? (dashboardData?.metrics?.streak ?? (profile?.identity?.fullName ? 1 : 0)) : 0;
  
  const continueLearning = dashboardData?.continue_learning || {
    module: "Start First Module",
    topic: `Begin your ${currentTrack} preparation path`,
    progress: 0,
    has_started: false
  };
  
  const learningProgress = dashboardData?.learning_progress || [
    { name: "Programming", progress: 0, icon: "TerminalSquare" },
    { name: "DSA", progress: 0, icon: "Code2" },
    { name: "SQL", progress: 0, icon: "Database" },
    { name: "Core CS", progress: 0, icon: "Server" },
    { name: "Aptitude", progress: 0, icon: "Network" }
  ];
  
  const todayPlan = dashboardData?.today_plan || {
    tasks: [],
    completion: 0,
    has_plan: false
  };
  
  const upcomingTarget = mounted && dashboardData?.upcoming_target ? dashboardData.upcoming_target : {
    title: profile?.targets?.companies?.[0] ? `${profile.targets.companies[0]} Target Prep` : "Set Target Companies",
    subtitle: profile?.targets?.companies?.[0] ? `Preparation calibrated for ${profile.targets.companies[0]}.` : "Track companies to personalize interview rubrics."
  };

  return (
    <div className="flex flex-col gap-8 pb-12 w-full min-w-0 box-border">
      {/* PAGE HEADER */}
      <motion.section 
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]/80 min-w-0"
      >
        <div className="min-w-0">
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight leading-tight">
            Good morning, {displayName}.
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-2 font-normal">
            Let's continue your placement preparation.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex flex-col px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm">
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Placement Readiness</span>
            <span className="text-lg font-bold text-[var(--accent)] mt-0.5">{readiness}</span>
          </div>
          <div className="flex flex-col px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm">
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Current Path</span>
            <span className="text-[13.5px] font-semibold text-[var(--ink)] mt-1">{currentTrack}</span>
          </div>
          <div className="flex flex-col px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm">
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Current Streak</span>
            <span className="text-[13.5px] font-semibold text-[var(--success)] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
              {streak} days
            </span>
          </div>
        </div>
      </motion.section>

      {/* MAIN DASHBOARD GRID */}
      <div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start box-border">
        
        {/* LEFT COLUMN (Main Content) - 8 columns */}
        <div className="lg:col-span-8 min-w-0 flex flex-col gap-6">
          
          {/* 1. Continue Learning Card */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] shadow-sm"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-mono font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                  CONTINUE LEARNING
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
                <div>
                  <h2 className="text-2xl font-newsreader font-normal text-[var(--ink)]">{continueLearning.module}</h2>
                  <p className="text-[var(--ink-secondary)] text-[15px] mt-1">{continueLearning.topic}</p>
                </div>
                <Link 
                  href={continueLearning.has_started && continueLearning.subject_slug && continueLearning.topic_slug 
                    ? `/learn/${continueLearning.subject_slug}/${continueLearning.topic_slug}` 
                    : "/learn"} 
                  className="btn-primary shrink-0"
                >
                  {continueLearning.has_started ? "Continue Module" : "Explore Modules"} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-mono text-[12px] text-[var(--ink-tertiary)] uppercase">Module Progress</span>
                  <span className="font-mono text-[12px] text-[var(--accent)] font-semibold">{continueLearning.progress}%</span>
                </div>
                <div className="w-full bg-[var(--border-strong)]/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--accent)] h-full rounded-full" style={{ width: `${continueLearning.progress}%` }}></div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 2. Learning Progress (Grid of subjects) */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 mt-2"
          >
            <h3 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider">Learning Progress</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {learningProgress.map((subject: any) => {
                let iconComponent = <TerminalSquare className="w-5 h-5 text-blue-600" />;
                if (subject.icon === "Code2") iconComponent = <Code2 className="w-5 h-5 text-emerald-600" />;
                if (subject.icon === "Database") iconComponent = <Database className="w-5 h-5 text-purple-600" />;
                if (subject.icon === "Server") iconComponent = <Server className="w-5 h-5 text-amber-600" />;
                if (subject.icon === "Network") iconComponent = <Network className="w-5 h-5 text-cyan-600" />;
                
                return (
                <div 
                  key={subject.name} 
                  className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm hover:border-[var(--border-strong)] transition-all hover:-translate-y-0.5 min-w-0"
                >
                  <div className="flex items-center gap-3 mb-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[var(--surface-subdued)] shrink-0">
                      {iconComponent}
                    </div>
                    <span className="font-semibold text-[14px] text-[var(--ink)] truncate">{subject.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-[var(--ink-secondary)] mb-1.5">
                    <span>PROGRESS</span>
                    <span className="text-[var(--ink)] font-semibold">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-[var(--border-strong)]/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--accent)] h-full rounded-full" style={{ width: `${subject.progress}%` }}></div>
                  </div>
                </div>
                );
              })}
            </div>
          </motion.section>

          {/* 3. Recommended Resources */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 mt-2 min-w-0"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider">Recommended Resources</h3>
              <Link href="/resources" className="text-[12px] font-medium text-[var(--accent)] hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Java OOP Complete Guide", type: "Notes", time: "45 min" },
                { title: "DSA Patterns Cheatsheet", type: "Cheatsheet", time: "20 min" },
                { title: "SQL Interview Handbook", type: "Interview", time: "1h 30m" },
                { title: "DBMS Revision Guide", type: "Revision", time: "40 min" },
              ].map((resource) => (
                <Link 
                  key={resource.title} 
                  href="#" 
                  className="group flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] shadow-sm transition-all hover:-translate-y-0.5 min-w-0"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="mt-0.5 text-[var(--ink-tertiary)] group-hover:text-[var(--accent)] transition-colors shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[14px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate">{resource.title}</span>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] font-mono bg-[var(--surface-subdued)] px-1.5 py-0.5 rounded text-[var(--ink-secondary)] shrink-0">{resource.type}</span>
                        <span className="text-[11px] font-mono text-[var(--ink-tertiary)] shrink-0">{resource.time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>

        </div>

        {/* RIGHT COLUMN (Sidebar context) - 4 columns */}
        <div className="lg:col-span-4 min-w-0 flex flex-col gap-6">
          
          {/* Today's Plan */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] shadow-sm"
          >
            <h3 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent)]" />
              Today's Plan
            </h3>
            
            <div className="flex flex-col gap-3">
              {todayPlan.tasks && todayPlan.tasks.length > 0 ? (
                todayPlan.tasks.map((task: any) => (
                  <label key={task.id} className="flex items-start gap-3 cursor-pointer group">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--border-strong)] group-hover:text-[var(--accent)] shrink-0 mt-0.5 transition-colors" />
                    )}
                    <span className={task.completed ? "text-[14px] text-[var(--ink-secondary)] line-through group-hover:text-[var(--ink)] transition-colors" : "text-[14px] text-[var(--ink)] font-medium"}>
                      {task.text}
                    </span>
                  </label>
                ))
              ) : (
                <div className="py-2 text-left">
                  <p className="text-[13px] text-[var(--ink-secondary)] leading-relaxed">
                    No active tasks scheduled yet for today.
                  </p>
                  <Link href="/practice" className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline">
                    Start a Practice Session <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border)]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase">Completion</span>
                <span className="text-[11px] font-mono font-semibold text-[var(--ink)]">{todayPlan.completion}%</span>
              </div>
              <div className="w-full bg-[var(--border-strong)]/30 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[var(--success)] h-full rounded-full" style={{ width: `${todayPlan.completion}%` }}></div>
              </div>
            </div>
          </motion.section>

          {/* Upcoming Milestone */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--accent-soft)] rounded-xl p-6 border border-[var(--accent-soft-border)] shadow-sm"
          >
            <h3 className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-3">
              Upcoming Target
            </h3>
            <div className="flex flex-col gap-1">
              <h4 className="text-[18px] font-newsreader font-medium text-[var(--ink)]">{upcomingTarget.title}</h4>
              <p className="text-[13px] text-[var(--ink-secondary)]">
                {upcomingTarget.subtitle}
              </p>
            </div>
            <Link href="/roadmaps" className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-white border border-[var(--border)] text-[var(--ink)] px-4 py-2 rounded-lg text-[13px] font-semibold hover:border-[var(--border-strong)] shadow-sm transition-all hover:-translate-y-0.5">
              View Roadmap
            </Link>
          </motion.section>

          {/* Quick Tools */}
          <motion.section 
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] shadow-sm"
          >
            <h3 className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-wider mb-4">
              Quick Tools
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "SQL Playground", icon: <Database className="w-4 h-4" /> },
                { name: "DSA Visualizer", icon: <PlaySquare className="w-4 h-4" /> },
                { name: "Resume Analyzer", icon: <FileText className="w-4 h-4" /> },
                { name: "Interview Sim", icon: <Briefcase className="w-4 h-4" /> },
              ].map((tool) => (
                <Link 
                  key={tool.name} 
                  href={`/tools/${tool.name.toLowerCase().replace(" ", "-")}`} 
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--surface-subdued)] border border-[var(--border)] rounded-lg hover:border-[var(--border-strong)] hover:bg-[var(--surface)] transition-all hover:-translate-y-0.5 group"
                >
                  <div className="text-[var(--ink-tertiary)] group-hover:text-[var(--accent)] transition-colors">
                    {tool.icon}
                  </div>
                  <span className="text-[11px] font-medium text-[var(--ink)] text-center leading-tight">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
