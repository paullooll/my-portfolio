import { useEffect, useState } from "react";

/**
 * Becomes true once the page has loaded and the browser is idle. Used to defer
 * non-essential extras (guide, cursor, radar animation) so they never compete
 * with the first paint or block the main thread during load.
 */
export function useAfterLoad(timeout = 2000): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let handle = 0;
    const hasIdle = typeof window.requestIdleCallback === "function";
    const go = () => {
      handle = hasIdle
        ? window.requestIdleCallback(() => setReady(true), { timeout })
        : window.setTimeout(() => setReady(true), 300);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [timeout]);
  return ready;
}
