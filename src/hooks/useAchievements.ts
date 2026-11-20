import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ACHIEVEMENTS,
  createAchievements,
  type AchievementId,
} from "@/lib/achievements";
import { safeStorage } from "@/lib/storage";

/** Unlock achievements and show an "Achievement unlocked" toast the first time. */
export function useAchievements() {
  const tracker = useMemo(() => createAchievements(safeStorage("local")), []);
  const [count, setCount] = useState(0);
  useEffect(() => setCount(tracker.unlocked().length), [tracker]);

  const unlock = useCallback(
    (id: AchievementId) => {
      if (!tracker.unlock(id)) return;
      setCount(tracker.unlocked().length);
      void import("sonner").then(({ toast }) =>
        toast(`★ Achievement unlocked: ${ACHIEVEMENTS[id].title}`)
      );
    },
    [tracker]
  );

  return { unlock, count };
}
