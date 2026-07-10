// helpers.ts — general-purpose utility functions.
// Keep each function pure and side-effect free.

/**
 * Generates a short random ID with an optional prefix.
 * @example uid('note') → 'note-3f7a'
 */
export function uid(prefix = ''): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return prefix ? `${prefix}-${rand}` : rand;
}

/**
 * Clamps a number between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Truncates a string to `maxLength` characters, appending '…' if cut.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}

/**
 * Returns true when running in a browser context (not SSR).
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Shallow-merges `patch` into `target` and returns a new object.
 * Convenience wrapper used in update handlers across the app.
 */
export function merge<T extends object>(target: T, patch: Partial<T>): T {
  return { ...target, ...patch };
}
