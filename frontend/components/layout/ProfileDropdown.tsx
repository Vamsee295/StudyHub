"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Compass, 
  Building2, 
  TrendingUp, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { UserProfile } from "@/types";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSignOut: () => void;
}

export function ProfileDropdown({
  isOpen,
  onClose,
  profile,
  onSignOut
}: ProfileDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const primaryRole = profile.identity?.targetRole || profile.careerTracks?.[0] || "Software Development Engineer (SDE-1)";
  const fullName = profile.identity?.fullName || "Aditya";
  const email = profile.identity?.email || "aditya@university.edu";
  const avatarUrl = profile.identity?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix";
  const completion = profile.completionPercentage || 88;
  const companiesCount = profile.targets?.companies?.length || 4;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="absolute right-0 top-full mt-2.5 w-[336px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 z-50 overflow-hidden font-sans"
        >
          {/* PROFILE HEADER (Clickable to /profile/preferences) */}
          <button
            onClick={() => handleNavigate("/profile/preferences")}
            className="w-full p-4 bg-slate-50/70 border-b border-slate-100 text-left hover:bg-slate-100/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {fullName}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 uppercase shrink-0">
                    Cycle '26
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-600 truncate mt-0.5">
                  {primaryRole}
                </span>
                <span className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {email}
                </span>
              </div>
            </div>

            {/* Profile Completion Meter */}
            <div className="mt-3.5 pt-3 border-t border-slate-200/60">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-slate-500 font-medium">Profile Calibration</span>
                <span className="text-blue-700 font-bold">{completion}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </button>

          {/* SECTION 1: CORE PREPARATION FULL-PAGE ROUTES */}
          <div className="p-1.5 border-b border-slate-100">
            {/* Profile & Preferences */}
            <button
              onClick={() => handleNavigate("/profile/preferences")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                    Profile &amp; Preferences
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    Academic standing, targets &amp; role preferences
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* My Learning Path */}
            <button
              onClick={() => handleNavigate("/profile/learning-path")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                    My Learning Path
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    Active curriculum, streak &amp; milestones
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* Target Companies */}
            <button
              onClick={() => handleNavigate("/profile/target-companies")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                    Target Companies
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {companiesCount} tracked (Google, Microsoft, Amazon...)
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* Progress & Readiness */}
            <button
              onClick={() => handleNavigate("/profile/progress")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                    Progress &amp; Readiness
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    Readiness 68% • Java 72%, DSA 48%, SQL 81%
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>

          {/* SECTION 2: SYSTEM & HELP FULL-PAGE ROUTES */}
          <div className="p-1.5 border-b border-slate-100">
            {/* Settings */}
            <button
              onClick={() => handleNavigate("/settings")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                  Settings
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* Help & Feedback */}
            <button
              onClick={() => handleNavigate("/help")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                  Help &amp; Feedback
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>

          {/* BOTTOM ACTION: SIGN OUT */}
          <div className="p-1.5 bg-slate-50/50">
            <button
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group cursor-pointer font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold">
                Sign out
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
