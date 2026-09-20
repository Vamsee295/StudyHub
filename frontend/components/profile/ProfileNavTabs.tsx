"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Compass, Building2, TrendingUp } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { name: "Profile & Preferences", href: "/profile/preferences", icon: User },
  { name: "My Learning Path", href: "/profile/learning-path", icon: Compass },
  { name: "Target Companies", href: "/profile/target-companies", icon: Building2 },
  { name: "Progress & Readiness", href: "/profile/progress", icon: TrendingUp },
];

export function ProfileNavTabs() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-[var(--border)] bg-[var(--surface)] -mx-4 sm:-mx-6 px-4 sm:px-6 mb-8 sticky top-16 z-20 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] font-semibold ring-1 ring-[var(--accent-soft-border)] shadow-xs"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)]"
              )}
            >
              <Icon className={clsx("w-4 h-4", isActive ? "text-[var(--accent)]" : "text-[var(--ink-tertiary)]")} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
