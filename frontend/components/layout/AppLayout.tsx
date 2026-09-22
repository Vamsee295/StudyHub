"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, Menu, X, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import { notificationService, AppNotification } from "@/lib/services/notificationService";
import { onboardingService, BLANK_USER_PROFILE } from "@/lib/services/onboardingService";
import { UserProfile } from "@/types";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";

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

  // Notification State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // Active User Profile State from Global Context
  const { draftProfile: profile, isLoading } = useProfile();

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user?.id) {
      const loadNotifications = async () => {
        try {
          const [notifs, unread] = await Promise.all([
            notificationService.getNotifications(),
            notificationService.getUnreadCount()
          ]);
          setNotifications(notifs);
          setUnreadCount(unread);
        } catch (err) {
          console.error("Failed to load notifications", err);
        } finally {
          setIsLoadingNotifications(false);
        }
      };

      loadNotifications();

      const unsubscribe = notificationService.subscribeToNotifications(user.id, (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [mounted, user?.id]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Onboarding is optional: authenticated users can access all dashboard and application features directly.

  const handleSignOut = async () => {
    // 1. Clear Supabase auth session
    try {
      const { supabase } = await import('@/lib/supabase/client');
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signOut error:", e);
    }

    // 2. Clear API authentication
    try {
      await authApi.logout();
    } catch (e) {}
    
    // 3. Clear authenticated cookies
    if (typeof document !== "undefined") {
      document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "onboarding-complete=; path=/; max-age=0; SameSite=Lax";
    }

    // 4. Clear stored client-side caches and session
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    // 5. Navigate cleanly to login
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

  // If loading or unmounted, show clean loader
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--canvas)]">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  // Check if current route is a dedicated lesson workspace (/learn/[subject]/[topic])
  const isLessonWorkspace = Boolean(
    pathname?.startsWith('/learn/') && 
    pathname.split('/').filter(Boolean).length >= 3
  );

  return (
    <div className={clsx(
      "flex flex-col bg-[var(--canvas)] selection:bg-[var(--accent-soft)] selection:text-[var(--accent-hover)] text-[var(--ink)] font-sans relative",
      isLessonWorkspace ? "h-screen overflow-hidden" : "min-h-screen grid-texture"
    )}>
      {/* TOP APP NAVIGATION BAR */}
      <header className={clsx(
        "shrink-0 z-40 w-full max-w-full bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] box-border",
        !isLessonWorkspace && "sticky top-0"
      )}>
        <div className={clsx(
          "h-16 flex items-center justify-between gap-3 sm:gap-4 w-full min-w-0 box-border",
          isLessonWorkspace ? "px-4 sm:px-6" : "max-w-7xl mx-auto px-4 sm:px-6"
        )}>
          {/* Brand & Primary Nav */}
          <div className="flex items-center gap-3 xl:gap-6 min-w-0">
            <StudyHubLogo href="/dashboard" size="md" showBadge={false} />

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
            <div className="relative shrink-0 flex">
              <button
                className={clsx(
                  "relative p-2 rounded-lg transition-colors shrink-0",
                  notificationsOpen 
                    ? "text-[var(--ink)] bg-[var(--surface-subdued)]" 
                    : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)]"
                )}
                type="button"
                onClick={() => setNotificationsOpen(prev => !prev)}
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--error)] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--surface)] shadow-sm">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              
              <NotificationDropdown 
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                notifications={notifications}
                isLoading={isLoadingNotifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onNavigate={(link) => router.push(link)}
              />
            </div>
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
      <main className={clsx(
        "flex-1 w-full box-border min-w-0",
        isLessonWorkspace 
          ? "h-[calc(100vh-4rem)] min-h-0 overflow-hidden p-0 m-0" 
          : "max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
      )}>
        {children}
      </main>

      {/* MINIMAL FOOTER */}
      {!isLessonWorkspace && (
        <footer className="w-full max-w-full bg-[var(--surface)] border-t border-[var(--border)]/80 py-6 mt-16 box-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ink-secondary)] font-normal box-border min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
              <span>STUDYHUB · Mapped Learning &amp; Placement Engine · Verified Cycle 2026</span>
            </div>
            <div className="flex items-center gap-4 text-[var(--ink-tertiary)]">
              <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Privacy</a>
              <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Terms of Verification</a>
              <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Campus Network</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
