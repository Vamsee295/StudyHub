"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Compass, Building2, TrendingUp } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { name: "About you", href: "/profile/preferences", icon: User },
  { name: "Path", href: "/profile/learning-path", icon: Compass },
  { name: "Targets", href: "/profile/target-companies", icon: Building2 },
  { name: "Progress", href: "/profile/progress", icon: TrendingUp },
];

/** Sub-navigation shared by the four profile pages; sticks under the phone top bar. */
export function ProfileNavTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Profile sections" className="sticky top-14 z-20 -mx-4 mb-8 border-b-[1.5px] border-hair bg-paper/95 px-4 backdrop-blur md:top-0 md:-mx-8 md:px-8">
      <div className="no-scrollbar flex gap-2 overflow-x-auto py-3">
        {tabs.map(({ name, href, icon: Icon }) => {
          const on = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={clsx(
                "label-cond flex h-9 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-[15px] transition-colors",
                on ? "border-ink bg-ink text-paper" : "border-hair text-body hover:border-line hover:text-ink"
              )}
            >
              <Icon className="size-4" aria-hidden />
              {name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
