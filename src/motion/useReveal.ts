import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./reducedMotion";

/**
 * Minimal scroll reveal (no animation library). Only [data-reveal] elements
 * that start BELOW the fold are hidden, so prerendered, above-the-fold content
 * is never blank, and with reduced motion nothing is hidden at all. Each
 * element fades up once, then is left alone.
 */
export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window))
      return;
    const vh = window.innerHeight;
    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-reveal]")
    ).filter(n => n.getBoundingClientRect().top > vh); // read all first…
    items.forEach(n => n.classList.add("reveal-pending")); // …then write

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const n = e.target as HTMLElement;
          io.unobserve(n);
          n.classList.add("reveal-in");
          n.classList.remove("reveal-pending");
          n.addEventListener(
            "transitionend",
            () => n.classList.remove("reveal-in"),
            { once: true }
          );
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach(n => io.observe(n));
    return () => {
      io.disconnect();
      items.forEach(n => n.classList.remove("reveal-pending", "reveal-in"));
    };
  }, [root]);
}
