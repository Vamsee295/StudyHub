# StudyHub UI Rebuild: Audit + Page-by-Page Plan

Date: 2026-11-24 · Design spec: [`/DESIGN.md`](../DESIGN.md) · References audited live and in source:
vamsee.tech (`Vamsee295/Portfolio`) and mimo-music.vercel.app (`Vamsee295/mimo-music`).

---

## Part 1: Audit

### 1.1 The references

Both sites already run **one shared design system** ("Paper & Ink": cream paper, ink outlines,
hard offset shadows, rust accent, Anton / Barlow Condensed / Inter / JetBrains Mono / Caveat).
Both sit on our exact stack (Next 16, React 19, Tailwind 4, lucide, framer-motion on the portfolio), so
their CSS and components can be copied in directly.

| | Portfolio (vamsee.tech) | Mimo (music app) |
|---|---|---|
| Role for StudyHub | **Landing + auth** look | **Signed-in app** shell and patterns |
| What works | Hero: Caveat aside → `I BUILD / [INTELLIGENT] / SOFTWARE.` with a rust word block; typing prompt bar; tilted "project deck" card stack; ink skills ticker; numbered `01` project cards with framed previews; sticker buttons; round "let's talk" sticker FAB | Resizable sidebar → rail; phone tab bar; `PageHeader` (eyebrow, Anton title, `hl` word, note); auto-numbered `Section`s; edge-bleeding `Shelf`s; hairline track rows for dense lists; in-app `<dialog>` instead of `confirm()`; View Transition page slides; pre-paint theme script + full dark theme; press feedback on every tap; 44px hit areas; 16px phone inputs |
| Problems we won't copy | **~3–5s of blank paper** before the intro loader appears on first load (seen live at 1440 and 375); rust used for 12px text (3.5:1, fails AA) | 2.65s forced splash on every launch (fine for music, wrong for a study tool opened daily); rust small text, same AA issue |
| Code to lift | `globals.css` (`.stk`, `.btn-stk`, marquee, dot grid, selection, focus), `common/motion.tsx` (`Reveal`, `Marked`, `CountUp`), `hero/Hero.tsx`, `hero/ProjectDeck.tsx`, `tech-strip/TechStrip.tsx`, `footer/FinalCTA.tsx`, `common/SpinSticker.tsx` | `globals.css` (tokens, both themes, `.brut*`, `.display`, `.label-cond`, `.hl`, `.note`, `.eyebrow`, `.sec-n`, `pop-in`, press layer, `.tap`, view-transition CSS), `components/Nav.tsx` (`Boot`, `Sidebar`, `TabBar`), `components/ui.tsx` (`PageHeader`, `Section`, `Shelf`), `Ask.tsx`, `PageTransition.tsx`, `Swipe.tsx` toaster, `layout.tsx` font + theme-script setup |

### 1.2 StudyHub today

Checked live on `localhost:3000` (landing, login) and in source (all 60 routes; the app routes need sign-in).

| Finding | Evidence | Impact |
|---|---|---|
| Generic AI-SaaS landing | Centered Newsreader serif headline, blue `Get Started` pill, search bar + suggestion chips, four stat boxes, uniform 3-column "Choose your engineering path" cards | It reads as a template |
| **Invented numbers** | `components/landing/Hero.tsx:20-23`: "1.2M+ interview guides", "150+ company blueprints", "94.2% students report feeling ready" | Credibility risk, and an obvious tell |
| Tokens exist but are bypassed | ~1,100 raw palette classes (`border-slate-200` ×121, `text-slate-900` ×99, `text-blue-600` ×57, `gray-*` mixed in) | Can't theme; no dark mode; looks inconsistent |
| Primitives barely used | `components/ui/Button/Badge/Input/SectionHeader` imported in only 11 files; every page hand-rolls its own | Rebuilding the primitives alone won't restyle pages |
| Top nav overloaded | `AppLayout` top bar holds 10 links (Dashboard … Study With Me) | Wraps or hides on laptops; no hierarchy |
| Fonts via render-blocking CSS `<link>` | `app/layout.tsx` | Slower first paint; swap to `next/font` |
| Dark mode "Coming Soon" | `components/settings/SettingsModal.tsx:308` | Comes free with the token system |
| **Good news: one chokepoint** | All 16 app sections' `layout.tsx` wrap `AppLayout` | Swap the shell once and all 60 routes get the new chrome on day one |
| **Good news: pages are thin on raw colour** | Most raw classes live in `components/*`, not `app/*` pages | Restyling happens per component folder, which matches the plan below |

### 1.3 Strategy

1. **Remap, then rebuild.** First replace `globals.css` with the Paper & Ink tokens, and remap the old
   token names (`--canvas`, `--surface`, `--ink-secondary`, `--accent`…) to the new ones, as the portfolio
   did. Every page that already uses tokens shifts immediately, so nothing is ever half old, half new.
2. **Swap the shell** (`AppLayout` → Mimo sidebar/tab bar). Every route gets the new chrome.
3. **Rebuild page by page** (below), deleting raw `slate/blue/gray` classes as each folder is touched.
4. **No new dependencies.** Fonts through `next/font`; zustand in Mimo's `Ask` becomes `useSyncExternalStore`.
5. **Logic, data, API calls and routes stay untouched.** This is a presentation-layer rebuild.

---

## Part 2: Plan

### Status
- **2026-11-24: Phases 0 + 1 done.** Accent stays rust.
  - `globals.css`: Paper & Ink tokens, both themes, Mimo/Portfolio primitives, old token names remapped.
  - **Palette remap:** `@theme` points Tailwind's `slate/gray/zinc/blue/indigo/sky/violet/purple/emerald/green/teal/cyan/amber/yellow/orange/red/rose` scales and `white` at the tokens. All ~1,900 raw colour classes render Paper & Ink and follow dark mode without page edits. 101 arbitrary hex classes (`bg-[#f8fafc]`…) were rewritten to tokens; the code-editor darks were left alone. **A page rebuild replaces raw palette classes with tokens; the remap block is deleted in Phase 7.**
  - `layout.tsx`: `next/font` (5 families) + pre-paint theme script (`lib/theme-script.ts`); `lib/theme.ts` = Paper / Dark / System + Reduce motion, per device.
  - `components/ui`: `Button` (+ `buttonClass`), `Input`, `Badge` restyled; `Page.tsx` adds `PageHeader`, `Section`, `Shelf`, `Card`. Still to build, with the first page that needs each: `AskDialog`, `Toast`, `ProgressBar`, `Stat`, `EmptyState`, `Row`, `Kbd`, `CodeBlock`, motion helpers.
  - `AppLayout`: grouped sidebar (⌘B rail, remembered), phone top bar + 5-tab bar, page slides via `<ViewTransition>`, no spinner flash between sections; dropdowns take a `placement` prop.
  - Settings → Appearance now works (theme + reduce motion). The no-op "Interface Density" / "Code Font" controls were removed, and the dead `components/settings/SettingsModal.tsx` was deleted.
  - Not done yet: Monaco `paper`/`ink` themes (Phase 4).
- **2026-11-24: Phase 3 (daily loop) done.** Dashboard, Learn, subject, lesson, daily, saved, review, revise, mock test, reading order and concept map are rebuilt on tokens + `components/ui` (no raw palette classes left in them). Checked in Paper and Dark, at 1440 and 375.
  - New shared pieces: `Progress` (in `Page.tsx`), `AskDialog` / `askConfirm` (mounted in `AppLayout`), `components/learn/optionClass.ts` (one answer-option style for daily, review, test and quick checks), `prose` + `LessonHeading` exported from `TheoryNotes.tsx` (17px / 1.75 reading type, fixed-dark code blocks).
  - Removed fakes: the dashboard's hard-coded "Recommended Resources" (all linked to `#`), the "Good morning" at every hour, the backend's always-1 streak (the dashboard now shows the real daily-question streak); Learn's "Learning Paths" (subject slugs that match no course); the concept map's 13-colour rainbow (ink nodes, the focused course in rust, progress in teal).
  - Bugs fixed on the way: (1) the global `* { border-color }` rule was unlayered, so it beat every `border-*` utility site-wide; it's now in `@layer base`. (2) `/learn/<subject>/{test,review,revise,reading-order}` matched the lesson "workspace" rule and were clipped to one screen; they scroll now. (3) MDX lessons (`public/content/learn/**/index.mdx`, one so far: programming-fundamentals/variables) always rendered blank; their markdown now renders through `TheoryNotes`. (4) The mock test used `window.confirm`; it uses `askConfirm` now.
  - Follow-up from the design hook: one-sided accent bars on callouts (lesson traps, warnings, revision traps, `prose.callout`, the search dialog's active row) became tinted fills with full hairline borders; DESIGN.md's anti-slop table now bans them. That check also found the legacy `--radius-*` variables overriding Tailwind's own radius tokens (`rounded-xl` measured 20px, larger than `rounded-2xl`); the scale is ascending again (6/8/10/12/16px).
  - Known, not changed (Phase 3): the lesson service fetches `index.mdx` for every lesson and most return 404 in the console (it then falls back to the TS content correctly).

Each page is **done** when it: uses no `slate|gray|blue|indigo` classes · uses only `components/ui`
primitives + tokens · looks right in Paper **and** Dark · has no horizontal scroll at 375px · has been
screenshot-checked at 375 / 1440 · passes `tsc` and `next build`.

- **2026-11-24: Phase 2 (landing, auth, onboarding) done.**
  - Landing (`app/page.tsx` + `components/landing/Landing.tsx`, `motion.tsx`): company-picker hero with a tilted card deck, subject ticker, a counts row, "how it works" (tracks / 12-stage explorer / practice), the one night section (tools), FAQ, closing CTA with a spin sticker. It reuses the content of the earlier unfinished `Landing.tsx` (real company rounds, roadmap and tracks) instead of the 14-section page.
  - **Every number is real**, counted on the server at build time from the content: 13 courses, 402 lessons, 1,576 quiz questions, 12 coding problems, 5 labs, 8 company playbooks. Removed: "1.2M+ guides", "150+ blueprints", "94.2% feel ready", the fake per-subject practice counts (`practiceCategories`) and the tracks' "120+ resources" claims.
  - Deleted (unused after the swap): 15 old `components/landing/*` sections incl. `Motif`, `layout/Navbar`, `layout/Footer`, `layout/ScrollProgress`, `ui/Reveal`, `ui/SectionHeader`, `theme/Paper.tsx`, `app/paper.css`.
  - Auth: `BrandPanel` now carries the landing's voice (the old one linked to `/#learn`, `/#resources`, `/#labs`, which no longer exist); shared `TextField` / `PasswordField` / Google button / right panel restyled, so login, signup, forgot, reset and verify all match. Removed the sign-up line linking "Terms of Study" and "Honor Code" to `#` (no such pages). Fixed the icon bubbles on forgot/reset/verify, which used class names that aren't Tailwind tokens and rendered empty.
  - Onboarding: new shell (step label, Anton title, 4-part progress rail, sticker card, Back/Next) and step headings. Removed fake-system copy ("First-Time Initialization", "Calibration Cycle v2.4 (Verified)"), dead `#` links, and an unsupported "Data encrypted" claim. Step internals (inputs, track cards) still carry raw palette classes; they render correctly through the remap and are left for Phase 7.
  - `CountUp` now starts at the real number (the server HTML used to say 0 until JavaScript animated it). The hero highlight is static rather than animated, so it can't render blank.
  - Not verified visually: the landing's lower sections in a visible browser. The preview pane ran as a hidden page all session, so scroll-triggered reveals never played there; their structure was checked in the DOM instead.

- **2026-11-24: Phase 4 (practice) done.**
  - Hub: three sticker cards (Problems, SQL lab, Code playground), solved / sprint-streak numbers, timed sprints and recent sessions as hairline lists. `PracticeHeader` folded in.
  - Problems: dense hairline table with status toggles, level badges and chip filters (status, level, company). Removed the false "1,240+ interview questions" (there are 12), "REPOSITORY_INDEX_v4.2" / "TABLE // MASTER_INDEX" / "telemetry" copy, and the Acceptance column (percentages nothing in the app measures).
  - Problem workspace: new top bar, Anton header with badges, goal and hint callouts, sticker Run / Submit, condensed console tabs; old tokens swapped file-wide. Removed three buttons with no handler (Bookmark, Submissions, Discussion), the acceptance figure and the "Practice Sandbox (Streak Safe)" badge.
  - One Monaco theme (`lib/monacoTheme.ts`, `studyhub-ink`) on all four editors (problem workspace, SQL lab, code playground, SQL playground tool). The playground's 2,000-line VS Code stylesheet (`WebIDE.css`) and the SQL lab's inline hexes were remapped from cold grey/blue to the night palette with rust accents (~290 colours).
  - Session (timed sprint) and review: restyled; submit now uses `askConfirm` instead of `window.confirm`.
  - Deleted 8 unused components in `components/practice/` (only `AITutorChat` remains).
  - Bugs fixed: the session page's negative margins assumed the old shell's padding; the code playground and SQL lab subtracted the old 64px top bar from `100vh`, leaving a gap; `--surface-hover` and `--surface-sunken` were undefined, so those hovers and the tutor chat bubbles had no background; auth pages wrapped every field in a `framer-motion` fade-in that left the login form invisible until animation frames ran (the fades are gone; forgot/reset keep the form ↔ success cross-fade but skip it on first render).
  - Left for Phase 7: SQL-lab sub-components and the problem console still use emerald/amber/rose classes (they render through the remap).

### Phase 0: Foundation (no visible page work)
| # | Task | Files |
|---|---|---|
| 0.1 | Tokens + both themes + primitive CSS classes, ported from Mimo/Portfolio `globals.css`; legacy names remapped; delete `.grid-texture`, `.elevate-*` | `app/globals.css` |
| 0.2 | `next/font` (Anton, Barlow Condensed, Inter, JetBrains Mono, Caveat); pre-paint theme script; `theme-color` meta | `app/layout.tsx` |
| 0.3 | Primitives: `Button`, `Card`, `Chip`, `Input/Select/Textarea`, `PageHeader`, `Section`, `Shelf`, `ProgressBar`, `Stat`, `EmptyState`, `Row`, `Kbd`, `CodeBlock` | `components/ui/*` (replace `Badge`, `SectionHeader`, `Reveal`) |
| 0.4 | `AskDialog` (`askConfirm/askText`), `Toast`, `PageTransition`, motion helpers (`Reveal`, `Marked`, `CountUp`) | `components/ui/*` |
| 0.5 | Theme setting: Paper / Dark / System + Reduce motion | `components/settings/SettingsModal.tsx`, profile store |
| 0.6 | Monaco `paper` + `ink` themes | `components/playground/*`, practice editor |

### Phase 1: App shell (all 60 routes change)
| Page / part | Rebuild to |
|---|---|
| `components/layout/AppLayout.tsx` | Mimo `Sidebar` (groups from DESIGN §5, resizable, `⌘B` rail) + phone `TabBar` + `PageTransition` around children |
| `Navbar.tsx` (landing) | Portfolio navbar: wordmark + rotated sticker tag, anchors, sticker "Start free" |
| `ProfileDropdown`, `NotificationDropdown` | Move to the sidebar footer; `pop-in` menus; bottom sheets on phones |
| `SearchLauncher` (⌘K) | `.brut` dialog, mono hints, hairline results |
| `Footer.tsx` | Portfolio footer: ink strip, mono links |
| `StudyHubLogo` | Ink wordmark (Anton) + rust block on "HUB", matching the Mimo/Portfolio marks |

### Phase 2: Landing, auth, onboarding (first impression)
| Route | Rebuild to |
|---|---|
| `/` (`components/landing/*`, 16 files) | **Hero**: Caveat aside "hi — placement season's coming ↓", `CRACK YOUR / [FIRST] / TECH JOB.`, typing prompt bar cycling real topics ("two pointers", "normalization", "page replacement") linking into Learn, a tilted card deck of real courses on the right · **Ticker** of subjects · numbered sections `01 Learn` `02 Practice` `03 Companies` `04 Tools & Labs`, each with a live product preview in a frame (not a stock card grid) · **Night section**: how a day in StudyHub works (Daily → Learn → Practice → Review) · real counts from `lib/data` via `CountUp` · `FinalCTA` + spin sticker. **Delete** the fake stats, `Motif.tsx`, `AICopilot.tsx` decoration if it isn't a real feature |
| `/login`, `/signup` | Split screen: left = paper with Anton headline + one Caveat note (drop the 5 mini-cards and feature boxes); right = `.brut` form card; Google button as `secondary` |
| `/forgot-password`, `/reset-password`, `/verify-email` | Single centered `.brut` card, same form primitives |
| `/onboarding` (28 raw classes, the worst offender) | Step flow: mono `STEP 2 / 5` eyebrow, Anton question, `Chip` multi-select, sticky bottom action bar on phones |

### Phase 3: Daily loop (most-used screens)
| Route | Rebuild to |
|---|---|
| `/dashboard` | `PageHeader` "GOOD EVENING, [NAME]" with the name in `hl` · `01 / CONTINUE` shelf of in-progress topics · `02 / TODAY` daily task list (hairline rows, teal ticks) · streak `Stat` with `CountUp` · `03 / DUE FOR REVIEW` · Study-With-Me status card |
| `/learn` | Header + search · `Shelf` per track · subject cards as `Card interactive` with a progress bar · Caveat note on the recommended next subject |
| `/learn/[subject]` | Subject header (Anton title, eyebrow `SUBJECT · 42 TOPICS`, progress) · numbered module sections · topic `Row`s with status chips · prerequisites as an inline note |
| `/learn/[subject]/[topic]` (991 lines, the core page) | Reading layout: 68ch column, 17px/1.75 Inter, Anton h1, mono h-labels, sticky hairline TOC on the left at ≥1280px, `CodeBlock`, callouts as `--paper-2` blocks with a hairline border (no one-sided accent bars), bookmark in the header, prev/next as large sticker buttons, key-points box as `.brut` |
| `/learn/daily` | Single-focus card, one task at a time, `CountUp` on finish |
| `/learn/saved` | Hairline list grouped by subject, `EmptyState` |
| `/learn/[subject]/review`, `/revise` | Flashcard `.brut` card with a flip (transform only), chip-based self-rating |
| `/learn/[subject]/test` | Exam mode: minimal chrome, mono timer, question card, answer chips, result screen with Anton score |
| `/learn/[subject]/reading-order` | Numbered vertical path, teal ticks for done |
| `/learn/map` | Graph on paper with dot grid; nodes as small `.brut` pills; selected node in rust |

### Phase 4: Practice
| Route | Rebuild to |
|---|---|
| `/practice` | Hub: three big `Card`s (Problems, SQL, Code/Web) + `01 / RECENT SESSIONS` rows + ledger `Stat`s |
| `/practice/problems` | **Dense table** (hairlines, not cards): index in mono, title, difficulty `Chip`, topic chips, status tick; filter `Chip` bar; sticky header |
| `/practice/problems/[id]` (883 lines) | Split pane: left = statement (reading typography), right = Monaco (`paper`/`ink` theme) + mono console; tabs as `label-cond`; run = `secondary`, submit = `primary`; result toast |
| `/practice/session/[id]`, `/practice/review/[id]` | Session header with mono timer + progress; review = diff of your answer vs the reference in `CodeBlock`s |
| `/practice/sql`, `/practice/code`, `/practice/web` | Same split-pane system as the problem page; schema/explorer panels with hairlines |

### Phase 5: Career and utilities
| Route | Rebuild to |
|---|---|
| `/companies` (`components/companies/*`) | Company `Card`s with a logo tile + mono meta (rounds, roles); detail as numbered sections |
| `/roadmaps` (481 lines) | Vertical numbered path; milestones as `.brut` stops; done = teal |
| `/resources`, `/resources/[id]` | Filter chips + hairline list; detail uses lesson reading layout |
| `/templates`, `/templates/[id]`, `/templates/[id]/editor` | Template shelf with paper previews; editor = split pane, toolbar of `label-cond` buttons |
| `/tools` (`components/tools/*`) | `PageHeader` "YOUR [TOOLS]" · `01 / CORE PLACEMENT` big cards · `02 / INTERVIEW` · `03 / CALCULATORS` rows · continue-using shelf |
| 10 tool pages (`resume-analyzer`(+`[id]`), `interview-simulator`, `star-builder`, `tech-questions`, `company-prep`, `dsa-visualizer`, `sql-playground`, `readiness-calculator`, `cgpa-converter`, `aptitude-timer`) | Shared tool frame: `PageHeader` + one main `.brut` work area + results panel; scores as Anton numbers; visualizer bars use ink/rust/teal only |
| `/labs` + 5 labs (`big-o`, `capacity-estimator`, `cpu-scheduling`, `page-replacement`, `subnet-calculator`) | Lab frame: controls column (inputs + chips) / output canvas; Gantt and frame tables in mono on `--paper-2` |
| `/study-with-me` | Focus room: huge mono timer, one Caveat note, daily log as hairline rows |
| `/ideas` | Board of `.brut` idea cards, vote button as a sticker counter, admin status chips |

### Phase 6: Account
| Route | Rebuild to |
|---|---|
| `/profile` + `learning-path`, `preferences`, `progress`, `target-companies` (15–20 raw classes each) | Profile header with avatar sticker; sub-pages as settings-style hairline sections; progress charts in ink/rust/teal |
| `/settings` (669 lines) + `SettingsModal` | Grouped hairline rows (Mimo settings), theme picker with three preview swatches, toggles in ink |
| `/help` | FAQ as numbered accordion, search |

### Phase 7: Sweep and verify
1. `grep -rE "(slate|gray|zinc|blue|indigo)-[0-9]" app components` returns **0**; delete the old token aliases.
2. Delete unused CSS and components (old `Reveal`, `SectionHeader`, `Badge`, `Motif`).
3. `tsc`, `next build`, `pytest` green; lint errors reduced in every file touched.
4. Screenshot pass of all 60 routes at 375 and 1440 in both themes; reduced-motion pass; keyboard-only pass.
5. Lighthouse on `/`, `/dashboard` and a lesson page (target: performance and accessibility ≥ 95).

### Order and size
Phase 0 → 1 must land first (about 2 sessions). After that, Phases 2–6 are independent per folder and
can run in parallel sessions, as long as two sessions never edit the same component folder. Suggested
order: **0 → 1 → 3 (daily loop) → 2 (landing) → 4 → 5 → 6 → 7**. The daily loop goes before the
landing page because it's what students actually use; the shell + tokens already lift the landing page
on day one.

### Open decisions
1. **Accent:** keep rust (same family as Portfolio and Mimo, recommended) or give StudyHub its own (only `--accent` / `--accent-ink` change).
2. **Landing copy:** the hero line above is a draft; use your own wording if you prefer.
3. **Landing sections to cut:** `AICopilot`, `ConceptDecoder`, `KnowledgeMap` demos: keep only the ones backed by real features.
