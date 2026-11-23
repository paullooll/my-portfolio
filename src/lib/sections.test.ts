import { describe, expect, it } from "vitest";
import content from "../content";
import { visibleSections } from "./sections";

describe("visibleSections", () => {
  it("lists every section in page order", () => {
    expect(visibleSections(content)).toEqual([
      "home",
      "projects",
      "skills",
      "experience",
      "about",
      "contact",
    ]);
  });
});
