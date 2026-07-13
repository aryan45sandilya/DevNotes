'use client';

import { useState } from 'react';
import { Bold, Italic, Heading, Code, Table, CheckSquare, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type FormatType = 'bold' | 'italic' | 'header' | 'code' | 'table' | 'checkbox';

interface Props {
  onFormat: (type: FormatType) => void;
  onExport?: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  activeFormats?: Set<FormatType>;
  hasSelection?: boolean;
}

const TOOLS: {
  icon: React.ElementType;
  label: string;
  type: FormatType;
  activeColor: string;
  selectionHint: string;
}[] = [
  {
    icon: Bold,
    label: 'Bold',
    type: 'bold',
    activeColor: 'text-cyber-cyan bg-cyber-cyan/15 border-cyber-cyan/40 shadow-[0_0_8px_rgba(0,229,255,0.2)]',
    selectionHint: 'text-cyber-cyan/60 bg-cyber-cyan/8 border-cyber-cyan/20',
  },
  {
    icon: Italic,
    label: 'Italic',
    type: 'italic',
    activeColor: 'text-cyber-purple bg-cyber-purple/15 border-cyber-purple/40 shadow-[0_0_8px_rgba(139,92,246,0.2)]',
    selectionHint: 'text-cyber-purple/60 bg-cyber-purple/8 border-cyber-purple/20',
  },
  {
    icon: Heading,
    label: 'Heading',
    type: 'header',
    activeColor: 'text-cyber-lime bg-cyber-lime/15 border-cyber-lime/40 shadow-[0_0_8px_rgba(163,255,18,0.2)]',
    selectionHint: 'text-cyber-lime/60 bg-cyber-lime/8 border-cyber-lime/20',
  },
  {
    icon: Code,
    label: 'Code Block',
    type: 'code',
    activeColor: 'text-cyber-cyan bg-cyber-cyan/15 border-cyber-cyan/40 shadow-[0_0_8px_rgba(0,229,255,0.2)]',
    selectionHint: 'text-cyber-cyan/60 bg-cyber-cyan/8 border-cyber-cyan/20',
  },
  {
    icon: Table,
    label: 'Table',
    type: 'table',
    activeColor: 'text-cyber-purple bg-cyber-purple/15 border-cyber-purple/40 shadow-[0_0_8px_rgba(139,92,246,0.2)]',
    selectionHint: 'text-cyber-purple/60 bg-cyber-purple/8 border-cyber-purple/20',
  },
  {
    icon: CheckSquare,
    label: 'Task item',
    type: 'checkbox',
    activeColor: 'text-cyber-lime bg-cyber-lime/15 border-cyber-lime/40 shadow-[0_0_8px_rgba(163,255,18,0.2)]',
    selectionHint: 'text-cyber-lime/60 bg-cyber-lime/8 border-cyber-lime/20',
  },
];

const STATUS_MAP = {
  saving: { label: 'SAVING...', cls: 'text-amber-400 border-amber-400/20 bg-amber-400/5' },
  saved:  { label: '✓ SYNCED',  cls: 'text-cyber-lime border-cyber-lime/20 bg-cyber-lime/5' },
  idle:   { label: 'IDLE',      cls: 'text-[var(--text-muted)] border-[var(--border-subtle)]' },
};

export default function Toolbar({ onFormat, onExport, saveStatus, activeFormats, hasSelection }: Props) {
  const { label, cls } = STATUS_MAP[saveStatus];
  const [justClicked, setJustClicked] = useState<FormatType | null>(null);

  const handleFormat = (type: FormatType) => {
    setJustClicked(type);
    onFormat(type);
    setTimeout(() => setJustClicked(null), 600);
  };

  return (
    <div className="flex items-center gap-1 px-3 sm:px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] flex-wrap shrink-0">

      {/* Format buttons */}
      <div className="flex items-center gap-1">
        {TOOLS.map(({ icon: Icon, label: lbl, type, activeColor, selectionHint }) => {
          const isActive   = activeFormats?.has(type) ?? false;
          const wasClicked = justClicked === type;
          // Show hint when text is selected (only for inline formats)
          const showHint   = hasSelection && (type === 'bold' || type === 'italic');

          return (
            <div key={type} className="relative">
              <motion.button
                onClick={() => handleFormat(type)}
                title={lbl}
                aria-label={lbl}
                aria-pressed={isActive}
                whileTap={{ scale: 0.85 }}
                className={`relative p-2 rounded-lg border font-medium transition-all duration-150 overflow-hidden ${
                  wasClicked
                    ? activeColor
                    : isActive
                    ? activeColor
                    : showHint
                    ? selectionHint
                    : 'text-[var(--text-muted)] bg-transparent border-transparent hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive || wasClicked ? 2.5 : 1.75} />

                {/* Click ripple */}
                <AnimatePresence>
                  {wasClicked && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 rounded-lg bg-current pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Active underline dot */}
              <AnimatePresence>
                {(isActive || wasClicked) && (
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-current"
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="h-4 w-px bg-[var(--border-default)] mx-1" />

      {/* Selection hint label */}
      <AnimatePresence>
        {hasSelection && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="text-[10px] font-mono text-cyber-cyan/70 hidden sm:inline"
          >
            text selected ↑ apply format
          </motion.span>
        )}
      </AnimatePresence>

      {/* Save status badge */}
      <motion.span
        key={saveStatus}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ml-auto ${cls}`}
      >
        {label}
      </motion.span>

      {/* Export */}
      {onExport && (
        <button
          onClick={onExport}
          title="Export workspace"
          aria-label="Export workspace as JSON"
          className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)] hover:text-cyber-cyan transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg-hover)]"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      )}
    </div>
  );
}
