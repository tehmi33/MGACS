/**
 * Removes null, undefined, false, "" etc and returns a clean typed array
 * Works perfectly with conditional array elements
 */
export const compact = <T,>(
  arr: (T | null | undefined | false | "" | 0)[]
): T[] => arr.filter(Boolean) as T[];