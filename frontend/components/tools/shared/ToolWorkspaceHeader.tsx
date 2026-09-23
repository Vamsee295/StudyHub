import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ToolWorkspaceHeaderProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function ToolWorkspaceHeader({
  title,
  description,
  badge,
  icon,
  actions
}: ToolWorkspaceHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 mb-8">
      <div>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Tools
        </Link>
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              {icon}
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {badge}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl">
          {description}
        </p>
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
