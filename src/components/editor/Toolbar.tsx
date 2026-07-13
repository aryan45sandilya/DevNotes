'use client';

import { useState } from 'react';
import { Bold, Italic, Heading, Code, Table, CheckSquare, Download } from 'lucide-react';
import { motion } from 'motion/react';

export type FormatType = 'bold' | 'italic' | 'header' | 'code' | 'table' | 'checkbox';

interface Props {
  onFormat: (type: FormatType) => void;
  onExport?: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

const TOOLS: { icon: React.ElementType; label: string; type: FormatType }[] = [
  { icon: Bold,        label: 'Bold',       type: 'bold'     },
  { icon: Italic,      label: 'Italic',     type: 'italic'   },
  { icon: Heading,     label: 'Heading',    type: 'header'   },
  { icon: Code,        label: 'Code Block', type: 'code'     },
  { icon: Table,       label: 'Table',      type: 'table'    },
  { icon: CheckSquare, label: 'Task item',  type: 'checkbox' },
];

const STATUS_MAP = {
  saving: { label: 'SAVING...', cls: 'text-amber-400 border-amber-400/20 bg-amber-400/5' },
  saved:  { label: '✓ SYNCED',  cls: 'text-cyber-lime border-cyber-lime/20 bg-cyber-lime/5' },
  idle:   { label: 'IDLE',      cls: 'text-[var(--text-muted)] border-[var(--border-subtle)]' },
};

export default function Toolbar({ onFormat, onExport, saveStatus }: Props) {
  const { label, cls } = STATUS_MAP[saveStatus];
  const [lastClicked, setLastClicked] = useState<FormatType | null>(null);

  const handleClick = (type: FormatType) => {
    setLastClicked(type);
    onFormat(type);
    setTimeout(() => setLastClicked(null), 500);
  };

  return (
    <div className="flex items-center gap-1 px-3 sm:px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] flex-wrap shrink-0">

      {/* Format buttons */}
      <div className="flex items-center gap-1">
        {TOOLS.map(({ icon: Icon, label: lbl, type }) => (
          <motion.button
            key={type}
            onClick={() => handleClick(type)}
            title={lbl}
            aria-label={lbl}
            whileTap={{ scale: 0.85 }}
            animate={lastClicked === type ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.2 }}
            className={`p-2 rounded-lg border transition-all duration-150 ${
              lastClicked === type
                ? 'text-cyber-cyan bg-cyber-cyan/15 border-cyber-cyan/30'
                : 'text-[var(--text-muted)] bg-transparent border-transparent hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={lastClicked === type ? 2.5 : 1.75} />
          </motion.button>
        ))}
      </div>

      <div className="h-4 w-px bg-[var(--border-default)] mx-1" />

      {/* Save status */}
      <motion.span
        key={saveStatus}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${cls}`}
      >
        {label}
      </motion.span>

      <div className="flex-1" />

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
