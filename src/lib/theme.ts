export type Theme = "light" | "dark";

/** A stored choice wins; otherwise the site starts in dark mode (Signal default). */
export function resolveInitialTheme(stored: string | null): Theme {
  return stored === "light" || stored === "dark" ? stored : "dark";
}
