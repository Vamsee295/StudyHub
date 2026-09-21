"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Edit3, 
  Check, 
  Compass,
  Building,
  Target,
  ArrowRight,
  ShieldCheck,
  Award
} from "lucide-react";
import { UserProfile } from "@/types";
import { profileApi } from "@/lib/api/profile";
import { ProfileNavTabs } from "@/components/profile/ProfileNavTabs";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";

export default function ProfilePreferencesPage() {
  const { user } = useAuth();
  const { draftProfile: profile, updateDraft, saveProfile, cancelEdits, isLoading } = useProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile();
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    cancelEdits();
    setIsEditing(false);
  };

  let displayName = "Learner";
  if (isLoading) {
    displayName = "Loading...";
  } else if (profile.identity?.fullName) {
    displayName = profile.identity.fullName;
  } else {
    displayName = user?.email ? user.email.split("@")[0] : "Learner";
  }
  const displayRole = profile.identity?.targetRole || profile.careerTracks?.[0] || "Software Development Engineer";
  const displayAvatar = profile.identity?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix";
  const completion = profile.completionPercentage || (profile.profileCompleted ? 100 : 0);

  return (
    <div className="w-full min-w-0 pb-16">
      {/* SECTION TABS */}
      <ProfileNavTabs />

      {/* PAGE TITLE BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border)] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)] font-semibold tracking-wider">
              Profile Verification &amp; Calibration
            </span>
          </div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
            Profile &amp; Preferences
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-1.5 font-normal">
            Manage your academic standing, target placement roles, and preparation criteria.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              <Check className="w-3.5 h-3.5" /> Changes saved to profile
            </span>
          )}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary text-xs h-9 px-4 flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Information
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="text-xs text-[var(--ink-secondary)] hover:text-[var(--ink)] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <Link
            href="/onboarding"
            className="btn-primary text-xs h-9 px-4 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Re-calibrate Matrix
          </Link>
        </div>
      </div>

      {/* TOP OVERVIEW CARD */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[var(--border)] shadow-xs bg-slate-50"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--success)] ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-tight">
                  {displayName}
                </h2>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {profile.identity?.driveCycle || "Cycle '26"}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" /> Campus Verified
                </span>
              </div>
              <p className="text-[14px] font-medium text-[var(--ink-secondary)] mt-1">
                {displayRole}
              </p>
              <div className="flex items-center gap-4 text-xs text-[var(--ink-tertiary)] font-mono mt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile.identity?.email || user?.email || ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {profile.identity?.college || "University Candidate"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Calibration Gauge */}
          <div className="w-full lg:w-72 p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)] shrink-0">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono text-[var(--ink-secondary)] uppercase font-semibold">Profile Calibration</span>
              <span className="font-mono text-[var(--accent)] font-bold">{completion}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--border-strong)]/40 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--ink-tertiary)]">
              All 4 baseline assessment modules completed for off-campus placement synching.
            </p>
          </div>
        </div>
      </div>

      {/* FORM / DETAILS SECTION */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
            <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[var(--accent)]" /> Edit Candidate Profile
            </h3>
            <span className="text-xs text-[var(--ink-secondary)]">All fields sync with your preparation workspace</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.identity?.fullName || ""}
                onChange={(e) => updateDraft({ identity: { fullName: e.target.value } as any })}
                className="field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                University Email Address
              </label>
              <input
                type="email"
                value={profile.identity?.email || ""}
                onChange={(e) => updateDraft({ identity: { email: e.target.value } as any })}
                className="field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                College / University
              </label>
              <input
                type="text"
                value={profile.identity?.college || ""}
                onChange={(e) => updateDraft({ identity: { college: e.target.value } as any })}
                className="field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                Degree &amp; Program
              </label>
              <input
                type="text"
                value={profile.identity?.degree || ""}
                onChange={(e) => updateDraft({ identity: { degree: e.target.value } as any })}
                className="field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                Discipline / Branch
              </label>
              <input
                type="text"
                value={profile.identity?.branch || ""}
                onChange={(e) => updateDraft({ identity: { branch: e.target.value } as any })}
                className="field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                Graduation Year
              </label>
              <select
                value={profile.identity?.graduationYear || "2026"}
                onChange={(e) => updateDraft({ identity: { graduationYear: e.target.value } as any })}
                className="field w-full cursor-pointer"
              >
                <option value="2025">2025</option>
                <option value="2026">2026 (Upcoming Batch)</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                Current Semester
              </label>
              <select
                value={profile.identity?.currentSemester || "Final Year"}
                onChange={(e) => updateDraft({ identity: { currentSemester: e.target.value } as any })}
                className="field w-full cursor-pointer"
              >
                <option value="5th Semester (3rd Year)">5th Semester (3rd Year)</option>
                <option value="6th Semester (3rd Year)">6th Semester (3rd Year)</option>
                <option value="7th Semester (Final Year)">7th Semester (Final Year)</option>
                <option value="8th Semester (Final Year)">8th Semester (Final Year)</option>
                <option value="Graduated">Graduated / Alumni</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                Primary Target Role
              </label>
              <input
                type="text"
                value={profile.identity?.targetRole || ""}
                onChange={(e) => updateDraft({ identity: { targetRole: e.target.value } as any })}
                className="field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                Preferred Job Type
              </label>
              <input
                type="text"
                value={profile.identity?.preferredJobType || ""}
                onChange={(e) => updateDraft({ identity: { preferredJobType: e.target.value } as any })}
                className="field w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-2">
                Location Preference
              </label>
              <input
                type="text"
                value={profile.identity?.locationPreference || ""}
                onChange={(e) => updateDraft({ identity: { locationPreference: e.target.value } as any })}
                className="field w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[var(--border)]">
            <button
              type="button"
              disabled={saving}
              onClick={handleCancel}
              className="btn-secondary text-xs h-9 px-4 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs h-9 px-6 font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Saving Changes...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Academic & Placement Specifications */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-bold text-[var(--ink)] uppercase font-mono tracking-wider mb-6 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[var(--accent)]" /> Academic Standing &amp; Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Institution</span>
                  <p className="text-sm font-semibold text-[var(--ink)] mt-1">{profile.identity?.college || "—"}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Degree &amp; Program</span>
                  <p className="text-sm font-semibold text-[var(--ink)] mt-1">{profile.identity?.degree || "—"}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Academic Term</span>
                  <p className="text-sm font-semibold text-[var(--ink)] mt-1">{profile.identity?.currentSemester || "—"}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Batch Graduation</span>
                  <p className="text-sm font-semibold text-[var(--ink)] mt-1">Class of {profile.identity?.graduationYear || "2026"}</p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-bold text-[var(--ink)] uppercase font-mono tracking-wider mb-6 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--accent)]" /> Career Objectives &amp; Role Targeting
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Primary Target Role</span>
                  <p className="text-sm font-semibold text-[var(--accent)] mt-1">{displayRole}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Engagement Type</span>
                  <p className="text-sm font-semibold text-[var(--ink)] mt-1">{profile.identity?.preferredJobType || "Full-Time Campus & Off-Campus"}</p>
                </div>
                <div className="sm:col-span-2 p-4 rounded-xl bg-[var(--surface-subdued)] border border-[var(--border)]/70">
                  <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">Locations Mapped</span>
                  <p className="text-sm font-semibold text-[var(--ink)] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.identity?.locationPreference || "Bangalore / Hyderabad / Pune / Remote"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Objectives, Career Tracks & Matrix Baseline */}
          <div className="flex flex-col gap-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[var(--ink)] uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--accent)]" /> Active Objectives
              </h3>
              <div className="flex flex-wrap gap-2">
                {(profile.targets?.objectives || ["Campus Placements", "Product Roles"]).map((obj) => (
                  <span key={obj} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/80">
                    {obj}
                  </span>
                ))}
              </div>

              <h4 className="text-xs font-mono font-bold text-[var(--ink-secondary)] uppercase tracking-wider mt-6 mb-3">
                Selected Career Tracks
              </h4>
              <div className="flex flex-wrap gap-2">
                {(profile.careerTracks || ["Software Engineer"]).map((track) => (
                  <span key={track} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                    {track}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Baseline Snapshot */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[var(--ink)] uppercase font-mono tracking-wider">
                  Baseline Matrix
                </h3>
                <Link href="/onboarding" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
                  Adjust <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                {Object.entries(profile.skillBaseline || {
                  programming: "Intermediate",
                  dsa: "Intermediate",
                  sql: "Beginner",
                  coreCS: "Intermediate",
                  aptitude: "Advanced"
                }).map(([skill, level]) => (
                  <div key={skill} className="flex items-center justify-between py-1.5 border-b border-[var(--border)]/50 last:border-0">
                    <span className="font-mono uppercase text-[var(--ink-secondary)] text-[11px]">{skill}</span>
                    <span className="font-semibold text-[var(--ink)] px-2 py-0.5 rounded bg-[var(--surface-subdued)]">
                      {level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
