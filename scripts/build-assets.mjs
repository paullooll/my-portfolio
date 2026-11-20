// One-off asset pipeline (run with `pnpm assets`). Outputs are committed.
// - WebP copies of project screenshots and the profile photo (originals kept).
// - The Open Graph preview image (added in the SEO step).
import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const projects = path.join(root, "public", "projects");

for (const file of await readdir(projects)) {
  if (!file.endsWith(".png")) continue;
  const out = path.join(projects, file.replace(/\.png$/, ".webp"));
  await sharp(path.join(projects, file))
    .resize({ width: 1200 })
    .webp({ quality: 78 })
    .toFile(out);
  console.log("webp:", path.relative(root, out));
}

await sharp(path.join(root, "public", "light.png"))
  .resize({ width: 640 })
  .webp({ quality: 80 })
  .toFile(path.join(root, "public", "light.webp"));
console.log("webp: public/light.webp");

// ---- Open Graph image (1200x630): console background, Haunt, name and role. ----
// Haunt's pixels are read straight from the sprite grid so the art stays in sync.
const gridSrc = await import("node:fs/promises").then(fs =>
  fs.readFile(path.join(root, "src/components/haunt/grid.ts"), "utf8")
);
const grid = [...gridSrc.matchAll(/^\s+"([.obekmt]{24})",$/gm)]
  .slice(0, 24)
  .map(m => m[1]);
const colors = {
  o: "#6E62C9",
  b: "#2B2457",
  e: "#A6FF4D",
  k: "#0B0D17",
  m: "#07080F",
  t: "#F4F1FF",
};
const cell = 14;
const hx = 820;
const hy = 150;
let haunt = "";
grid.forEach((row, y) =>
  [...row].forEach((ch, x) => {
    if (colors[ch])
      haunt += `<rect x="${hx + x * cell}" y="${hy + y * cell}" width="${cell}" height="${cell}" fill="${colors[ch]}"/>`;
  })
);
const scan = Array.from(
  { length: 210 },
  (_, i) =>
    `<rect y="${i * 3}" width="1200" height="1" fill="#000" opacity="0.25"/>`
).join("");
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" shape-rendering="crispEdges">
  <rect width="1200" height="630" fill="#0B0D17"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#2A3060" stroke-width="4"/>
  <text x="72" y="120" font-family="Consolas, 'Courier New', monospace" font-size="28" fill="#9AA0C3">&gt; PLAYER 1 READY · ILOILO CITY, PH</text>
  <text x="72" y="230" font-family="Consolas, 'Courier New', monospace" font-weight="700" font-size="72" fill="#E8EAF4">RICHIE PAUL</text>
  <text x="72" y="315" font-family="Consolas, 'Courier New', monospace" font-weight="700" font-size="72" fill="#E8EAF4">AQUIÑO</text>
  <text x="72" y="395" font-family="Consolas, 'Courier New', monospace" font-size="38" fill="#A6FF4D">Junior Fullstack Developer_</text>
  <text x="72" y="520" font-family="Consolas, 'Courier New', monospace" font-size="26" fill="#FFB547">■ OPEN TO WORK</text>
  ${haunt}
  ${scan}
</svg>`;
await sharp(Buffer.from(og))
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public", "og-image.png"));
console.log("og: public/og-image.png");

// ---- Self-hosted fonts (OFL), copied from @fontsource so they can be preloaded. ----
const fontDir = path.join(root, "public", "fonts");
await mkdir(fontDir, { recursive: true });
const fonts = [
  ["press-start-2p", "press-start-2p-latin-400-normal.woff2"],
  ["vt323", "vt323-latin-400-normal.woff2"],
  ["ibm-plex-sans", "ibm-plex-sans-latin-400-normal.woff2"],
  ["ibm-plex-sans", "ibm-plex-sans-latin-500-normal.woff2"],
  ["ibm-plex-sans", "ibm-plex-sans-latin-600-normal.woff2"],
];
for (const [pkg, file] of fonts) {
  await copyFile(
    path.join(root, "node_modules", "@fontsource", pkg, "files", file),
    path.join(fontDir, file)
  );
  console.log("font:", file);
}
