import { describe, expect, it, vi } from "vitest";
import {
  HAUNT_WORD,
  KONAMI,
  createSequenceDetector,
  shouldIgnoreTarget,
} from "./sequence";

function feed(keys: string[]) {
  const onMatch = vi.fn();
  const push = createSequenceDetector([KONAMI, HAUNT_WORD], onMatch);
  keys.forEach(push);
  return onMatch;
}

describe("createSequenceDetector", () => {
  it("matches the Konami code", () => {
    expect(feed(KONAMI)).toHaveBeenCalledTimes(1);
  });
  it("matches 'haunt' case-insensitively", () => {
    expect(feed(["H", "A", "U", "N", "T"])).toHaveBeenCalledTimes(1);
  });
  it("restarts progress correctly after a wrong key", () => {
    expect(feed(["h", "a", "h", "a", "u", "n", "t"])).toHaveBeenCalledTimes(1);
  });
  it("does not match broken sequences", () => {
    expect(feed(["ArrowUp", "x", "ArrowUp"])).not.toHaveBeenCalled();
  });
});

describe("shouldIgnoreTarget", () => {
  it("ignores typing in form fields", () => {
    expect(shouldIgnoreTarget({ tagName: "INPUT" })).toBe(true);
    expect(shouldIgnoreTarget({ tagName: "TEXTAREA" })).toBe(true);
    expect(shouldIgnoreTarget({ tagName: "SELECT" })).toBe(true);
    expect(shouldIgnoreTarget({ isContentEditable: true })).toBe(true);
  });
  it("listens everywhere else", () => {
    expect(shouldIgnoreTarget({ tagName: "BUTTON" })).toBe(false);
    expect(shouldIgnoreTarget(null)).toBe(false);
  });
});

describe("shouldIgnoreTarget inside dialogs", () => {
  it("ignores keys while a modal dialog has focus", () => {
    expect(
      shouldIgnoreTarget({
        tagName: "BUTTON",
        closest: (s: string) => (s === "dialog" ? {} : null),
      })
    ).toBe(true);
  });
});
