import { HAUNT_GRID } from "../components/haunt/grid";
import { hasOrb, TILE, type World } from "./world";

export interface Palette {
  bg: string;
  surface: string;
  line: string;
  ink: string;
  muted: string;
  accent: string;
  warn: string;
  body: string;
  outline: string;
  mouth: string;
  teeth: string;
}

export function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (n: string) => css.getPropertyValue(n).trim();
  return {
    bg: v("--bg"),
    surface: v("--surface"),
    line: v("--line"),
    ink: v("--ink"),
    muted: v("--ink-muted"),
    accent: v("--accent"),
    warn: v("--warn"),
    body: v("--haunt-body"),
    outline: v("--haunt-outline"),
    mouth: v("--haunt-mouth"),
    teeth: v("--haunt-teeth"),
  };
}

const partColor = (ch: string, p: Palette): string | null =>
  ({ o: p.outline, b: p.body, e: p.accent, k: p.bg, m: p.mouth, t: p.teeth })[
    ch
  ] ?? null;

/** Draw Haunt's 24x24 grid into a square of `size` px at (x, y). */
export function drawHaunt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  p: Palette
) {
  const cell = size / 24;
  HAUNT_GRID.forEach((row, gy) => {
    for (let gx = 0; gx < row.length; gx++) {
      const c = partColor(row[gx], p);
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(
        x + gx * cell,
        y + gy * cell,
        Math.ceil(cell),
        Math.ceil(cell)
      );
    }
  });
}

/** Draw one frame of the world. `pos` is Haunt's tile position (may be fractional while moving). */
export function drawWorld(
  ctx: CanvasRenderingContext2D,
  w: World,
  pos: { x: number; y: number },
  t: number,
  p: Palette,
  labels: Record<string, string>
) {
  const s = TILE;
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w.width * s, w.height * s);

  for (let y = 0; y < w.height; y++) {
    for (let x = 0; x < w.width; x++) {
      const ch = w.rows[y][x];
      const px = x * s;
      const py = y * s;
      if (ch === "#") {
        ctx.fillStyle = p.surface;
        ctx.fillRect(px, py, s, s);
        ctx.fillStyle = p.line;
        ctx.fillRect(px, py + s - 3, s, 3);
        ctx.fillRect(px + (y % 2 ? 4 : 10), py + 2, 2, s - 6);
      } else if (ch === "~") {
        ctx.fillStyle = p.line;
        ctx.fillRect(px, py, s, s);
        ctx.fillStyle = p.accent;
        const wave = Math.floor(t / 400 + x) % 2;
        ctx.fillRect(px + 2 + wave * 6, py + 6, 6, 2);
      } else if (ch === "t") {
        ctx.fillStyle = p.accent;
        ctx.fillRect(px + 3, py + 2, 10, 9);
        ctx.fillStyle = p.warn;
        ctx.fillRect(px + 7, py + 11, 2, 4);
      } else {
        // Floor: sparse dots.
        if ((x * 7 + y * 13) % 5 === 0) {
          ctx.fillStyle = p.line;
          ctx.fillRect(px + 7, py + 7, 2, 2);
        }
      }
      if (hasOrb(w, x, y)) {
        const bob = Math.floor(t / 300) % 2;
        ctx.fillStyle = p.warn;
        ctx.fillRect(px + 5, py + 4 + bob, 6, 6);
        ctx.fillStyle = p.ink;
        ctx.fillRect(px + 6, py + 5 + bob, 2, 2);
      }
    }
  }

  // Doors with labels.
  ctx.font = '8px "VT323", monospace';
  ctx.textAlign = "center";
  for (const d of w.doors) {
    const px = d.x * s;
    const py = d.y * s;
    ctx.fillStyle = p.warn;
    ctx.fillRect(px + 2, py, s - 4, s);
    ctx.fillStyle = p.bg;
    ctx.fillRect(px + 4, py + 2, s - 8, s - 2);
    ctx.fillStyle = p.warn;
    ctx.fillRect(px + s - 7, py + 8, 2, 2);
    const label = labels[d.section] ?? d.section;
    ctx.fillStyle = p.ink;
    ctx.fillText(label.toUpperCase(), px + s / 2, py - 3);
  }

  const bob = Math.sin(t / 300) * 1.5;
  drawHaunt(ctx, pos.x * s - 2, pos.y * s - 4 + bob, s + 4, p);
}
