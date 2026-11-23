export const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
export const HAUNT_WORD = ["h", "a", "u", "n", "t"];

const norm = (k: string) => (k.length === 1 ? k.toLowerCase() : k);

/**
 * Watches a stream of key names and calls onMatch when any sequence is typed.
 * Keeps a rolling buffer, so overlapping starts ("up up up down…") still match.
 */
export function createSequenceDetector(
  sequences: string[][],
  onMatch: () => void
): (key: string) => void {
  const seqs = sequences.map(s => s.map(norm));
  const max = Math.max(...seqs.map(s => s.length));
  let buffer: string[] = [];
  return key => {
    buffer = [...buffer, norm(key)].slice(-max);
    const hit = seqs.some(
      s =>
        buffer.length >= s.length &&
        s.every((k, i) => buffer[buffer.length - s.length + i] === k)
    );
    if (hit) {
      buffer = [];
      onMatch();
    }
  };
}

/** Never trigger while someone is typing into a field. */
export function shouldIgnoreTarget(
  t: {
    tagName?: string;
    isContentEditable?: boolean;
    closest?: (selector: string) => unknown;
  } | null
): boolean {
  if (!t) return false;
  if (t.isContentEditable) return true;
  // Not while a modal (e.g. a case study) is open: the world would open hidden behind it.
  if (t.closest?.("dialog")) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(
    (t.tagName ?? "").toUpperCase()
  );
}
