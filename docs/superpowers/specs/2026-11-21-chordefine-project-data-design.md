# ChorDefine project data: short design

**Intent:** fill in ChorDefine's portfolio entry from the real project (`Personal/Projects/ChorDefine`), as was done for SOLID, so the case study stops showing placeholders.

**Goals:** a real problem, role, features and result; real screenshots; the APK as the live link; the repo the owner pushes to (`paullooll/ChorDefine`).
**Non-goals:** component changes, a demo video (none exists yet).
**Anti-goals:** overstating the role. It was a five-person thesis, and the role says so.

**Approaches:** (1) data only, reusing the existing 1920×1080 gallery: chosen, because every screenshot is already 1920×1080. (2) A phone-shaped gallery component: rejected, since the screenshots already show phone frames.

**Decided:** 5 screenshots (chord, fret, tuner, learn, progress) copied to `public/projects/chordefine-*.png` with WebP copies made with the same settings as `pnpm assets`. Text comes from the README and the code (YOLOv8 TFLite models, labels A–G, 12 fret zones).
**Left open:** `video` stays a placeholder (hidden on the live site) until a demo is recorded.
