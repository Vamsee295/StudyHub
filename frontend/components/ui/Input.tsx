import React from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "default" | "sm";
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "default", error, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={clsx(
          "w-full bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] transition-colors placeholder:text-[var(--ink-muted)]",
          "rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--accent)]",
          "disabled:opacity-50 disabled:bg-[var(--surface-subdued)] disabled:cursor-not-allowed",
          inputSize === "default" && "h-10 px-3 text-[14px] leading-relaxed",
          inputSize === "sm" && "h-9 px-2.5 text-[13px]",
          error && "border-[var(--error)] focus:border-[var(--error)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
