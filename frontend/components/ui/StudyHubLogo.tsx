"use client";

import React from "react";
import Link from "next/link";
import { clsx } from "clsx";

interface StudyHubLogoProps {
  href?: string;
  prefetch?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  iconOnly?: boolean;
}

/** The mark: a study card with a bookmark and a half-filled reading bar (public/logo-mark.svg). */
export function StudyHubLogoIcon({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className={className}>
      <rect x="8" y="8" width="52" height="52" rx="12" fill="#191614" />
      <rect x="4" y="4" width="52" height="52" rx="12" fill="#fbf8f2" stroke="#191614" strokeWidth="4" />
      <path d="M35 4h13v25l-6.5-5.2L35 29z" fill="#c8603a" stroke="#191614" strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="13" y="14" width="15" height="5" rx="2.5" fill="#191614" />
      <rect x="13" y="35" width="34" height="5" rx="2.5" fill="#191614" />
      <rect x="13" y="45" width="34" height="5" rx="2.5" fill="#191614" fillOpacity=".18" />
      <rect x="13" y="45" width="19" height="5" rx="2.5" fill="#c8603a" />
    </svg>
  );
}

export function StudyHubEmblem({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const px = { sm: 30, md: 34, lg: 42, xl: 50 }[size];
  return <StudyHubLogoIcon size={px} className={clsx("shrink-0 transition-transform duration-200 group-hover:-rotate-3", className)} />;
}

export function StudyHubLogo({
  href = "/dashboard",
  prefetch,
  size = "md",
  showBadge = false,
  badgeText = "",
  className,
  iconOnly = false,
}: StudyHubLogoProps) {
  const textSizes = {
    sm: "text-[18px]",
    md: "text-[22px]",
    lg: "text-[26px]",
    xl: "text-[30px]",
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
          <div className={clsx("display flex items-baseline text-ink", textSizes[size])}>
            STUDY<span className="hl ml-0.5">HUB</span>
          </div>

          {showBadge && (
            <span
              className={clsx(
                "hidden sm:inline-block font-mono uppercase rounded font-bold tracking-wider",
                "bg-accent-soft text-accent-ink border border-accent-line/80",
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
      <Link href={href} prefetch={prefetch} className="inline-flex items-center no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

export default StudyHubLogo;
