import { Suspense, lazy, useRef } from "react";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";
import content, { type SectionId, type Social } from "@/content";
import { SiteHeader } from "@/components/SiteHeader";
import { useAchievements } from "@/hooks/useAchievements";
import { useAfterLoad } from "@/hooks/useAfterLoad";
import { useEasterEgg } from "@/hooks/useEasterEgg";
import { track } from "@/lib/analytics";
import { useReveal } from "@/motion/useReveal";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";

// Haunt's chat loads after the page is idle; the hidden world only when found.
const HauntChat = lazy(() =>
  import("@/components/haunt/HauntChat").then(m => ({ default: m.HauntChat }))
);
const HauntWorld = lazy(() => import("@/game/HauntWorld"));

const socialIcons: Record<Social["icon"], typeof Github> = {
  facebook: Facebook,
  instagram: Instagram,
  github: Github,
  linkedin: Linkedin,
};

/** The single scrolling page. Every section reads from src/content.ts. */
export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const { unlock } = useAchievements(); // only the hidden world awards these
  const egg = useEasterEgg();
  const extras = useAfterLoad();
  useReveal(mainRef);

  const goTo = (id: SectionId) => {
    egg.closeGame();
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
      const h = el?.querySelector<HTMLElement>("h1, h2");
      h?.setAttribute("tabindex", "-1");
      h?.focus({ preventScroll: true });
    });
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader onCvClick={() => track("cv-download")} />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <About />
        <Contact onSent={() => track("message-sent")} />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="mono muted">
            © 2026 {content.name} · {content.location}
          </p>
          <ul className="socials">
            {content.socials.map(s => {
              const Icon = socialIcons[s.icon];
              return (
                <li key={s.label}>
                  <a
                    className="icon-button"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${content.shortName} on ${s.label}`}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </footer>
      {extras && (
        <Suspense fallback={null}>
          <HauntChat />
        </Suspense>
      )}
      {egg.open && (
        <Suspense
          fallback={<div className="world-loading">Loading world…</div>}
        >
          <HauntWorld onClose={egg.closeGame} onGoTo={goTo} onUnlock={unlock} />
        </Suspense>
      )}
    </>
  );
}
