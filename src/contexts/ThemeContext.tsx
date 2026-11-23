import React, { createContext, useContext, useEffect, useState } from "react";
import { safeStorage } from "@/lib/storage";
import { resolveInitialTheme, type Theme } from "@/lib/theme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const storage = safeStorage("local");

interface ThemeProviderProps {
  children: React.ReactNode;
  switchable?: boolean;
}

/** Theme: stored choice, else dark. Persisted when switchable. */
export function ThemeProvider({
  children,
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Browser: the inline script in index.html already applied the theme class
    // before first paint, so start from it. Prerender (no document): dark.
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    return resolveInitialTheme(switchable ? storage.get("theme") : null);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Only an explicit toggle is remembered.
  const toggleTheme = switchable
    ? () =>
        setTheme(prev => {
          const next = prev === "light" ? "dark" : "light";
          storage.set("theme", next);
          return next;
        })
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
