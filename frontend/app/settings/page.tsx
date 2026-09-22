"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Bell, 
  Sun, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Trash2, 
  Check, 
  AlertTriangle,
  Download,
  ArrowRight,
  Sparkles,
  Eye,
  KeyRound,
  ExternalLink
} from "lucide-react";
import { UserProfile } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";

type TabType = "account" | "notifications" | "appearance" | "security" | "privacy" | "danger";

export default function SettingsPage() {
  const { user } = useAuth();
  const { draftProfile: profile, isLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notifications State
  const [learningReminders, setLearningReminders] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [companyAlerts, setCompanyAlerts] = useState(true);
  const [roadmapUpdates, setRoadmapUpdates] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  // Appearance State
  const [interfaceDensity, setInterfaceDensity] = useState("compact");
  const [codeTheme, setCodeTheme] = useState("navy");

  // Privacy State
  const [profileVisibility, setProfileVisibility] = useState("campus");
  const [telemetry, setTelemetry] = useState(true);

  // Password change state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  // Delete account state
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const handleSaveGeneral = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      setPassError("Please fill in all password fields.");
      return;
    }
    if (newPass.length < 8) {
      setPassError("New password must be at least 8 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("Passwords do not match.");
      return;
    }

    setPassError("");
    setPassSuccess(true);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => setPassSuccess(false), 3500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `studyhub_profile_${profile.identity?.fullName || "user"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    
    // Clear Supabase session, cookies & storage
    try {
      const { supabase } = await import('@/lib/supabase/client');
      await supabase.auth.signOut();
    } catch (e) {}

    document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "onboarding-complete=; path=/; max-age=0; SameSite=Lax";
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
    window.location.href = "/login";
  };

  const tabs: { id: TabType; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "account", name: "Account", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "appearance", name: "Appearance", icon: Sun },
    { id: "security", name: "Security & Password", icon: Lock },
    { id: "privacy", name: "Privacy & Data", icon: ShieldCheck },
    { id: "danger", name: "Delete Account", icon: Trash2 },
  ];

  return (
    <div className="w-full min-w-0 pb-16">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border)] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--surface-subdued)] text-[var(--ink-secondary)] font-semibold tracking-wider border border-[var(--border)]">
              System &amp; Configuration
            </span>
          </div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
            Settings
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-1.5 font-normal">
            Configure your account, alerts, privacy, security credentials, and system preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <Check className="w-3.5 h-3.5" /> Preferences saved
          </div>
        )}
      </div>

      {/* TWO-COLUMN APPLICATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SETTINGS NAVIGATION TABS */}
        <div className="lg:col-span-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-2 sm:p-3 shadow-xs sticky top-24">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === "danger";
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-[13px] font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? isDanger
                        ? "bg-red-50 text-red-700 font-bold border border-red-200"
                        : "bg-[var(--accent-soft)] text-[var(--accent)] font-semibold border border-[var(--accent-soft-border)] shadow-xs"
                      : isDanger
                      ? "text-red-600 hover:bg-red-50/70"
                      : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isActive ? (isDanger ? "text-red-700" : "text-[var(--accent)]") : (isDanger ? "text-red-500" : "text-[var(--ink-tertiary)]")
                  }`} />
                  <span className="whitespace-nowrap">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT COLUMN: SELECTED SETTINGS CONTENT */}
        <div className="lg:col-span-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs min-w-0">
          {/* TAB 1: ACCOUNT */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--ink)]">Account Details</h2>
                <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                  Your core academic identity and connected campus authentication credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider block mb-1">
                    Primary University Email
                  </span>
                  <span className="text-sm font-semibold text-[var(--ink)] block font-mono">
                    {profile.identity?.email || user?.email || ""}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Contact your university administrator to modify primary campus email.
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider block mb-1">
                    Connected Auth Provider
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-sm font-semibold text-[var(--ink)]">Campus SSO / Direct</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Verified session active.
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider block mb-1">
                    Target Placement Cycle
                  </span>
                  <span className="text-sm font-semibold text-[var(--ink)] block">
                    {profile.identity?.driveCycle || "Campus & Off-Campus 2026–27"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider block mb-1">
                    Account Role &amp; Tier
                  </span>
                  <span className="text-sm font-semibold text-[var(--accent)] block">
                    Undergraduate Candidate (Verified)
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-xs text-[var(--ink-secondary)]">
                  Want to modify academic details or target roles?
                </span>
                <Link
                  href="/profile/preferences"
                  className="btn-secondary text-xs h-8 px-3 flex items-center gap-1.5"
                >
                  Edit Profile &amp; Preferences <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--ink)]">Notification Preferences</h2>
                <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                  Select which automated alerts and reminders you wish to receive.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--ink)]">Learning &amp; Module Reminders</h3>
                    <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                      Daily prompts to continue in-progress topics and preserve streak.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={learningReminders}
                    onChange={(e) => {
                      setLearningReminders(e.target.checked);
                      handleSaveGeneral();
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--ink)]">Practice &amp; Drill Alerts</h3>
                    <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                      Notifications when diagnostic test sets for your target role become available.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={practiceReminders}
                    onChange={(e) => {
                      setPracticeReminders(e.target.checked);
                      handleSaveGeneral();
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--ink)]">Target Company Alerts</h3>
                    <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                      Recruitment window announcements and question pattern updates for tracked companies.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={companyAlerts}
                    onChange={(e) => {
                      setCompanyAlerts(e.target.checked);
                      handleSaveGeneral();
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--ink)]">Roadmap &amp; Milestone Updates</h3>
                    <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                      Alerts when prerequisite topics unlock new mock assessment rubrics.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={roadmapUpdates}
                    onChange={(e) => {
                      setRoadmapUpdates(e.target.checked);
                      handleSaveGeneral();
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--ink)]">Weekly Email Digest</h3>
                    <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                      Summary report of placement readiness score, weak areas, and solved questions.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => {
                      setEmailDigest(e.target.checked);
                      handleSaveGeneral();
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--ink)]">Appearance &amp; Interface</h2>
                <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                  Customize the visual presentation and technical density of your workspace.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                    Visual Theme
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-soft)] flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-[var(--ink)] block">Technical Light (Active)</span>
                        <span className="text-[11px] text-[var(--ink-secondary)]">Optimized for high readability &amp; editorial focus</span>
                      </div>
                      <Check className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="p-4 rounded-xl border border-[var(--border)] opacity-60 bg-[var(--surface-subdued)] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[var(--ink)] block">Dark Grid (Pro)</span>
                        <span className="text-[11px] text-[var(--ink-secondary)]">Scheduled for Cycle '26 Q4 release</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">Soon</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                    Interface Density
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setInterfaceDensity("compact");
                        handleSaveGeneral();
                      }}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        interfaceDensity === "compact"
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]/50 font-bold"
                          : "border-[var(--border)] hover:bg-[var(--surface-subdued)]"
                      }`}
                    >
                      <span className="text-xs text-[var(--ink)] block font-semibold">Compact Technical</span>
                      <span className="text-[11px] text-[var(--ink-secondary)]">Higher information density per viewport</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInterfaceDensity("spacious");
                        handleSaveGeneral();
                      }}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        interfaceDensity === "spacious"
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]/50 font-bold"
                          : "border-[var(--border)] hover:bg-[var(--surface-subdued)]"
                      }`}
                    >
                      <span className="text-xs text-[var(--ink)] block font-semibold">Comfortable</span>
                      <span className="text-[11px] text-[var(--ink-secondary)]">Expanded padding and generous margins</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                    Monospace Code Font
                  </label>
                  <select
                    value={codeTheme}
                    onChange={(e) => {
                      setCodeTheme(e.target.value);
                      handleSaveGeneral();
                    }}
                    className="field w-full cursor-pointer text-xs"
                  >
                    <option value="jetbrains">JetBrains Mono (Default Technical)</option>
                    <option value="fira">Fira Code</option>
                    <option value="system">System Monospace</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--ink)]">Security &amp; Password</h2>
                <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                  Update your authentication credentials and manage session security.
                </p>
              </div>

              {passError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Password updated successfully. Session credentials refreshed.</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="field w-full text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Minimum 8 characters with numbers and symbols"
                    className="field w-full text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-enter new password"
                    className="field w-full text-xs font-mono"
                    required
                  />
                </div>

                <div className="pt-3">
                  <button type="submit" className="btn-primary text-xs h-9 px-5 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: PRIVACY & DATA */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--ink)]">Privacy &amp; Data Governance</h2>
                <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                  Manage how your assessment metrics and preparation activity are shared.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-[var(--ink)]">Profile Visibility</h3>
                    <select
                      value={profileVisibility}
                      onChange={(e) => {
                        setProfileVisibility(e.target.value);
                        handleSaveGeneral();
                      }}
                      className="field text-xs h-8 cursor-pointer"
                    >
                      <option value="campus">Campus Recruiters &amp; Faculty Only</option>
                      <option value="public">Verified Partner Organizations</option>
                      <option value="private">Private (Only Me)</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-[var(--ink-secondary)]">
                    Allows verified campus placement cell coordinators to match you with suitable recruiter slots.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--ink)]">Diagnostic Telemetry</h3>
                    <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                      Share anonymized problem solve-time data to help improve placement difficulty benchmarks.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={telemetry}
                    onChange={(e) => {
                      setTelemetry(e.target.checked);
                      handleSaveGeneral();
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--ink)]">Download Preparation Ledger</h3>
                    <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                      Export your complete profile, test scores, target companies, and module milestones as a JSON file.
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="btn-secondary text-xs h-8 px-3 shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Data (JSON)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DELETE ACCOUNT (DANGER ZONE) */}
          {activeTab === "danger" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-600" /> Delete Account
                </h2>
                <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                  Permanently erase your StudyHub preparation workspace, submission history, and placement targets.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-red-50 border border-red-200 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-800 space-y-1">
                    <p className="font-bold">This action is permanent and irreversible.</p>
                    <p>
                      Deleting your account removes all saved roadmaps, problem logs, mock test percentiles, and company alignments.
                    </p>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-secondary text-xs h-9 px-4 text-red-600 border-red-300 hover:bg-red-100/50 cursor-pointer font-semibold"
                  >
                    I understand, proceed to deletion
                  </button>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-red-200">
                    <p className="text-xs text-red-900 font-medium">
                      To confirm deletion, type <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-red-300">DELETE</span> below:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="field w-full text-xs font-mono border-red-300 focus:border-red-600"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "DELETE"}
                        className={`text-xs h-9 px-4 rounded-lg font-semibold transition-all ${
                          deleteConfirmText === "DELETE"
                            ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        Permanently Delete My Account
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
