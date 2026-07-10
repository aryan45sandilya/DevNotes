'use client';

// EmptyState — generic zero-results / empty-list placeholder.
// Pass an icon, a heading, a sub-message, and an optional CTA.

import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center select-none">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-2xl">
          {icon}
        </div>
      )}
      <p className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-muted)] uppercase">{title}</p>
      {description && (
        <p className="text-xs text-[var(--text-secondary)] max-w-[200px]">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
