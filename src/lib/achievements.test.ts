import { describe, expect, it } from "vitest";
import { createAchievements, reachableTotal } from "./achievements";
import type { SafeStorage } from "./storage";

function memoryStorage(): SafeStorage {
  const m = new Map<string, string>();
  return { get: k => m.get(k) ?? null, set: (k, v) => void m.set(k, v) };
}

describe("createAchievements", () => {
  it("unlocks once", () => {
    const a = createAchievements(memoryStorage());
    expect(a.unlock("toggled-theme")).toBe(true);
    expect(a.unlock("toggled-theme")).toBe(false);
    expect(a.unlocked()).toEqual(["toggled-theme"]);
  });

  it("remembers unlocks across instances", () => {
    const s = memoryStorage();
    createAchievements(s).unlock("toggled-theme");
    expect(createAchievements(s).unlock("toggled-theme")).toBe(false);
  });

  it("still works when storage throws", () => {
    const boom = () => {
      throw new Error("blocked");
    };
    const a = createAchievements({ get: boom, set: boom });
    expect(a.unlock("found-egg")).toBe(true);
  });

  it("ignores corrupted stored data", () => {
    const s = memoryStorage();
    s.set("achievements", "{not json");
    expect(createAchievements(s).unlocked()).toEqual([]);
  });
});

describe("reachableTotal", () => {
  it("counts every achievement when the CV is available", () => {
    expect(reachableTotal(true)).toBe(6);
  });
  it("leaves out the CV achievement while the CV button is hidden", () => {
    expect(reachableTotal(false)).toBe(5);
  });
});
