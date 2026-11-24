import React from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "default" | "sm";
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "default", error, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl border-2 border-hair bg-card text-ink placeholder:text-mute transition-colors",
        "focus:border-accent disabled:cursor-not-allowed disabled:opacity-50",
        inputSize === "default" ? "h-[42px] px-3.5 text-[15px]" : "h-9 px-3 text-[14px]",
        error && "border-danger focus:border-danger",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
