import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { loadAnalytics } from "./lib/analytics";
import "./index.css";

const root = document.getElementById("root")!;

// The home page is prerendered at build time: hydrate it. Any other path (the
// 404 page) gets a fresh client render instead of a mismatched hydration.
if (root.hasChildNodes() && window.location.pathname === "/") {
  hydrateRoot(root, <App />);
} else {
  root.textContent = "";
  createRoot(root).render(<App />);
}

// Umami analytics: only when both env vars are set (see .env.example).
loadAnalytics(
  import.meta.env.VITE_ANALYTICS_ENDPOINT,
  import.meta.env.VITE_ANALYTICS_WEBSITE_ID
);
