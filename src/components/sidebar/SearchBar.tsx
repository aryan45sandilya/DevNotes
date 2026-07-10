'use client';

// SearchBar — the clickable search trigger that opens the
// CommandPalette. Lives in the sidebar/header so it can be
// reused in either location without duplicating markup.

import { Search } from 'lucide-react';

interface Props {
  onClick: () => void;
  /** If true, renders a compact icon-only button (mobile). */
  compact?: boolean;
}

export default function SearchBar({ onClick, compact = false }: Props) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex-1 max-w-sm mx-3 px-3.5 py-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all hidden md:flex items-center justify-between text-xs text-[var(--text-muted)]"
      aria-label="Open command palette"
    >
      <div className="flex items-center gap-2.5">
        <Search className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
        <span>Search notes...</span>
      </div>
      <span className="font-mono text-[9px] bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5">
        Ctrl+K
      </span>
    </button>
  );
}
