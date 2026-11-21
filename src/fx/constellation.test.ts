import { describe, expect, it } from "vitest";
import { createParticles, linkAlpha, particleCount, step } from "./constellation";

describe("particleCount", () => {
  it("caps compact (mobile) screens at 36", () => {
    expect(particleCount(1200, 2000, true)).toBe(36);
  });
  it("caps large desktop screens at 90", () => {
    expect(particleCount(3840, 2160, false)).toBe(90);
  });
  it("never goes below 12", () => {
    expect(particleCount(100, 100, false)).toBe(12);
  });
});

describe("step", () => {
  it("wraps particles that leave an edge", () => {
    const [p] = createParticles(1, 100, 100, () => 0.5);
    p.x = 125;
    p.vx = 1;
    step([p], 100, 100, 1);
    expect(p.x).toBe(-20);
  });
  it("moves by velocity times dt", () => {
    const ps = [{ x: 10, y: 10, vx: 1, vy: -0.5, r: 1 }];
    step(ps, 100, 100, 2);
    expect(ps[0]).toMatchObject({ x: 12, y: 9 });
  });
});

describe("linkAlpha", () => {
  it("is 1 at zero distance and 0 at or past max", () => {
    expect(linkAlpha(0, 100)).toBe(1);
    expect(linkAlpha(100, 100)).toBe(0);
    expect(linkAlpha(150, 100)).toBe(0);
  });
  it("fades between", () => {
    expect(linkAlpha(50, 100)).toBeCloseTo(0.25);
  });
});
