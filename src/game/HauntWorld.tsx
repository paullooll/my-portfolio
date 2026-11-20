import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, X } from "lucide-react";
import content, { type SectionId } from "../content";
import type { AchievementId } from "../lib/achievements";
import { visibleSections } from "../lib/sections";
import { prefersReducedMotion } from "../motion/reducedMotion";
import { drawWorld, readPalette } from "./render";
import {
  MAP,
  TILE,
  canMove,
  collectOrb,
  doorAt,
  orbsLeft,
  parseMap,
  type World,
} from "./world";

type Dir = "up" | "down" | "left" | "right";
const DELTA: Record<Dir, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};
const KEYS: Record<string, Dir> = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
};
const STEP_MS = 130;

/**
 * The hidden playable world (spec §5.10). Lazy-loaded: never part of the
 * first page load. Walk Haunt into a door to jump to that section.
 */
export default function HauntWorld({
  onClose,
  onGoTo,
  onUnlock,
}: {
  onClose: () => void;
  onGoTo: (id: SectionId) => void;
  onUnlock: (id: AchievementId) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<Element | null>(null);
  const visible = useMemo(
    () => visibleSections(content, import.meta.env.DEV),
    []
  );
  const worldRef = useRef<World>(parseMap(MAP, visible));
  const pos = useRef({ ...worldRef.current.start });
  const drawPos = useRef({ ...worldRef.current.start });
  const held = useRef<Dir | null>(null);
  const lastStep = useRef(0);
  const [door, setDoor] = useState<SectionId | null>(null);
  const [orbs, setOrbs] = useState(orbsLeft(worldRef.current));
  const coarse = useMemo(() => {
    try {
      return window.matchMedia("(pointer: coarse)").matches;
    } catch {
      return false;
    }
  }, []);
  const labels = useMemo(
    () =>
      Object.fromEntries(content.sections.map(s => [s.id, s.plain])) as Record<
        string,
        string
      >,
    []
  );

  const step = useCallback(
    (dir: Dir) => {
      const [dx, dy] = DELTA[dir];
      const nx = pos.current.x + dx;
      const ny = pos.current.y + dy;
      if (!canMove(worldRef.current, nx, ny)) return;
      pos.current = { x: nx, y: ny };
      const before = orbsLeft(worldRef.current);
      worldRef.current = collectOrb(worldRef.current, nx, ny);
      const after = orbsLeft(worldRef.current);
      if (after !== before) {
        setOrbs(after);
        if (after === 0) onUnlock("collected-orbs");
      }
      setDoor(doorAt(worldRef.current, nx, ny));
    },
    [onUnlock]
  );

  // Focus management + achievement on open.
  useEffect(() => {
    prevFocus.current = document.activeElement;
    closeRef.current?.focus();
    onUnlock("found-egg");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      (prevFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [onUnlock]);

  // Keyboard: arrows/WASD move, Esc closes, Enter follows a door.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        // Keep focus inside the overlay.
        const root = closeRef.current?.closest(".world");
        const items = root
          ? Array.from(root.querySelectorAll<HTMLElement>("button"))
          : [];
        if (!items.length) return;
        const i = items.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey
          ? i <= 0
            ? items.length - 1
            : i - 1
          : (i + 1) % items.length;
        e.preventDefault();
        items[next].focus();
        return;
      }
      const dir = KEYS[e.key];
      if (dir) {
        e.preventDefault();
        if (held.current !== dir) {
          held.current = dir;
          lastStep.current = performance.now();
          step(dir);
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      if (KEYS[e.key] === held.current) held.current = null;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onClose, step]);

  // Render loop (pauses in hidden tabs).
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const w = worldRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = prefersReducedMotion();
    let palette = readPalette();
    let raf = 0;

    const fit = () => {
      const scale = Math.max(
        1,
        Math.floor(
          Math.min(
            (window.innerWidth - 32) / (w.width * TILE),
            (window.innerHeight - 220) / (w.height * TILE)
          ) * 2
        ) / 2
      );
      canvas.style.width = w.width * TILE * scale + "px";
      canvas.style.height = w.height * TILE * scale + "px";
      canvas.width = w.width * TILE * scale * dpr;
      canvas.height = w.height * TILE * scale * dpr;
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    fit();

    const frame = (t: number) => {
      if (held.current && t - lastStep.current > STEP_MS) {
        lastStep.current = t;
        step(held.current);
      }
      const k = reduced ? 1 : 0.35;
      drawPos.current.x += (pos.current.x - drawPos.current.x) * k;
      drawPos.current.y += (pos.current.y - drawPos.current.y) * k;
      drawWorld(
        ctx,
        worldRef.current,
        drawPos.current,
        reduced ? 0 : t,
        palette,
        labels
      );
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    const onTheme = new MutationObserver(() => (palette = readPalette()));
    onTheme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(raf);
      onTheme.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", fit);
    };
  }, [labels, step]);

  const doorMeta = door ? content.sections.find(s => s.id === door) : null;
  const pad = (dir: Dir) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      held.current = dir;
      lastStep.current = performance.now();
      step(dir);
    },
    onPointerUp: () => (held.current = null),
    onPointerLeave: () => (held.current = null),
  });

  return (
    <div
      className="world"
      role="dialog"
      aria-modal="true"
      aria-label="Haunt world"
    >
      <header className="world-head">
        <p className="hud-label">
          <span className="accent">HAUNT WORLD</span> · Soul orbs left: {orbs} ·
          Arrows/WASD to move · Esc to exit
        </p>
        <button
          ref={closeRef}
          type="button"
          className="hud-btn"
          onClick={onClose}
        >
          <X size={16} aria-hidden="true" />{" "}
          <span className="hud-label">Exit</span>
        </button>
      </header>
      <canvas
        ref={canvasRef}
        className="world-canvas"
        aria-label="Top-down town map with Haunt and five buildings"
        role="img"
      />
      <div className="world-card panel" aria-live="polite">
        {doorMeta ? (
          <>
            <p className="hud-label accent">{doorMeta.game}</p>
            <p>
              <strong>{doorMeta.plain}.</strong> {doorMeta.summary}
            </p>
            <button
              type="button"
              className="button button-primary"
              onClick={() => onGoTo(doorMeta.id)}
            >
              ▶ Go there
            </button>
          </>
        ) : (
          <p className="muted">
            Walk Haunt into a door to visit that part of the portfolio. Collect
            all soul orbs for a secret.
          </p>
        )}
      </div>
      {coarse && (
        <div className="dpad" aria-label="Movement controls">
          <button
            type="button"
            className="dpad-up"
            aria-label="Up"
            {...pad("up")}
          >
            <ArrowUp aria-hidden="true" />
          </button>
          <button
            type="button"
            className="dpad-left"
            aria-label="Left"
            {...pad("left")}
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="dpad-right"
            aria-label="Right"
            {...pad("right")}
          >
            <ArrowRight aria-hidden="true" />
          </button>
          <button
            type="button"
            className="dpad-down"
            aria-label="Down"
            {...pad("down")}
          >
            <ArrowDown aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
