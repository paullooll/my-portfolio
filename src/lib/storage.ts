/** Storage wrapper that never throws (private mode, blocked cookies, SSR). */
export interface SafeStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export function safeStorage(kind: "local" | "session"): SafeStorage {
  const store = (): Storage | undefined => {
    try {
      return kind === "local"
        ? globalThis.localStorage
        : globalThis.sessionStorage;
    } catch {
      return undefined;
    }
  };
  return {
    get(key) {
      try {
        return store()?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        store()?.setItem(key, value);
      } catch {
        /* storage unavailable: ignore */
      }
    },
  };
}
