# StudyHub logo: brief and prompt

The shipped mark is `frontend/public/logo-mark.svg` (also inlined in `components/ui/StudyHubLogo.tsx`): a cream study card with a thick ink border and a hard offset shadow, a rust bookmark ribbon, and text lines where the bottom line is a half-filled rust reading bar, the product's core idea (reading progress). Use the prompt below to explore alternatives with Gemini or ChatGPT; keep whatever you pick as a flat SVG so it stays sharp at 16px.

## Prompt (copy as is)

> Design a logo mark (icon only, no text) for **StudyHub**, a web app where engineering students in India prepare for campus placements: courses, lessons with a reading-progress bar, practice problems, mock tests and company interview prep.
>
> **Visual system ("Paper & Ink", neo-brutalist editorial):**
> - Colours, flat only: paper cream `#F5EFE6`, card cream `#FBF8F2`, ink `#191614`, rust accent `#C8603A`. Optional teal `#2F6F6A` used sparingly. No gradients, no glow, no 3D, no photographic texture.
> - Shapes: rounded squares (corner radius about 20% of the side), thick ink outlines (about 6% of the icon width), and a **hard offset drop shadow** in solid ink, shifted down-right, no blur, like a sticker on paper.
> - Mood: confident, handmade, editorial. Think of a well-designed notebook sticker, not a tech startup logo. Avoid graduation caps, light bulbs, brains, rockets, owls and generic book-stack clip art.
> - Typography in the product (do not put text in the mark, but match its feel): Anton for headlines, Barlow Condensed for labels, Inter for body, JetBrains Mono for small caps labels.
>
> **Concept:** one idea about *progress through study*. For example a card or page with a bookmark and a partly filled progress bar, or a stacked deck of three cards with the top one in rust. It must read at **16×16 px** (favicon) and at 512 px. Keep it to 3–5 simple shapes.
>
> **Deliver:** a square icon on a transparent background, plus a version on the cream background. Also show the mark next to the wordmark "STUDY**HUB**" set in Anton, with "HUB" knocked out of a slightly rotated (−1.5°) rust block.
>
> **Output format:** flat vector style suitable for conversion to SVG; centred with even padding; no mockups or extra scenes.

## UI stack (for context, if the tool asks)

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4 with design tokens in `app/globals.css`, fonts via `next/font` (Anton, Barlow Condensed, Inter, JetBrains Mono, Caveat), lucide-react icons. The design rules live in `DESIGN.md` (Paper & Ink).

## Swapping in a new mark

1. Save the SVG as `frontend/public/logo-mark.svg` and paste its shapes into `StudyHubLogoIcon` in `frontend/components/ui/StudyHubLogo.tsx` (viewBox `0 0 64 64`).
2. Regenerate `frontend/app/favicon.ico`, `frontend/public/favicon.ico`, `favicon.png` (192 px) and `apple-icon.png` (180 px on the cream background) from it.
