# StudyHub Design System: "Paper & Ink"

> Replaces the old "Technical Editorial" spec (off-white + Tailwind blue + Newsreader serif) and
> `docs/STUDYHUB_UI_SYSTEM_V2.md`. Both are superseded.
>
> **Source of truth:** this system is the same one that ships on
> [vamsee.tech](https://www.vamsee.tech/) (repo `Vamsee295/Portfolio`) and
> [Mimo](https://mimo-music.vercel.app/) (repo `Vamsee295/mimo-music`). StudyHub is the third
> product in that family. All three run Next 16 + React 19 + Tailwind 4, so tokens, CSS
> primitives and components port over as-is. **Port the code; don't redraw it.**
>
> - **Landing / marketing pages** follow the **Portfolio** (sticker hero, ticker, night section).
> - **The signed-in app** follows **Mimo** (sidebar + phone tab bar, page header, numbered
>   sections, shelves, in-app dialogs, page transitions, dark theme).

---

## 1. Character

A printed study notebook on a desk: warm paper, ink outlines, a rust highlighter, handwritten notes
in the margin. It should feel **made by a person who uses it**, not generated.

**Anti-slop rules (the reasons the current UI reads as AI-made):**

| Never | Instead |
|---|---|
| Centered serif hero + blue pill CTA | Left-aligned Anton headline, one word in a rust block, sticker buttons |
| Invented stats ("1.2M guides", "94.2% ready") | Real counts from `lib/data` (courses, topics, problems) or nothing at all |
| A uniform 3-column grid of identical cards | Mixed rhythm: numbered sections, horizontal shelves, a dense list, one feature card |
| `slate-*` / `blue-*` / `gray-*` classes | Tokens only (`bg-paper`, `text-ink`, `border-line`, `text-accent-ink`) |
| Soft blurred shadows, glass, gradient blobs | 2.4px ink outline + hard offset shadow, or a hairline. Nothing in between |
| Every block fading up the same way | Motion only where it means something (see §7) |
| `window.confirm` / `window.prompt` | The in-app `askConfirm` / `askText` dialog |
| A thick coloured bar down one side of a card or callout | A tinted fill with a full hairline border in the same tone (a timeline rail through numbered stops is fine) |

---

## 2. Color tokens

Defined once in `app/globals.css` on `:root` / `.theme-paper` and `.theme-dark`, then exposed to
Tailwind through `@theme inline`. Values are taken verbatim from Mimo, so the products match.

| Token | Paper (default) | Dark | Use |
|---|---|---|---|
| `--paper` | `#F5EFE6` | `#121110` | page background (with dot grid) |
| `--paper-2` | `#ECE3D4` | `#1A1816` | sunken areas, table header, code gutter |
| `--card` | `#FBF8F2` | `#1C1A18` | cards, inputs, dialogs |
| `--card-2` | `#EFE7DA` | `#26231F` | hover/selected rows, chips |
| `--ink` | `#191614` | `#F5EFE6` | text, outlines |
| `--body` | `ink / 78%` | `ink / 78%` | paragraph text |
| `--mute` | `ink / 56%` | `ink / 60%` | meta, captions |
| `--line` | `#191614` | `rgb(245 239 230 / .22)` | outline of `.brut` surfaces |
| `--hair` | `ink / 14%` | `ink / 14%` | hairline dividers, table rows |
| `--hard` | `#191614` | `#000` | offset-shadow colour |
| `--dots` | `ink / 9%` | `ink / 5%` | dot-grid texture |
| `--accent` | `#C8603A` | `#C8603A` | rust: fills, large text, highlight blocks, focus ring |
| `--accent-ink` | `#A34A28` | `#E07A52` | **rust text under 18px** (eyebrows, links, active labels) |
| `--note` | `#2F6F6A` | `#7FC4BC` | teal: handwritten notes, **success / solved / completed** |
| `--gold` | `#E3A72F` | `#E3A72F` | streaks, "in progress", warnings (fills only) |
| `--danger` | `#B3261E` | `#F2B8B5` | errors, destructive actions |
| `--night` | `#151311` | `#0B0A09` | the one dark "island" section on the landing page |

**Contrast (measured, WCAG 2.x):** ink on paper 15.8:1 · `--accent-ink` on paper 5.2:1 ✅ ·
teal on paper 5.1:1 ✅ · rust `#C8603A` on paper **3.5:1, which fails AA for small text**. Both
reference sites use plain rust for 12px eyebrows; StudyHub fixes this with `--accent-ink`.

**Rules**
- One accent per screen region. Rust marks *the one thing to look at*; teal marks *done*; gold marks *in progress*.
- Rust-filled buttons only at ≥ 18px bold label (large-text AA). Smaller primary buttons are **ink fill, paper text**.
- Difficulty: Easy = teal, Medium = gold, Hard = rust, shown as a chip with an outline, never as coloured text alone.
- Accent stays rust (product family). Changing it later means editing two variables.

---

## 3. Typography

Five roles, loaded with `next/font/google` (replaces the current `<link>` to Google Fonts CSS).

| Role | Font | Class | Use |
|---|---|---|---|
| Display | **Anton** 400 | `.display` | page titles, section titles, big numbers. Uppercase, `-0.02em`, line-height .95. **Never under 28px, never in dense UI** |
| Label | **Barlow Condensed** 600/700 | `.label-cond` | buttons, nav items, tabs, chips. Uppercase, `.04em` |
| Body | **Inter** | default | everything you read |
| Mono | **JetBrains Mono** | `.eyebrow`, `font-mono` | section index (`01 / CORE TOPICS`), code, timers, meta |
| Hand | **Caveat** | `.note` | margin notes in teal. **At most one per screen** |

**Scale:** page title 44 → 72px (`md`) · hero 54/72/92px · section title 28 → 34px · body 15–17px ·
lesson body **17px / 1.75, max 68ch** · meta 12–13px · inputs 16px on phones (stops iOS zoom).
Anton ships one weight: never apply `font-bold` to it.

---

## 4. Surfaces & shape

| Primitive | Spec | Where |
|---|---|---|
| `.brut` | `2.4px solid var(--line)`, `box-shadow: 4px 5px 0 var(--hard)` | any card you can click, dialogs, primary panels |
| `.brut-hover` | hover `translate(-2px,-2px)` + shadow `6px 7px`; active `translate(3px,4px)` + shadow `1px 1px` | clickable `.brut` |
| `.stk` (large) | `2.5px` border, radius 16, shadow `5px 6px 0` | landing feature cards |
| hairline | `1px solid var(--hair)` | **dense UI**: tables, problem lists, settings rows, lesson TOC |
| `.hl` | rust block behind one word, radius 8, `rotate(-1.5deg)` | one word per title, max |

**Density rule:** hard shadows are for *objects* (a course, a tool, a template). Lists of 10+ rows,
editors and tables use hairlines and `--card-2` hover, the way Mimo's track rows do. Never nest a
`.brut` inside a `.brut`.

**Radius:** 12 (buttons, inputs, chips: pill only for chips), 16 (cards), 20 (dialogs, hero tiles).
**Background:** paper + `radial-gradient(var(--dots) 1.1px, transparent 1.5px)` at 22px on `body`.
The old `.grid-texture` / `.elevate-*` classes are deleted.

---

## 5. Layout

**App shell (from Mimo `components/Nav.tsx` + `app/layout.tsx`):**
- **Desktop (≥ 768px):** left sidebar, 240px, resizable 200–380, collapses to a 72px rail (`Ctrl/⌘ + B`).
  Active item = `bg-ink text-paper`; icons rust when inactive. Account + settings pinned to the bottom.
- **Phone (< 768px):** bottom tab bar with 5 tabs and safe-area padding; the account button sits on the page-title row.
- Content: `px-4 md:px-8`, `pt-[max(1.25rem,env(safe-area-inset-top))] md:pt-8`, max width 1200px for reading pages.

**Sidebar groups:**
```
TODAY      Dashboard · Daily · Study With Me
LEARN      Learn · Roadmaps · Knowledge map · Saved
PRACTICE   Practice · Problems · SQL · Code
CAREER     Companies · Resources · Templates · Tools · Labs
           ─────────
           Ideas · Help · Settings · Account
```
**Phone tabs:** Home (dashboard) · Learn · Practice · Tools · Me.

**Page anatomy (Mimo `components/ui.tsx`):**
- `PageHeader`: mono eyebrow → Anton title with an optional `hl` word → optional Caveat note → actions on the right.
- `Section`: auto-numbered `01 / KICKER` (CSS counter) + Anton title + optional "see all →" + note.
- `Shelf`: horizontal snap-scroll row that bleeds to the screen edge, with padding for shadows.

**Landing (from Portfolio):** sticky paper navbar with sticker tag · two-column hero · ink ticker
strip (slightly rotated) · numbered feature sections · one `--night` section · final CTA with
a spinning round sticker.

---

## 6. Components (target inventory, `components/ui/`)

| Component | Ported from | Notes |
|---|---|---|
| `Button` | Mimo `btnPrimary/btnSecondary` + Portfolio `.btn-stk` | variants `primary` (ink), `accent` (rust, large only), `secondary` (card + outline), `ghost`, `danger`; all `label-cond`; press = translate + shadow shrink |
| `Card` | `.brut` | `as="a"` for links; `interactive` adds `.brut-hover` + slight `-rotate-1` on hover (Mimo AlbumCard) |
| `Chip` | Mimo library filter pills | outline pill, active = ink fill; also difficulty / status chips |
| `Input`, `Select`, `Textarea` | Mimo Ask input | `border-2 border-line bg-paper rounded-xl focus:border-accent`, 16px on phones |
| `PageHeader`, `Section`, `Shelf` | Mimo `ui.tsx` | as described above |
| `Sidebar`, `TabBar`, `Boot` | Mimo `Nav.tsx` | drop the player/YouTube bits; keep resize, collapse, theme boot |
| `AskDialog` + `askConfirm` / `askText` | Mimo `Ask.tsx` | native `<dialog>`; swap zustand for `useSyncExternalStore` (no new deps) |
| `PageTransition` | Mimo | React `<ViewTransition>`, shared-axis X, off on first mount |
| `Toast` | Mimo `Swipe.tsx` Toaster | replaces ad-hoc banners |
| `Reveal`, `Marked`, `CountUp` | Portfolio `common/motion.tsx` | framer-motion is already installed |
| `Ticker` | Portfolio `.marquee-track` | landing only; pauses on hover |
| `ProgressBar` | Mimo `.range` look | 4px track, rust fill, teal when complete |
| `Stat` | new | Anton number + mono label, real data only |
| `EmptyState` | new | Caveat note + one action, no illustration |
| `Table` / `Row` | Mimo `TrackRow` | hairline rows, index column in mono, `⋯` menu |
| `Kbd`, `CodeBlock` | new | inline code mono on `--paper-2`; code blocks and every editor are a fixed dark "island" in both themes: one Monaco theme, `studyhub-ink` (`lib/monacoTheme.ts`: night bg, rust keywords, teal strings, gold numbers); the playground IDE stylesheet uses the same night palette |

Icons stay **lucide-react** (installed), 18px in nav, 16px in buttons, stroke 2.

---

## 7. Motion

| Pattern | Spec | Where |
|---|---|---|
| Press | `scale .96`, 140ms `cubic-bezier(.2,0,0,1)` on every `button/a` | global (Mimo `@layer base`) |
| Sticker press | translate(3px,4px) + shadow to 1px, 50ms down / 150ms up | `.brut-hover`, buttons |
| Page change | old: fade + `-40px`, 160ms; new: from `+56px`, 340ms `cubic-bezier(.05,.7,.1,1)` | `PageTransition` |
| Menus / sheets | `pop-in` 220ms from the tap origin; bottom sheet on phones | dropdowns, dialogs |
| Highlight sweep | `Marked` scales in from the left, 550ms, once | landing headlines only |
| Count-up | 1.4s ease-out cubic, once in view | landing stats, dashboard streak |
| Reveal | `y: 28 → 0`, 700ms, once | **landing only**. App pages appear instantly |

- No launch splash in StudyHub. Students open it many times a day (the portfolio's ~3–5s blank paper before its loader is the thing to avoid).
- `prefers-reduced-motion` and a Settings → "Reduce motion" toggle both turn off everything except opacity.
- Animate `transform` / `opacity` only.

---

## 8. Theming

- Classes: `.theme-paper` (default) and `.theme-dark` on `<html>`, plus `html[data-theme]`.
- A pre-paint inline script in `layout.tsx` (Mimo `THEME_SCRIPT`, static string) applies the saved theme before first paint, so the page never flashes. Choices: Paper / Dark / System.
- Dark mode is a recolour through tokens only. A component that needs a `dark:` class is a component using raw colours.
- `meta[name=theme-color]` follows the theme (`#F5EFE6` / `#121110`).

---

## 9. Accessibility & phone comfort

- Focus: `2px solid var(--accent)`, offset 3px, `:focus-visible` only.
- Icon buttons get a 44px hit area via `.tap::after` (Mimo).
- No information by colour alone (difficulty and status chips carry text).
- Small rust text always uses `--accent-ink`.
- Inputs 16px on phones; `-webkit-tap-highlight-color: transparent`; safe-area insets on the tab bar.
- Every page is checked at 375 / 768 / 1440 with no horizontal scroll, in both themes.
