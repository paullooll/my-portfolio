# Retro Command Center Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a single scrolling, retro-game "command center" site guided by an original ghost mascot, Haunt, with a hidden playable world.

**Architecture:** All copy and data move into one typed `src/content.ts`. Pure logic (placeholder gating, filters, achievements, key sequences, world collision, theme resolution) lives in small `src/lib/*` and `src/game/world.ts` modules, which are unit-tested with Vitest. Sections are thin React components in `src/sections/*` that read from `content.ts`. A Vite plugin handles build-time HTML meta, the sitemap, and the unfilled-content report. Motion is GSAP + ScrollTrigger behind a reduced-motion guard.

**Tech Stack:** React 19, TypeScript 5.6, Vite 7, Tailwind 4, GSAP 3 (+ScrollTrigger), wouter, sonner, lucide-react, Vitest. New dev dependency: `sharp`.

**Spec:** `docs/superpowers/specs/2026-11-20-retro-command-center-portfolio-design.md` (read it alongside this plan. Section numbers like §5.4 refer to it.)

## Global Constraints

- **Do not commit or push anything** (Paul's instruction). Every task ends with a green checkpoint instead of a commit. Paul decides when to commit.
- Work on branch `retro-redesign`.
- No new runtime dependencies. Only `sharp` is added, as a dev dependency.
- Keep all existing content from the current `src/pages/Home.tsx` word for word: projects, experience, education, skills, the 4 hobby cards, contact and social links, and the Web3Forms form using `VITE_WEB3FORMS_ACCESS_KEY`.
- Display name: "Richie Paul Aquiño". Role: "Junior Fullstack Developer".
- The placeholder literal is exactly `[REPLACE ME]`. Never invent employers, awards, numbers, or testimonials.
- Production hides unfilled content. Dev shows it with a dashed marker (§5.13).
- Fonts: Press Start 2P (H1/H2/short HUD labels only), VT323 (HUD/terminal), IBM Plex Sans 400/500/600 (body). Remove DM Sans, DM Mono, and Fraunces.
- Colour tokens are exactly the §5.3 table, adjusted only where needed to pass AA.
- Every animation has an instant final state under `prefers-reduced-motion: reduce`. Animate only transform and opacity (clip-path is allowed for the section wipe).
- No Pokémon names or assets anywhere. Haunt has no spikes, no ears, no legs, and no red eyes.
- Haunt never covers the main text column or form fields.

## Review Focus

1. **Typing inside the contact form:** typing "haunt" or the Konami keys in a form field must not open the game. Pinned in Task 9 (`shouldIgnoreTarget`).
2. **Blocked storage:** with localStorage or sessionStorage unavailable (private mode, blocked cookies), the theme, guide toggle, achievements, and intro all still work without throwing. Pinned in Task 1 (`safeStorage`) and Task 6 (achievements with throwing storage).
3. **All placeholders in production:** in a prod build where everything is still a placeholder, no nav link, game door, or empty heading points at a hidden section. Pinned in Task 1 (`visibleSections`).
4. **Opening a case study by URL:** loading `/#mission-solid` directly, or with a filter active that hides SOLID, opens that case study. An unknown hash opens nothing. Pinned in Task 5 (`missionIdFromHash`).
5. **Keyboard focus in overlays:** while the intro, a case-study dialog, or the game is open, focus stays inside it, Esc closes it, and focus returns to the element that opened it. Pinned in the browser checks for Tasks 5, 8, and 10.

---

### Task 1: Content model, placeholder gating, test setup

**Files:**
- Create: `src/lib/placeholder.ts`, `src/lib/storage.ts`, `src/content.ts`, `src/lib/sections.ts`
- Create tests: `src/lib/placeholder.test.ts`, `src/lib/storage.test.ts`, `src/lib/sections.test.ts`
- Modify: `package.json` (add `"test": "vitest run"`), `vite.config.ts` (add a `test: { environment: "node", include: ["src/**/*.test.ts"] }` block, importing `defineConfig` from `vitest/config`)

**Interfaces:**
- Produces, in `placeholder.ts`:
  - `PLACEHOLDER = "[REPLACE ME]"`
  - `type Maybe<T> = T | typeof PLACEHOLDER`
  - `isFilled(value: unknown): boolean`
  - `shouldRender(value: unknown, isDev: boolean): boolean`
  - `listUnfilled(value: unknown, path?: string): string[]`
- Produces, in `storage.ts`: `safeStorage(kind: "local" | "session"): { get(k: string): string | null; set(k: string, v: string): void }`, which never throws.
- Produces, in `content.ts`, the default-exported `content: SiteContent`, plus these types:
  - `SectionId = "start" | "profile" | "stats" | "missions" | "tech-tree" | "quest-log" | "achievements" | "reviews" | "dev-log" | "transmission"`
  - `Tag = "Web" | "Mobile" | "AI/Data" | "Government"`
  - `Project { id; number; type; title; tags: Tag[]; description; stack: string[]; image; github?; live?: Maybe<string>; private?: boolean; caseStudy: { problem: Maybe<string>; role: string; features: string[]; outcome: Maybe<string>; media: Maybe<string[]>; video: Maybe<string> } }`
  - `Stat { label; value: Maybe<number>; suffix? }`
  - `SkillGroup { name; unlocked: string[]; training: Maybe<string[]> }`
  - `TimelineEntry`, `Achievement`, `Testimonial`, `LogEntry`, `Hobby`, `Social`
  - `cv: Maybe<string>`
  - `hauntLines: Record<SectionId, string>`
  - `sections: { id: SectionId; game: string; plain: string }[]`
- Produces, in `sections.ts`: `visibleSections(c: SiteContent, isDev: boolean): SectionId[]`

`content.ts` must be pure data: no imports from React, no `import.meta`, no asset imports. Task 12 imports it from `vite.config.ts`. Fill it from current `Home.tsx` following §5.2, §5.6–5.8 and §5.13:
- Project ids are `ambatuhelp`, `budget-tracker`, `chordefine`, `solid`, with tags per §5.6.
- Stats: projects shipped `4`. The other two stats are `PLACEHOLDER`.
- Testimonials (3) and dev-log entries (3) are all `PLACEHOLDER` objects.
- Achievements: "Magna Cum Laude, BS Information Technology, WVSU", plus 2 placeholder slots.

- [ ] **Step 1: Install Vitest config and write failing tests.**
  - `placeholder.test.ts`:
    - `isFilled("[REPLACE ME]") === false`
    - `isFilled("Year [REPLACE ME]") === false`
    - `isFilled("") === false`
    - `isFilled(undefined) === false`
    - `isFilled("React") === true`
    - `isFilled([]) === false`
    - `isFilled(["[REPLACE ME]", "x"]) === true` (an array is filled if any item is)
    - `isFilled({ name: "A", quote: "[REPLACE ME]" }) === false` (an object is filled only if every value is)
    - `shouldRender(PLACEHOLDER, true) === true`
    - `shouldRender(PLACEHOLDER, false) === false`
    - `listUnfilled({ a: { b: PLACEHOLDER }, c: ["ok", PLACEHOLDER] })` deep-equals `["a.b", "c.1"]`
  - `storage.test.ts`: with `globalThis.localStorage` stubbed so every method throws, `safeStorage("local").get("x") === null` and `set` does not throw.
  - `sections.test.ts`:
    - `visibleSections(content, false)` excludes `"reviews"` and `"dev-log"` and includes `"missions"`.
    - `visibleSections(content, true)` has length 10.
    - After setting all 3 testimonials to filled objects, `visibleSections(c, false)` includes `"reviews"`.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL (modules not found).
- [ ] **Step 3:** Implement the four modules. A section is visible in prod if its backing data passes `isFilled`. STATS needs at least one filled stat. ACHIEVEMENTS needs at least one filled entry.
- [ ] **Step 4:** Run `pnpm test && pnpm check`. Expected: all pass.
- [ ] **Step 5: Checkpoint.** Green. Do not commit.

### Task 2: Design system (tokens, fonts, panels) with a contrast test

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/panels.css`, `src/lib/contrast.ts`, `src/lib/contrast.test.ts`, `src/lib/theme.ts`, `src/lib/theme.test.ts`
- Modify: `src/index.css` (becomes `@import "tailwindcss";` plus imports of the three style files; remove the old rules once the sections in Tasks 4–5 no longer use them), `index.html` (font link per Global Constraints; remove `maximum-scale=1`), `src/contexts/ThemeContext.tsx`

**Interfaces:**
- Produces: CSS variables `--bg --surface --line --ink --ink-muted --accent --warn --danger --haunt-body` under `:root` (light) and `.dark` (dark), plus `--font-display --font-hud --font-body`.
- Produces utility classes:
  - `.panel` (pixel-stepped corners)
  - `.hud-label` (VT323)
  - `.pixel-heading` (Press Start 2P)
  - `.replace-me` (dashed `--warn` outline, with a `::before` "[REPLACE ME]" tag)
  - `.scanlines` and `.grain` (fixed overlays, `pointer-events: none`)
  - `.sr-only`
- Produces: `contrastRatio(hexA: string, hexB: string): number`, `resolveInitialTheme(stored: string | null, prefersDark: boolean | null): "light" | "dark"`.
- `ThemeContext` keeps its API. Its initial state uses `resolveInitialTheme(safeStorage("local").get("theme"), matchMedia("(prefers-color-scheme: dark)").matches)`.

- [ ] **Step 1: Write the failing tests.**
  - `contrast.test.ts`:
    - `contrastRatio("#000000", "#FFFFFF")` is approximately 21.
    - It then reads `src/styles/tokens.css` with `fs`, parses both themes, and asserts these pairs:
      - ≥ 4.5: `ink/bg`, `ink/surface`, `ink-muted/bg`, `ink-muted/surface`
      - ≥ 3: `accent/bg`, `warn/bg`, `danger/bg`
    - Also ≥ 4.5: `bg` on `accent`, because button text sits on an accent fill.
  - `theme.test.ts`:
    - `("light", true) → "light"`
    - `(null, false) → "light"`
    - `(null, true) → "dark"`
    - `(null, null) → "dark"`
    - `("garbage", null) → "dark"`
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement. Start from the §5.3 hex values. If a pair fails, nudge that token's lightness until it passes, and note the change in a CSS comment.
- [ ] **Step 4:** Run `pnpm test && pnpm check`. Expected: PASS.
- [ ] **Step 5: Checkpoint.** Green. Do not commit.

### Task 3: Page shell, HUD, routing, 404

**Files:**
- Create: `src/components/Hud.tsx`, `src/components/Gate.tsx`, `src/components/SectionFrame.tsx`, `src/pages/NotFound.tsx` (rewrite)
- Modify: `src/App.tsx` (wouter `<Switch>`: `/` → Home, fallback → NotFound), `src/pages/Home.tsx` (rewrite as a thin page)
- Create: `vercel.json` (`{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`), `public/_redirects` (`/* /index.html 200`)

**Interfaces:**
- Consumes: `content`, `visibleSections`, `shouldRender`.
- Produces:
  - `<Gate value={unknown}>children</Gate>`: renders children when `shouldRender(value, import.meta.env.DEV)`. When the value is unfilled in dev, children are wrapped in `<div className="replace-me">`.
  - `<SectionFrame id={SectionId} game plain>children</SectionFrame>`: renders `<section id aria-labelledby>` with a header showing `GAME · Plain` (`.pixel-heading` + plain text visible), and returns null when the id is not in `visibleSections`.
  - `useIsDev(): boolean`.
- HUD (§5.2 row 0):
  - a "Skip to content" link before it, visible on focus, targeting `#start`
  - sticky `<header>` with name and "LVL 1 · Grad Student"
  - `<nav>` of anchor links to visible sections
  - theme toggle
  - CV link, gated on `content.cv`, with `download`
  - "Open to work" badge
  - "Guide: on/off" toggle (UI only; wired in Task 7)
  - achievement count slot (wired in Task 6)
  - Below 900px, nav collapses into a disclosure button (`aria-expanded`) that closes on link click and on Esc.
- NotFound: "GAME OVER · Continue?" heading, a home link, and a slot where Task 7 puts sleeping Haunt.

- [ ] **Step 1:** Implement the shell. Home renders the HUD and an empty `SectionFrame` for each `SectionId`, in §5.2 order, plus a footer with socials, ©, and the "psst… try the Konami code" hint.
- [ ] **Step 2:** Run `pnpm check && pnpm build`. Expected: both succeed.
- [ ] **Step 3: Browser check.** Run `pnpm dev`.
  - All 10 frames show.
  - Nav links scroll to them.
  - `/nope` shows the 404 page.
  - Tab order: skip link → HUD → sections, with visible focus rings.
  - At 375px wide there is no horizontal scroll.
- [ ] **Step 4: Checkpoint.** Do not commit.

### Task 4: Content sections (Start, Profile, Stats, Tech Tree, Quest Log, Achievements, Reviews, Dev Log, Transmission)

**Files:**
- Create: one file per section under `src/sections/`:
  - `Start.tsx`, `Profile.tsx`, `Stats.tsx`, `TechTree.tsx`, `QuestLog.tsx`
  - `Achievements.tsx`, `Reviews.tsx`, `DevLog.tsx`, `Transmission.tsx`
- Create: `src/sections/sections.css`.

**Interfaces:**
- Consumes: `content`, `Gate`, `SectionFrame`.
- Produces: `data-reveal` attributes on the elements Task 8 animates. Specific hooks:
  - `data-counter={number}` on stat values
  - `data-typed` on the role line
  - `.tree-link` SVG paths in TechTree
  - `.timeline-spine` in QuestLog
  - `#radar-slot` in Start
  - `#haunt-anchor` in Start
- Section requirements:
  - **Start:** H1 is the name, the typed-line target shows the static role, and the value statement comes from content. A low-opacity accent/indigo gradient-mesh glow sits behind it (CSS radial gradients, §5.3). `▶ VIEW MISSIONS` links to `#missions`. `⬇ DOWNLOAD CV` is gated.
  - **Profile:** keeps the existing About paragraphs word for word. The photo uses `width`/`height` and `alt="Richie Paul Aquiño"`. "Now training" lists the five interests. The 4 hobby cards are titled "Side quests", and the Spotify card is gated on its link.
  - **TechTree:** follows the §5.7 table exactly. The Unlocked and Training states are shown as text, not colour alone. It keeps the intro line from §5.7 and includes the SOLID note.
  - **Transmission:** moves the existing form logic over unchanged, adds the `botcheck` honeypot (a visually hidden checkbox, `tabIndex={-1}`), and replaces the inline error style with a `.form-error` class using `--danger`.

- [ ] **Step 1:** Implement all nine sections.
- [ ] **Step 2:** Run `pnpm check && pnpm build`. Expected: success.
- [ ] **Step 3: Browser check.**
  - In dev, Reviews, Dev Log, two stats, and the CV button show dashed `[REPLACE ME]` markers.
  - In `pnpm build && pnpm preview`, they and their nav links are gone.
  - The form still shows the missing-key error when `VITE_WEB3FORMS_ACCESS_KEY` is unset.
- [ ] **Step 4: Checkpoint.** Do not commit.

### Task 5: Missions (filters, cards, case-study dialog, WebP assets)

**Files:**
- Create: `src/lib/missions.ts`, `src/lib/missions.test.ts`, `src/sections/Missions.tsx`, `src/components/CaseStudyDialog.tsx`, `scripts/build-assets.mjs`
- Modify: `package.json` (dev dep `sharp`, script `"assets": "node scripts/build-assets.mjs"`)

**Interfaces:**
- Produces, in `missions.ts`:
  - `filterProjects(projects: Project[], tag: Tag | "All"): Project[]`
  - `missionIdFromHash(hash: string, projects: Project[]): string | null`
- Produces: `public/projects/*.webp`, generated next to the PNG originals, which are kept.
- Cards use `<picture>` with a WebP source and a PNG fallback, plus `loading="lazy"`, `width`, and `height`.

- [ ] **Step 1: Write the failing tests.**
  - `filterProjects(all, "Government").map(p => p.id)` deep-equals `["budget-tracker", "solid"]`.
  - `filterProjects(all, "AI/Data")` → `["ambatuhelp", "chordefine"]`.
  - `"All"` → all 4, in original order.
  - `missionIdFromHash("#mission-solid", all) === "solid"`.
  - `missionIdFromHash("#mission-nope", all) === null`.
  - `missionIdFromHash("", all) === null`.
  - `missionIdFromHash("#missions", all) === null`.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement `missions.ts` and `Missions.tsx`.
  - The filter toolbar uses `aria-pressed` buttons.
  - An empty result shows "No missions in this sector yet."
  - Private projects show a "Classified" lock.
  - `CaseStudyDialog` is a native `<dialog>` with `showModal()` (built-in focus trap, Esc closes). It opens from a card click or from `missionIdFromHash(location.hash)` on load and on `hashchange`. It sets `#mission-<id>` when opened, clears it when closed, and returns focus to the card.
  - Dialog fields are wrapped in `Gate`.
- [ ] **Step 4:** Run `pnpm add -D sharp`, then `pnpm assets`. Expected: 4 `.webp` files in `public/projects/`.
- [ ] **Step 5:** Run `pnpm test && pnpm check`. Expected: PASS.
- [ ] **Step 6: Browser check.**
  - Open `/#mission-solid` directly: the dialog is open.
  - Tab stays inside the dialog.
  - Esc closes it and focus is back on the SOLID card.
  - Filters work.
- [ ] **Step 7: Checkpoint.** Do not commit.

### Task 6: Achievements system

**Files:**
- Create: `src/lib/achievements.ts`, `src/lib/achievements.test.ts`, `src/components/AchievementToasts.tsx`
- Modify: `src/components/Hud.tsx` (count), `src/App.tsx` (mount sonner `<Toaster>`, restyled with `.panel`)

**Interfaces:**
- Produces:
  - `AchievementId = "reached-missions" | "downloaded-cv" | "sent-message" | "toggled-theme" | "found-egg" | "collected-orbs"`
  - `ACHIEVEMENTS: Record<AchievementId, { title: string }>`
  - `createAchievements(storage: ReturnType<typeof safeStorage>): { unlock(id: AchievementId): boolean; unlocked(): AchievementId[] }`
  - Hook `useAchievements(): { unlock(id: AchievementId): void; count: number }`, which shows a toast only when `unlock` returns true.
- Wire-up:
  - `reached-missions` fires when the Missions section first enters the viewport.
  - `downloaded-cv` fires on CV link click.
  - `sent-message` fires on form success.
  - `toggled-theme` fires on theme toggle.
  - The other two are wired in Task 10.

- [ ] **Step 1: Write the failing tests.**
  - The first `unlock("toggled-theme")` returns true. The second returns false.
  - `unlocked()` deep-equals `["toggled-theme"]`.
  - A new instance over the same storage still returns false.
  - Over a storage whose get/set throw, `unlock` returns true and does not throw.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement. Store the list as JSON under key `"achievements"`.
- [ ] **Step 4:** Run `pnpm test && pnpm check`. Expected: PASS.
- [ ] **Step 5: Checkpoint.** Do not commit.

### Task 7: Haunt mascot and dialogue

**Files:**
- Create: `src/components/haunt/HauntSprite.tsx`, `src/components/haunt/HauntGuide.tsx`, `src/components/haunt/DialogueBox.tsx`, `src/lib/dialogue.ts`, `src/lib/dialogue.test.ts`
- Modify: `src/pages/NotFound.tsx` (sleeping Haunt), `src/components/Hud.tsx` (wire the Guide toggle)

**Interfaces:**
- Produces:
  - `HauntState = "idle" | "talk" | "wave" | "point-left" | "point-right" | "phase" | "surprised" | "sleep"`
  - `<HauntSprite state={HauntState} size={number} />`: an `aria-hidden` SVG of 24×24 `<rect>` cells. Colours come only from `--haunt-body`, `--accent`, and `--ink`.
  - `nextLine(sectionId: SectionId, seen: ReadonlySet<SectionId>, guideOn: boolean): string | null`
  - `<HauntGuide />`, mounted once in Home. It also exposes `onTap` counting for the Task 9 tap trigger, via the `onFiveTaps?: () => void` prop.
- Sprite rules (§5.4):
  - round body tapering into a wavy tail
  - wide toothy grin and two `--accent` eyes
  - no spikes, ears, or legs
  - an occasional 1–2 px glitch offset
  - eyes follow the cursor by up to 1 cell (`pointer: fine` only)
- Guide behaviour:
  - An IntersectionObserver at threshold 0.4 calls `nextLine`. The line types out and auto-hides after 6 s. ✕ or Esc dismisses it.
  - A separate visible button "Talk to Haunt" re-shows the current section's line inside an `aria-live="polite"` region. Scroll-shown lines go in a non-live element.
  - Placement: desktop bottom-right at 72px; below 900px, bottom-left at 48px. The dialogue box has `max-width: min(320px, 70vw)` and sits above the HUD layer and below dialogs.
  - Guide off hides both the sprite and the box. Its state persists via `safeStorage("local")` key `"guide"`.

- [ ] **Step 1: Write the failing tests.**
  - `nextLine("missions", new Set(), true) === content.hauntLines.missions`.
  - `nextLine("missions", new Set(["missions"]), true) === null`.
  - `nextLine("missions", new Set(), false) === null`.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement. Haunt's lines live in `content.hauntLines`, per §5.4's tone and §5.13's no-claims rule.
- [ ] **Step 4:** Run `pnpm test && pnpm check`. Expected: PASS.
- [ ] **Step 5: Browser check.**
  - At 375px and 1440px, Haunt and the box never overlap the text column or the form.
  - With reduced motion emulated, Haunt is static and lines appear without typing.
- [ ] **Step 6: Checkpoint.** Do not commit.

### Task 8: Motion (intro, reveals, hero canvas, hovers, counters, cursor)

**Files:**
- Create in `src/motion/`:
  - `reducedMotion.ts`, `useReveals.ts`, `useCounters.ts`, `useTyped.ts`
  - `magnetic.ts`, `tilt.ts`, `useScrollTimeline.ts`
- Create in `src/components/`: `BootIntro.tsx`, `RadarCanvas.tsx`, `CustomCursor.tsx`
- Modify: `src/pages/Home.tsx` (mount the hooks and components)

**Interfaces:**
- Produces: `prefersReducedMotion(): boolean`, plus a `useReducedMotion(): boolean` hook that subscribes to changes. Every hook below returns early (instant final state) when it is true.
- Behaviour per §5.5:
  - **BootIntro:** a fixed overlay, `role="dialog"`, `aria-label="Intro"`, with a focusable "Skip" button that gets focus.
    - Any key, click, or tap skips it.
    - It shows once per session (`safeStorage("session")` key `"booted"`) and is never shown under reduced motion.
    - It runs about 2 s.
    - The page renders underneath from the first paint.
  - **useReveals:** ScrollTrigger on each `SectionFrame` runs a stepped `clip-path: inset()` wipe in 6 steps, then staggers the `[data-reveal]` children.
  - **RadarCanvas:**
    - Canvas size is capped with `Math.min(devicePixelRatio, 2)`.
    - It pauses via IntersectionObserver and `visibilitychange`, and draws one static frame under reduced motion.
    - It cleans up its RAF and observers on unmount.
  - **useTyped:** cycles the three role strings from §5.5. The element has `aria-label` set to the first string, and the animated text is `aria-hidden`.
  - **useCounters:** counts once on enter. Values come from `data-counter`.
  - **magnetic:** applies to `.button-primary`, max 8px.
  - **tilt:** applies to mission cards, max 6°, only under `(hover: hover) and (pointer: fine)`. On hover, the card screenshot zooms to 1.05 with a single scanline sweep. If a filled `caseStudy.video` exists, it plays muted on hover and pauses on leave.
  - **useScrollTimeline:** a scrubbed `scaleY` on `.timeline-spine`, plus the TechTree `.tree-link` stroke draw.
  - **CustomCursor:** a pixel crosshair. It renders only under `(pointer: fine)` without reduced motion, hides over `input` and `textarea`, and grows over `a, button`.
  - CSS `scroll-behavior: smooth` is set on `html`, inside `@media (prefers-reduced-motion: no-preference)`.

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** Run `pnpm check && pnpm build`. Expected: success.
- [ ] **Step 3: Browser check.**
  - On first load the intro plays, and Esc, a click, or Skip removes it. Reloading in the same tab skips it.
  - Reduced motion emulated: no intro, and everything is visible immediately.
  - A Chrome performance recording of scrolling the whole page with 4× CPU throttle shows no long frames attributable to the scroll handlers.
- [ ] **Step 4: Checkpoint.** Do not commit.

### Task 9: Easter-egg triggers

**Files:**
- Create: `src/lib/sequence.ts`, `src/lib/sequence.test.ts`, `src/hooks/useEasterEgg.ts`

**Interfaces:**
- Produces:
  - `KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]`
  - `HAUNT_WORD = ["h","a","u","n","t"]`
  - `createSequenceDetector(sequences: string[][], onMatch: () => void): (key: string) => void`. Letters are compared case-insensitively. A wrong key resets progress, but still counts as a possible first key.
  - `shouldIgnoreTarget(t: { tagName?: string; isContentEditable?: boolean } | null): boolean`
  - `useEasterEgg(): { open: boolean; openGame(): void; closeGame(): void }`. It binds `keydown` on `window` and is also triggered by `HauntGuide`'s `onFiveTaps`.

- [ ] **Step 1: Write the failing tests.**
  - Feeding KONAMI calls `onMatch` once.
  - Feeding `"H","A","U","N","T"` calls it.
  - `"h","a","h","a","u","n","t"` calls it (progress restarts correctly).
  - `"ArrowUp","x","ArrowUp"` does not.
  - `shouldIgnoreTarget({tagName:"INPUT"})`, `({tagName:"TEXTAREA"})`, `({tagName:"SELECT"})`, and `({isContentEditable:true})` are true.
  - `shouldIgnoreTarget({tagName:"BUTTON"})` and `(null)` are false.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `pnpm test && pnpm check`. Expected: PASS.
- [ ] **Step 5: Checkpoint.** Do not commit.

### Task 10: The playable world

**Files:**
- Create: `src/game/world.ts`, `src/game/world.test.ts`, `src/game/HauntWorld.tsx`, `src/game/render.ts`
- Modify: `src/pages/Home.tsx`. Mount `const HauntWorld = lazy(() => import("../game/HauntWorld"))` inside `<Suspense>` only when `useEasterEgg().open` is true.

**Interfaces:**
- Produces, in `world.ts`:
  - `TILE = 16`
  - `MAP: string[]`, an ASCII map. `#` is a wall, `.` is floor, and `1`–`5` are doors. The doors map in order to `missions`, `tech-tree`, `quest-log`, `achievements`, and `transmission`. `o` marks an orb (5 total) and `P` marks the start.
  - `parseMap(map: string[], visible: SectionId[]): World`. Doors whose section is not visible become walls.
  - `canMove(w: World, x: number, y: number): boolean`, in tile coordinates.
  - `doorAt(w: World, x: number, y: number): SectionId | null`
  - `collectOrb(w: World, x: number, y: number): World`, which returns a new World.
  - `orbsLeft(w: World): number`
- `HauntWorld` props: `{ onClose(): void; onGoTo(id: SectionId): void; onUnlock(id: AchievementId): void }`.
  - It is a full-screen `role="dialog"` with `aria-label="Haunt world"`.
  - It draws to a canvas with `render.ts` and uses `HauntSprite`'s cell grid as Haunt's art.
  - Controls: arrows/WASD, plus an on-screen D-pad when `(pointer: coarse)`.
  - Stepping on a door shows a card with that section's plain label, a one-line summary from `content`, and "Go there", which calls `onGoTo` → close → scroll.
  - It calls `onUnlock("found-egg")` on mount, and `onUnlock("collected-orbs")` when `orbsLeft` hits 0.
  - Esc or ✕ closes it and restores focus.
  - It pauses its RAF when the tab is hidden.

- [ ] **Step 1: Write the failing tests.**
  - `parseMap(MAP, all)` finds exactly 5 doors and 5 orbs and one start position.
  - `canMove` is false on `#` and true on `.`.
  - `doorAt` at door 1 returns `"missions"`.
  - With `visible` lacking `"achievements"`, door 4 becomes a wall and `doorAt` there returns null.
  - `orbsLeft` drops from 5 to 4 after `collectOrb` on an orb tile.
  - Collecting the same tile again does not change the count.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `pnpm test && pnpm check && pnpm build`. Expected: PASS. The build output also shows a separate chunk for `HauntWorld` that isn't loaded on first page view.
- [ ] **Step 5: Browser check.**
  - The Konami code opens the world. Typing "haunt" in the message textarea does not.
  - Five taps on Haunt open it in mobile emulation.
  - Walking into the Missions door and pressing "Go there" closes the game and lands on Missions.
  - Esc returns focus.
- [ ] **Step 6: Checkpoint.** Do not commit.

### Task 11: Analytics

**Files:**
- Create: `src/lib/analytics.ts`, `src/lib/analytics.test.ts`
- Modify: `index.html` (remove the static Umami `<script>`), `src/main.tsx` (inject the script when configured), and the CV link and form success handler (call `track`)

**Interfaces:**
- Produces:
  - `analyticsScriptSrc(endpoint?: string, id?: string): string | null`. It returns `` `${endpoint}/umami` `` only when both values are non-empty and neither contains `%VITE_`.
  - `track(event: "cv-download" | "message-sent"): void`. It calls `window.umami?.track(event)` and never throws.

- [ ] **Step 1: Write the failing tests.**
  - `("https://a.io", "x")` gives `"https://a.io/umami"`.
  - `(undefined, "x")`, `("", "x")`, and `("%VITE_ANALYTICS_ENDPOINT%", "x")` all give `null`.
  - `track` with no `window.umami` does not throw.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement. The injected script gets `defer` and `data-website-id`.
- [ ] **Step 4:** Run `pnpm test && pnpm check`. Expected: PASS.
- [ ] **Step 5: Checkpoint.** Do not commit.

### Task 12: Build-time SEO plugin, OG image, unfilled report, README, final audit

**Files:**
- Create: `scripts/vite-portfolio-plugin.ts`, `scripts/vite-portfolio-plugin.test.ts`, `scripts/og-template.svg`
- Modify: `vite.config.ts` (register the plugin, and add `scripts/**/*.test.ts` to the test include list), `scripts/build-assets.mjs` (also renders `public/og-image.png` at 1200×630 from the template), `README.md` (rewrite), `.env.example` (add `VITE_SITE_URL`, `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID`)

**Interfaces:**
- Consumes: `content` (imported directly from `../src/content`), `listUnfilled`.
- Produces:
  - `buildHead(c: SiteContent, siteUrl: string | undefined): string`. It returns:
    - `<title>`, description, `theme-color`
    - OG and Twitter tags. `og:image` is absolute only when `siteUrl` is set; otherwise it is omitted.
    - `<link rel="canonical">`, only when `siteUrl` is set
    - Person JSON-LD per §5.11, with `url` only when `siteUrl` is set
  - `buildSitemap(siteUrl: string): string`
  - `portfolioPlugin(): Plugin`:
    - `transformIndexHtml` injects `buildHead`.
    - On build, if `VITE_SITE_URL` is set, it emits `sitemap.xml` and a `robots.txt` with a `Sitemap:` line. Otherwise it emits a `robots.txt` without that line.
    - On build, it logs `listUnfilled(content)` as a yellow warning block. The build does not fail.

- [ ] **Step 1: Write the failing tests.**
  - `buildHead(content, undefined)` contains `"Richie Paul Aquiño"` and `"application/ld+json"`, but not `rel="canonical"` or `og:image`.
  - `buildHead(content, "https://x.dev")` contains `href="https://x.dev/"` and `"https://x.dev/og-image.png"`.
  - The parsed JSON-LD has `@type === "Person"`, `jobTitle === "Junior Fullstack Developer"`, and a `sameAs` that includes the GitHub URL.
  - `buildSitemap("https://x.dev")` contains `<loc>https://x.dev/</loc>`.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement. Remove the hard-coded title and description from `index.html` so they aren't duplicated. Run `pnpm assets` to produce the OG PNG.
- [ ] **Step 4:** Run `pnpm test && pnpm check && pnpm build`. Expected: PASS. The build prints the unfilled list, and `dist/robots.txt` exists.
- [ ] **Step 5: Lighthouse.** Run `pnpm preview`, then a Lighthouse mobile run (Chrome DevTools) on `/`. Expected: Performance, Accessibility, Best Practices, and SEO each ≥ 90. Fix regressions and re-run. Record the four scores in the README.
- [ ] **Step 6: README.** It must cover:
  - run, test, and build commands
  - editing `content.ts` and how hide-until-filled works
  - every env var
  - Vercel and Netlify deploy steps
  - the §7 content checklist
  - the Easter-egg triggers, as a spoiler section
- [ ] **Step 7: Full sweep.** Run `pnpm test && pnpm check && pnpm build`, then a final browser pass of the Review Focus items 1–5. Checkpoint. Do not commit. Report to Paul for a commit decision.
