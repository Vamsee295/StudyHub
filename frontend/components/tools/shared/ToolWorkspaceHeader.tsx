"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { recordToolUse } from "@/lib/tools/recentTools";

interface ToolWorkspaceHeaderProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Header for every tool page; also records the visit for the "Continue where you left off" list. */
export function ToolWorkspaceHeader({ title, description, badge, actions }: ToolWorkspaceHeaderProps) {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) recordToolUse(pathname);
  }, [pathname]);

  return (
    <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="min-w-0">
        <Link href="/tools" className="mb-5 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink">
          <ArrowLeft aria-hidden className="size-3.5" /> Tools
        </Link>
        {badge && <p className="eyebrow mb-2">{badge}</p>}
        <h1 className="display text-[44px] md:text-[60px]">{title}</h1>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-body">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </header>
  );
}
