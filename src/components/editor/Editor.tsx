'use client';

import { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText } from 'lucide-react';
import type { Note } from '@/types';
import MarkdownRenderer from './MarkdownRenderer';
import Toolbar, { type FormatType } from './Toolbar';

interface Props {
  note: Note | undefined;
  showPreview: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  onUpdateNote: (fields: Partial<Note>) => void;
  onTogglePreview: () => void;
  onExport: () => void;
}

export default function Editor({ note, showPreview, saveStatus, onUpdateNote, onTogglePreview, onExport }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineNumbers = useMemo(() => {
    if (!note) return [1];
    return Array.from({ length: note.content.split('\n').length }, (_, i) => i + 1);
  }, [note?.content]);

  const insertFormatting = (type: FormatType) => {
    const ta = textareaRef.current;
    if (!ta || !note) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const sel = ta.value.substring(start, end);
    let insertion = '';
    switch (type) {
      case 'bold':     insertion = `**${sel || 'bold text'}**`; break;
      case 'italic':   insertion = `*${sel || 'italic text'}*`; break;
      case 'code':     insertion = `\n\`\`\`typescript\n${sel || '// code here'}\n\`\`\`\n`; break;
      case 'header':   insertion = `\n## ${sel || 'Section Heading'}\n`; break;
      case 'checkbox': insertion = `\n- [ ] ${sel || 'Task item'}\n`; break;
      case 'table':    insertion = `\n| Column A | Column B | Column C |\n| :--- | :--- | :--- |\n| ${sel || 'Value'} | Value | Value |\n`; break;
    }
    const newContent = ta.value.slice(0, start) + insertion + ta.value.slice(end);
    onUpdateNote({ content: newContent });
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + insertion.length, start + insertion.length); }, 50);
  };

  // ── Empty state ───────────────────────────────────────────
  if (!note) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex items-center justify-center text-[var(--text-muted)] flex-col gap-4 p-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center">
          <FileText className="w-7 h-7 text-[var(--text-muted)] opacity-50" />
        </div>
        <div className="text-center">
          <p className="text-sm font-mono text-[var(--text-muted)]">SELECT OR CREATE A NOTE</p>
          <p className="text-xs text-[var(--text-muted)] opacity-60 mt-1">Pick a note from the sidebar to start editing</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={note.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col overflow-hidden min-w-0"
    >
      {/* Title + tags */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-[var(--border-subtle)]">
        <input
          type="text"
          value={note.title}
          onChange={e => onUpdateNote({ title: e.target.value })}
          className="w-full bg-transparent text-base sm:text-lg font-bold font-display text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-colors"
          placeholder="Note title..."
          aria-label="Note title"
        />
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <AnimatePresence mode="popLayout">
            {note.tags.map(tag => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/5 border border-cyber-cyan/20 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </motion.span>
            ))}
          </AnimatePresence>
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

      <Toolbar onFormat={insertFormatting} onExport={onExport} saveStatus={saveStatus} />

      {/* Editor / Preview split */}
      <div className={`flex-1 flex overflow-hidden ${showPreview ? 'flex-col md:flex-row' : 'flex-row'}`}>
        <div className={`flex overflow-hidden ${showPreview ? 'md:w-1/2 md:border-r border-b md:border-b-0 border-[var(--border-subtle)] min-h-[40%] md:min-h-0' : 'w-full'}`}>
          {/* Line numbers */}
          <div className="select-none text-right pr-3 pl-3 sm:pl-4 py-4 text-[11px] font-mono text-[var(--text-muted)] leading-relaxed min-w-[2.5rem] sm:min-w-[3rem] bg-[var(--bg-card)] border-r border-[var(--border-subtle)] overflow-hidden">
            {lineNumbers.map(n => <div key={n} className="h-[1.5rem]">{n}</div>)}
          </div>
          <textarea
            ref={textareaRef}
            value={note.content}
            onChange={e => onUpdateNote({ content: e.target.value })}
            spellCheck={false}
            className="flex-1 resize-none bg-transparent p-3 sm:p-4 text-sm font-mono text-[var(--text-secondary)] leading-relaxed focus:outline-none overflow-y-auto"
            style={{ lineHeight: '1.5rem' }}
            aria-label="Markdown editor"
            aria-multiline="true"
          />
        </div>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="md:w-1/2 flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--bg-base)]"
            >
              <MarkdownRenderer content={note.content} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] text-[10px] font-mono text-[var(--text-muted)]">
        <span className="hidden xs:block">
          {note.content.split(/\s+/).filter(Boolean).length} words · {note.content.split('\n').length} lines
        </span>
        <span className="xs:hidden">
          {note.content.split('\n').length}L
        </span>
        <button
          onClick={onTogglePreview}
          className="flex items-center gap-1.5 hover:text-cyber-cyan transition-colors"
          aria-label={showPreview ? 'Hide preview' : 'Show preview'}
        >
          {showPreview ? '⊟ Hide Preview' : '⊞ Show Preview'}
        </button>
      </div>
    </motion.div>
  );
}
