/**
 * Placeholder handling ("hide until filled").
 * Anything still set to PLACEHOLDER renders in dev with a dashed marker
 * and is hidden entirely in production builds.
 */
export const PLACEHOLDER = "[TODO]" as const;
export type Maybe<T> = T | typeof PLACEHOLDER;

/** Strings: non-empty and free of the marker. Arrays: any item filled. Objects: every value filled. */
export function isFilled(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string")
    return value.trim() !== "" && !value.includes(PLACEHOLDER);
  if (Array.isArray(value)) return value.some(isFilled);
  if (typeof value === "object") return Object.values(value).every(isFilled);
  return true;
}

export function shouldRender(value: unknown, isDev: boolean): boolean {
  return isDev || isFilled(value);
}

/** List items to render: all of them in dev (with markers), only filled ones in production. */
export function visibleItems<T>(
  list: T[] | typeof PLACEHOLDER,
  isDev: boolean
): (T | typeof PLACEHOLDER)[] {
  const items: (T | typeof PLACEHOLDER)[] = Array.isArray(list) ? list : [list];
  return isDev ? items : items.filter(isFilled);
}

/** Dotted paths of every unfilled leaf, used for the build-time warning. */
export function listUnfilled(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v, i) =>
      listUnfilled(v, path ? `${path}.${i}` : String(i))
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      listUnfilled(v, path ? `${path}.${k}` : k)
    );
  }
  return isFilled(value) ? [] : [path];
}
