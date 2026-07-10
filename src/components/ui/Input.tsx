'use client';

// Input — base text input primitive.
// Handles focus ring, error state, and optional icon prefix.

import type { InputHTMLAttributes, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export default function Input({ label, error, leftIcon, className = '', id, ...rest }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--text-muted)]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[var(--text-muted)] pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full rounded-xl border bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-cyan/40 ${
            error
              ? 'border-red-500/50 focus:ring-red-500/40'
              : 'border-[var(--border-default)] hover:border-[var(--border-subtle)]'
          } ${leftIcon ? 'pl-9' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && (
        <p className="text-[10px] font-mono text-red-400">{error}</p>
      )}
    </div>
  );
}
