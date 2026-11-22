// Screenshots the real Ambatu.help Flutter web build through headless Chrome (CDP).
// usage: node capture.mjs <url> <steps.json>   steps: [["seed","light"|"dark"],["open"],["wait",ms],["click",x,y],["type","text"],["shot","name"]] (x,y in CSS px of a 412×892 phone)
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, stepsFile] = process.argv.slice(2);
const steps = JSON.parse(readFileSync(stepsFile, "utf8"));
const here = new URL(".", import.meta.url).pathname.slice(1);
mkdirSync(join(here, "screens"), { recursive: true });
const W = 412, H = 892, PORT = 9339;

const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(tmpdir(), "ambatu-cdp")}`,
  "--no-first-run", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find(t => t.type === "page"); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
const mouse = async (x, y) => {
  for (const type of ["mouseMoved", "mousePressed", "mouseReleased"])
    await send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1, pointerType: "mouse" });
};

await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 2.5, mobile: true });
const conv = JSON.parse(readFileSync(join(here, "seed.json"), "utf8"));
for (const [cmd, a, b] of steps) {
  if (cmd === "seed" || cmd === "open") {
    await send("Page.navigate", { url });
    await sleep(800);
    if (cmd === "seed") {
      // shared_preferences on web = localStorage, "flutter." prefix, JSON-encoded values
      const prefs = { conversations: JSON.stringify(conv), themeMode: a || "light", botName: "Ambatu" };
      await send("Runtime.evaluate", { expression: `localStorage.clear();${Object.entries(prefs).map(([k, v]) => `localStorage.setItem("flutter.${k}", ${JSON.stringify(JSON.stringify(v))})`).join(";")};location.reload()` });
    }
    await sleep(4000);
  } else if (cmd === "wait") await sleep(a);
  else if (cmd === "click") { await mouse(a, b); await sleep(700); }
  else if (cmd === "type") { await send("Input.insertText", { text: a }); await sleep(300); }
  else if (cmd === "shot") {
    const { result } = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(here, "screens", a + ".png"), Buffer.from(result.data, "base64"));
    console.log("shot", a);
  }
}
ws.close(); chrome.kill();
