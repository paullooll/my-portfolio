import { useCallback, useEffect, useState } from "react";
import {
  HAUNT_WORD,
  KONAMI,
  createSequenceDetector,
  shouldIgnoreTarget,
} from "@/lib/sequence";

/** Opens the hidden world on the Konami code or by typing "haunt" (outside form fields). */
export function useEasterEgg() {
  const [open, setOpen] = useState(false);
  const openGame = useCallback(() => setOpen(true), []);
  const closeGame = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const push = createSequenceDetector([KONAMI, HAUNT_WORD], () =>
      setOpen(true)
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || shouldIgnoreTarget(e.target as HTMLElement | null))
        return;
      push(e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { open, openGame, closeGame };
}
