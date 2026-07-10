'use client';

import { Plus, Heart, Pin, Trash2, Hash } from 'lucide-react';
import ClientDate from '@/components/common/ClientDate';
import type { Note } from '@/types';

interface Props {
  notes: Note[];
  activeNoteId: string;
  filterFavorites: boolean;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onToggleFilter: () => void;
}

export default function NoteList({
  notes, activeNoteId, filterFavorites,
  onSelectNote, onCreateNote, onDeleteNote,
  onTogglePin, onToggleFavorite, onToggleFilter,
}: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-card)]">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-widest font-mono text-[var(--text-muted)] font-bold">COMPILED FILES</span>
          {filterFavorites && (
            <span className="text-[8px] font-mono text-rose-400 border border-rose-400/20 bg-rose-400/5 px-1 rounded">FAVS</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleFilter}
            className={`p-1 rounded transition-colors ${filterFavorites ? 'text-rose-400 bg-rose-400/5' : 'text-[var(--text-muted)] hover:text-rose-400'}`}
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
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {notes.length === 0 ? (
          <div className="py-12 text-center select-none">
            <p className="text-[10px] font-mono text-[var(--text-muted)] mb-1">NO FILES HERE</p>
            <button onClick={onCreateNote} className="text-[11px] font-mono text-cyber-cyan hover:underline">+ Create Note</button>
          </div>
        ) : (
          notes.map(note => {
            const isActive  = note.id === activeNoteId;
            const readTime  = Math.max(1, Math.ceil(note.content.split(/\s+/).filter(Boolean).length / 200));
            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`p-3 rounded-xl border select-none cursor-pointer transition-all duration-200 group relative flex flex-col gap-1.5 ${
                  isActive
                    ? 'border-cyber-purple bg-cyber-purple/5 shadow-[0_0_15px_rgba(139,92,246,0.05)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-default)] hover:bg-[var(--bg-card)]'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onSelectNote(note.id)}
                aria-label={`Open note: ${note.title}`}
                aria-selected={isActive}
              >
                {/* Title row */}
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium truncate pr-4 ${isActive ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                    {note.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => onTogglePin(note.id, e)} className={`p-0.5 rounded hover:bg-[var(--bg-hover)] transition-colors ${note.pinned ? 'text-cyber-cyan' : 'text-[var(--text-muted)]'}`} title={note.pinned ? 'Unpin' : 'Pin'} aria-label={note.pinned ? 'Unpin note' : 'Pin note'}><Pin className="w-3 h-3" /></button>
                    <button onClick={e => onToggleFavorite(note.id, e)} className={`p-0.5 rounded hover:bg-[var(--bg-hover)] transition-colors ${note.favorite ? 'text-rose-400' : 'text-[var(--text-muted)]'}`} title={note.favorite ? 'Unfavorite' : 'Favorite'} aria-label={note.favorite ? 'Remove from favorites' : 'Add to favorites'}><Heart className="w-3 h-3" /></button>
                    <button onClick={e => onDeleteNote(note.id, e)} className="p-0.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-red-400 transition-colors" title="Delete note" aria-label="Delete note"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="flex items-center gap-0.5 text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-subtle)] px-1.5 py-0.5 rounded-full">
                        <Hash className="w-2 h-2" />{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && <span className="text-[9px] font-mono text-[var(--text-muted)]">+{note.tags.length - 3}</span>}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <ClientDate iso={note.updatedAt} type="date" className="text-[9px] font-mono text-[var(--text-muted)]" />
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">{readTime} min read</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
