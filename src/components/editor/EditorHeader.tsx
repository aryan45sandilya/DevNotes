'use client';

// EditorHeader — renders the note title input and tag chips.
// Extracted from Editor.tsx so the editor body stays focused on
// the textarea / preview split only.

import type { Note } from '@/types';

interface Props {
  note: Note;
  onUpdateNote: (fields: Partial<Note>) => void;
}

export default function EditorHeader({ note, onUpdateNote }: Props) {
  return (
    <div className="px-6 pt-5 pb-3 border-b border-[var(--border-subtle)]">
      <input
        type="text"
        value={note.title}
        onChange={e => onUpdateNote({ title: e.target.value })}
        className="w-full bg-transparent text-lg font-bold font-display text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
        placeholder="Note title..."
        aria-label="Note title"
      />
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {note.tags.map(tag => (
          <span
            key={tag}
            className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/5 border border-cyber-cyan/20 px-2 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
        <button
          onClick={() => {
            const t = prompt('Add tag:');
            if (t?.trim()) onUpdateNote({ tags: [...note.tags, t.trim()] });
          }}
          className="text-[10px] font-mono text-[var(--text-muted)] hover:text-cyber-cyan transition-colors px-2 py-0.5 rounded-full border border-dashed border-[var(--border-default)] hover:border-cyber-cyan/30"
          aria-label="Add tag"
        >
          + tag
        </button>
      </div>
    </div>
  );
}
