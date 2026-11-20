import { describe, expect, it } from "vitest";
import {
  PLACEHOLDER,
  isFilled,
  listUnfilled,
  shouldRender,
  visibleItems,
} from "./placeholder";

describe("isFilled", () => {
  it("treats the placeholder literal as unfilled", () => {
    expect(isFilled("[TODO]")).toBe(false);
  });
  it("treats strings containing the placeholder as unfilled", () => {
    expect(isFilled("Year [TODO]")).toBe(false);
  });
  it("treats empty and missing values as unfilled", () => {
    expect(isFilled("")).toBe(false);
    expect(isFilled(undefined)).toBe(false);
  });
  it("treats real strings as filled", () => {
    expect(isFilled("React")).toBe(true);
  });
  it("needs at least one filled array item", () => {
    expect(isFilled([])).toBe(false);
    expect(isFilled(["[TODO]", "x"])).toBe(true);
  });
  it("needs every object value filled", () => {
    expect(isFilled({ name: "A", quote: "[TODO]" })).toBe(false);
  });
});

describe("shouldRender", () => {
  it("always renders in dev", () => {
    expect(shouldRender(PLACEHOLDER, true)).toBe(true);
  });
  it("hides unfilled values in production", () => {
    expect(shouldRender(PLACEHOLDER, false)).toBe(false);
  });
});

describe("listUnfilled", () => {
  it("returns dotted paths of unfilled leaves", () => {
    expect(
      listUnfilled({ a: { b: PLACEHOLDER }, c: ["ok", PLACEHOLDER] })
    ).toEqual(["a.b", "c.1"]);
  });
});

describe("visibleItems", () => {
  it("drops unfilled items in production", () => {
    expect(visibleItems(["Burp Suite", PLACEHOLDER], false)).toEqual([
      "Burp Suite",
    ]);
  });
  it("keeps everything in dev (shown with markers)", () => {
    expect(visibleItems(["Burp Suite", PLACEHOLDER], true)).toEqual([
      "Burp Suite",
      PLACEHOLDER,
    ]);
  });
  it("treats a bare placeholder as an empty list", () => {
    expect(visibleItems(PLACEHOLDER, false)).toEqual([]);
  });
});
