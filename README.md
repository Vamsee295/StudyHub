# Pathward — Placement Preparation Platform

A structured placement-preparation and technical-learning platform for engineering
students: **Learn → Practice → Prepare → Build → Apply → Interview**.

This is **Stage 1** of the build plan: the landing page, fully componentized and
ready to grow into routed pages (`/learn`, `/roadmaps`, `/companies`, etc.) in
later stages.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-based theme, see `app/globals.css`)
- **Framer Motion** for scroll reveals, parallax and staged animations
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```

## Design system

The visual language ("Technical Editorial") is documented in full in
[`DESIGN.md`](./DESIGN.md) at the project root — colors, typography scale,
spacing, elevation levels and component specs. The tokens are implemented as
CSS custom properties in `app/globals.css` and consumed via small utility
classes (`.elevate-1`, `.pill`, `.btn-primary`, `.tag-mono`, etc.) rather than
being duplicated into Tailwind config, so the source of truth stays in one file.

Fonts (Newsreader for display/headings, Geist for UI text, JetBrains Mono for
labels/code) are loaded via a `<link>` tag in `app/layout.tsx` rather than
`next/font/google`, since this sandbox couldn't reach `fonts.googleapis.com`
to verify a build-time font fetch. If you'd rather use `next/font/google`
(recommended for production — self-hosted, no runtime request), swap it in;
it's a five-line change and the font-family names are already correct.

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata
  page.tsx           Landing page — assembles all sections
  globals.css        Design tokens + utility classes

components/
  layout/            Navbar, Footer, ScrollProgress
  landing/           One component per landing-page section
  ui/                Reveal/RevealGroup/RevealItem (scroll animation
                      primitives), SectionHeader

lib/data/            Typed content for every section — swap for a real
                      API/database later without touching components
types/                Shared TypeScript interfaces
```

## Sections (all preserved from the original prototype)

1. Hero — scroll-linked parallax, live client-side search over resources/companies
2. Topic strip
3. Learning Paths
4. Placement Roadmap — horizontal stepper + 3-column detail panel (topics /
   resources / practice)
5. Resource Library — filterable card grid
6. Company Preparation — filterable card grid with sample-dated content
7. Practice — featured problem panel + category progress grid
8. Interactive Labs
9. Concept Decoder — tabbed, staged reveal
10. Template Library
11. Knowledge Map — SVG graph, progressive construction on scroll, hover
    tooltips (`components/landing/KnowledgeMap.tsx`)
12. AI Placement Copilot — local mock logic, no API key required
13. Dashboard — count-up score, animated bars, sequential checklist
14. Final CTA + Footer

## Content

Section copy is **original writing**, structured with the same depth and
information-architecture patterns as the reference brief (12-phase roadmap
with per-stage "frequently tested by" companies, 8 companies with real
round-by-round breakdowns, 4 fully worked CS concepts, a worked 3-Sum
problem with Java solution, 3 AI-copilot role tracks) — not copied verbatim
from any source, per the "final result should be an ORIGINAL platform"
instruction.

## Notes for the next stages

- All content lives in `lib/data/*.ts` as typed arrays/objects — this is the
  seam where a real database (Postgres via an ORM, or a CMS) plugs in without
  touching any component.
- `components/landing/*` are the section components; `components/ui/Reveal.tsx`
  is the reusable animation layer other pages can reuse.
- Company data is explicitly marked as sample/demo with a `verified` date
  field, per the "do not invent current company requirements" instruction —
  wire this to a real, periodically-reviewed source before launch.
- Respects `prefers-reduced-motion` throughout (`useReducedMotion` from
  Framer Motion gates every animated component).
