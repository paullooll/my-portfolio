/**
 * Build-time SEO + content checks (spec §5.11, §5.13).
 * - Injects <title>, meta, Open Graph/Twitter tags and Person JSON-LD into index.html.
 * - Emits robots.txt (and sitemap.xml when VITE_SITE_URL is set).
 * - Prints every field still set to [TODO] as a build warning.
 */
import type { Plugin } from "vite";
import { loadEnv } from "vite";
import content, { type SiteContent } from "../src/content";
import { listUnfilled } from "../src/lib/placeholder";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const withSlash = (url: string) => url.replace(/\/?$/, "/");

export function buildHead(c: SiteContent, siteUrl: string | undefined): string {
  const title = `${c.name} — ${c.role}`;
  const description = `${c.role} in ${c.location}. ${c.valueStatement}`;
  const url = siteUrl ? withSlash(siteUrl) : undefined;
  const image = url ? `${url}og-image.png` : undefined;

  const person: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.name,
    jobTitle: c.role,
    worksFor: {
      "@type": "GovernmentOrganization",
      name: "Iloilo City Government",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "West Visayas State University",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Iloilo City",
      addressCountry: "PH",
    },
    knowsAbout: c.about.training,
    sameAs: c.socials.map(s => s.href),
  };
  if (url) person.url = url;
  if (image) person.image = image;

  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="theme-color" content="#0A0A0B" media="(prefers-color-scheme: dark)" />`,
    `<meta name="theme-color" content="#FAFAFA" media="(prefers-color-scheme: light)" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  ];
  if (url) {
    tags.push(
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta property="og:url" content="${esc(url)}" />`
    );
  }
  if (image) {
    tags.push(
      `<meta property="og:image" content="${esc(image)}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta name="twitter:image" content="${esc(image)}" />`
    );
  }
  // JSON-LD: escape "<" so content can never close the script tag.
  tags.push(
    `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, "\\u003c")}</script>`
  );
  return tags.map(t => `    ${t}`).join("\n");
}

export function buildSitemap(siteUrl: string): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    `  <url><loc>${esc(withSlash(siteUrl))}</loc><changefreq>monthly</changefreq></url>`,
    `</urlset>`,
    ``,
  ].join("\n");
}

export function buildRobots(siteUrl: string | undefined): string {
  const lines = ["User-agent: *", "Allow: /"];
  if (siteUrl) lines.push(`Sitemap: ${withSlash(siteUrl)}sitemap.xml`);
  return lines.join("\n") + "\n";
}

export function portfolioPlugin(): Plugin {
  let siteUrl: string | undefined;
  let isBuild = false;
  return {
    name: "portfolio-seo",
    configResolved(config) {
      isBuild = config.command === "build";
      const env = loadEnv(config.mode, config.root, "VITE_");
      siteUrl = env.VITE_SITE_URL?.trim() || undefined;
    },
    transformIndexHtml(html) {
      return html.replace(
        "<!-- seo -->",
        buildHead(content, siteUrl).trimStart()
      );
    },
    generateBundle() {
      if (!isBuild) return;
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: buildRobots(siteUrl),
      });
      if (siteUrl)
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: buildSitemap(siteUrl),
        });

      const missing = listUnfilled(content);
      if (!siteUrl)
        missing.push(
          "VITE_SITE_URL (env): no canonical URL, sitemap or OG image URL"
        );
      if (missing.length) {
        const y = (s: string) => `\x1b[33m${s}\x1b[0m`;
        console.warn(
          y(
            `\n[portfolio] ${missing.length} field(s) still [TODO] — hidden on the live site:`
          ) +
            "\n" +
            missing.map(m => y(`  • ${m}`)).join("\n") +
            "\n"
        );
      }
    },
  };
}
