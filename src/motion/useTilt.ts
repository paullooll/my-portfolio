import { useEffect, type RefObject } from "react";
import { hasFinePointer, prefersReducedMotion } from "./reducedMotion";

/**
 * Pointer tilt for a card: writes --rx/--ry (degrees) on the element. CSS does the rest.
 * Mouse/trackpad only; nothing happens under reduced motion or on touch.
 */
export function useTilt(ref: RefObject<HTMLElement | null>, max = 3) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };
    el.classList.add("is-tiltable");
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.classList.remove("is-tiltable");
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, max]);
}
