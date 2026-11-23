import { describe, expect, it } from "vitest";
import { resolveInitialTheme } from "./theme";

describe("resolveInitialTheme", () => {
  it("prefers a stored choice", () => {
    expect(resolveInitialTheme("light")).toBe("light");
    expect(resolveInitialTheme("dark")).toBe("dark");
  });
  it("defaults to dark", () => {
    expect(resolveInitialTheme(null)).toBe("dark");
    expect(resolveInitialTheme("garbage")).toBe("dark");
  });
});
