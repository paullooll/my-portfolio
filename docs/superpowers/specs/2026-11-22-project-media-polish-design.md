# Project media polish + remove Budget Tracker

**Why:** Budget Tracker has no media and isn't worth showing; the remaining
cards' images sit in a generic grey frame (ChorDefine's white shot melts into
the card, SOLID's 16:10 shot gets cropped). Each card should feel like its
own project.

## Goals
- Remove Budget Tracker from content and tests.
- Keep a full row of three featured cards: AmbatuHelp becomes featured, numbered 03.
- Each card's media frame uses that project's own palette.

## Non-goals
- Re-exporting or recoloring the PNGs.
- New components.

## Approaches
1. **Per-project palette in data + CSS variables (picked).** One `palette` field, frame styled from it.
2. Re-export images with new backgrounds: redone on every image change.
3. Hard-code colors per project id in CSS: data and style drift apart.

## Design
- `Project.palette?: { accent: string; bg: string }` in `src/content.ts`.
  - SOLID `#3ddc84` / `#0b0b0b`, ChorDefine `#c2410c` / `#fdf7f2`, AmbatuHelp `#c9a227` / `#1a160c`.
- `ProjectCard` sets `--p-accent` / `--p-bg` on the card.
- `.project-media` image: `object-fit: contain` on `--p-bg`, 1px accent-tinted border,
  accent glow on hover; the "View case study" pill uses the accent.
- Falls back to the current theme tokens when a project has no palette.

## Builder's calls
- Exact tint strengths (border/glow mix percentages).
