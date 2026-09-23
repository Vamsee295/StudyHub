import React from 'react';
import { cn } from '@/lib/utils';

interface ToolCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export function ToolCard({ children, className, noPadding = false, ...props }: ToolCardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
        !noPadding && "p-5 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
