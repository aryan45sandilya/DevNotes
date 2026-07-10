'use client';

// ============================================================
// ThemeContext — provides dark/light mode toggle across the app.
// Uses next-themes under the hood; this wrapper keeps component
// code framework-agnostic (just call useTheme()).
// ============================================================

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"        // toggles 'dark' class on <html>
      defaultTheme="dark"      // start dark per design intent
      enableSystem={false}     // explicit toggle only — no OS sync
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
