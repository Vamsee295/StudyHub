"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, Menu, X, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { onboardingService, BLANK_USER_PROFILE } from "@/lib/services/onboardingService";
import { UserProfile } from "@/types";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";

const navLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Learn", href: "/learn" },
  { name: "Roadmaps", href: "/roadmaps" },
  { name: "Practice", href: "/practice" },
  { name: "Companies", href: "/companies" },
  { name: "Resources", href: "/resources" },
  { name: "Templates", href: "/templates" },
  { name: "Tools", href: "/tools" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile Quick Launcher Dropdown State
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Active User Profile State from Global Context
  const { draftProfile: profile, isLoading } = useProfile();

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Strict Onboarding Route Guard
  useEffect(() => {
    if (mounted && !isLoading) {
      if (!profile.profileCompleted) {
        console.log("[ROUTE GUARD] Profile not completed, redirecting to /onboarding");
        router.replace("/onboarding");
      }
    }
  }, [mounted, isLoading, profile.profileCompleted, router]);

  const handleSignOut = async () => {
    // 1. Clear API authentication
    await authApi.logout();
    
    // 2. Clear authenticated cookies
    document.cookie = "auth-session=; path=/; max-age=0";
    document.cookie = "onboarding-complete=; path=/; max-age=0";

    // 3. Clear stored client-side profile caches
    if (typeof window !== "undefined") {
      localStorage.removeItem("pathward-user-profile");
      localStorage.removeItem("pathward-onboarding-draft");
      localStorage.removeItem("pathward-dashboard-cache");
      if (user?.id) {
        localStorage.removeItem(`pathward-user-profile:${user.id}`);
      }
    }

    // 4. Navigate directly to login
    window.location.href = "/login";
  };

  let displayName = "Learner";
  if (!mounted || isLoading) {
    displayName = "Loading...";
  } else if (profile.identity?.fullName) {
    displayName = profile.identity.fullName;
  } else {
    displayName = user?.email ? user.email.split("@")[0] : "Learner";
  }
  const displayRole = mounted 
    ? (profile.identity?.targetRole || profile.careerTracks?.[0] || "Software Development Engineer")
    : "Software Development Engineer";
  const displayAvatar = mounted 
    ? (profile.identity?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix")
    : "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix";

  // If we are strictly guarding, we can also prevent rendering the AppLayout until loading finishes, 
  // or until it's confirmed they are onboarded, to prevent flashing.
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--canvas)]">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  // If not completed, we are redirecting, so return null to avoid flash
  if (!profile.profileCompleted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)] grid-texture selection:bg-[var(--accent-soft)] selection:text-[var(--accent-hover)] text-[var(--ink)] font-sans relative">
      {/* TOP APP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full max-w-full bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] box-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4 w-full min-w-0 box-border">
          {/* Brand & Primary Nav */}
          <div className="flex items-center gap-3 xl:gap-6 min-w-0">
            <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-newsreader font-bold text-lg shadow-sm shadow-[var(--accent)]/30 transition-transform group-hover:scale-105">
                P
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans font-bold text-[var(--ink)] tracking-tight text-[16px] sm:text-[17px]">
                  PATHWARD
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--surface-subdued)] text-[var(--ink-secondary)] font-semibold tracking-wider">
                  Engine
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[13px] xl:text-[13.5px]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      "px-2.5 xl:px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap",
                      isActive
                        ? "font-semibold text-[var(--accent)] bg-[var(--accent-soft)] ring-1 ring-[var(--accent-soft-border)]"
                        : "font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)]/70"
                    )}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0"></span>}
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Notifications */}
            <button
              className="relative p-2 text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] rounded-lg transition-colors shrink-0"
              type="button"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--surface)]"></span>
            </button>
            <div className="h-5 w-px bg-[var(--border)] hidden sm:block shrink-0"></div>

            {/* Profile Control with Anchored Dropdown */}
            <div className="relative shrink-0">
              <button 
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                title="Account & preferences"
                className="flex items-center gap-2 sm:gap-2.5 pl-1 py-1 pr-2 rounded-full hover:bg-[var(--surface-subdued)]/70 transition-colors cursor-pointer border border-transparent hover:border-[var(--border)] select-none text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 max-w-[180px] sm:max-w-[220px]"
              >
                <img
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--border)] shrink-0"
                  src={displayAvatar}
                />
                <div className="hidden sm:flex flex-col text-left min-w-0 flex-1">
                  <span className="text-[13px] font-semibold text-[var(--ink)] leading-tight truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] font-medium text-[var(--ink-secondary)] truncate">
                    {displayRole}
                  </span>
                </div>
                <ChevronDown 
                  className={clsx(
                    "w-4 h-4 text-[var(--ink-tertiary)] transition-transform duration-200 shrink-0", 
                    profileDropdownOpen && "rotate-180 text-[var(--ink)]"
                  )} 
                />
              </button>

              {/* Anchored Dropdown Menu (Quick Launcher to Full-Page Routes) */}
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onClose={() => setProfileDropdownOpen(false)}
                profile={profile}
                onSignOut={handleSignOut}
                isLoading={isLoading}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] rounded-lg transition-colors shrink-0"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[var(--surface)] border-t border-[var(--border)] px-6 py-4 flex flex-col gap-2 shadow-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "px-3 py-2 rounded-md text-[14px] transition-all flex items-center justify-between",
                    isActive
                      ? "font-semibold text-[var(--accent)] bg-[var(--accent-soft)]"
                      : "font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)]"
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN PAGE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 box-border min-w-0">
        {children}
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="w-full max-w-full bg-[var(--surface)] border-t border-[var(--border)]/80 py-6 mt-16 box-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ink-secondary)] font-normal box-border min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
            <span>PATHWARD · Mapped Learning &amp; Placement Engine · Verified Cycle 2026</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--ink-tertiary)]">
            <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Terms of Verification</a>
            <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Campus Network</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
