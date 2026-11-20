# Richie Paul Aquiño — Portfolio ("Signal")

A single-page portfolio with a minimal "mission control" look: monochrome, lots of white space, rounded cards, and one mint accent used only for live/active things. Dark by default, with a light/dark toggle. **Haunt**, an original pixel ghost, answers visitors' questions in a small chat.

- **Sections:** Home (hero + status chips) · Projects (filters + case studies) · Skills · Experience · About (+ Now / Learning) · Contact
- **Extras:** Haunt chat (offline, answers only from `content.ts`; can be wired to an AI endpoint), a hidden playable world (easter egg)

## Run it

Requires Node.js 20.19+ (Vite 7) and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000 (shows [TODO] markers)
pnpm test       # unit tests (Vitest)
pnpm check      # TypeScript
pnpm build      # production build + prerender → dist/
pnpm preview    # serve dist/ locally
pnpm assets     # regenerate WebP images and the OG image
```

> Windows PowerShell may need: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

## Editing content

**Everything you'd want to change lives in [`src/content.ts`](src/content.ts):** hero text and status chips, projects and case studies, skills, timeline, Now/Learning, hobbies, links, and Haunt's greeting and suggested questions.

### Hide until filled

Any value set to `PLACEHOLDER` (`"[TODO]"`) is:

- **shown in `pnpm dev`** with a dashed orange `[TODO]` marker, so you can see what's missing;
- **hidden on the live site** (`pnpm build`);
- **listed as a warning** at the end of every `pnpm build`.

Don't invent numbers or results: leave `PLACEHOLDER` until you have real ones.

**Resume:** put your PDF in `public/` (e.g. `public/cv.pdf`) and set `cv: "/cv.pdf"` in `content.ts`. The header "Resume" button appears automatically.

### Government / internal projects

Projects with `private: true` never show real screenshots, URLs, names or data. Their cards and case studies use a generic, data-free mock preview (`src/components/MockPreview.tsx`). Keep real screenshots of internal systems in `private-assets/` (git-ignored, never deployed), not in `public/`.

## Haunt chat

By default Haunt answers **offline** with a small intent matcher over `content.ts` (`src/lib/haunt-brain.ts`). It never invents facts, skips anything still `[TODO]`, and says "I don't know" otherwise.

To make it a real AI chatbot, deploy your own endpoint (for example a serverless function that calls an LLM with `content.ts` as context) and set `VITE_HAUNT_API_URL`. The page POSTs `{ question, history }` and expects `{ text, links? }`. On any error it falls back to the offline answers. Keep API keys on the server.

## Environment variables

Copy `.env.example` to `.env` for local use, or set these in your host's dashboard:

| Variable                    | What it does                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `VITE_WEB3FORMS_ACCESS_KEY` | Contact form delivery ([web3forms.com](https://web3forms.com), free).                                      |
| `VITE_SITE_URL`             | Your live URL, e.g. `https://richie.dev`. Enables canonical URL, `sitemap.xml`, absolute Open Graph image. |
| `VITE_ANALYTICS_ENDPOINT`   | Umami analytics host (privacy-friendly, optional).                                                         |
| `VITE_ANALYTICS_WEBSITE_ID` | Umami website ID. Analytics loads only when both are set.                                                  |
| `VITE_HAUNT_API_URL`        | Optional AI endpoint for Haunt (see above).                                                                |

Tracked analytics events: `cv-download`, `message-sent`.

## Deploy

Build command `pnpm build`, output directory `dist`. SPA rewrites for the custom 404 are already included (`vercel.json`, `public/_redirects`).

**Vercel:** import the repo at vercel.com/new → framework "Vite" (auto-detected) → add the env vars above → Deploy.

**Netlify:** "Add new site" → import the repo → build `pnpm build`, publish `dist` → add the env vars → Deploy.

After the first deploy, set `VITE_SITE_URL` to the real URL and redeploy so the sitemap and social preview use it.

## How it's built

- **Stack:** React 19, TypeScript, Vite 7, wouter, sonner, lucide-react. Plain CSS with design tokens (`src/styles/tokens.css`); no animation library.
- **Prerendered:** `scripts/prerender.mjs` renders the page to static HTML at build time; React hydrates it.
- **Lazy by default:** Haunt's chat loads after the page is idle; the hidden world only when someone finds it.
- **Motion:** one small IntersectionObserver fade-in (`src/motion/useReveal.ts`), hover lifts, and dialog/chat entrances. Nothing autoplays; everything respects `prefers-reduced-motion`.
- **Accessibility:** semantic landmarks, skip link, visible focus, native `<dialog>` for case studies (focus trap, Esc, focus return), labelled filters (`aria-pressed`), live regions for filter results and chat replies, AA contrast checked by `src/lib/contrast.test.ts`.
- **SEO:** `scripts/vite-portfolio-plugin.ts` injects meta, Open Graph/Twitter tags and Person JSON-LD, and emits `robots.txt` / `sitemap.xml`.
- **Fonts:** IBM Plex Sans (body) and IBM Plex Mono (labels), self-hosted and preloaded. The pixel fonts only load inside the hidden world.

```
src/
  content.ts            ← all content
  sections/             ← Hero, Projects, Skills, Experience, About, Contact + sections.css
  components/           ← header, section frame, project card/media, case-study dialog, mock preview, Gate
  components/haunt/     ← Haunt's sprite and chat
  game/                 ← the hidden world (lazy-loaded)
  lib/                  ← pure logic, unit-tested (projects filter, Haunt brain/client, placeholders…)
  motion/               ← reveal + reduced-motion helpers
  styles/               ← tokens, fonts, base, components, game
scripts/                ← asset pipeline, prerender, SEO plugin
```

## Content checklist

- [ ] Resume PDF in `public/` + `cv` in `content.ts`
- [ ] Production domain → `VITE_SITE_URL`
- [ ] Per project: problem, result, extra screenshots or demo video, live links (`projects[].caseStudy`, `live`)
- [ ] Now / Learning: a short note per topic and an "updated" date (`now`)
- [ ] Spotify playlist link (`hobbies[0].link`)
- [ ] Web3Forms key and (optional) Umami env vars in the host

<details>
<summary>Easter egg (spoilers)</summary>

Type the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) or type `haunt` anywhere outside a form field. Walk Haunt into a door to jump to that section; collect all five soul orbs for an achievement. Esc exits. Asking Haunt about "secrets" in the chat gives a hint.

</details>

## License

MIT. Fonts: SIL Open Font License. Haunt is an original character.
