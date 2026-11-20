/** True in `pnpm dev`, false in production builds. */
export function useIsDev(): boolean {
  return import.meta.env.DEV;
}
