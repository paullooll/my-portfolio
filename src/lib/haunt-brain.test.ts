import { describe, expect, it } from "vitest";
import content from "../content";
import { PLACEHOLDER } from "./placeholder";
import { answer, findTechs, normalize } from "./haunt-brain";

const topic = (q: string) => answer(q, content).topic;

describe("normalize", () => {
  it("lowercases and strips accents and punctuation", () => {
    expect(normalize("  Who's Richie Aquiño?! ")).toBe("who s richie aquino");
  });
});

describe("answer: routing", () => {
  it.each([
    ["What projects has Richie built?", "projects"],
    ["What's his tech stack?", "skills"],
    ["Is he open to work?", "availability"],
    ["Are you hiring-ready? can I hire him", "availability"],
    ["Tell me about SOLID", "project"],
    ["budget tracker?", "project"],
    ["Does he know React?", "tech"],
    ["postgres experience", "tech"],
    ["How do I contact him?", "contact"],
    ["Where can I see his code on github", "contact"],
    ["Can I get his resume", "resume"],
    ["Where did he study?", "education"],
    ["What is he learning now", "now"],
    ["Tell me about his work experience", "experience"],
    ["Where is he based?", "location"],
    ["What are his hobbies", "hobbies"],
    ["Who is Richie?", "about"],
    ["hello", "greeting"],
    ["thanks!", "thanks"],
    ["who are you", "self"],
    ["is there a secret?", "secret"],
    ["why are there no screenshots", "privacy"],
    ["what's the weather in Tokyo", "unknown"],
    ["", "help"],
  ])("%s → %s", (q, t) => {
    expect(topic(q)).toBe(t);
  });

  it("does not treat 'his' as a greeting", () => {
    expect(topic("his favourite colour")).toBe("unknown");
  });
});

describe("answer: content", () => {
  it("never shows [TODO] text", () => {
    const qs = [
      "Tell me about SOLID",
      "Tell me about ChorDefine",
      "resume",
      "what is he learning",
      "hobbies",
      "contact",
    ];
    for (const q of qs)
      expect(answer(q, content).text).not.toContain(PLACEHOLDER);
  });

  it("explains private government projects without details", () => {
    const r = answer("tell me about solid", content);
    expect(r.text).toContain("internal government system");
    expect(r.links?.[0].href).toBe("#project-solid");
  });

  it("links a public project's code", () => {
    const r = answer("chordefine", content);
    expect(r.links?.some(l => l.href.includes("github.com"))).toBe(true);
  });

  it("says when a tech is still being learned", () => {
    expect(answer("docker?", content).text).toContain("learning");
  });

  it("uses the CV link once it is filled", () => {
    const r = answer("resume", { ...content, cv: "/cv.pdf" });
    expect(r.links?.[0].href).toBe("/cv.pdf");
  });
});

describe("findTechs", () => {
  it("matches whole words and aliases", () => {
    expect(findTechs(normalize("React and node"), content)).toEqual([
      "React",
      "NodeJS",
    ]);
    expect(findTechs(normalize("reactive"), content)).toEqual([]);
  });
});
