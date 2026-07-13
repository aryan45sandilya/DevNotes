'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
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

// Check if cursor is inside **bold** markers
function isCursorInBold(value: string, pos: number): boolean {
  // Find all **..** pairs and check if pos is inside one
  const re = /\*\*([^*]+)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    const inner_start = m.index + 2;
    const inner_end   = m.index + 2 + m[1].length;
    if (pos >= inner_start && pos <= inner_end) return true;
  }
  return false;
}

// Check if cursor is inside *italic* markers (not **)
function isCursorInItalic(value: string, pos: number): boolean {
  const re = /(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    const inner_start = m.index + 1;
    const inner_end   = m.index + 1 + m[1].length;
    if (pos >= inner_start && pos <= inner_end) return true;
  }
  return false;
}

export default function Editor({ note, showPreview, saveStatus, onUpdateNote, onTogglePreview, onExport }: Props) {
  const textareaRef   = useRef<HTMLTextAreaElement>(null);
  const pendingSelect = useRef<[number, number] | null>(null);
  const [activeFormats, setActiveFormats] = useState<Set<FormatType>>(new Set());
  const [hasSelection,  setHasSelection]  = useState(false);

  // ── Detect active formatting — plain function, called on events only ──
  const detectFormats = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    setHasSelection(s !== e);
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    const lineEnd   = value.indexOf('\n', s);
    const line      = value.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    const active    = new Set<FormatType>();
    if (isCursorInBold(value, s))   active.add('bold');
    if (isCursorInItalic(value, s)) active.add('italic');
    if (/^#{1,6}\s/.test(line))     active.add('header');
    if (/^- \[[ x]\]\s/.test(line)) active.add('checkbox');
    if (/^\|/.test(line))           active.add('table');
    setActiveFormats(active);
  };

  // ── Restore cursor ONLY when content changes from formatting insert ───
  const prevContent = useRef<string>('');
  useEffect(() => {
    if (!note) return;
    if (pendingSelect.current && note.content !== prevContent.current) {
      const ta = textareaRef.current;
      if (ta) {
        const [s, e] = pendingSelect.current;
        pendingSelect.current = null;
        setTimeout(() => { ta.focus(); ta.setSelectionRange(s, e); }, 0);
      }
    }
    prevContent.current = note.content;
  }, [note?.content]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Line numbers ──────────────────────────────────────────
  const lineNumbers = useMemo(() => {
    if (!note) return [1];
    return Array.from({ length: note.content.split('\n').length }, (_, i) => i + 1);
  }, [note?.content]);

  // ── Insert formatting ─────────────────────────────────────
  const insertFormatting = (type: FormatType) => {
    const ta = textareaRef.current;
    if (!ta || !note) return;

    // Read positions BEFORE any state change
    const start  = ta.selectionStart;
    const end    = ta.selectionEnd;
    const sel    = ta.value.substring(start, end);
    const before = ta.value.slice(0, start);
    const after  = ta.value.slice(end);

    let newContent  = '';
    let selectStart = start;
    let selectEnd   = start;

    switch (type) {
      case 'bold': {
        const ph      = sel || 'bold text';
        newContent    = before + `**${ph}**` + after;
        selectStart   = start + 2;
        selectEnd     = start + 2 + ph.length;
        break;
      }
      case 'italic': {
        const ph      = sel || 'italic text';
        newContent    = before + `*${ph}*` + after;
        selectStart   = start + 1;
        selectEnd     = start + 1 + ph.length;
        break;
      }
      case 'code': {
        const ph      = sel || '// code here';
        const block   = `\n\`\`\`typescript\n${ph}\n\`\`\`\n`;
        newContent    = before + block + after;
        selectStart   = before.length + 16;
        selectEnd     = selectStart + ph.length;
        break;
      }
      case 'header': {
        const ph      = sel || 'Section Heading';
        const line    = `\n## ${ph}\n`;
        newContent    = before + line + after;
        selectStart   = before.length + 5;
        selectEnd     = selectStart + ph.length;
        break;
      }
      case 'checkbox': {
        const ph      = sel || 'Task item';
        const line    = `\n- [ ] ${ph}\n`;
        newContent    = before + line + after;
        selectStart   = before.length + 7;
        selectEnd     = selectStart + ph.length;
        break;
      }
      case 'table': {
        const t       = `\n| Column A | Column B | Column C |\n| :--- | :--- | :--- |\n| Value | Value | Value |\n`;
        newContent    = before + t + after;
        selectStart   = before.length + t.length;
        selectEnd     = selectStart;
        break;
      }
      default: return;
    }

    onUpdateNote({ content: newContent });
    pendingSelect.current = [selectStart, selectEnd];

    // Clear active state after insert
    setTimeout(() => { setActiveFormats(new Set()); setHasSelection(false); }, 100);
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

      <Toolbar
        onFormat={insertFormatting}
        onExport={onExport}
        saveStatus={saveStatus}
        activeFormats={activeFormats}
        hasSelection={hasSelection}
      />

      {/* Editor / Preview split */}
      <div className={`flex-1 flex min-h-0 overflow-hidden ${showPreview ? 'flex-col md:flex-row' : 'flex-row'}`}>
        <div className={`flex overflow-hidden ${showPreview ? 'h-1/2 md:h-auto md:w-1/2 md:border-r border-b md:border-b-0 border-[var(--border-subtle)]' : 'w-full'}`}>
          {/* Line numbers */}
          <div className="select-none text-right pr-3 pl-3 sm:pl-4 py-4 text-[11px] font-mono text-[var(--text-muted)] leading-relaxed min-w-[2.5rem] sm:min-w-[3rem] bg-[var(--bg-card)] border-r border-[var(--border-subtle)] overflow-hidden">
            {lineNumbers.map(n => <div key={n} className="h-[1.5rem]">{n}</div>)}
          </div>
          <textarea
            ref={textareaRef}
            value={note.content}
            onChange={e => onUpdateNote({ content: e.target.value })}
            onSelect={detectFormats}
            onClick={detectFormats}
            onKeyUp={detectFormats}
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
              className="md:w-1/2 flex-1 h-1/2 md:h-auto overflow-y-auto p-4 md:p-6 bg-[var(--bg-base)]"
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
