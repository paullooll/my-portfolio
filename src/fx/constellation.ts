/**
 * Pure math for the "Network Constellation" background: particle setup,
 * drift with edge wrapping, and the link-opacity curve. No DOM here, so it is
 * unit-tested in constellation.test.ts.
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/** Particle budget for a viewport: scales with area, capped harder on small/touch screens. */
export function particleCount(
  width: number,
  height: number,
  compact: boolean
): number {
  const byArea = Math.round((width * height) / 15000);
  const cap = compact ? 36 : 90;
  return Math.max(12, Math.min(cap, byArea));
}

/** Seeded-free random particles; `rand` is injectable for tests. */
export function createParticles(
  n: number,
  width: number,
  height: number,
  rand: () => number = Math.random
): Particle[] {
  return Array.from({ length: n }, () => {
    const angle = rand() * Math.PI * 2;
    const speed = 0.08 + rand() * 0.17; // px per frame at 60fps: slow drift
    return {
      x: rand() * width,
      y: rand() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 0.8 + rand() * 1.4,
    };
  });
}

/** Advance every particle by `dt` frames (1 = one 60fps frame) and wrap at the edges. */
export function step(
  ps: Particle[],
  width: number,
  height: number,
  dt: number
): void {
  const pad = 20;
  for (const p of ps) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.x < -pad) p.x = width + pad;
    else if (p.x > width + pad) p.x = -pad;
    if (p.y < -pad) p.y = height + pad;
    else if (p.y > height + pad) p.y = -pad;
  }
}

/** Line opacity for two points `dist` apart: 1 when touching, 0 at `max` and beyond. */
export function linkAlpha(dist: number, max: number): number {
  if (dist >= max) return 0;
  const t = 1 - dist / max;
  return t * t; // ease out so long links stay faint
}
