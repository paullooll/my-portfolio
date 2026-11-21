import { useEffect, useRef } from "react";
import {
  createParticles,
  linkAlpha,
  particleCount,
  step,
  type Particle,
} from "@/fx/constellation";
import { hasFinePointer, prefersReducedMotion } from "@/motion/reducedMotion";

const LINK = 120; // px between particles
const CURSOR_LINK = 170; // px from the cursor
const GLOW = 260; // cursor glow radius

/** Read the live theme colors from CSS custom properties. */
function readColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    accent: s.getPropertyValue("--accent").trim() || "#3ddc97",
    ink: s.getPropertyValue("--ink").trim() || "#ededef",
  };
}

/** "#rrggbb" + alpha → "rgba(...)". Falls back to the input for other formats. */
function rgba(hex: string, a: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

/**
 * Full-page canvas of drifting dots joined by thin lines, with links and a soft
 * glow toward the cursor. Purely decorative (aria-hidden, no pointer events).
 * Pauses when the tab is hidden; draws one still frame under reduced motion.
 */
export default function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = prefersReducedMotion();
    const followCursor = !still && hasFinePointer();
    let colors = readColors();
    let w = 0;
    let h = 0;
    let ps: Particle[] = [];
    let raf = 0;
    let last = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const compact = w < 768 || !hasFinePointer();
      const n = particleCount(w, h, compact);
      // Keep existing particles on resize so the field doesn't "jump".
      if (ps.length !== n) {
        ps = ps.slice(0, n).concat(createParticles(Math.max(0, n - ps.length), w, h));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, GLOW);
        g.addColorStop(0, rgba(colors.accent, 0.16));
        g.addColorStop(1, rgba(colors.accent, 0));
        ctx.fillStyle = g;
        ctx.fillRect(mouse.x - GLOW, mouse.y - GLOW, GLOW * 2, GLOW * 2);
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i];
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
          const al = linkAlpha(Math.hypot(dx, dy), LINK);
          if (!al) continue;
          ctx.strokeStyle = rgba(colors.ink, al * 0.35);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (mouse.active) {
          const al = linkAlpha(Math.hypot(a.x - mouse.x, a.y - mouse.y), CURSOR_LINK);
          if (al) {
            ctx.strokeStyle = rgba(colors.accent, al * 0.8);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      for (const p of ps) {
        ctx.fillStyle = rgba(colors.ink, 0.55);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      const dt = last ? Math.min((t - last) / 16.67, 3) : 1;
      last = t;
      step(ps, w, h, dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (still || raf) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onResize = () => {
      resize();
      if (still) draw();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);

    // Re-read colors when the theme class on <html> changes.
    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      if (still) draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    draw();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (followCursor) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    requestAnimationFrame(() => canvas.classList.add("is-ready"));

    return () => {
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="fx-constellation" aria-hidden="true" />;
}
