import React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = ink fill · accent = rust (large CTAs only, see DESIGN §2) · secondary = card + outline */
  variant?: "primary" | "accent" | "secondary" | "ghost" | "danger";
  size?: "sm" | "default" | "lg";
  icon?: React.ReactNode;
}

const base =
  "label-cond inline-flex items-center justify-center gap-2 select-none cursor-pointer rounded-xl transition-[transform,box-shadow] duration-150 disabled:opacity-50 disabled:pointer-events-none";
const sticker =
  "border-[2.4px] shadow-[3px_4px_0_var(--hard)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_5px_0_var(--hard)] active:translate-x-[3px] active:translate-y-1 active:shadow-none active:duration-75";

const variants = {
  primary: clsx(sticker, "bg-ink text-paper border-ink"),
  accent: clsx(sticker, "bg-accent text-paper border-line"),
  secondary: clsx(sticker, "bg-card text-ink border-line"),
  ghost: "text-body hover:text-ink hover:bg-card-2",
  danger: clsx(sticker, "bg-danger text-paper border-line"),
};

const sizes = {
  sm: "h-9 px-3.5 text-[14px]",
  default: "h-[42px] px-5 text-[15px]",
  lg: "h-[52px] px-6 text-[19px]",
};

/** Class string for links that should look like buttons: <Link className={buttonClass("secondary")}> */
export const buttonClass = (variant: ButtonProps["variant"] = "primary", size: ButtonProps["size"] = "default") =>
  clsx(base, variants[variant], sizes[size]);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", icon, children, ...props }, ref) => (
    <button ref={ref} className={clsx(buttonClass(variant, size), "no-press", className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
);

Button.displayName = "Button";
