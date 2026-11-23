import { describe, expect, it } from "vitest";
import { analyticsScriptSrc, track } from "./analytics";

describe("analyticsScriptSrc", () => {
  it("builds the Umami script URL when configured", () => {
    expect(analyticsScriptSrc("https://a.io", "x")).toBe("https://a.io/umami");
  });
  it("returns null when not configured", () => {
    expect(analyticsScriptSrc(undefined, "x")).toBeNull();
    expect(analyticsScriptSrc("", "x")).toBeNull();
    expect(analyticsScriptSrc("%VITE_ANALYTICS_ENDPOINT%", "x")).toBeNull();
    expect(analyticsScriptSrc("https://a.io", undefined)).toBeNull();
  });
});

describe("track", () => {
  it("never throws without Umami loaded", () => {
    expect(() => track("cv-download")).not.toThrow();
  });
});
