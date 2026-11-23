# AmbatuHelp Project Data + Demo Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Real AmbatuHelp case study and a narrated ~30 s demo video.
**Architecture:** Copy the ChorDefine canvas renderer (`assets-src/chordefine-video/`) to `assets-src/ambatuhelp-video/`, swap scenes and assets; reuse `assets-src/tts/gen.mjs` with a lines file per project.
**Tech Stack:** Canvas 2D + WebCodecs + webm-muxer, kokoro-js, sharp, Flutter web build.
**Spec:** `docs/superpowers/specs/2026-11-21-ambatuhelp-project-data-design.md`

## Global Constraints
- 1920×1080, 30 fps, webm, voice `af_heart`, brand gold `#86730F`.
- Repo link `https://github.com/paullooll/AmbatuHelp`; no TensorFlow in stack.

## Review Focus
- Video plays in the case-study dialog (same path as ChorDefine) — check in the preview.
- Voice lines never overlap the next scene — `gen.mjs` reports TOO LONG.
- Dark/light screens readable at phone size inside the mockup.

---

### Task 1: Capture screens
- [ ] Serve `build/web` (launch config `web-build` in the chatbot repo), viewport 412×915, capture landing, login, chat empty, chat drawer, settings, FAQ, profile (light + dark chat) as PNG into `assets-src/ambatuhelp-video/screens/`.

### Task 2: Voice
- [ ] Make `gen.mjs` take the lines module as an arg (`node gen.mjs <voice> <out> <lines.mjs>`), keep ChorDefine lines as default; add `assets-src/ambatuhelp-video/lines.mjs`.
- [ ] Run; every line reports `ok`; `timing.json` written to `assets-src/ambatuhelp-video/voice/`.

### Task 3: Video
- [ ] `assets-src/ambatuhelp-video/index.html`: scenes = title, problem, landing/login, streaming chat (animated in-style), markdown/code + actions, history + themes, settings/FAQ/profile, outro. Render via `/save` to `out/ambatuhelp-demo.webm`, copy to `public/projects/`.
- [ ] Check: ffprobe duration ≈ timing length, audio stream present; spot-check frames.

### Task 4: Content
- [ ] Update `src/content.ts` ambatuhelp entry (problem, role, features, result, stack, github, video). Run `pnpm test` and `pnpm build`; open the dialog in preview and confirm video plays. Commit.
