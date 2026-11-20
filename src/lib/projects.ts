import type { Project, Tag } from "../content";

export type Filter = Tag | "All";

/** Filter buttons, in display order. */
export const FILTERS: Filter[] = [
  "All",
  "Web",
  "Data",
  "Security",
  "Work",
  "School",
];

/**
 * Projects to show for a filter. "All" without `showAll` shows only the
 * featured projects (the home-page view); any tag shows every match.
 */
export function filterProjects(
  projects: Project[],
  filter: Filter,
  showAll = true
): Project[] {
  if (filter !== "All") return projects.filter(p => p.tags.includes(filter));
  if (showAll) return projects;
  const featured = projects.filter(p => p.featured);
  return featured.length ? featured : projects;
}

/** "#project-solid" → "solid" when that project exists, else null. */
export function projectIdFromHash(
  hash: string,
  projects: Project[]
): string | null {
  const m = /^#project-(.+)$/.exec(hash);
  if (!m) return null;
  let id: string;
  try {
    id = decodeURIComponent(m[1]);
  } catch {
    return null; // malformed share link, e.g. "#project-%"
  }
  return projects.some(p => p.id === id) ? id : null;
}

/**
 * Where keyboard focus goes after a case study closes: the element that opened
 * it, else that project's card (deep links), else the Projects heading (card
 * filtered out).
 */
export function closeFocusTarget(
  id: string | null,
  opener: HTMLElement | null,
  find: (selector: string) => HTMLElement | null
): HTMLElement | null {
  if (opener) return opener;
  return (
    (id ? find(`[data-project="${id}"]`) : null) ?? find("#projects-heading")
  );
}
