import { describe, expect, it } from "vitest";
import type { SectionId } from "../content";
import { MAP, canMove, collectOrb, doorAt, orbsLeft, parseMap } from "./world";

const all: SectionId[] = [
  "projects",
  "skills",
  "experience",
  "about",
  "contact",
];

function find(ch: string): { x: number; y: number } {
  const y = MAP.findIndex(r => r.includes(ch));
  return { x: MAP[y].indexOf(ch), y };
}

describe("parseMap", () => {
  it("finds 5 doors, 5 orbs and a start", () => {
    const w = parseMap(MAP, all);
    expect(w.doors).toHaveLength(5);
    expect(orbsLeft(w)).toBe(5);
    expect(w.start).toEqual(find("P"));
  });
});

describe("movement and doors", () => {
  const w = parseMap(MAP, all);
  it("blocks walls and allows floor", () => {
    const wall = find("#");
    const floor = find(".");
    expect(canMove(w, wall.x, wall.y)).toBe(false);
    expect(canMove(w, floor.x, floor.y)).toBe(true);
  });
  it("blocks out-of-bounds moves", () => {
    expect(canMove(w, -1, 0)).toBe(false);
  });
  it("maps door 1 to projects", () => {
    const d = find("1");
    expect(doorAt(w, d.x, d.y)).toBe("projects");
  });
  it("walls off doors to hidden sections", () => {
    const hidden = parseMap(
      MAP,
      all.filter(s => s !== "about")
    );
    const d = find("4");
    expect(doorAt(hidden, d.x, d.y)).toBeNull();
    expect(canMove(hidden, d.x, d.y)).toBe(false);
  });
});

describe("orbs", () => {
  it("collects each orb once", () => {
    const w = parseMap(MAP, all);
    const o = find("o");
    const after = collectOrb(w, o.x, o.y);
    expect(orbsLeft(after)).toBe(4);
    expect(orbsLeft(collectOrb(after, o.x, o.y))).toBe(4);
    expect(orbsLeft(w)).toBe(5);
  });
});

describe("map integrity", () => {
  it("has rows of equal width", () => {
    MAP.forEach(r => expect(r).toHaveLength(MAP[0].length));
  });
  it("lets the player reach every door and orb", () => {
    const w = parseMap(MAP, all);
    const seen = new Set<string>();
    const queue = [w.start];
    while (queue.length) {
      const { x, y } = queue.shift()!;
      const k = `${x},${y}`;
      if (seen.has(k) || !canMove(w, x, y)) continue;
      seen.add(k);
      queue.push(
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 }
      );
    }
    w.doors.forEach(d =>
      expect(seen.has(`${d.x},${d.y}`), `door ${d.section}`).toBe(true)
    );
    w.orbs.forEach(o => expect(seen.has(o), `orb ${o}`).toBe(true));
  });
});
