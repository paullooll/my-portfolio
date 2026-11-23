import { describe, expect, it } from "vitest";
import { render } from "./entry-server";

describe("prerendered HTML", () => {
  const html = render();
  it("includes the hero and every section", () => {
    expect(html).toContain("Richie Paul Aquiño");
    for (const id of ["projects", "skills", "experience", "about", "contact"])
      expect(html).toContain(`id="${id}"`);
  });
  it("leaves out the deferred extras (chat, hidden world)", () => {
    expect(html).not.toContain("haunt-chat");
    expect(html).not.toContain('class="world');
  });
});
