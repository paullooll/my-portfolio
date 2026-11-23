// Prerender the home page into dist/index.html after `vite build`.
// Loads src/entry-server.tsx through Vite (so TS, aliases and env work) and
// injects the rendered HTML into <div id="root">. The client then hydrates it.
// Must be set before Vite loads so import.meta.env.DEV is false, exactly like the
// client bundle (otherwise dev-only [TODO] content would be prerendered).
process.env.NODE_ENV = "production";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";

const root = path.resolve(import.meta.dirname, "..");
const vite = await createServer({
  root,
  mode: "production",
  logLevel: "error",
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});

try {
  const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
  const html = render();
  if (html.includes("todo-marker"))
    throw new Error(
      "prerender ran in dev mode: [TODO] markers in output"
    );
  const file = path.join(root, "dist", "index.html");
  const page = await readFile(file, "utf8");
  if (!page.includes('<div id="root"></div>'))
    throw new Error("root placeholder not found in dist/index.html");
  await writeFile(
    file,
    page.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  );
  console.log(
    `prerender: dist/index.html (+${Math.round(html.length / 1024)} KB of HTML)`
  );
} finally {
  await vite.close();
}
