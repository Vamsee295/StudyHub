"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { recordToolUse } from '@/lib/tools/recentTools';

interface ToolWorkspaceHeaderProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Header for every tool page; also records the visit for the "Continue using" list. */
export function ToolWorkspaceHeader({ title, description, badge, icon, actions }: ToolWorkspaceHeaderProps) {
  const pathname = usePathname();
  useEffect(() => { if (pathname) recordToolUse(pathname); }, [pathname]);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-[var(--border)] pb-6 mb-8">
      <div>
        <Link
          href="/tools"
          className="inline-flex items-center text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--accent)] transition-colors mb-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-1.5" />
          Back to Tools
        </Link>
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
              {icon}
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--ink)]">{title}</h1>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)] ring-1 ring-inset ring-[var(--accent-soft-border)]">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[var(--ink-secondary)] text-sm md:text-base max-w-2xl">{description}</p>
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
