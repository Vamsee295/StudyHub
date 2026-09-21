"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
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
  AlertCircle
} from "lucide-react";
import { UserProfile } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export function ProfileModal({ isOpen, onClose, profile }: ProfileModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { draftProfile, updateDraft, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable Form State
  const [formData, setFormData] = useState({
    fullName: profile.identity?.fullName || "",
    email: profile.identity?.email || "",
    college: profile.identity?.college || "",
    degree: profile.identity?.degree || "B.Tech — Computer Science & Engineering",
    branch: profile.identity?.branch || "Computer Science & Engineering",
    graduationYear: profile.identity?.graduationYear || "2026",
    currentSemester: profile.identity?.currentSemester || "Final Year",
    targetRole: profile.identity?.targetRole || "Software Development Engineer (SDE-1)",
    preferredJobType: profile.identity?.preferredJobType || "Full-Time Campus & Off-Campus",
    locationPreference: profile.identity?.locationPreference || "Bangalore / Hyderabad / Remote",
  });

  // Sync state whenever profile updates
  useEffect(() => {
    setFormData({
      fullName: profile.identity?.fullName || "",
      email: profile.identity?.email || "",
      college: profile.identity?.college || "",
      degree: profile.identity?.degree || "B.Tech — Computer Science & Engineering",
      branch: profile.identity?.branch || "Computer Science & Engineering",
      graduationYear: profile.identity?.graduationYear || "2026",
      currentSemester: profile.identity?.currentSemester || "Final Year",
      targetRole: profile.identity?.targetRole || "Software Development Engineer (SDE-1)",
      preferredJobType: profile.identity?.preferredJobType || "Full-Time Campus & Off-Campus",
      locationPreference: profile.identity?.locationPreference || "Bangalore / Hyderabad / Remote",
    });
  }, [profile]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedDraft = {
      ...draftProfile,
      identity: {
        ...draftProfile.identity,
        fullName: formData.fullName,
        email: formData.email,
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        graduationYear: formData.graduationYear,
        currentSemester: formData.currentSemester,
        targetRole: formData.targetRole,
        preferredJobType: formData.preferredJobType,
        locationPreference: formData.locationPreference,
      } as any,
      completionPercentage: draftProfile.completionPercentage || 100
    };
    
    updateDraft({ identity: updatedDraft.identity });
    await saveProfile(updatedDraft);

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRecalibrate = () => {
    onClose();
    router.push("/onboarding");
  };

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
            className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-[#fafaf8] flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profile.identity?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"}
                    alt={formData.fullName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {formData.fullName}
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      Active Candidate
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5">
                    {formData.targetRole} • {formData.college}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Success Alert */}
            {savedSuccess && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-medium text-emerald-800 animate-in fade-in duration-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Profile changes successfully updated across Pathward.
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {isEditing ? (
                /* EDIT FORM */
                <form id="profile-edit-form" onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        College / University
                      </label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Branch / Discipline
                      </label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Graduation Year
                      </label>
                      <select
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Target Role
                      </label>
                      <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Current Year / Semester
                      </label>
                      <input
                        type="text"
                        value={formData.currentSemester}
                        onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Preferred Location(s)
                      </label>
                      <input
                        type="text"
                        value={formData.locationPreference}
                        onChange={(e) => setFormData({ ...formData, locationPreference: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </form>
              ) : (
                /* READ-ONLY OVERVIEW */
                <div className="space-y-6">
                  {/* Academic Profile */}
                  <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-700 mb-3">
                      <GraduationCap className="w-4 h-4" />
                      Academic Qualifications
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                      <div>
                        <span className="font-mono text-slate-400 uppercase tracking-wider">Institution</span>
                        <p className="text-slate-900 font-medium mt-0.5">{formData.college}</p>
                      </div>
                      <div>
                        <span className="font-mono text-slate-400 uppercase tracking-wider">Degree &amp; Branch</span>
                        <p className="text-slate-900 font-medium mt-0.5">{formData.degree}</p>
                      </div>
                      <div>
                        <span className="font-mono text-slate-400 uppercase tracking-wider">Graduation Cycle</span>
                        <p className="text-slate-900 font-medium mt-0.5">{formData.graduationYear} Batch • {formData.currentSemester}</p>
                      </div>
                      <div>
                        <span className="font-mono text-slate-400 uppercase tracking-wider">Placement Track</span>
                        <p className="text-slate-900 font-medium mt-0.5">{profile.identity?.driveCycle || "Campus & Off-Campus 2026–27"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Career & Role Preferences */}
                  <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-700 mb-3">
                      <Briefcase className="w-4 h-4" />
                      Career &amp; Placement Direction
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                      <div>
                        <span className="font-mono text-slate-400 uppercase tracking-wider">Target Role</span>
                        <p className="text-slate-900 font-medium mt-0.5">{formData.targetRole}</p>
                      </div>
                      <div>
                        <span className="font-mono text-slate-400 uppercase tracking-wider">Employment Format</span>
                        <p className="text-slate-900 font-medium mt-0.5">{formData.preferredJobType}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-mono text-slate-400 uppercase tracking-wider">Location Preferences</span>
                        <p className="text-slate-900 font-medium mt-0.5">{formData.locationPreference}</p>
                      </div>
                    </div>
                  </div>

                  {/* Synchronized Archetypes */}
                  <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-700">
                        <Sparkles className="w-4 h-4" />
                        Target Company Archetypes
                      </div>
                      <button 
                        onClick={() => {
                          onClose();
                          router.push("/companies");
                        }}
                        className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        Manage Targets →
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.targets?.companies && profile.targets.companies.length > 0 ? (
                        profile.targets.companies.map((comp) => (
                          <span 
                            key={comp} 
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700"
                          >
                            {comp}
                          </span>
                        ))
                      ) : (
                        ["Google", "Microsoft", "Amazon", "TCS"].map((comp) => (
                          <span 
                            key={comp} 
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700"
                          >
                            {comp}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Revisit Onboarding Banner */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Compass className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Need to Re-calibrate your Roadmap?</h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          You can re-run the 4-step onboarding matrix to change your career tracks or skill baselines.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRecalibrate}
                      className="shrink-0 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      Re-calibrate →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-[#fafaf8] flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-mono">
                Last updated: {new Date(profile.updatedAt || Date.now()).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      form="profile-edit-form"
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
