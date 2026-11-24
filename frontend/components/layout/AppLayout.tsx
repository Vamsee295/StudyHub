"use client";

import { useState, useEffect, useSyncExternalStore, ViewTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  BookOpen,
  Building,
  CalendarCheck,
  CodeXml,
  Database,
  Dumbbell,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Library,
  LifeBuoy,
  Lightbulb,
  ListChecks,
  Loader2,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Settings,
  Timer,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import { notificationService, AppNotification } from "@/lib/services/notificationService";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";
import { SearchLauncher } from "@/components/learn/SearchLauncher";
import { applyTheme } from "@/lib/theme";
import { AskDialog } from "@/components/ui/AskDialog";

type NavItem = readonly [href: string, label: string, icon: LucideIcon];

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Today",
    items: [
      ["/dashboard", "Dashboard", LayoutDashboard],
      ["/learn/daily", "Daily", CalendarCheck],
      ["/study-with-me", "Study With Me", Timer],
    ],
  },
  {
    title: "Learn",
    items: [
      ["/learn", "Learn", BookOpen],
      ["/roadmaps", "Roadmaps", Route],
      ["/learn/map", "Knowledge map", Network],
      ["/learn/saved", "Saved", Bookmark],
    ],
  },
  {
    title: "Practice",
    items: [
      ["/practice", "Practice", Dumbbell],
      ["/practice/problems", "Problems", ListChecks],
      ["/practice/sql", "SQL", Database],
      ["/practice/code", "Code", CodeXml],
    ],
  },
  {
    title: "Career",
    items: [
      ["/companies", "Companies", Building],
      ["/resources", "Resources", Library],
      ["/templates", "Templates", FileText],
      ["/tools", "Tools", Wrench],
      ["/labs", "Labs", FlaskConical],
    ],
  },
];
const utility: NavItem[] = [
  ["/ideas", "Ideas", Lightbulb],
  ["/help", "Help", LifeBuoy],
  ["/settings", "Settings", Settings],
];
const tabs: NavItem[] = [
  ["/dashboard", "Home", LayoutDashboard],
  ["/learn", "Learn", BookOpen],
  ["/practice", "Practice", Dumbbell],
  ["/tools", "Tools", Wrench],
  ["/profile", "Me", UserRound],
];

const matches = (path: string, href: string) => path === href || path.startsWith(href + "/");
/** The single most specific item for this path, so /learn/daily lights "Daily" and not also "Learn". */
const activeHref = (path: string, items: NavItem[]) =>
  items.filter(([h]) => matches(path, h)).sort((a, b) => b[0].length - a[0].length)[0]?.[0];
const allItems = [...groups.flatMap((g) => g.items), ...utility];

const SIDEBAR_KEY = "sh-sidebar-collapsed";
const readCollapsed = () => {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === "1";
  } catch {
    return false;
  }
};
const noop = () => () => {};
// The first page to appear is the app opening, not a navigation, so it doesn't slide in.
let started = false;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { user } = useAuth();
  const { draftProfile: profile, isLoading } = useProfile();
  // false only while hydrating the server HTML. Each section's layout.tsx renders its own AppLayout, so moving
  // between sections remounts it; on those client mounts this is already true and the spinner doesn't flash.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  // read on first render: nothing reads it until `mounted`, so the server/client difference never reaches the DOM
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  useEffect(() => {
    started = true;
  }, []);

  // --sb drives the sidebar width and the content's left edge
  useEffect(() => {
    document.documentElement.style.setProperty("--sb", collapsed ? "72px" : "240px");
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  // Ctrl/Cmd + B toggles the sidebar; the "System" theme follows the OS live
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    const mq = matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", applyTheme);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", applyTheme);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !user?.id) return;
    (async () => {
      try {
        const [notifs, unread] = await Promise.all([
          notificationService.getNotifications(),
          notificationService.getUnreadCount(),
        ]);
        setNotifications(notifs);
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setIsLoadingNotifications(false);
      }
    })();
    return notificationService.subscribeToNotifications(user.id, (n) => {
      setNotifications((prev) => [n, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
  }, [mounted, user?.id]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleSignOut = async () => {
    try {
      const { supabase } = await import("@/lib/supabase/client");
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signOut error:", e);
    }
    try {
      await authApi.logout();
    } catch {}
    document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "onboarding-complete=; path=/; max-age=0; SameSite=Lax";
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/login");
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  const displayName = profile.identity?.fullName || (user?.email ? user.email.split("@")[0] : "Learner");
  const displayRole = profile.identity?.targetRole || profile.careerTracks?.[0] || "Software Development Engineer";
  const displayAvatar = profile.identity?.avatarUrl || "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix";

  // Lessons and editors fill the screen and scroll inside themselves
  const isWorkspace =
    // /learn/<subject>/<lesson>, but not the subject's own pages (test, review, …), which scroll normally
    (/^\/learn\/[^/]+\/[^/]+$/.test(pathname) && !/\/(test|review|revise|reading-order)$/.test(pathname)) ||
    pathname === "/practice/code" ||
    pathname === "/practice/sql" ||
    (pathname.startsWith("/practice/problems/") && pathname !== "/practice/problems");

  const active = activeHref(pathname, allItems);
  const activeTab = activeHref(pathname, tabs);

  const navLink = ([href, label, Icon]: NavItem) => {
    const on = active === href;
    return (
      <Link
        key={href}
        href={href}
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
        aria-current={on ? "page" : undefined}
        className={clsx(
          "label-cond flex h-10 items-center gap-3 rounded-xl text-[16px] transition-colors",
          collapsed ? "justify-center" : "px-3",
          on ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
        )}
      >
        <Icon className={clsx("size-[18px] shrink-0", on ? "text-paper" : "text-accent")} />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    );
  };

  const bell = (open: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
      aria-expanded={open}
      className={clsx(
        "tap relative grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
        open ? "bg-ink/[0.08] text-ink" : "text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
      )}
    >
      <Bell className="size-[18px]" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-paper">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );

  const notificationsMenu = (placement: string) => (
    <NotificationDropdown
      isOpen={notificationsOpen}
      onClose={() => setNotificationsOpen(false)}
      notifications={notifications}
      isLoading={isLoadingNotifications}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onNavigate={(link) => router.push(link)}
      placement={placement}
    />
  );

  return (
    <div className={clsx("relative text-ink", isWorkspace ? "h-dvh overflow-hidden" : "min-h-dvh")}>
      {/* ── Desktop sidebar ── */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-[var(--sb)] flex-col border-r-[2.4px] border-line bg-paper transition-[width] duration-200 [view-transition-name:sidebar] md:flex"
        aria-label="Main navigation"
      >
        <div className={clsx("flex h-16 shrink-0 items-center gap-2", collapsed ? "justify-center px-2" : "justify-between pl-4 pr-3")}>
          <StudyHubLogo href="/dashboard" size="sm" iconOnly={collapsed} />
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar (Ctrl+B)"
              title="Collapse sidebar (Ctrl+B)"
              className="tap grid size-8 place-items-center rounded-lg text-ink/60 hover:bg-ink/[0.06] hover:text-ink"
            >
              <PanelLeftClose className="size-[18px]" />
            </button>
          )}
        </div>

        <div className={clsx("relative flex shrink-0 items-center gap-1 pb-3", collapsed ? "flex-col px-2" : "px-3")}>
          <SearchLauncher />
          {bell(notificationsOpen, () => setNotificationsOpen((o) => !o))}
          {notificationsMenu("left-3 top-full mt-2")}
        </div>

        <nav className={clsx("no-scrollbar flex-1 overflow-y-auto pb-4", collapsed ? "px-2" : "px-3")}>
          {groups.map((g) => (
            <div key={g.title} className="mb-4">
              {collapsed ? (
                <div className="mx-auto mb-2 h-px w-6 bg-hair" />
              ) : (
                <p className="eyebrow mb-1.5 px-3 !text-[11px] !text-mute">{g.title}</p>
              )}
              <div className="flex flex-col gap-0.5">{g.items.map(navLink)}</div>
            </div>
          ))}
          <div className="flex flex-col gap-0.5 border-t-[1.5px] border-hair pt-3">{utility.map(navLink)}</div>
        </nav>

        <div className={clsx("relative shrink-0 border-t-[2.4px] border-line p-3", collapsed && "flex flex-col items-center gap-2")}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
            title="Account & preferences"
            className={clsx(
              "flex w-full items-center gap-2.5 rounded-xl text-left transition-colors hover:bg-ink/[0.06]",
              collapsed ? "justify-center p-1" : "p-1.5"
            )}
          >
            <img alt="" src={displayAvatar} className="size-9 shrink-0 rounded-full border-2 border-line bg-card object-cover" />
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold leading-tight">{displayName}</span>
                <span className="block truncate font-mono text-[11px] text-mute">{displayRole}</span>
              </span>
            )}
          </button>
          <ProfileDropdown
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            profile={profile}
            onSignOut={handleSignOut}
            isLoading={isLoading}
            placement="left-3 bottom-full mb-2"
          />
          {collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar (Ctrl+B)"
              title="Expand sidebar (Ctrl+B)"
              className="tap grid size-8 place-items-center rounded-lg text-ink/60 hover:bg-ink/[0.06] hover:text-ink"
            >
              <PanelLeftOpen className="size-[18px]" />
            </button>
          )}
        </div>
      </aside>

      {/* ── Phone top bar ── */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b-[2.4px] border-line bg-paper px-4 pt-[env(safe-area-inset-top)] md:hidden">
        <StudyHubLogo href="/dashboard" size="sm" />
        <div className="relative flex items-center gap-1">
          <SearchLauncher />
          {bell(notificationsOpen, () => setNotificationsOpen((o) => !o))}
          {notificationsMenu("right-0 top-full mt-2")}
          <button
            type="button"
            onClick={() => setMobileProfileOpen((o) => !o)}
            aria-expanded={mobileProfileOpen}
            aria-label="Account & preferences"
            className="tap ml-1 shrink-0 rounded-full"
          >
            <img alt="" src={displayAvatar} className="size-8 rounded-full border-2 border-line bg-card object-cover" />
          </button>
          <ProfileDropdown
            isOpen={mobileProfileOpen}
            onClose={() => setMobileProfileOpen(false)}
            profile={profile}
            onSignOut={handleSignOut}
            isLoading={isLoading}
          />
        </div>
      </header>

      {/* ── Page ── */}
      <div className={clsx("md:pl-[var(--sb)] md:transition-[padding] md:duration-200", isWorkspace && "h-[calc(100dvh-3.5rem)] md:h-dvh")}>
        <main
          className={clsx(
            "min-w-0",
            isWorkspace ? "h-full overflow-hidden" : "mx-auto max-w-[1200px] px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-8"
          )}
        >
          <ViewTransition key={pathname} enter={started ? "page-in" : "none"} exit="page-out" default="none">
            <div className={clsx(isWorkspace && "h-full")}>{children}</div>
          </ViewTransition>
        </main>
        {!isWorkspace && (
          <footer className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-hair px-4 py-6 pb-28 font-mono text-[11px] uppercase tracking-wider text-mute md:px-8 md:pb-6">
            <span>StudyHub · placement prep, mapped</span>
            <span className="flex gap-4">
              <Link href="/ideas" className="text-accent-ink hover:underline">
                Ideas board
              </Link>
              <Link href="/help" className="hover:text-ink">
                Help
              </Link>
            </span>
          </footer>
        )}
      </div>

      <AskDialog />

      {/* ── Phone tab bar (hidden in full-screen workspaces) ── */}
      {!isWorkspace && (
        <nav
          aria-label="Main navigation"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t-[2.4px] border-line bg-paper pb-[env(safe-area-inset-bottom)] [view-transition-name:tabbar] md:hidden"
        >
          {tabs.map(([href, label, Icon]) => {
            const on = activeTab === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={on ? "page" : undefined}
                className={clsx("label-cond flex h-16 flex-col items-center justify-center gap-1 text-[12px]", on ? "text-ink" : "text-ink/55")}
              >
                <span className={clsx("grid h-7 w-12 place-items-center rounded-full transition-colors", on && "bg-ink text-paper")}>
                  <Icon className="size-[18px]" />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
