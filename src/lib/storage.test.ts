import { afterEach, describe, expect, it, vi } from "vitest";
import { safeStorage } from "./storage";

describe("safeStorage", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("never throws when storage access throws", () => {
    const boom = () => {
      throw new Error("blocked");
    };
    vi.stubGlobal("localStorage", { getItem: boom, setItem: boom });
    const s = safeStorage("local");
    expect(s.get("x")).toBeNull();
    expect(() => s.set("x", "1")).not.toThrow();
  });

  it("never throws when storage is missing entirely", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(safeStorage("local").get("x")).toBeNull();
  });
});
