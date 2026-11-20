import type { SectionId, SiteContent } from "../content";

/**
 * Section ids to render, in page order. Every section in the Signal layout has
 * real content, so all are visible; empty sections were removed from content.ts
 * instead of being hidden here. Kept as a function so the nav, the page and the
 * easter-egg world all agree on one list.
 */
export function visibleSections(c: SiteContent, _isDev = false): SectionId[] {
  return c.sections.map(s => s.id);
}
