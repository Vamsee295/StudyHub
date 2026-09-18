---
name: Technical Editorial
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#434655'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#004870'
  on-tertiary: '#ffffff'
  tertiary-container: '#006194'
  on-tertiary-container: '#b2d9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display:
    fontFamily: Newsreader
    fontSize: 44px
    fontWeight: '500'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  margin-desktop-max: 80rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style
The design system reflects the convergence of authoritative technical documentation, high-end editorial engineering publishing, and modern software craft. It is built for senior engineers, candidates preparing for tier-one systems architecture interviews, and technical leaders who value rigor, density, and legibility over superficial ornamentation.

The visual direction rejects generic SaaS tropes—such as amorphous gradient blobs, saturated neon glows, and heavy glassmorphism. Instead, it balances Swiss structural restraint with an architectural warmth. Every interface element exists to clarify complex mental models, reduce cognitive friction during deep problem-solving sessions, and impart quiet authority.

### Key Visual Tenets
- **Structural Integrity:** Crisp 1px structural dividing lines provide clear page rhythm reminiscent of technical schematics and ledger layouts.
- **Editorial Legibility:** Strict typographic scale calibrated for extended technical reading, inline code parsing, and fast visual scanning.
- **Controlled Density:** Information-dense layouts that retain breathability through deliberate margin systems and high optical contrast.

## Colors
The palette is rooted in tactile, paper-like warmth paired with high-contrast inks and an engineered cobalt blue.

### Semantic Tiers
- **Canvas (`#FAFAF8`):** The primary off-white surface tone reduces visual fatigue during marathon coding and systems design study sessions.
- **Surface Raised (`#FFFFFF`):** Reserved for interactive cards, code workbench surfaces, and modular panels to naturally separate content from the canvas.
- **Surface Subdued (`#F1F5F9`):** Used for code block line backgrounds, table headers, and inactive states.
- **Border Default (`#E2E8F0`):** Precise 1px borders define structure without visually competing with content.
- **Text Ink Primary (`#0F172A`):** Deep near-black slate offering superior legibility and high contrast.
- **Text Ink Secondary (`#64748B`):** Muted slate gray for secondary metadata, labels, and timestamps.
- **Text Ink Tertiary (`#94A3B8`):** Restrained gray for inactive icons, line numbers, and subtle guides.
- **Accent Primary (`#1D4ED8`):** Architectural cobalt used selectively for primary actions, current navigation indicators, and active execution states.
- **Accent Interactive Hover (`#1E40AF`):** Deepened blue for sustained press and hover feedback.
- **Telemetry & Status:** 
  - Pass/Correct: `#059669` (Emerald)
  - Alert/Warning: `#D97706` (Amber)
  - Failure/Error: `#DC2626` (Crimson)
  - System Metric/Telemetry: `#0284C7` (Cyan Blue)

## Typography
The system balances academic gravitas with functional engineering precision by pairing three distinct typefaces:

1. **Newsreader (Display & Editorial Headlines):** Establishes an elevated publication aesthetic for curriculum overviews, module chapters, deep-dive architectural essays, and executive interview breakdowns.
2. **Geist (Interface & Body Text):** Delivers clean neutral legibility across long-form problem statements, parameter specifications, and system dashboards.
3. **JetBrains Mono (Technical Metadata & Code):** Governs code blocks, execution runtimes, memory metrics, pill badges, and status counters.

### Typographic Rules
- Never use Newsreader for interface labels, form inputs, buttons, or technical metrics.
- Keep `label-sm` uppercase when used as section super-headers or architectural metadata flags.
- Maintain a line-height multiplier between 1.55 and 1.65 for long-form explanatory reading blocks to maintain focus.

## Layout & Spacing
The layout system relies on a mathematical 8pt baseline grid with an overlaid technical coordinate feel.

### Grid Construction
- **Desktop (>= 1280px):** 12-column grid within a max-width container of `80rem` (1280px), centered with `margin: 2rem` and `gutter: 1.5rem`. Split-screen workspaces (e.g., problem briefing vs. interactive IDE) utilize a 50/50 split or a 40/60 ratio separated by a continuous 1px vertical border.
- **Tablet (768px – 1279px):** 8-column layout with `1.5rem` gutters and dynamic sheet drawers for ancillary debugging telemetry.
- **Mobile (< 768px):** Single-column stacked layout with `1rem` edge margins and sticky tabbed panel switches between problem statements and code terminals.

### Delicate Grid Backgrounds
Subtle background grid textures are deployed selectively across hero zones, technical architectural canvases, and empty test harness states:
- Linear grid pattern: 24px by 24px grid cells constructed from 1px rules colored with `rgba(15, 23, 42, 0.03)`.
- Never place dense technical body copy directly over contrasting grid patterns; mask grids out behind solid white cards or reading columns.

## Elevation & Depth
Visual hierarchy is achieved through tonal layer separation and structural perimeter rules rather than deep, murky dropshadows.

### Elevation Levels
- **Level 0 (Base Canvas):** Background tone `#FAFAF8`. Flat plane.
- **Level 1 (Card & Module Tier):** Background `#FFFFFF` accompanied by a continuous `1px solid #E2E8F0` border and a restrained micro-shadow: `0 1px 2px -1px rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02)`.
- **Level 2 (Interactive Flyouts & Menus):** Background `#FFFFFF`, `1px solid #E2E8F0`, and shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Command Palette & Modal Overlays):** Background `#FFFFFF`, `1px solid #CBD5E1`, and ambient drop: `0 20px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.03)`. Backdrop is dimmed with `#0F172A` at `25%` opacity with a subtle `backdrop-filter: blur(2px)`.

### Border Integrity
Every container transition is anchored by 1px rules. Surfaces never float ambiguously in space; every panel boundary is explicitly demarcated.

## Shapes
The shape language conveys precision, mathematical order, and stability. Sharp edges are tempered with a conservative corner radius (`4px` for small components, `6px` to `8px` for large system modules).

### Radius Allocation
- **Cards, Panels, Code Containers:** `rounded-lg` (8px / `0.5rem`). Keeps containers structured and orderly without feeling bulbous.
- **Buttons, Form Inputs, Dropdown Triggers:** `rounded-md` (4px / `0.25rem`). Gives controls a dependable, instrument-like feel.
- **Status Badges, Metric Indicators, and Topic Pills:** Fully rounded capsule/pill shape (`rounded-full` / `9999px`). Provides clear semantic contrast against rectangular code panes and data tables.

## Components

### Buttons
- **Primary Button:** Solid `#1D4ED8` background, `#FFFFFF` text, `4px` radius, font `Geist` 14px weight 500. Height `36px` (compact) or `40px` (default). Inset micro-highlight on top border (`1px solid rgba(255,255,255,0.15)`). Hover: `#1E40AF`.
- **Secondary Button:** White surface, `1px solid #E2E8F0`, text `#0F172A`. Hover: `#F8FAFC` background with border `#CBD5E1`.
- **Tertiary / Ghost Button:** Transparent background, text `#64748B`. Hover: `#F1F5F9`, text `#0F172A`.

### Pill Tags & Badges
- **Specification:** Height `22px`, horizontal padding `8px`, font `JetBrains Mono` 11px weight 500, border radius `9999px`.
- **Neutral Tag (Complexity, Memory, Runtime):** Background `#F1F5F9`, border `1px solid #E2E8F0`, text `#475569`.
- **Active / Accent Tag:** Background `#EFF6FF`, border `1px solid #BFDBFE`, text `#1D4ED8`.
- **Success Tag (Passing tests):** Background `#ECFDF5`, border `1px solid #A7F3D0`, text `#065F46`.

### Form Inputs & Editor Triggers
- Height `38px`, background `#FFFFFF`, border `1px solid #E2E8F0`, radius `4px`.
- Padding: `0 12px`.
- Focus state: Border transitions to `#1D4ED8` with a distinct `0 0 0 1px #1D4ED8` ring (no fuzzy multi-pixel halos).
- Placeholder text in `#94A3B8`.

### Code Blocks & Technical Cards
- **Card Container:** `#FFFFFF` background, `1px solid #E2E8F0`, `8px` corner radius.
- **Card Header:** Height `44px`, background `#FAFAF8`, bottom border `1px solid #E2E8F0`, padding `0 16px`, flexbox alignment for action pills and terminal controls.
- **Code Surface:** `#0F172A` for dark syntax shells or `#FFFFFF` for daylight document flows, always framed with a `1px` inner structural border and persistent line numbers rendered in `JetBrains Mono` with `#94A3B8`.

### Lists & Curriculum Navigation
- Multi-tier tree lists styled with delicate `1px` guide lines linking parent modules to child engineering challenges.
- Active items marked by a vertical `2px` border in cobalt `#1D4ED8` along the left boundary and a subtle background tint (`#EFF6FF` at 50% opacity).

### Checkboxes & Radio Elements
- `16px` dimension, radius `3px` for checkboxes, `9999px` for radios.
- Unchecked: `1px solid #CBD5E1`, background `#FFFFFF`.
- Checked: Background `#1D4ED8`, border `#1D4ED8`, displaying crisp white interior geometry.