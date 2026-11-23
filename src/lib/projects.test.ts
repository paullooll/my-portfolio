import { describe, expect, it } from "vitest";
import content from "../content";
import {
  cardTags,
  closeFocusTarget,
  filterProjects,
  projectIdFromHash,
} from "./projects";

const all = content.projects;
const ids = (f: Parameters<typeof filterProjects>[1], showAll = true) =>
  filterProjects(all, f, showAll).map(p => p.id);

describe("filterProjects", () => {
  it("filters by tag, keeping original order", () => {
    expect(ids("Web System")).toEqual(["solid"]);
    expect(ids("Mobile Application")).toEqual([
      "chordefine",
      "ambatuhelp",
      "kayaba",
    ]);
  });
  it("returns everything for All", () => {
    expect(ids("All")).toHaveLength(4);
  });
  it("shows only the 3 featured projects for All when collapsed", () => {
    expect(ids("All", false)).toEqual(["solid", "chordefine", "ambatuhelp"]);
  });
  it("ignores showAll for a tag filter", () => {
    expect(ids("Mobile Application", false)).toHaveLength(3);
  });
  it("card tags drop the platform filters", () => {
    expect(all.map(p => cardTags(p))).toEqual([
      ["Work"],
      ["School"],
      ["School"],
      ["Personal"],
    ]);
  });
});

describe("projectIdFromHash", () => {
  it("finds a known project", () => {
    expect(projectIdFromHash("#project-solid", all)).toBe("solid");
    expect(projectIdFromHash("#project-kayaba", all)).toBe("kayaba");
  });
  it("ignores unknown or unrelated hashes", () => {
    expect(projectIdFromHash("#project-nope", all)).toBeNull();
    expect(projectIdFromHash("", all)).toBeNull();
    expect(projectIdFromHash("#projects", all)).toBeNull();
  });
  it("returns null instead of throwing on bad percent-encoding", () => {
    expect(projectIdFromHash("#project-%", all)).toBeNull();
    expect(projectIdFromHash("#project-%E0", all)).toBeNull();
  });
});

describe("closeFocusTarget", () => {
  const els: Record<string, { id: string }> = {
    '[data-project="solid"]': { id: "card" },
    "#projects-heading": { id: "heading" },
  };
  const find = (sel: string) => (els[sel] as unknown as HTMLElement) ?? null;
  it("prefers the element that opened the dialog", () => {
    const opener = { id: "opener" } as unknown as HTMLElement;
    expect(closeFocusTarget("solid", opener, find)).toBe(opener);
  });
  it("falls back to the project card after a deep link", () => {
    expect(closeFocusTarget("solid", null, find)).toEqual({ id: "card" });
  });
  it("falls back to the Projects heading when the card is filtered out", () => {
    expect(closeFocusTarget("chordefine", null, find)).toEqual({
      id: "heading",
    });
  });
});
