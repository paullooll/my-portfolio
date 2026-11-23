# Project Media Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drop Budget Tracker and frame each project image in its own palette.

**Architecture:** A `palette` field on `Project` becomes two CSS custom properties on the card; existing `.project-media` rules read them with theme-token fallbacks.

**Tech Stack:** React, TypeScript, plain CSS, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-22-project-media-polish-design.md`

## Global Constraints
- Palettes: SOLID `#3ddc84`/`#0b0b0b`, ChorDefine `#c2410c`/`#fdf7f2`, AmbatuHelp `#c9a227`/`#1a160c`.
- No new components, no image re-exports.

## Review Focus
- A project with no palette keeps today's look (fallback to `--line` / `--accent`).
- Dark theme: frames still read against the dark card.
- Peek pill text stays legible on the gold/green accents.

---

### Task 1: Remove Budget Tracker

**Files:** Modify `src/content.ts`, `src/lib/projects.test.ts`, `src/lib/haunt-brain.test.ts`

- [ ] Update tests: `ids("Work")` → `["solid"]`; collapsed All → `["solid","chordefine","ambatuhelp"]`; routing case `"ambatuhelp?"` → `"project"`; drop the budget-tracker "no public screenshots" assertion.
- [ ] Run `npx vitest run` → FAIL.
- [ ] Delete the budget-tracker entry; ChorDefine `number: "02"`, AmbatuHelp `number: "03"`, `featured: true`.
- [ ] Run `npx vitest run` → PASS. Commit.

### Task 2: Per-project palette frame

**Files:** Modify `src/content.ts`, `src/components/ProjectCard.tsx`, `src/sections/sections.css`, `src/styles/fx.css`

**Interfaces:** Produces `Project.palette?: { accent: string; bg: string }`; CSS vars `--p-accent`, `--p-bg` on `.project`.

- [ ] Add the field and the three palettes.
- [ ] `ProjectCard` sets `style={{"--p-accent": …, "--p-bg": …}}` when a palette exists.
- [ ] CSS: media `object-fit: contain`, `background: var(--p-bg, transparent)`, border mixed from `--p-accent`; hover glow and `.project-peek` use `var(--p-accent, var(--accent))`.
- [ ] Verify in the browser preview (light + dark), `npx tsc --noEmit`, `npx vitest run`. Commit.
