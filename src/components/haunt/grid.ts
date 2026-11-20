/**
 * Haunt's pixel art: an ORIGINAL ghost (spec §5.4). Round body, wavy three-lobe
 * tail, wide toothy grin, glowing eyes. No legs, spikes or ears.
 * o = outline, b = body, e = eye, k = pupil, m = mouth, t = teeth, . = empty
 */
export const HAUNT_GRID: readonly string[] = [
  "........oooooooo........",
  "......oobbbbbbbboo......",
  ".....obbbbbbbbbbbbo.....",
  "....obbbbbbbbbbbbbbo....",
  "...obbbbbbbbbbbbbbbbo...",
  "..obbbbbbbbbbbbbbbbbbo..",
  "..obbeeebbbbbbbbeeebbo..",
  ".obbeeeeebbbbbbeeeeebbo.",
  ".obbeekeebbbbbbeekeebbo.",
  ".obbbeeebbbbbbbbeeebbbo.",
  ".obbbbbbbbbbbbbbbbbbbbo.",
  ".obbmmmmmmmmmmmmmmmmbbo.",
  ".obbmttmttmttmttmttmbbo.",
  ".obbbmmmmmmmmmmmmmmbbbo.",
  ".obbbbbmmmmmmmmmmbbbbbo.",
  ".obbbbbbbbbbbbbbbbbbbbo.",
  ".obbbbbbbbbbbbbbbbbbbbo.",
  ".obbbbbbbbbbbbbbbbbbbbo.",
  ".obbbbbbbbbbbbbbbbbbbbo.",
  ".obbbbbbbbbbbbbbbbbbbbo.",
  ".obbbbo.obbbbbbo.obbbbo.",
  "..oooo...oooooo...oooo..",
  "........................",
  "........................",
];

/** Rows that change when Haunt sleeps (eyes become closed lines). */
export const SLEEP_EYES: Record<number, string> = {
  6: "..obbbbbbbbbbbbbbbbbbo..",
  7: ".obbbbbbbbbbbbbbbbbbbbo.",
  8: ".obbeeeeebbbbbbeeeeebbo.",
  9: ".obbbbbbbbbbbbbbbbbbbbo.",
};

export const CELL_PARTS = {
  o: "outline",
  b: "body",
  e: "eye",
  k: "pupil",
  m: "mouth",
  t: "teeth",
} as const;
export type CellPart = (typeof CELL_PARTS)[keyof typeof CELL_PARTS];

/** Merge horizontal runs of the same cell so the SVG has few elements. */
export function gridRuns(
  rows: readonly string[]
): { x: number; y: number; w: number; part: CellPart }[] {
  const runs: { x: number; y: number; w: number; part: CellPart }[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x] as keyof typeof CELL_PARTS;
      let w = 1;
      while (row[x + w] === ch) w++;
      if (ch in CELL_PARTS) runs.push({ x, y, w, part: CELL_PARTS[ch] });
      x += w;
    }
  });
  return runs;
}
