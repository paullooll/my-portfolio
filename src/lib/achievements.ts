import type { SafeStorage } from "./storage";

export type AchievementId =
  | "reached-missions"
  | "downloaded-cv"
  | "sent-message"
  | "toggled-theme"
  | "found-egg"
  | "collected-orbs";

export const ACHIEVEMENTS: Record<AchievementId, { title: string }> = {
  "reached-missions": { title: "Mission briefing reached" },
  "downloaded-cv": { title: "Intel acquired: CV downloaded" },
  "sent-message": { title: "Transmission sent" },
  "toggled-theme": { title: "Day/night cycle discovered" },
  "found-egg": { title: "Secret world found" },
  "collected-orbs": { title: "All soul orbs collected" },
};

export const ACHIEVEMENT_TOTAL = Object.keys(ACHIEVEMENTS).length;

/** Achievements a visitor can actually earn (the CV one needs the CV button). */
export function reachableTotal(cvAvailable: boolean): number {
  return ACHIEVEMENT_TOTAL - (cvAvailable ? 0 : 1);
}
const KEY = "achievements";

/** Achievement tracker persisted as a JSON list. Survives broken or missing storage. */
export function createAchievements(storage: SafeStorage) {
  let list: AchievementId[] = [];
  try {
    const parsed: unknown = JSON.parse(storage.get(KEY) ?? "[]");
    if (Array.isArray(parsed))
      list = parsed.filter((x): x is AchievementId => x in ACHIEVEMENTS);
  } catch {
    list = [];
  }

  return {
    /** Returns true only the first time an achievement is unlocked. */
    unlock(id: AchievementId): boolean {
      if (list.includes(id)) return false;
      list = [...list, id];
      try {
        storage.set(KEY, JSON.stringify(list));
      } catch {
        /* keep in memory only */
      }
      return true;
    },
    unlocked: (): AchievementId[] => [...list],
  };
}
