// Card — glass surface container.
// The base visual building block used wherever a rounded,
// bordered panel is needed. Supports optional header/footer slots.

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Use 'glass' for the frosted backdrop variant. */
  variant?: 'default' | 'glass';
}

export default function Card({ children, header, footer, className = '', variant = 'default' }: Props) {
  const base = variant === 'glass'
    ? 'glass-panel'
    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)]';

  return (
    <div className={`rounded-2xl overflow-hidden ${base} ${className}`}>
      {header && (
        <div className="px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]">
          {footer}
        </div>
      )}
    </div>
  );
}
