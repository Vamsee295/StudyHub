# StudyHub UI System V2 — Specification & Architecture Guide

## 1. Vision & Identity
StudyHub is an **Operating System for Placement Preparation**:
- **Personality**: Technical + Editorial + Calm + Precise + Human.
- **Inspiration**: Technical documentation + Developer tooling + Modern editorial design + Career workspace.
- **Anti-patterns eliminated**: "Vibe-coded" repetitive SaaS cards, blue glowing blobs, glassmorphism, universal `rounded-2xl`, decorative grid backgrounds, and marketing feature overload.

---

## 2. Implemented Design Tokens (Phase 1)

### Color Palette (`globals.css`)
```css
:root {
  /* Canvas & Surfaces */
  --canvas: #f7f7f5;
  --surface: #ffffff;
  --surface-elevated: #fcfcfb;
  --surface-subdued: #f0f0ec;

  /* Text & Ink */
  --ink: #18181a;
  --ink-secondary: #5f6368;
  --ink-tertiary: #8b8e93;
  --ink-muted: #8b8e93;

  /* Borders */
  --border: #e5e5e2;
  --border-strong: #d5d5d1;

  /* Primary Brand Blue (Semantic Only: Action / Selected / Active / Progress / Link) */
  --accent: #2457e6;
  --accent-hover: #1d46c0;
  --accent-soft: #eef3ff;
  --accent-soft-border: #d0deff;

  /* Semantic Status */
  --success: #16845b;
  --success-soft: #eaf7f1;
  --success-soft-border: #b7e4cf;

  --warning: #a66a00;
  --warning-soft: #fff5dd;
  --warning-soft-border: #fce1a1;

  --error: #c43d3d;
  --error-soft: #fdecec;
  --error-soft-border: #f9c0c0;

  --info: #2457e6;
  --info-soft: #eef3ff;
  --info-soft-border: #d0deff;
}
```

### Subject Accents (Micro-Indicators Only)
- Java: `#B45309`
- Python: `#2563EB`
- SQL: `#0F766E`
- DSA: `#7C3AED`
- DBMS: `#0369A1`
- Operating Systems: `#475569`
- Networks: `#0891B2`
- Aptitude: `#CA8A04`
- AI/ML: `#7C3AED`
- Cloud: `#0F766E`

### Radius Scale (Implemented)
- `4px` (`--radius-xs`): Code / editor surfaces, badges
- `6px` (`--radius-sm`): Buttons, inputs, compact controls
- `8px` (`--radius-md`): Standard content surfaces
- `10px` (`--radius-lg`): Dialogs, overlays
- `12px` (`--radius-xl`): Large containers
- `16px` (`--radius-2xl`): Rare promotional surfaces only
- *Note: Universal rounded-2xl has been strictly removed.*

### Spacing Scale (Implemented)
`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`, `80px`, `96px`

### Typography & Fonts (Implemented)
- Primary Font: **Geist Sans** (`"Geist", sans-serif`) loaded from Google Fonts in `app/layout.tsx`.
- Technical Font: **Geist Mono** (`"Geist Mono", monospace`) loaded from Google Fonts in `app/layout.tsx`.
- Strict Type Scale:
  - Display: `56px / 60px / 600` (`.type-display`)
  - Hero: `48px / 52px / 600` (`.type-hero`)
  - Page title: `36px / 40px / 600` (`.type-page-title`)
  - Section: `24px / 29px / 600` (`.type-section`)
  - Subsection: `18px / 25px / 600` (`.type-subsection`)
  - Body large: `16px / 26px / 400` (`.type-body-large`)
  - Body: `14px / 22px / 400` (`.type-body`)
  - UI label: `13px / 18px / 500` (`.type-ui-label`)
  - Metadata: `12px / 17px / 500` (`.type-metadata`)
  - Caption: `11px / 15px / 500` (`.type-caption`)
  - Code: `13px / 21px / 400` (`.type-code`)

---

## 3. UI Primitives Implemented (Phase 1)
1. **Button (`components/ui/Button.tsx`)**:
   - Variants: `primary`, `secondary`, `ghost`, `danger`.
   - Heights: `36px` (standard), `40px` (`lg` / CTA), `32px` (`sm`).
   - Radius: `6px` (`var(--radius-sm)`).
   - Font: `13px / 500`.
   - Accessible keyboard focus: `focus-visible:outline-2 focus-visible:outline-[var(--accent)]`.
2. **Input (`components/ui/Input.tsx`)**:
   - Heights: `40px` (standard), `36px` (`sm`).
   - Radius: `6px` (`var(--radius-sm)`).
   - Border: `#E5E5E2`, Focus: `#2457E6` (no glowing halo).
3. **Badge (`components/ui/Badge.tsx`)**:
   - Semantic only: status, difficulty, category, metadata.
   - Height: `22px`, Radius: `4px` (`var(--radius-xs)`), Font: `11px / 500`.

---

## 4. Removed Decorative Template Signals
- **Grid Textures (`.grid-texture`)**: Neutralized (background: transparent).
- **Fade Masks (`.grid-fade-mask`)**: Removed.
- **Glowing Blobs (`blur-3xl`, `blur-[100px]`, `auth-ambient-glow`)**: Removed from `BrandPanel.tsx`, `learn/page.tsx`, `RecommendedCompanies.tsx`, and `globals.css`.
- **Card Shadows**: Replaced with flat borders and minimal elevation (`0 1px 3px rgba(0,0,0,0.05)`).
