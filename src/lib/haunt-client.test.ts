import { describe, expect, it } from "vitest";
import content from "../content";
import { askHaunt } from "./haunt-client";

const reply = (body: unknown, ok = true) =>
  (async () =>
    ({ ok, status: ok ? 200 : 500, json: async () => body }) as Response) as typeof fetch;

describe("askHaunt", () => {
  it("answers offline when no endpoint is set", async () => {
    const r = await askHaunt("tell me about solid", [], content);
    expect(r.topic).toBe("project");
  });

  it("uses the endpoint's answer and drops unsafe links", async () => {
    const r = await askHaunt(
      "hi",
      [],
      content,
      "https://example.test/ask",
      reply({
        text: "Hello from the API",
        links: [
          { label: "ok", href: "#projects" },
          { label: "bad", href: "javascript:alert(1)" },
        ],
      })
    );
    expect(r.text).toBe("Hello from the API");
    expect(r.links).toEqual([{ label: "ok", href: "#projects" }]);
  });

  it("falls back to the offline brain on errors or bad replies", async () => {
    const e1 = await askHaunt("solid", [], content, "x", reply({}, false));
    const e2 = await askHaunt("solid", [], content, "x", reply({ nope: 1 }));
    const e3 = await askHaunt("solid", [], content, "x", (async () => {
      throw new Error("offline");
    }) as typeof fetch);
    for (const r of [e1, e2, e3]) expect(r.topic).toBe("project");
  });
});
