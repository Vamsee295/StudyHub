import React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "success" | "warning" | "danger";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-[var(--surface-subdued)] text-[var(--ink-secondary)] border-[var(--border)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-soft-border)]",
    success: "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success-soft-border)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning-soft-border)]",
    danger: "bg-[var(--error-soft)] text-[var(--error)] border-[var(--error-soft-border)]",
  };

  const dotStyles = {
    neutral: "bg-[var(--ink-tertiary)]",
    accent: "bg-[var(--accent)]",
    success: "bg-[var(--success)]",
    warning: "bg-[var(--warning)]",
    danger: "bg-[var(--error)]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 h-[22px] px-2 rounded-[var(--radius-xs)] text-[11px] font-medium border select-none ",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full", dotStyles[variant])} />}
      {children}
    </span>
  );
}
