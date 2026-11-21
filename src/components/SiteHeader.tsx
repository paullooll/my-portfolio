import { useEffect, useState } from "react";
import { Command, Download, Menu, Moon, Sun, X } from "lucide-react";
import content from "@/content";
import { useTheme } from "@/contexts/ThemeContext";
import { Gate } from "./Gate";
import { prefersReducedMotion } from "@/motion/reducedMotion";

/**
 * Theme switch with a circular reveal from the toggle (View Transitions API).
 * The class flips synchronously inside the transition; ThemeContext then
 * stores the same value. Falls back to an instant switch.
 */
function switchTheme(button: HTMLElement, toggle?: () => void) {
  if (!toggle) return;
  const flip = () => {
    document.documentElement.classList.toggle("dark");
    toggle();
  };
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  if (!doc.startViewTransition || prefersReducedMotion()) return flip();
  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  doc
    .startViewTransition(flip)
    .ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 520, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      )
    )
    .catch(() => {});
}

/** Section links in the header (Home is the brand link). */
const links = content.sections.filter(s => s.id !== "home");

/** Resume download. Hidden on the live site until `content.cv` is set. */
function ResumeButton({
  className = "",
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <Gate value={content.cv} as="span">
      <a
        className={`button button-sm button-primary ${className}`}
        href={content.cv}
        download="Richie-Paul-Aquino-CV.pdf"
        onClick={onClick}
      >
        <Download size={15} aria-hidden="true" /> Resume
      </a>
    </Gate>
  );
}

/** Sticky header: brand, section nav, theme toggle, resume, mobile menu. */
export function SiteHeader({
  onCvClick,
  onOpenPalette,
}: {
  onCvClick: () => void;
  onOpenPalette: () => void;
}) {
  const { toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  // Esc closes the mobile menu; so does widening the window past the breakpoint.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 821px)");
    const onWide = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="brand">
          <span className="brand-mark" aria-hidden="true">
            RPA
          </span>
          <span>{content.name}</span>
        </a>

        <nav className="nav" aria-label="Sections">
          <ul>
            {links.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.plain}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-button palette-trigger"
            onClick={onOpenPalette}
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Command size={16} aria-hidden="true" />
            <span className="palette-trigger-label mono" aria-hidden="true">K</span>
            <span className="sr-only">Open command palette (Ctrl+K)</span>
          </button>
          {/* Same markup in both themes (safe to prerender); CSS shows the right icon. */}
          <button
            type="button"
            className="icon-button theme-toggle"
            onClick={e => switchTheme(e.currentTarget, toggleTheme)}
          >
            <span className="when-dark">
              <Sun size={17} aria-hidden="true" />
              <span className="sr-only">Switch to light mode</span>
            </span>
            <span className="when-light">
              <Moon size={17} aria-hidden="true" />
              <span className="sr-only">Switch to dark mode</span>
            </span>
          </button>
          <ResumeButton className="resume-desktop" onClick={onCvClick} />
          <button
            type="button"
            className="icon-button menu-button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(o => !o)}
          >
            {open ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="drawer" hidden={!open}>
        <nav aria-label="Sections (mobile)">
          <ul>
            {links.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                  {s.plain}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ResumeButton onClick={onCvClick} />
      </div>
    </header>
  );
}
