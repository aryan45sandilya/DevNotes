'use client';

// NoteCard — a single note entry in the NoteList.
// Extracted so NoteList stays a pure list manager and card
// rendering logic (pin, favorite, delete, tags, meta) is isolated.

import { Pin, Heart, Trash2, Hash } from 'lucide-react';
import ClientDate from '@/components/common/ClientDate';
import type { Note } from '@/types';

interface Props {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export default function NoteCard({
  note, isActive, onSelect, onDelete, onTogglePin, onToggleFavorite,
}: Props) {
  const readTime = Math.max(1, Math.ceil(note.content.split(/\s+/).filter(Boolean).length / 200));

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-xl border select-none cursor-pointer transition-all duration-200 group relative flex flex-col gap-1.5 ${
        isActive
          ? 'border-cyber-purple bg-cyber-purple/5 shadow-[0_0_15px_rgba(139,92,246,0.05)]'
          : 'border-[var(--border-subtle)] hover:border-[var(--border-default)] hover:bg-[var(--bg-card)]'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
      aria-label={`Open note: ${note.title}`}
      aria-selected={isActive}
    >
      {/* Title row */}
      <div className="flex justify-between items-center">
        <span className={`text-xs font-medium truncate pr-4 ${isActive ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}>
          {note.title}
        </span>
        <div className="flex items-center gap-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onTogglePin}
            className={`p-0.5 rounded hover:bg-[var(--bg-hover)] transition-colors ${note.pinned ? 'text-cyber-cyan' : 'text-[var(--text-muted)]'}`}
            title={note.pinned ? 'Unpin' : 'Pin'}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className="w-3 h-3" />
          </button>
          <button
            onClick={onToggleFavorite}
            className={`p-0.5 rounded hover:bg-[var(--bg-hover)] transition-colors ${note.favorite ? 'text-rose-400' : 'text-[var(--text-muted)]'}`}
            title={note.favorite ? 'Unfavorite' : 'Favorite'}
            aria-label={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-0.5 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {note.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="flex items-center gap-0.5 text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-subtle)] px-1.5 py-0.5 rounded-full"
            >
              <Hash className="w-2 h-2" />{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[9px] font-mono text-[var(--text-muted)]">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between">
        <ClientDate iso={note.updatedAt} type="date" className="text-[9px] font-mono text-[var(--text-muted)]" />
        <span className="text-[9px] font-mono text-[var(--text-muted)]">{readTime} min read</span>
      </div>
    </div>
  );
}
