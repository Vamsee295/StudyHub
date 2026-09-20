"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Bell, 
  Sun, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Trash2, 
  Check, 
  AlertTriangle,
  Download
} from "lucide-react";
import { UserProfile } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSignOut: () => void;
}

type TabType = "account" | "notifications" | "appearance" | "security" | "privacy" | "danger";

export function SettingsModal({ isOpen, onClose, profile, onSignOut }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [emailDigest, setEmailDigest] = useState(true);
  const [hiringAlerts, setHiringAlerts] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [telemetry, setTelemetry] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);
  
  // Password change state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  // Danger zone state
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSaveGeneral = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pathward_profile_${profile.identity?.fullName || "user"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.trim() === "DELETE MY ACCOUNT") {
      onSignOut();
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "security", label: "Security & Password", icon: Lock },
    { id: "privacy", label: "Privacy & Data", icon: ShieldCheck },
    { id: "danger", label: "Delete Account", icon: Trash2 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 h-[580px] max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-[#fafaf8] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Application Settings</h2>
                <p className="text-xs text-slate-500">Configure your account, alerts, privacy, and system preferences.</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Banner */}
            {savedSuccess && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2 text-xs font-medium text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Settings preferences updated successfully.
              </div>
            )}

            {/* Layout: Sidebar + Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-52 border-r border-slate-200 bg-slate-50/70 p-3 space-y-1 shrink-0 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isDanger = item.id === "danger";

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                        isActive
                          ? isDanger
                            ? "bg-red-50 text-red-700 font-bold border border-red-200"
                            : "bg-white text-blue-700 font-bold border border-slate-200 shadow-2xs"
                          : isDanger
                          ? "text-red-600 hover:bg-red-50/60"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isDanger ? "text-red-500" : isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Content View */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* ACCOUNT TAB */}
                {activeTab === "account" && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Account Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-mono text-slate-400 uppercase tracking-wider block mb-1">Primary Email</label>
                        <input
                          type="text"
                          disabled
                          value={profile.identity?.email || "aditya@university.edu"}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">Contact your campus administrator to change official student email.</span>
                      </div>
                      <div>
                        <label className="font-mono text-slate-400 uppercase tracking-wider block mb-1">Connected Auth Provider</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>Campus SSO / Direct Credentials</span>
                        </div>
                      </div>
                      <div>
                        <label className="font-mono text-slate-400 uppercase tracking-wider block mb-1">Target Placement Cycle</label>
                        <input
                          type="text"
                          disabled
                          value={profile.identity?.driveCycle || "Campus & Off-Campus 2026–27"}
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-slate-400 uppercase tracking-wider block mb-1">Account Role</label>
                        <input
                          type="text"
                          disabled
                          value="Undergraduate Student (Verified)"
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Notification Preferences</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={emailDigest}
                          onChange={(e) => setEmailDigest(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold text-slate-800">Weekly Readiness Digest</span>
                          <span className="text-slate-500">Receive a weekly summary of completed practice modules, streak, and readiness metrics.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={hiringAlerts}
                          onChange={(e) => setHiringAlerts(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold text-slate-800">Company Test &amp; Drive Alerts</span>
                          <span className="text-slate-500">Get notified when target companies (Google, Microsoft, TCS) announce campus dates.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={streakReminders}
                          onChange={(e) => setStreakReminders(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold text-slate-800">Daily Practice Reminder</span>
                          <span className="text-slate-500">A quick reminder to solve 1 DSA or SQL problem every evening to protect your streak.</span>
                        </div>
                      </label>
                    </div>

                    <button
                      onClick={handleSaveGeneral}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer mt-2"
                    >
                      Save Preferences
                    </button>
                  </div>
                )}

                {/* APPEARANCE TAB */}
                {activeTab === "appearance" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Display Theme &amp; Density</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-blue-500 rounded-xl p-4 bg-blue-50/30 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Technical Editorial (Light)</span>
                          <Check className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-[11px] text-slate-500">Clean light background with subtle blueprint grid and high contrast ink typography.</p>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 opacity-60 flex flex-col gap-2 cursor-not-allowed">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Dark Mode</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Coming Soon</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Pathward's design language prioritizes technical clarity on white paper surfaces.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Change Password</h3>
                    
                    {passError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {passError}
                      </div>
                    )}
                    {passSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-700 flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        Password has been successfully updated.
                      </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md text-xs">
                      <div>
                        <label className="block text-slate-600 font-mono uppercase tracking-wider mb-1">Current Password</label>
                        <input
                          type="password"
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-mono uppercase tracking-wider mb-1">New Password</label>
                        <input
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-mono uppercase tracking-wider mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                )}

                {/* PRIVACY & DATA TAB */}
                {activeTab === "privacy" && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Privacy &amp; Data Control</h3>
                    
                    <div className="space-y-3 text-xs">
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={telemetry}
                          onChange={(e) => setTelemetry(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">Diagnostic Practice Telemetry</span>
                          <span className="text-slate-500">Permit Pathward to calibrate problem recommendations based on your time-to-solve data.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={leaderboardVisible}
                          onChange={(e) => setLeaderboardVisible(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">Campus Leaderboard Visibility</span>
                          <span className="text-slate-500">Allow your peer percentile to be visible in anonymous departmental benchmarks.</span>
                        </div>
                      </label>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 mb-1">Export Personal Data</h4>
                      <p className="text-xs text-slate-500 mb-3">Download a structured JSON archive of your onboarding responses, baseline diagnostics, and target roadmaps.</p>
                      <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer transition-colors"
                      >
                        <Download className="w-4 h-4 text-slate-500" />
                        Download Data Archive (.json)
                      </button>
                    </div>
                  </div>
                )}

                {/* DANGER ZONE / DELETE ACCOUNT */}
                {activeTab === "danger" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-red-700 pb-2 border-b border-red-100 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Danger Zone
                    </h3>
                    
                    <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 text-xs text-red-900 space-y-2">
                      <p className="font-bold">Permanent Account Deletion</p>
                      <p className="text-red-700 leading-relaxed">
                        Deleting your account will permanently remove your calibrated placement roadmap, problem submission history, streak counters, and resume preferences. This action cannot be undone.
                      </p>
                    </div>

                    {!showDeleteConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                      >
                        Initiate Account Deletion...
                      </button>
                    ) : (
                      <div className="p-4 border border-red-200 rounded-xl bg-white space-y-3">
                        <p className="text-xs font-bold text-slate-800">
                          Please type <span className="font-mono text-red-600 select-all">DELETE MY ACCOUNT</span> to confirm:
                        </p>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE MY ACCOUNT"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-500"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteConfirmText("");
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={deleteConfirmText.trim() !== "DELETE MY ACCOUNT"}
                            onClick={handleDeleteAccount}
                            className="px-4 py-1.5 rounded-lg bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Permanently Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
