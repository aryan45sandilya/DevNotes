'use client';

// useTheme — thin wrapper around next-themes' useTheme.
// Keeps component code decoupled from next-themes internals
// and adds a convenience `isDark` boolean.

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return { theme, setTheme, resolvedTheme, isDark, mounted, toggleTheme };
}
