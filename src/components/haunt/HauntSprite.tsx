import { useMemo } from "react";
import { HAUNT_GRID, SLEEP_EYES, gridRuns } from "./grid";

export type HauntState =
  | "idle"
  | "talk"
  | "wave"
  | "point-left"
  | "point-right"
  | "phase"
  | "surprised"
  | "sleep";

/**
 * Haunt, drawn as an SVG grid of pixel runs. Colours come from CSS tokens
 * (--haunt-body, --accent, --ink...) so it re-themes automatically.
 * Animation per state lives in haunt.css; reduced motion disables it.
 */
export function HauntSprite({
  state = "idle",
  size = 72,
  className = "",
}: {
  state?: HauntState;
  size?: number;
  className?: string;
}) {
  const runs = useMemo(() => {
    const rows =
      state === "sleep"
        ? HAUNT_GRID.map((r, i) => SLEEP_EYES[i] ?? r)
        : HAUNT_GRID;
    return gridRuns(rows);
  }, [state]);

  return (
    <svg
      className={`haunt haunt-${state} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <g className="haunt-body-g">
        {runs
          .filter(r => r.part !== "eye" && r.part !== "pupil")
          .map(r => (
            <rect
              key={`${r.x}-${r.y}`}
              x={r.x}
              y={r.y}
              width={r.w}
              height={1}
              className={`h-${r.part}`}
            />
          ))}
      </g>
      <g className="haunt-eyes">
        {runs
          .filter(r => r.part === "eye" || r.part === "pupil")
          .map(r => (
            <rect
              key={`${r.x}-${r.y}`}
              x={r.x}
              y={r.y}
              width={r.w}
              height={1}
              className={`h-${r.part}`}
            />
          ))}
      </g>
      {state === "sleep" && (
        <text x="19" y="4" className="haunt-zzz">
          z
        </text>
      )}
    </svg>
  );
}
