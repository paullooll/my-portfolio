# AmbatuHelp project data + demo video: short design

**Intent:** fill AmbatuHelp's portfolio entry from the real project (`Personal/Projects/cc206_chatbot_application`), as was done for SOLID and ChorDefine, and replace the screenshot with a narrated, motion-designed demo video.

**Goals:** real problem, role, features, result and stack; correct repo link (`paullooll/AmbatuHelp`); a ~30 s 1920×1080 voiced demo at `public/projects/ambatuhelp-demo.webm`.
**Non-goals:** component changes; a live link (none exists, stays placeholder).
**Anti-goals:** overstating the role (team final project for CC 206; owner designed the UI/UX); claiming TensorFlow (not used).

**Approaches:** (1) reuse the ChorDefine canvas renderer + Kokoro `gen.mjs`, with real screens captured from the Flutter web build: chosen, consistent with the other videos. (2) Screen-record the running app: rejected, chat can't reply without an API key and the result wouldn't match the edited style of the other videos.

**Decided:** screens captured from `build/web` at phone size; the streaming conversation is animated in the app's own style (not a live reply). Voice `af_heart`, scenes stretched to fit lines. Brand gold `#86730F`.
**Left to the builder:** scene count and exact copy.
