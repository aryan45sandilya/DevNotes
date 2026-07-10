'use client';

import { Bold, Italic, Heading, Code, Table, CheckSquare, Download } from 'lucide-react';

export type FormatType = 'bold' | 'italic' | 'header' | 'code' | 'table' | 'checkbox';

interface Props {
  onFormat: (type: FormatType) => void;
  onExport?: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

const TOOLS: { icon: React.ElementType; label: string; type: FormatType }[] = [
  { icon: Bold,        label: 'Bold (Ctrl+B)',        type: 'bold'     },
  { icon: Italic,      label: 'Italic (Ctrl+I)',       type: 'italic'   },
  { icon: Heading,     label: 'Heading',               type: 'header'   },
  { icon: Code,        label: 'Code Block',            type: 'code'     },
  { icon: Table,       label: 'Table',                 type: 'table'    },
  { icon: CheckSquare, label: 'Task / Checklist item', type: 'checkbox' },
];

export default function Toolbar({ onFormat, onExport, saveStatus }: Props) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] flex-wrap">
      <div className="flex items-center gap-0.5">
        {TOOLS.map(({ icon: Icon, label, type }) => (
          <button
            key={type}
            onClick={() => onFormat(type)}
            title={label}
            aria-label={label}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-[var(--border-default)] mx-1" />

      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
        saveStatus === 'saving' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' :
        saveStatus === 'saved'  ? 'text-cyber-lime border-cyber-lime/20 bg-cyber-lime/5' :
                                  'text-[var(--text-muted)] border-[var(--border-subtle)]'
      }`}>
        {saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'saved' ? '✓ SYNCED' : 'IDLE'}
      </span>

      <div className="flex-1" />

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
