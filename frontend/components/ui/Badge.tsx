import React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** success = teal (done) · warning = gold (in progress) · accent = rust (the one thing to look at) */
  variant?: "neutral" | "accent" | "success" | "warning" | "danger";
  dot?: boolean;
}

const variants = {
  neutral: "bg-card-2 text-body border-hair",
  accent: "bg-accent-soft text-accent-ink border-accent-line",
  success: "bg-success-soft text-note border-success-line",
  warning: "bg-warning-soft text-warning border-warning-line",
  danger: "bg-danger-soft text-danger border-danger-line",
};
const dots = { neutral: "bg-mute", accent: "bg-accent", success: "bg-note", warning: "bg-gold", danger: "bg-danger" };

/** Outlined pill chip. Always carries text, so status never relies on colour alone. */
export function Badge({ className, variant = "neutral", dot = false, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex h-[22px] select-none items-center gap-1.5 rounded-full border-[1.5px] px-2.5 font-mono text-[11px] font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={clsx("size-1.5 rounded-full", dots[variant])} />}
      {children}
    </span>
  );
}
