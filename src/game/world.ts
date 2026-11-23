import type { SectionId } from "../content";

/**
 * The Easter-egg world ("HQ town"). Pure data + rules so it can be unit-tested.
 * # wall · . floor · 1-5 doors · o soul orb · P start · ~ water (blocks) · t tree (blocks)
 */
export const TILE = 16;

export const MAP: string[] = [
  "######################",
  "#..1.....#....2......#",
  "#........#...........#",
  "#..o.....#.....o.....#",
  "#........##.####.....#",
  "#.t..................#",
  "#....~~~~.....P....t.#",
  "#....~~~~............#",
  "#.o..........####.##.#",
  "#.....3......#.....o.#",
  "#............#.......#",
  "#..t.....o...4...5...#",
  "######################",
];

export const DOOR_SECTIONS: Record<string, SectionId> = {
  "1": "projects",
  "2": "skills",
  "3": "experience",
  "4": "about",
  "5": "contact",
};

export interface World {
  rows: string[];
  width: number;
  height: number;
  start: { x: number; y: number };
  doors: { x: number; y: number; section: SectionId }[];
  orbs: Set<string>;
}

const key = (x: number, y: number) => `${x},${y}`;

/** Parse the map. Doors to sections that aren't visible become walls. */
export function parseMap(map: string[], visible: SectionId[]): World {
  const doors: World["doors"] = [];
  const orbs = new Set<string>();
  let start = { x: 1, y: 1 };
  const rows = map.map((row, y) =>
    row
      .split("")
      .map((ch, x) => {
        if (ch === "P") {
          start = { x, y };
          return ".";
        }
        if (ch === "o") {
          orbs.add(key(x, y));
          return ".";
        }
        const section = DOOR_SECTIONS[ch];
        if (section) {
          if (!visible.includes(section)) return "#";
          doors.push({ x, y, section });
        }
        return ch;
      })
      .join("")
  );
  return { rows, width: map[0].length, height: map.length, start, doors, orbs };
}

export function canMove(w: World, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= w.width || y >= w.height) return false;
  return !"#~t".includes(w.rows[y][x]);
}

export function doorAt(w: World, x: number, y: number): SectionId | null {
  return w.doors.find(d => d.x === x && d.y === y)?.section ?? null;
}

/** Returns a new World without the orb at (x, y), if there was one. */
export function collectOrb(w: World, x: number, y: number): World {
  if (!w.orbs.has(key(x, y))) return w;
  const orbs = new Set(w.orbs);
  orbs.delete(key(x, y));
  return { ...w, orbs };
}

export const orbsLeft = (w: World) => w.orbs.size;
export const hasOrb = (w: World, x: number, y: number) => w.orbs.has(key(x, y));
