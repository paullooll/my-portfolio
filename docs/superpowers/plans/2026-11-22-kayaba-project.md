# KayaBa? Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add KayaBa? as the 4th project (non-featured, new `Personal` tag) with a designed cover and a voiced demo video.

**Architecture:** Pure data in `src/content.ts`; cover via `assets-src/covers/index.html?p=kayaba` + `render.mjs`; video via a new `assets-src/kayaba-video/` copied from `ambatuhelp-video`, using the screenshots in `Personal/kayaba/docs/revamp/` instead of a live capture, voiced with `assets-src/tts/gen.mjs`.

**Tech Stack:** TypeScript, Vitest, headless Chrome, Kokoro TTS, sharp (`pnpm assets`).

**Spec:** `docs/superpowers/specs/2026-11-22-kayaba-project-design.md`

## Global Constraints

- Not featured; the collapsed view stays `["solid", "chordefine", "ambatuhelp"]`.
- `github: "https://github.com/paullooll/kayaba-mobile"`, no `live`.
- Palette `{ accent: "#0038A8", bg: "#FAF8F3" }`; gold `#FCD116` never as text on cream.
- Result must say it is in development (MVP, Android first). No invented numbers.

## Review Focus

- Personal filter: shows only `kayaba`.
- "Show all" collapsed: KayaBa? absent; expanded: present as 04.
- Deep link `#project-kayaba` opens its case study.
- Haunt chat answers "kayaba?" with the project (existing haunt-brain matcher).
- Cover/poster `.webp` exists next to the `.png` (else card falls back).

---

### Task 1: Content entry + Personal tag

**Files:** Modify `src/content.ts` (Tag type, projects array), `src/lib/projects.ts` (FILTERS), Test `src/lib/projects.test.ts`, `src/lib/haunt-brain.test.ts`

- [ ] Tests: `ids("Personal")` → `["kayaba"]`; `ids("All")` length 4; collapsed unchanged; `projectIdFromHash("#project-kayaba", all)` → `"kayaba"`; haunt-brain `["kayaba?", "project"]`.
- [ ] Run `pnpm vitest run src/lib` → FAIL.
- [ ] Add `"Personal"` to `Tag` and `FILTERS`; add entry `id: "kayaba"`, `number: "04"`, `type: "Mobile app"`, `tags: ["Personal"]`, image `/projects/kayaba.png` 1920×1080, video `/projects/kayaba-demo.webm`.
- [ ] Run `pnpm vitest run` and `pnpm tsc --noEmit` → PASS.
- [ ] Commit `feat(projects): add KayaBa? personal project`.

### Task 2: Cover

**Files:** Modify `assets-src/covers/index.html`; add `assets-src/covers/kayaba-*.png|ttf`; output `public/projects/kayaba.png|webp`

- [ ] Add `kayaba` variant: cream bg, Cubao wordmark "KayaBa?", clay "₱ → hrs" chip motif, tilted phone with `home-light.png`.
- [ ] `node assets-src/covers/render.mjs kayaba` then `pnpm assets` → both files exist, PNG 1920×1080.
- [ ] Commit `feat(image): KayaBa? cover`.

### Task 3: Voiced demo video

**Files:** Create `assets-src/kayaba-video/` (index.html, lines.mjs, server.cjs, .gitignore from ambatuhelp-video); output `public/projects/kayaba-demo.webm`

- [ ] Scenes from revamp screenshots: intro → onboarding → add → detail (hours) → budget → wishlist → dark mode → outro "in development".
- [ ] `node assets-src/tts/gen.mjs af_heart <out> assets-src/kayaba-video/lines.mjs` → every line "ok".
- [ ] Record → webm ~30 s, audio present (ffprobe shows video+audio streams).
- [ ] Commit `feat(video): KayaBa? demo video`.

### Task 4: Verify in preview

- [ ] Personal filter, show all, open case study, video plays; no console errors.
