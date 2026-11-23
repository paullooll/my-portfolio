import { describe, expect, it } from "vitest";
import content from "../content";
import { PLACEHOLDER } from "./placeholder";
import { runCommand } from "./terminal";

describe("runCommand", () => {
  it("lists every command on help", () => {
    const { lines } = runCommand("help", content);
    for (const c of ["about", "projects", "contact", "resume"])
      expect(lines.some(l => l.includes(c))).toBe(true);
  });

  it("is case and whitespace insensitive", () => {
    expect(runCommand("  HELP ", content).lines.length).toBeGreaterThan(0);
  });

  it("prints only real content for about", () => {
    const r = runCommand("about", content);
    expect(r.lines).toContain(content.valueStatement);
    expect(r.action).toEqual({ type: "goto", hash: "#about" });
  });

  it("lists projects and opens one by number", () => {
    expect(runCommand("projects", content).lines[0]).toContain(content.projects[0].title);
    expect(runCommand("projects 1", content).action).toEqual({
      type: "goto",
      hash: `#project-${content.projects[0].id}`,
    });
  });

  it("rejects an unknown project number", () => {
    const r = runCommand("projects 99", content);
    expect(r.action).toBeUndefined();
    expect(r.lines[0]).toMatch(/no project/);
  });

  it("shows contact details from content", () => {
    expect(runCommand("contact", content).lines.join("\n")).toContain(content.email);
  });

  it("marks a missing resume as [TODO] instead of linking", () => {
    const r = runCommand("resume", { ...content, cv: PLACEHOLDER });
    expect(r.action).toBeUndefined();
    expect(r.lines[0]).toContain("[TODO]");
  });

  it("downloads the resume once it is set", () => {
    expect(runCommand("resume", { ...content, cv: "/cv.pdf" }).action).toEqual({
      type: "download",
      href: "/cv.pdf",
    });
  });

  it("handles clear, exit and unknown commands", () => {
    expect(runCommand("clear", content).action).toEqual({ type: "clear" });
    expect(runCommand("exit", content).action).toEqual({ type: "close" });
    expect(runCommand("rm -rf /", content).lines[0]).toMatch(/not found/);
  });
});
