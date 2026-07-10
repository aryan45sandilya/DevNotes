'use client';

import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating `value` until `delay` ms have
 * passed since the last change. Useful for search inputs that
 * trigger expensive filtering on every keystroke.
 *
 * @example
 *   const debouncedQuery = useDebounce(query, 300);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
