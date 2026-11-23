import React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "default" | "lg";
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", icon, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium transition-colors select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2";

    const variantStyles = {
      primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border border-transparent",
      secondary:
        "bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--surface-subdued)] hover:border-[var(--border-strong)]",
      ghost: "bg-transparent text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] border border-transparent",
      danger: "bg-[var(--error)] text-white hover:opacity-90 border border-transparent",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-[12px] rounded-[var(--radius-sm)]",
      default: "h-9 px-4 text-[13px] rounded-[var(--radius-sm)]",
      lg: "h-10 px-5 text-[14px] rounded-[var(--radius-sm)]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
