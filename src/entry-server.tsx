/**
 * Prerender entry (used by scripts/prerender.mjs at build time only).
 * Renders the home page to static HTML so text appears before JavaScript runs.
 */
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

export function render(): string {
  return renderToString(
    <Router ssrPath="/">
      <App />
    </Router>
  );
}
