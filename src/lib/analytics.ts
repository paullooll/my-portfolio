/** Privacy-friendly analytics (Umami). Loads only when both env vars are set. */
export type TrackedEvent = "cv-download" | "message-sent";

export function analyticsScriptSrc(
  endpoint?: string,
  id?: string
): string | null {
  const ok = (v?: string) => !!v && v.trim() !== "" && !v.includes("%VITE_");
  if (!ok(endpoint) || !ok(id)) return null;
  return `${endpoint!.replace(/\/$/, "")}/umami`;
}

declare global {
  interface Window {
    umami?: { track: (event: string) => void };
  }
}

export function track(event: TrackedEvent): void {
  try {
    globalThis.window?.umami?.track(event);
  } catch {
    /* analytics must never break the page */
  }
}

/** Inject the Umami script at runtime (called from main.tsx). */
export function loadAnalytics(endpoint?: string, id?: string): void {
  const src = analyticsScriptSrc(endpoint, id);
  if (!src || typeof document === "undefined") return;
  const s = document.createElement("script");
  s.defer = true;
  s.src = src;
  s.dataset.websiteId = id!;
  document.head.appendChild(s);
}
