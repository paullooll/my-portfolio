import { describe, expect, it } from "vitest";
import content from "../src/content";
import { buildHead, buildRobots, buildSitemap } from "./vite-portfolio-plugin";

function jsonLd(html: string) {
  const m = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(
    html
  );
  return JSON.parse(m![1]);
}

describe("buildHead", () => {
  it("omits URL-dependent tags when no site URL is set", () => {
    const html = buildHead(content, undefined);
    expect(html).toContain("Richie Paul Aquiño");
    expect(html).toContain("application/ld+json");
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain("og:image");
  });

  it("adds canonical and absolute OG image when a site URL is set", () => {
    const html = buildHead(content, "https://x.dev");
    expect(html).toContain('href="https://x.dev/"');
    expect(html).toContain("https://x.dev/og-image.png");
  });

  it("describes a Person in JSON-LD", () => {
    const ld = jsonLd(buildHead(content, "https://x.dev"));
    expect(ld["@type"]).toBe("Person");
    expect(ld.jobTitle).toBe("Junior Fullstack Developer");
    expect(ld.sameAs).toContain("https://github.com/paullooll");
    expect(ld.url).toBe("https://x.dev/");
  });

  it("escapes HTML in text", () => {
    const html = buildHead({ ...content, name: 'A <b> "q"' }, undefined);
    expect(html).not.toContain("<b>");
  });
});

describe("sitemap and robots", () => {
  it("lists the home page", () => {
    expect(buildSitemap("https://x.dev")).toContain(
      "<loc>https://x.dev/</loc>"
    );
  });
  it("links the sitemap only when a URL is known", () => {
    expect(buildRobots("https://x.dev")).toContain(
      "Sitemap: https://x.dev/sitemap.xml"
    );
    expect(buildRobots(undefined)).not.toContain("Sitemap");
  });
});
