import React from "react";

interface MotifProps {
  slug: string;
  className?: string;
}

export function Motif({ slug, className = "" }: MotifProps) {
  return (
    <div className={`x-motif relative shrink-0 select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 110 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible"
      >
        {/* Folder Back Tab */}
        <path
          d="M 12 14 L 38 14 L 46 22 L 100 22 A 4 4 0 0 1 104 26 L 104 64 A 4 4 0 0 1 100 68 L 12 68 A 4 4 0 0 1 8 64 L 8 18 A 4 4 0 0 1 12 14 Z"
          fill="#cfcfcf"
          stroke="#0a0a0a"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Paper Document Slipping Out */}
        <g transform="rotate(-1 55 36)">
          <rect
            x="18"
            y="8"
            width="74"
            height="46"
            rx="4"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2"
          />

          {/* Top Document Header Dots */}
          <circle cx="26" cy="14" r="1.5" fill="#0a0a0a" />
          <circle cx="31" cy="14" r="1.5" fill="#0a0a0a" />
          <circle cx="36" cy="14" r="1.5" fill="#0a0a0a" />

          {/* Discipline-Specific Insignia */}
          {slug === "software-engineer" && (
            <g id="motif-swe">
              <path
                d="M 38 24 L 30 32 L 38 40"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 52 23 L 46 41"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 60 24 L 68 32 L 60 40"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="76" cy="32" r="2" fill="#8a8a8a" />
            </g>
          )}

          {slug === "ai-ml-engineer" && (
            <g id="motif-aiml">
              {/* Neural network lines */}
              <line x1="32" y1="22" x2="52" y2="25" stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.35" />
              <line x1="32" y1="22" x2="52" y2="39" stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.35" />
              <line x1="32" y1="32" x2="52" y2="25" stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.35" />
              <line x1="32" y1="32" x2="52" y2="39" stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.35" />
              <line x1="32" y1="42" x2="52" y2="25" stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.35" />
              <line x1="32" y1="42" x2="52" y2="39" stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.35" />
              <line x1="52" y1="25" x2="70" y2="32" stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.35" />
              <line x1="52" y1="39" x2="70" y2="32" stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.35" />

              {/* Neural nodes */}
              <circle cx="32" cy="22" r="3.5" fill="#8a8a8a" stroke="#0a0a0a" strokeWidth="1.8" />
              <circle cx="32" cy="32" r="3.5" fill="#cfcfcf" stroke="#0a0a0a" strokeWidth="1.8" />
              <circle cx="32" cy="42" r="3.5" fill="#8a8a8a" stroke="#0a0a0a" strokeWidth="1.8" />
              <circle cx="52" cy="25" r="3.5" fill="#cfcfcf" stroke="#0a0a0a" strokeWidth="1.8" />
              <circle cx="52" cy="39" r="3.5" fill="#8a8a8a" stroke="#0a0a0a" strokeWidth="1.8" />
              <circle cx="70" cy="32" r="4.5" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2" />
            </g>
          )}

          {slug === "data-engineer" && (
            <g id="motif-de">
              {/* Primary cylinder */}
              <ellipse cx="38" cy="23" rx="12" ry="4" fill="#ececec" stroke="#0a0a0a" strokeWidth="1.8" />
              <path
                d="M 26 23 v 14 c 0 2.2 5.4 4 12 4 s 12 -1.8 12 -4 v -14"
                fill="#ececec"
                stroke="#0a0a0a"
                strokeWidth="1.8"
              />
              <path
                d="M 26 30 c 0 2.2 5.4 4 12 4 s 12 -1.8 12 -4"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="1.5"
              />

              {/* Pipeline arrow */}
              <path
                d="M 54 30 L 63 30 M 60 27 L 64 30 L 60 33"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Processed block / cylinder */}
              <ellipse cx="75" cy="25" rx="9" ry="3.2" fill="#cfcfcf" stroke="#0a0a0a" strokeWidth="1.8" />
              <path
                d="M 66 25 v 10 c 0 1.8 4 3.2 9 3.2 s 9 -1.4 9 -3.2 v -10"
                fill="#cfcfcf"
                stroke="#0a0a0a"
                strokeWidth="1.8"
              />
            </g>
          )}

          {slug === "cloud-devops-engineer" && (
            <g id="motif-cloud">
              {/* Isometric Container Box */}
              <g transform="translate(4, -1)">
                {/* Top face */}
                <polygon
                  points="48,18 62,25 48,32 34,25"
                  fill="#ececec"
                  stroke="#0a0a0a"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                {/* Left face */}
                <polygon
                  points="34,25 48,32 48,45 34,38"
                  fill="#ffffff"
                  stroke="#0a0a0a"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                {/* Right face */}
                <polygon
                  points="48,32 62,25 62,38 48,45"
                  fill="#8a8a8a"
                  stroke="#0a0a0a"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                {/* Slats */}
                <line x1="39" y1="29" x2="39" y2="40" stroke="#0a0a0a" strokeWidth="1.2" />
                <line x1="43" y1="31" x2="43" y2="42" stroke="#0a0a0a" strokeWidth="1.2" />
                <line x1="53" y1="31" x2="53" y2="42" stroke="#0a0a0a" strokeWidth="1.2" />
                <line x1="57" y1="29" x2="57" y2="40" stroke="#0a0a0a" strokeWidth="1.2" />
              </g>
              {/* Cloud loop */}
              <path
                d="M 27 33 C 27 24 35 18 42 20"
                fill="none"
                stroke="#cfcfcf"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 70 33 C 70 24 62 18 55 20"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {slug === "data-analyst" && (
            <g id="motif-analytics">
              {/* Chart baseline */}
              <line x1="26" y1="42" x2="78" y2="42" stroke="#0a0a0a" strokeWidth="1.8" />

              {/* Bars */}
              <rect x="29" y="31" width="7" height="11" rx="1.5" fill="#ececec" stroke="#0a0a0a" strokeWidth="1.6" />
              <rect x="39" y="25" width="7" height="17" rx="1.5" fill="#8a8a8a" stroke="#0a0a0a" strokeWidth="1.6" />
              <rect x="49" y="19" width="7" height="23" rx="1.5" fill="#cfcfcf" stroke="#0a0a0a" strokeWidth="1.6" />
              <rect x="59" y="14" width="7" height="28" rx="1.5" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="1.6" />

              {/* Trendline */}
              <path
                d="M 28 35 L 33 29 L 43 23 L 53 17 L 63 10"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="63" cy="10" r="2.8" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.8" />
            </g>
          )}

          {slug === "cybersecurity-specialist" && (
            <g id="motif-security">
              {/* Shield */}
              <path
                d="M 52 14 L 68 19 C 68 30 52 41 52 43 C 52 41 36 30 36 19 Z"
                fill="#cfcfcf"
                stroke="#0a0a0a"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Padlock */}
              <path
                d="M 47 25 v -3 a 5 5 0 0 1 10 0 v 3"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="1.8"
              />
              <rect
                x="45"
                y="25"
                width="14"
                height="10"
                rx="2"
                fill="#ffffff"
                stroke="#0a0a0a"
                strokeWidth="1.8"
              />
              <circle cx="52" cy="29" r="1.5" fill="#0a0a0a" />
              <line x1="52" y1="30.5" x2="52" y2="33" stroke="#0a0a0a" strokeWidth="1.5" />
            </g>
          )}

          {/* Fallback for other slugs */}
          {![
            "software-engineer",
            "ai-ml-engineer",
            "data-engineer",
            "cloud-devops-engineer",
            "data-analyst",
            "cybersecurity-specialist",
          ].includes(slug) && (
            <g id="motif-generic">
              <line x1="28" y1="24" x2="68" y2="24" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="31" x2="58" y2="31" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="38" x2="48" y2="38" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* Front Folder Flap with authentic folder silhouette */}
        <path
          d="M 6 34 L 46 34 L 54 40 L 102 40 A 4 4 0 0 1 106 44 L 106 66 A 4 4 0 0 1 102 70 L 6 70 A 4 4 0 0 1 2 66 L 2 38 A 4 4 0 0 1 6 34 Z"
          fill="#ffffff"
          stroke="#0a0a0a"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Folder detail lines & tag */}
        <line x1="12" y1="52" x2="36" y2="52" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="58" x2="26" y2="58" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />

        {/* Folder sticker / tab accent on bottom right */}
        <rect
          x="68"
          y="50"
          width="26"
          height="11"
          rx="3"
          fill="#ececec"
          stroke="#0a0a0a"
          strokeWidth="1.6"
        />
        <line
          x1="73"
          y1="55.5"
          x2="89"
          y2="55.5"
          stroke="#0a0a0a"
          strokeWidth="1.8"
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  );
}

