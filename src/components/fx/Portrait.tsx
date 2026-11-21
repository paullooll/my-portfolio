import { useEffect, useRef, type CSSProperties } from "react";
import content from "@/content";
import { hasFinePointer, prefersReducedMotion } from "@/motion/reducedMotion";

/** Orbit badges: only tools listed under "using" in content.ts are shown. */
const ORBIT = ["React", "TypeScript", "NodeJS", "Python", "Flutter", "MySQL"];
const using = new Set(content.skills.flatMap(g => g.using));
const orbit = ORBIT.filter(t => using.has(t));

/**
 * Hero portrait: background-removed cutout over a glowing ring, with the
 * stack orbiting slowly. On mouse devices the layers tilt toward the cursor
 * (parallax). Reduced motion: no tilt, no orbit, everything still visible.
 */
export function Portrait() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const tick = () => {
      // Ease toward the target so the tilt feels weighted, not twitchy.
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--tilt-x", x.toFixed(3));
      el.style.setProperty("--tilt-y", y.toFixed(3));
      raf =
        Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001
          ? requestAnimationFrame(tick)
          : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // -1…1 relative to the portrait's center, clamped.
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="portrait" ref={ref}>
      <div className="portrait-ring" aria-hidden="true" />
      <ul className="portrait-orbit" aria-hidden="true">
        {orbit.map((t, i) => (
          <li
            key={t}
            style={{ "--a": `${(360 / orbit.length) * i}deg` } as CSSProperties}
          >
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <picture className="portrait-img">
        <source srcSet="/portrait.webp" type="image/webp" />
        <img
          src="/portrait.png"
          alt={`Portrait of ${content.name}`}
          width={370}
          height={508}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  );
}
