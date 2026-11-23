// Renders each cover in index.html to public/projects/<id>.png (1920×1080) with headless Chrome.
// usage: node assets-src/covers/render.mjs [id ...]   then `pnpm assets` for the .webp files.
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = join(here, "..", "..", "public", "projects");
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ["solid", "chordefine", "ambatuhelp"];
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";

for (const id of ids) {
  const url = `${pathToFileURL(join(here, "index.html"))}?p=${id}`;
  execFileSync(chrome, [
    "--headless=new", "--hide-scrollbars", "--allow-file-access-from-files",
    "--window-size=1600,900", "--force-device-scale-factor=1.2",
    "--virtual-time-budget=3000", `--screenshot=${join(out, `${id}.png`)}`, url,
  ], { stdio: "ignore" });
  console.log("cover:", `public/projects/${id}.png`);
}
