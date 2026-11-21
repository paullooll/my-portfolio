import { useEffect, useState } from "react";
import { prefersReducedMotion } from "./reducedMotion";

/**
 * Types each phrase, holds, deletes, moves to the next. Starts with the first
 * phrase fully shown (so the prerendered HTML and reduced motion read
 * correctly) and only begins cycling after a short delay.
 */
export function useTypewriter(
  phrases: string[],
  { type = 55, erase = 30, hold = 2200 } = {}
): string {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (phrases.length < 2 || prefersReducedMotion()) return;
    let i = 0;
    let shown = phrases[0].length;
    let deleting = true;
    let timer = 0;
    const tick = () => {
      if (deleting) {
        shown--;
        if (shown <= 0) {
          deleting = false;
          i = (i + 1) % phrases.length;
        }
      } else {
        shown++;
      }
      const current = phrases[i];
      setText(current.slice(0, Math.max(0, shown)));
      if (!deleting && shown >= current.length) {
        deleting = true;
        timer = window.setTimeout(tick, hold);
      } else {
        timer = window.setTimeout(tick, deleting ? erase : type);
      }
    };
    timer = window.setTimeout(tick, hold);
    return () => window.clearTimeout(timer);
  }, [phrases, type, erase, hold]);

  return text;
}
