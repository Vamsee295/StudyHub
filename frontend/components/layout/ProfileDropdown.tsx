"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Compass, 
  Building2, 
  TrendingUp, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/Page";
import { UserProfile } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSignOut: () => void;
  isLoading?: boolean;
  /** where the menu opens relative to its trigger */
  placement?: string;
}

export function ProfileDropdown({
  isOpen,
  onClose,
  profile,
  onSignOut,
  isLoading = false,
  placement = "right-0 top-full mt-2.5"
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

  const { user } = useAuth();
  const primaryRole = profile.identity?.targetRole || profile.careerTracks?.[0] || "Software Development Engineer";
  
  let fullName = "Learner";
  if (isLoading) {
    fullName = "Loading...";
  } else if (profile.identity?.fullName) {
    fullName = profile.identity.fullName;
  } else {
    fullName = user?.email ? user.email.split("@")[0] : "Learner";
  }

  const email = profile.identity?.email || user?.email || "";
  const avatarUrl = profile.identity?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix";
  const completion = profile.completionPercentage || (profile.profileCompleted ? 100 : 0);
  const companies = profile.targets?.companies ?? [];
  const rows = [
    { path: "/profile/preferences", label: "About you", hint: primaryRole, icon: User },
    { path: "/profile/learning-path", label: "Your path", hint: "Courses in progress and next up", icon: Compass },
    {
      path: "/profile/target-companies",
      label: "Target companies",
      hint: companies.length ? companies.slice(0, 3).join(", ") + (companies.length > 3 ? ` +${companies.length - 3}` : "") : "None picked yet",
      icon: Building2,
    },
    { path: "/profile/progress", label: "Progress", hint: "Lessons, problems, review queue", icon: TrendingUp },
  ];
  const rowCls = "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-card-2";

  if (!isOpen) return null;
  return (
    <div ref={dropdownRef} className={`pop-in brut absolute ${placement} z-50 w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl bg-card`}>
      <button onClick={() => handleNavigate("/profile/preferences")} className="w-full border-b-[1.5px] border-hair p-4 text-left hover:bg-card-2">
        <span className="flex items-center gap-3">
          <img src={avatarUrl} alt="" className="size-11 shrink-0 rounded-full border-2 border-line bg-paper object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold">{fullName}</span>
            <span className="block truncate font-mono text-[11px] text-mute">{email}</span>
          </span>
        </span>
        {completion < 100 && <Progress value={completion} label="Profile complete" className="mt-3" />}
      </button>

      <div className="border-b-[1.5px] border-hair p-1.5">
        {rows.map(({ path, label, hint, icon: Icon }) => (
          <button key={path} onClick={() => handleNavigate(path)} className={rowCls}>
            <Icon className="size-4 shrink-0 text-accent" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold">{label}</span>
              <span className="block truncate text-[12px] text-mute">{hint}</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        ))}
      </div>

      <div className="border-b-[1.5px] border-hair p-1.5">
        <button onClick={() => handleNavigate("/settings")} className={rowCls}>
          <Settings className="size-4 text-mute" aria-hidden />
          <span className="flex-1 text-[14px] font-semibold">Settings</span>
        </button>
        <button onClick={() => handleNavigate("/help")} className={rowCls}>
          <HelpCircle className="size-4 text-mute" aria-hidden />
          <span className="flex-1 text-[14px] font-semibold">Help</span>
        </button>
      </div>

      <div className="p-1.5">
        <button
          onClick={() => {
            onClose();
            onSignOut();
          }}
          className={`${rowCls} text-danger`}
        >
          <LogOut className="size-4" aria-hidden />
          <span className="flex-1 text-[14px] font-semibold">Sign out</span>
        </button>
      </div>
    </div>
  );
}
