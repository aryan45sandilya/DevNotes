// ── Date formatting utilities ─────────────────────────────
// All date/time formatting is centralised here so locale is
// always pinned to 'en-US' — preventing SSR hydration mismatches.

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
  });
}
