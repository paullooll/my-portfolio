# Richie Paul Aquiño — Developer Portfolio

Minimalist static portfolio for an early-career software & web developer. Single-page app with animated section switching, light/dark theme, and fully responsive layout.

## Features
- **Sections:** Home, About, Experience, Skills, Projects, Contact
- **Animations:** GSAP page transitions + hover lifts
- **Theme:** Light/Dark via `ThemeContext` + localStorage
- **Responsive:** Sidebar on desktop, slide-in drawer on mobile
- **Static-only:** No backend — `vite build` outputs to `dist/`

## Tech Stack
- **Framework:** React 19, TypeScript 5.6, Vite 7
- **Styling:** Tailwind CSS 4 + `@tailwindcss/vite`, custom CSS in `src/index.css`
- **Icons:** lucide-react
- **Animations:** GSAP 3, framer-motion (installed)
- **UI primitives:** Radix UI, shadcn/ui (`src/components/ui`)
- **Routing:** Local state `activeSection` (no router) — `wouter` kept for optional 404

## Folder Structure
```
/
├── public/
│   ├── light.png        # hero photo (313×234 box, object-fit:cover)
│   └── .gitkeep
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn components (button, card, tooltip…)
│   │   └── ErrorBoundary.tsx
│   ├── contexts/ThemeContext.tsx
│   ├── hooks/useMobile.tsx, usePersistFn.ts, useComposition.ts
│   ├── lib/utils.ts
│   ├── pages/Home.tsx   # all sections (HomeSection, AboutSection…)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css        # theme vars, layout, responsive rules
├── index.html
├── vite.config.ts       # alias @ → ./src
├── tsconfig.json
├── components.json
└── package.json
```

## Getting Started
**Prerequisites:** Node.js 18+

```bash
# install
pnpm install
# or npm install

# dev (http://localhost:3000)
pnpm dev

# type check
pnpm check

# build
pnpm build          # → dist/
pnpm preview        # serve dist/

# format
pnpm format
```

> Windows PowerShell may require: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

## Customization

**Hero photo:** `src/pages/Home.tsx:129` → `<img src="/light.png">` loads from `public/light.png`. Recommended ≥620×470px (4:3), JPG/PNG. Replace file or change `src` to URL. Box is ~313×234px (`note-illustration`, `object-fit:cover`).

**Name/Roles:** `src/pages/Home.tsx:436` sidebar-brand + `navItems` array.

**Experience/Education:** `ExperienceSection` in `src/pages/Home.tsx:199`. Education card uses `white-space: nowrap` for `"MIT / WVSU · Currently enrolled"` with span fallback on mobile.

**Skills:** `skillGroups` in `src/pages/Home.tsx:42`:
```ts
Languages, Frameworks & Platforms: HTML, CSS, JS, TS, PHP, Python, Dart, Flutter, React, TailwindCSS, NodeJS
Databases & Tools: MySQL, Firebase, VS Code, Antigravity, OpenCode, Manus, Git and Github
Currently Learning: Vite, NextJS, NestJS, Express, Docker, MongoDB, PostgreSQL, Google Colab
```

**About hobbies:** `AboutSection:188` grid of 4 cards — Currently listening / Gaming (`Gamepad2`) / Physical activities (`Dumbbell`) / Unwind & travel (`Plane`). Edit placeholder `<p>` text.

**Projects:** `projects` array in `src/pages/Home.tsx:60` — title, description, stack, color (`apricot/sage/lilac`).

**Socials:** `sidebar-socials` in `src/pages/Home.tsx:446` — order Facebook → Instagram → GitHub → LinkedIn. Update `href`s to your profiles.

**Contact:** `ContactSection` — form is frontend-only; wire to backend or keep mailto/links.

**Theme:** `ThemeProvider defaultTheme="light" switchable` in `src/App.tsx:9`. Colors in `src/index.css:20` `:root` / `.dark`.

## Deployment
Static output `dist/` deployable to Vercel, Netlify, Cloudflare Pages, GitHub Pages:
```bash
pnpm build
# upload dist/ or connect repo with build command `pnpm build` and output `dist`
```

## Scripts
| Script | Command |
|--------|---------|
| `dev` | `vite --host` |
| `build` | `vite build` |
| `preview` | `vite preview --host` |
| `check` | `tsc --noEmit` |
| `format` | `prettier --write .` |

## License
MIT
