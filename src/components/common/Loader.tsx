'use client';

// Loader — generic full-area or inline spinner.
// Used as a Suspense fallback or while async data loads.

interface Props {
  /** 'full' fills the parent container; 'inline' renders a small spinner. */
  variant?: 'full' | 'inline';
  label?: string;
}

export default function Loader({ variant = 'full', label = 'Loading...' }: Props) {
  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
        <span className="w-3 h-3 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
        {label}
      </span>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center min-h-[120px]" role="status" aria-label={label}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[var(--text-muted)]">{label}</span>
      </div>
    </div>
  );
}
