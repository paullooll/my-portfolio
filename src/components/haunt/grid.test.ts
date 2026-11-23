import { describe, expect, it } from "vitest";
import { HAUNT_GRID, SLEEP_EYES, gridRuns } from "./grid";

describe("Haunt grid", () => {
  it("is 24x24", () => {
    expect(HAUNT_GRID).toHaveLength(24);
    HAUNT_GRID.forEach(r => expect(r).toHaveLength(24));
    Object.values(SLEEP_EYES).forEach(r => expect(r).toHaveLength(24));
  });
  it("is left-right symmetric", () => {
    HAUNT_GRID.forEach(r => expect(r).toBe([...r].reverse().join("")));
  });
  it("merges runs", () => {
    expect(gridRuns(["..bbb."])).toEqual([{ x: 2, y: 0, w: 3, part: "body" }]);
  });
});
