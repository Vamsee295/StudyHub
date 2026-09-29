"use client";

import React from "react";
import Link from "next/link";
import { clsx } from "clsx";

interface StudyHubLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  iconOnly?: boolean;
}

export function StudyHubLogoIcon({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 247.0 61.9 L 265.0 61.9 L 276.0 64.9 L 282.0 67.6 L 363.0 115.6 L 445.0 165.8 L 450.0 170.6 L 454.1 176.0 L 456.3 180.0 L 458.6 187.0 L 459.3 195.0 L 458.4 202.0 L 456.3 208.0 L 452.7 214.0 L 444.0 222.4 L 403.0 247.3 L 396.0 250.2 L 392.0 251.1 L 385.0 251.7 L 378.0 251.2 L 374.0 250.3 L 365.0 246.4 L 311.0 214.6 L 281.0 197.8 L 266.0 192.7 L 259.0 191.7 L 251.0 191.8 L 239.2 194.0 L 228.0 198.5 L 187.0 220.6 L 130.0 253.3 L 123.0 256.3 L 112.0 258.5 L 103.0 257.6 L 97.0 256.2 L 90.0 253.2 L 81.0 247.2 L 72.0 238.9 L 64.6 230.0 L 55.8 216.0 L 52.5 208.0 L 50.3 197.0 L 50.7 188.0 L 53.7 179.0 L 58.6 171.0 L 67.0 163.4 L 230.0 67.7 L 237.0 64.7 L 247.0 61.9 Z"
        fill="currentColor"
      />
      <path
        d="M 247.0 214.9 L 260.0 214.5 L 267.0 215.8 L 274.0 218.7 L 356.0 268.5 L 363.4 276.0 L 366.4 281.0 L 367.4 285.0 L 367.7 291.0 L 367.1 296.0 L 363.0 304.0 L 358.4 309.0 L 355.0 311.4 L 304.0 342.3 L 293.0 346.4 L 289.0 347.3 L 281.0 347.3 L 273.0 345.4 L 266.0 342.3 L 196.0 298.7 L 152.0 273.6 L 149.9 271.0 L 149.8 269.0 L 153.0 265.8 L 191.0 245.1 L 235.0 218.8 L 242.0 215.9 L 247.0 214.9 Z"
        fill="currentColor"
      />
      <path
        d="M 161.0 303.7 L 166.0 303.4 L 170.0 305.5 L 249.0 355.6 L 260.0 364.5 L 268.4 374.0 L 273.5 382.0 L 277.3 391.0 L 279.6 400.0 L 280.2 410.0 L 279.6 416.0 L 276.5 426.0 L 271.3 435.0 L 264.0 442.3 L 257.0 446.4 L 247.0 449.2 L 236.0 449.2 L 232.0 448.4 L 224.0 445.5 L 211.0 437.3 L 167.0 406.1 L 158.3 398.0 L 153.0 391.6 L 147.6 383.0 L 141.9 369.0 L 139.6 356.0 L 139.6 346.0 L 141.9 333.0 L 146.8 321.0 L 152.5 312.0 L 158.8 305.0 L 161.0 303.7 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StudyHubEmblem({
  size = "md",
  variant = "dark",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "blue";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-8 h-8 rounded-[9px]",
    lg: "w-10 h-10 rounded-xl",
    xl: "w-12 h-12 rounded-2xl",
  };

  const iconSizes = {
    sm: 18,
    md: 21,
    lg: 26,
    xl: 32,
  };

  const px = iconSizes[size];

  const variantClasses = {
    dark: "bg-black text-white shadow-black/25 shadow-sm ring-1 ring-white/10",
    blue: "bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-500/20 shadow-md",
  };

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-105",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <StudyHubLogoIcon size={px} className="relative z-10 text-white" />
    </div>
  );
}

export function StudyHubLogo({
  href = "/dashboard",
  size = "md",
  showBadge = false,
  badgeText = "",
  className,
  iconOnly = false,
}: StudyHubLogoProps) {
  const textSizes = {
    sm: "text-[15px]",
    md: "text-[16px] sm:text-[17px]",
    lg: "text-[19px] sm:text-[20px]",
    xl: "text-[22px] sm:text-[24px]",
  };

  const badgeSizes = {
    sm: "text-[9px] px-1.5 py-0.5",
    md: "text-[10px] px-1.5 py-0.5",
    lg: "text-[11px] px-2 py-0.5",
    xl: "text-[12px] px-2.5 py-1",
  };

  const content = (
    <div className={clsx("flex items-center gap-2.5 group shrink-0 select-none", className)}>
      <StudyHubEmblem size={size} />

      {!iconOnly && (
        <div className="flex items-baseline gap-1.5">
          <div className="flex items-baseline font-sans font-extrabold tracking-tight leading-none">
            <span className="text-[var(--ink)]">STUDY</span>
            <span className="text-blue-600 dark:text-blue-400">HUB</span>
          </div>

          {showBadge && (
            <span
              className={clsx(
                "hidden sm:inline-block font-mono uppercase rounded font-bold tracking-wider",
                "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60",
                badgeSizes[size]
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

export default StudyHubLogo;
