'use client';

// NoteActions — toolbar of bulk / contextual note actions
// (create, filter favorites). Sits at the top of the NoteList.

import { Plus, Heart } from 'lucide-react';

interface Props {
  filterFavorites: boolean;
  onCreateNote: () => void;
  onToggleFilter: () => void;
}

export default function NoteActions({ filterFavorites, onCreateNote, onToggleFilter }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onToggleFilter}
        className={`p-1 rounded transition-colors ${
          filterFavorites ? 'text-rose-400 bg-rose-400/5' : 'text-[var(--text-muted)] hover:text-rose-400'
        }`}
        title="Filter favorites"
        aria-label="Toggle favorites filter"
        aria-pressed={filterFavorites}
      >
        <Heart className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onCreateNote}
        className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-cyber-cyan transition-colors"
        title="New note"
        aria-label="Create new note"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
