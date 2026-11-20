import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

/** Pull `--name: #hex` pairs out of one CSS block. */
function tokens(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  const block = css.slice(start, css.indexOf("}", start));
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g))
    out[m[1]] = m[2];
  return out;
}

const css = readFileSync(
  path.resolve(__dirname, "../styles/tokens.css"),
  "utf8"
);

describe("contrastRatio", () => {
  it("is 21 for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });
});

describe.each([
  ["light", ":root"],
  ["dark", ".dark"],
])("%s theme meets WCAG AA", (_name, selector) => {
  const t = tokens(css, selector);
  it.each([
    ["ink", "bg", 4.5],
    ["ink", "surface", 4.5],
    ["ink-muted", "bg", 4.5],
    ["ink-muted", "surface", 4.5],
    ["accent", "bg", 3],
    ["warn", "bg", 3],
    ["danger", "bg", 3],
    ["on-accent", "accent", 4.5],
    ["accent", "surface", 4.5],
  ])("%s on %s ≥ %s", (fg, bg, min) => {
    expect(t[fg], `missing --${fg}`).toBeDefined();
    expect(contrastRatio(t[fg], t[bg])).toBeGreaterThanOrEqual(min);
  });
});
