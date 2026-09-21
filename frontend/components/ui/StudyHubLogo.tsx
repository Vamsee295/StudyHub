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

export function StudyHubEmblem({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizeClasses = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-8 h-8 rounded-[9px]",
    lg: "w-10 h-10 rounded-xl",
    xl: "w-12 h-12 rounded-2xl",
  };

  const iconSizes = {
    sm: 16,
    md: 19,
    lg: 24,
    xl: 28,
  };

  const px = iconSizes[size];

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center shrink-0 overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105",
        "bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-500/20 shadow-md",
        sizeClasses[size],
        className
      )}
    >
      {/* Subtle glass reflection highlight */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/25 pointer-events-none" />

      {/* Unique Geometric StudyHub Icon: Converging Knowledge Wings + Interconnected Node Hub */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
      >
        {/* Left Open Page / Wing */}
        <path
          d="M4 19.5V6.5C4 5.39543 4.89543 4.5 6 4.5H11C11.5523 4.5 12 4.94772 12 5.5V18.5C12 19.0523 11.5523 19.5 11 19.5H5C4.44772 19.5 4 19.5 4 19.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="white"
          fillOpacity="0.15"
        />
        {/* Right Open Page / Wing */}
        <path
          d="M20 19.5V6.5C20 5.39543 19.1046 4.5 18 4.5H13C12.4477 4.5 12 4.94772 12 5.5V18.5C12 19.0523 12.4477 19.5 13 19.5H19C19.5523 19.5 20 19.5 20 19.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="white"
          fillOpacity="0.15"
        />
        {/* Central Interconnected Placement Hub Nodes */}
        <circle cx="12" cy="10" r="2.2" fill="#60A5FA" stroke="white" strokeWidth="1.4" />
        <path d="M12 12.2V17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="17.5" r="1" fill="white" />
        {/* Top Floating Orbit / Focus Diamond */}
        <path
          d="M12 3L13.5 4.5L12 6L10.5 4.5L12 3Z"
          fill="#93C5FD"
        />
      </svg>
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
