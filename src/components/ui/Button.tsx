'use client';

// Button — base primitive for all interactive button elements.
// Supports variant, size, loading state, and icon slots.

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary:   'bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/20',
  secondary: 'bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]',
  ghost:     'bg-transparent border border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
  danger:    'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
};

const SIZE_CLASS: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-[11px] gap-1',
  md: 'px-3.5 py-1.5 text-xs gap-1.5',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export default function Button({
  variant = 'secondary',
  size    = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-xl font-mono font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan/50 disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
    >
      {isLoading ? (
        <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
