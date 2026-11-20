# Retro Command Center Portfolio: Design

Date: 2026-11-20 · Branch: `contacts-tab` · Status: draft for approval

## 1. Intent and why

Richie Paul Aquiño (goes by Paul) is a Junior Fullstack Developer at the Iloilo City
Government and a first-year Master in IT student at West Visayas State University. The
portfolio exists to **get him hired or noticed for web/software roles**. The current site is
a clean but generic minimalist template. The redesign must make an employer remember it,
without making it any harder to find his projects, CV, and contact details.

Concept (chosen by Paul): **a retro game, styled as a mission-control console.** The site
reads like the command center of an old console game: pixel headings, a HUD with player
stats, projects as "missions", skills as a tech tree. An original ghost mascot, **Haunt**,
guides visitors. Under the skin it is still a normal, skimmable, scrolling web page. A
playable top-down world is hidden as the Easter egg.

## 2. Goals, non-goals, anti-goals

**Goals**
- A recruiter can see who Paul is, open a project, and download the CV within ~10 seconds.
- Distinctive look and motion that does not resemble a template.
- Every section from the brief: hero, about, featured projects, skills, experience and
  education timeline, certifications, impact numbers, testimonials, learning log, contact,
  Easter egg.
- Lighthouse 90+ on Performance, Accessibility, Best Practices, and SEO (mobile run).
- WCAG AA, full keyboard navigation, `prefers-reduced-motion` honoured.
- All content lives in one data file so Paul can edit it without touching layout.

**Non-goals**
- No backend, CMS, or blog engine. The learning log is a static array.
- No framework change (stays React + Vite).
- No sound in this version.
- No real Pokémon assets or names anywhere.

**Anti-goals** (failures even if everything "works")
- Game gimmicks that stand between a visitor and the content: a forced intro, a mascot
  blocking text, or navigation that only works inside the game.
- Body text set in a pixel font, or contrast below AA.
- Invented employers, awards, numbers, or testimonials. Unknowns are always `[REPLACE ME]`.
- A mascot that reads as a Gengar copy (same silhouette, spikes, red eyes, purple body).

## 3. Constraints

- Keep the stack: React 19, TypeScript, Vite 7, Tailwind 4, GSAP 3, wouter, sonner,
  lucide-react, pnpm.
- Keep **all** existing content: the 4 projects (text, images, GitHub links, private
  flags), the experience and education entries, the skills, the 4 hobby cards (including the
  Spotify placeholder), the contact links, the social links (Facebook, Instagram, GitHub,
  LinkedIn), and the Web3Forms contact form with `VITE_WEB3FORMS_ACCESS_KEY`.
- Keep the Umami analytics hook already in `index.html` (`VITE_ANALYTICS_ENDPOINT`,
  `VITE_ANALYTICS_WEBSITE_ID`). It must not break the build or page when those are unset.
- Static output only (`dist/`), deployable to Vercel or Netlify.
- 60 fps on mid-range phones: animate transform and opacity only, pause offscreen canvases,
  cap canvas devicePixelRatio at 2.

## 4. Approaches considered

| Decision | Options | Picked | Why |
|---|---|---|---|
| How game-like | A. Game-skinned scrolling site · B. Playable world as the whole site | **A** (Paul) | Recruiters must skim fast. B becomes the Easter egg (Paul). |
| Mascot | Gengar itself · original Gengar-inspired ghost | **Original "Haunt"** (Paul) | Gengar is Nintendo/Game Freak IP. Paul asked to keep Gengar only as inspiration. |
| Framework | Keep React + Vite · move to Astro or Next | **Keep** (my call, Paul did not object) | Already meets the targets. A migration adds risk for no visible gain. |
| Mascot rendering | Hand-built SVG pixel sprite + GSAP · PNG sprite sheet · Lottie | **SVG + GSAP** (my call) | Tiny, sharp at any size, themeable with CSS variables. No outside art tool needed. |
| Easter-egg engine | Plain canvas, lazy-loaded · Phaser or Kaplay | **Plain canvas** (my call) | About 10 KB and loaded only on trigger. Engines add 200 KB to 1 MB. |
| Fonts | Pixel everywhere · pixel display + readable body | **Pixel display + readable body** (my call) | Readability and AA. |
| Navigation model | Current section-swap · single scrolling page | **Single scrolling page** (my call) | Scroll reveals, deep links, SEO, and skimmability all need it. |

## 5. Decided design

### 5.1 Structure and code organisation
- `src/content.ts` holds all text, projects, skills, timeline, certifications, stats,
  testimonials, learning log, links, and Haunt's lines. It is typed, and every unknown value
  is the literal string `"[REPLACE ME]"` (or a clearly marked placeholder object).
- `src/sections/*`: one component per section. `src/components/*`: HUD, Haunt, DialogueBox,
  CustomCursor, BootIntro, RadarCanvas, TiltCard, MagneticButton, AchievementToasts.
- `src/game/*`: the Easter-egg world. It is imported only through a dynamic `import()`.
- `src/pages/Home.tsx` becomes a thin page that renders the sections in order.
- `src/pages/NotFound.tsx` becomes a custom 404 served through wouter.
- The unused shadcn components in `src/components/ui` stay in place. Tree-shaking already
  keeps them out of the bundle (my call).

### 5.2 Page layout (top to bottom)
Each section has a game label and a plain label, and **the plain label is always visible**
(for example "MISSIONS · Projects") so nobody has to decode the theme.

| # | Game label | Plain label | Content |
|---|---|---|---|
| 0 | HUD (sticky top bar) | Navigation | Name, "LVL 1 · Grad Student", section links, theme toggle, CV button, "Open to work" badge. Collapses to a menu on mobile. |
| 1 | START | Hero | Name, typed role line, one-line value statement, `▶ VIEW MISSIONS` and `⬇ DOWNLOAD CV`, radar canvas, Haunt's welcome. |
| 2 | PLAYER PROFILE | About | Short story, photo (`/light.png`), "Now training" (AI, cloud computing, cybersecurity, data mining, IT project management), existing 4 hobby cards shown as "Side quests". |
| 3 | STATS | Impact numbers | Animated counters: projects shipped (4, from the existing list), years of experience (`[REPLACE ME]`), users served (`[REPLACE ME]`). |
| 4 | MISSIONS | Featured projects | 4 case studies with filters. |
| 5 | TECH TREE | Skills | Grouped skill nodes. |
| 6 | QUEST LOG | Experience & education | Animated vertical timeline. |
| 7 | ACHIEVEMENTS | Certifications, awards, trainings | Magna Cum Laude (from the existing education text) plus `[REPLACE ME]` slots. |
| 8 | PARTY REVIEWS | Testimonials | 2 to 3 placeholder cards, all `[REPLACE ME]`. |
| 9 | DEV LOG | Learning log | 3 short static entries with date, title, and a one-line note, all `[REPLACE ME]`. |
| 10 | TRANSMISSION | Contact | Existing form and links, "Open to work" badge. |
| – | footer | | Socials, ©, and a faint hint: "psst… try the Konami code". |

### 5.3 Visual system

**Themes.** Dark is the default ("night shift console"). Light is "daylight terminal". The
toggle sits in the HUD and is saved to localStorage through the existing `ThemeContext`. The
first visit follows `prefers-color-scheme` (my call).

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#0B0D17` | `#F1EEE4` |
| `--surface` | `#141831` | `#FFFFFF` |
| `--line` | `#2A3060` | `#C9C3B2` |
| `--ink` | `#E8EAF4` | `#15172B` |
| `--ink-muted` | `#9AA0C3` | `#4D5170` |
| `--accent` (primary, Haunt's eyes) | `#A6FF4D` acid green | `#2E7A14` |
| `--warn` (amber, secondary) | `#FFB547` | `#8F5200` |
| `--danger` | `#FF5D73` | `#B3122E` |
| `--haunt-body` | `#2B2457` deep indigo | `#E7E3FA` pale, with an `--ink` outline |

The hex values are starting points. The builder must verify AA contrast (4.5:1 for body
text, 3:1 for large text and UI) and adjust where needed.

**Typography** (Google Fonts, `display=swap`, preconnected):
- Display: **Press Start 2P**, used only for H1 and H2 and short HUD labels, kept small with
  generous letter-spacing.
- Terminal/HUD: **VT323**, for meta labels, counters, tags, and the typed role line.
- Body: **IBM Plex Sans** (400/500/600) for all paragraphs and form text.
- This replaces DM Sans, DM Mono, and Fraunces.

**Texture.** CRT scanlines (a CSS repeating gradient) and an SVG noise grain overlay at about
4% opacity, with `pointer-events: none`. Panels have pixel-stepped corners
(clip-path or `border-image`), not rounded cards. A low-opacity gradient-mesh glow in
accent and indigo sits behind the hero.

**Custom cursor.** A pixel crosshair that grows over interactive elements. Shown only when
`(pointer: fine)`. The native cursor stays on form fields. Disabled under reduced motion.

### 5.4 Haunt, the mascot
- **Design:** an original pixel ghost about 24×24 logical pixels, drawn as an SVG `<rect>`
  grid. It has a round body that tapers into a wispy, wavy tail (no legs, no spikes, no ears),
  a wide toothy grin, and two glowing `--accent` eyes. The body uses `--haunt-body`, and its
  edges glitch occasionally (a 1 to 2 px offset flicker). Inspired by Gengar's grin and
  mischief only.
- **States:** idle float (bob loop), talk (mouth frames), wave, point (left/right), phase
  (fades through dividers), surprised, and sleep (used on the 404 page). Eyes track the cursor
  slightly on desktop.
- **Placement:** fixed bottom-right on desktop (about 72 px). On mobile it is smaller and
  sits bottom-left, clear of the browser UI. It must never cover the main text column or form
  fields.
- **Dialogue:** a retro dialogue box beside Haunt shows a contextual line when a section
  enters view (one line per section, from `content.ts`). Lines are short, cheeky, and helpful
  (for example "Boo! Missions are this way →"). Each line shows once per visit, auto-hides
  after about 6 s, and can be dismissed with ✕ or Esc. A HUD toggle "Guide: on/off" is saved
  to localStorage.
- **Accessibility:** Haunt is decorative (`aria-hidden`), and dialogue lines sit in a polite
  live region **only** when the visitor opens them by clicking Haunt. Scroll-triggered lines
  are not announced. Under reduced motion Haunt stays still (no bob or glitch), and lines
  appear without typing.

### 5.5 Motion (GSAP + ScrollTrigger; framer-motion is not used)
- **Boot intro:** about 2 s. A boot log prints a few lines, then Haunt pops in, then
  "PRESS START" blinks, then it wipes away to the page. Any key, click, or tap skips it, and a
  visible "Skip" button is focusable. It shows once per browser session (sessionStorage) and
  is skipped entirely under reduced motion. The page renders underneath at the same time, so
  the intro is a removable overlay, not a gate.
- **Smooth scroll:** native CSS `scroll-behavior: smooth` for anchor links. No Lenis
  (my call, to save a dependency).
- **Section transitions:** as each section enters, its panel does a short pixel "screen
  wipe" (a stepped clip-path reveal), then children stagger-reveal (opacity and y).
- **Hero canvas:** a radar sweep with pixel blips and a slow drifting particle grid. It
  pauses when offscreen or the tab is hidden, and renders a static frame under reduced
  motion.
- **Typed role line:** cycles through "Junior Fullstack Developer", "Web developer @ Iloilo
  City Gov", and "MIT student @ WVSU", with a blinking block caret. Screen readers get the
  static first line.
- **Hover:** magnetic primary buttons; 3D tilt on mission cards (max about 6°, desktop only);
  screenshot preview zoom and scanline sweep on project hover.
- **Counters:** count up once when STATS enters view. Unfilled stats are hidden in
  production (see 5.13).
- **Tech tree:** nodes connect with lines that draw in (SVG stroke-dashoffset) on enter.
- **Timeline:** the spine line draws down as you scroll (scrub), and entries slide in.
- **Achievement toasts** (sonner, restyled): "Achievement unlocked" fires once each for
  reaching Missions, downloading the CV, sending a message, toggling the theme, and finding
  the Easter egg. Collected toasts are kept in localStorage, and the count appears in the HUD.
- **Reduced motion:** every effect above falls back to an instant final state.

### 5.6 Missions (projects)
- Filters: All · Web · Mobile · AI/Data · Government, as a toolbar with
  `aria-pressed` toggle buttons (not tabs, my call). A project can carry several tags:
  - AmbatuHelp: Mobile, AI/Data
  - Budget Tracker: Web, Government
  - ChorDefine: Mobile, AI/Data
  - SOLID: Web, Government
- Each mission card shows the screenshot, title, type, stack, and links: GitHub where it
  exists, "Classified" (lock) where the project is private, and a live link if one is added.
- Clicking a card opens a **case-study dialog** (accessible modal, focus-trapped, Esc
  closes, deep-linkable as `#mission-solid`) with: Problem, My role, Tech stack, Key features,
  Outcome, screenshots or video, and links. Fill-in rules:
  - **My role** comes from the existing description text.
  - **Problem** may be drawn from the existing description where it states one (for
    example Budget Tracker's "allows the City Budget to overview…"). Otherwise
    `[REPLACE ME]`.
  - **Key features** come from the existing description (for example SOLID: RBAC, JWT auth,
    database design). Anything else is `[REPLACE ME]`.
  - **Outcome** is always `[REPLACE ME]`.
- Screenshots get converted to WebP (keeping the originals), served with width and height
  set, and lazy-loaded. Optional demo video slot (`[REPLACE ME]`, muted, plays on hover
  only, poster image).

### 5.7 Tech tree (skills)
The existing skills are regrouped into the brief's six groups. Each node has a state:
**Unlocked** (in use today) or **Training** (from the existing "Currently Learning" list).
There are no percentage bars, because they imply mastery claims Paul hasn't made. The
existing intro line "A growing toolkit, not a list of claimed mastery" stays.

| Group | Unlocked | Training |
|---|---|---|
| Frontend | HTML, CSS, JavaScript, TypeScript, React, TailwindCSS, Flutter, Dart | Vite, NextJS |
| Backend | NodeJS, PHP, Python | NestJS, Express |
| Database | MySQL, Firebase | MongoDB, PostgreSQL |
| DevOps / Cloud | Git and GitHub | Docker |
| Security | RBAC and JWT authentication (demonstrated in SOLID) | `[REPLACE ME]` |
| Tools | VS Code, Antigravity, OpenCode, Manus | Google Colab |

Note: SOLID's stack lists NestJS, NextJS, and PostgreSQL even though the skills list marks
them as "Currently Learning". Both are kept as written. Paul can promote them later.

### 5.8 Quest log (timeline), from existing content
- Present: Junior Fullstack Developer, Iloilo City Government, Aug 2025 to present.
- Jan to Apr 2025: Software Development Intern, Warp Prometheus.
- Present: Master in Information Technology, WVSU, Year 1.
- Completed: BS Information Technology, Magna Cum Laude, WVSU (year `[REPLACE ME]`).

### 5.9 Contact
- Keep the Web3Forms flow and error handling, restyled as a "transmission" console. Field
  labels stay plain. A honeypot field is added (Web3Forms `botcheck`).
- Keep the email, LinkedIn, and GitHub links.
- The "Open to work" badge appears here and in the HUD.

### 5.10 Easter egg: the playable world
- **Triggers:** the Konami code (↑↑↓↓←→←→BA), typing `haunt` anywhere outside a field, or
  tapping Haunt 5 times (so mobile can reach it).
- It opens a full-screen canvas overlay, loaded through dynamic `import()`. The world is a
  small top-down pixel "HQ town" with about 5 buildings, one each for Missions, Tech Tree,
  Quest Log, Achievements, and Transmission.
- The player controls Haunt with arrow keys or WASD (on-screen D-pad on touch). Walking into
  a door shows a dialogue card summarising that section and a "Go there" button that closes
  the game and scrolls to the section.
- There is one collectible (about 5 "soul orbs"). Collecting all of them fires an
  achievement.
- Esc or ✕ exits and returns focus to where it was. The game is fully optional, and nothing
  important exists only inside it.

### 5.11 SEO, performance, quality
- `index.html`: title, description, canonical, Open Graph and Twitter tags,
  `theme-color`, and Person JSON-LD (name, jobTitle, worksFor: Iloilo City Government,
  alumniOf: WVSU, sameAs: GitHub and LinkedIn, url `[REPLACE ME]`). Remove
  `maximum-scale=1` from the viewport tag (it blocks zoom and fails accessibility).
- `public/og-image.png` (1200×630): Haunt, the name, and the role on the console background.
  The builder may generate it from an SVG at build time or hand-export it once.
- `public/robots.txt` and `public/sitemap.xml` use domain `[REPLACE ME]`.
- CV: the button shows only once `cv` in `content.ts` points at a real file in `public/` (see 5.13).
- Analytics: load the Umami script only when both env vars are set, and track the CV download
  and form send as events.
- 404: a custom NotFound with sleeping Haunt and "GAME OVER · Continue?" linking home.
  Add host rewrites (`vercel.json` / `public/_redirects`) so unknown paths reach the SPA 404.
- Fonts: preconnect, `display=swap`, and only the needed weights.
- README: rewritten with how to run, how to edit `content.ts`, deploy steps (Vercel and
  Netlify), and the content checklist.

### 5.12 Build order
1. Layout: single scrolling page, `content.ts`, all sections with real content and
   placeholders.
2. Design system: tokens, fonts, panels, both themes, AA check.
3. Haunt and the dialogue system.
4. Motion: intro, ScrollTrigger reveals, hero canvas, hovers, counters, toasts.
5. Easter-egg world.
6. Polish: SEO, OG image, 404, analytics, performance pass (Lighthouse), README.

## 5.13 Settled after review (my calls unless marked)
- **Name and voice:** the display name is "Richie Paul Aquiño" (hero, meta title, JSON-LD,
  OG image). First-person copy keeps "Richie" as the current site does. Existing paragraphs are
  kept word for word. New copy the design needs (value statement, section headings, Haunt's
  lines) is written by the builder, makes no claims beyond the existing content, and lives in
  `content.ts` for Paul to review.
- **Branching:** build on a new branch `retro-redesign` cut from `contacts-tab`, one commit
  per build-order step, shipped as one PR. Intermediate steps don't need to be deployable.
- **Dependencies:** dev-only packages are allowed for asset work. Use `sharp` in a one-off
  script (`scripts/build-assets.mjs`) to make WebP screenshots and the OG PNG, and commit the
  outputs. No new runtime dependencies.
- **Routing:** wire wouter in `App.tsx`: `/` goes to Home, everything else to NotFound.
- **Haunt interaction:** the SVG stays `aria-hidden`. A separate visually labelled button
  ("Talk to Haunt") is the focusable trigger.
- **Canonical URL:** read from `VITE_SITE_URL` and omitted when unset, so an unset domain
  never fails SEO.
- **Theme default:** follow `prefers-color-scheme` on first visit. Dark is the fallback.
- **Boot intro:** must not delay the hero's largest-paint element. The hero renders
  underneath, and the overlay is checked in the Lighthouse pass.
- **Placeholders in production (Paul's call): hide until filled.** In production builds,
  any section, stat, card, or button whose content is still `[REPLACE ME]` is not rendered:
  testimonials, learning log, unfilled stats, unfilled case-study fields, the CV button and its
  achievement, and the Easter-egg doors for hidden sections. Nav links to hidden sections hide
  too. In `pnpm dev` they render with a visible dashed "[REPLACE ME]" marker so Paul can see
  what's missing. `pnpm build` prints a list of the unfilled fields as a warning (it does not
  fail). Filling a field in `content.ts` makes it appear with no other change. A missing CV is
  detected by `cv` being unset in `content.ts`, not by checking for a file.

## 6. Left to the builder
- Exact pixel art for Haunt and the world tiles, within the rules in 5.4.
- Exact easing, durations, and stagger values.
- Final hex tweaks needed to pass AA.
- Internal component APIs and file names beyond those listed.
- Whether to add a small test setup (Vitest is already a dev dependency) for
  `content.ts` shape and the Easter-egg key-sequence detector.

## 7. Content checklist (for Paul)
- [ ] CV PDF (put it in `public/` and set `cv` in `content.ts`)
- [ ] Production domain (canonical, sitemap, Open Graph, JSON-LD)
- [ ] Years of experience and users served (STATS)
- [ ] Per project: problem, outcome, more screenshots or demo video, live links
- [ ] Certifications, awards, trainings
- [ ] Testimonials (name, role, quote, with permission)
- [ ] Learning log entries
- [ ] Security skills in training
- [ ] BSIT graduation year
- [ ] Spotify playlist link (side quest card)
- [ ] Umami endpoint and website ID; Web3Forms key in host env vars
