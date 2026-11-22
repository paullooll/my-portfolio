# Designed project covers

**Why:** Card images were raw screenshots / a plain name card. Each project should get a
cover that looks made by a graphic designer, in the project's own colors.

## Decisions (approved)
- One matching series, 16:9, each in its project palette (see `palette` in `src/content.ts`).
- **SOLID** (black/green): wordmark + isometric line-art warehouse boxes on a faint grid. No screens (internal system).
- **ChorDefine** (cream/orange): pick logo, fretboard + chord-diagram + sound-wave motifs, one tilted phone with the real home screen.
- **AmbatuHelp** (dark brown/gold): glowing "An" mark, floating chat bubbles, one tilted phone with the real chat screen.
- Source: `assets-src/covers/index.html?p=<id>`, rendered by `assets-src/covers/render.mjs`
  (headless Chrome → `public/projects/<id>.png`), then `pnpm assets` makes the `.webp`.
- Case-study video posters are the same file, so they change too.

## Approaches
1. HTML/CSS covers rendered headless (picked): editable, reuses existing Chrome + sharp tooling.
2. Hand-made in a design tool: not reproducible from the repo.
3. Generated images: can't use the real logos/screens faithfully.
