// themeStore.ts — re-exports the theme hook as the canonical
// theme accessor. Swap the underlying implementation here
// without touching any consumer component.

export { useTheme } from '@/hooks/useTheme';
