'use client';

import { useState } from 'react';
import { FolderPlus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Folder, Note } from '@/types';

interface Props {
  folders: Folder[];
  notes: Note[];
  activeFolderId: string;
  onSelectFolder: (id: string) => void;
  onAddFolder: () => void;
  onDeleteFolder: (id: string, e: React.MouseEvent) => void;
}

function dotClass(color: Folder['color']) {
  switch (color) {
    case 'cyan':   return 'bg-cyber-cyan   shadow-[0_0_8px_rgba(0,229,255,0.4)]';
    case 'purple': return 'bg-cyber-purple shadow-[0_0_8px_rgba(139,92,246,0.4)]';
    case 'lime':   return 'bg-cyber-lime   shadow-[0_0_8px_rgba(163,255,18,0.4)]';
    default:       return 'bg-gray-400';
  }
}

function borderHover(color: Folder['color']) {
  switch (color) {
    case 'cyan':   return 'glow-border-cyan';
    case 'purple': return 'glow-border-purple';
    case 'lime':   return 'glow-border-lime';
    default:       return 'hover:border-[var(--border-default)]';
  }
}

export default function Sidebar({ folders, notes, activeFolderId, onSelectFolder, onAddFolder, onDeleteFolder }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-card)]">
        <span className="text-[10px] tracking-widest font-mono text-[var(--text-muted)] font-bold">
          DIRECTORY ROOT
        </span>

        {/* New Folder button with custom tooltip */}
        <div className="relative">
          <button
            onClick={onAddFolder}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-cyber-cyan transition-colors"
            aria-label="Add new folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>

          {/* Custom floating tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 z-50 pointer-events-none"
              >
                {/* Arrow */}
                <div className="absolute -top-1.5 right-2 w-3 h-3 rotate-45 bg-[var(--bg-panel)] border-l border-t border-[var(--border-default)]" />

                {/* Tooltip body */}
                <div className="relative bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-xl px-3 py-2.5 shadow-xl min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shrink-0" />
                    <span className="text-[11px] font-mono font-bold text-[var(--text-primary)] whitespace-nowrap">
                      New Folder
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-relaxed">
                    Create a new directory to organize your notes
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-3 space-y-2 overflow-y-auto">
        {folders.map(folder => {
          const isActive = folder.id === activeFolderId;
          const count    = notes.filter(n => n.folderId === folder.id).length;
          return (
            <div
              key={folder.id}
              onClick={() => onSelectFolder(folder.id)}
              className={`p-3 rounded-xl border cursor-pointer select-none transition-all duration-200 glass-card flex items-center justify-between group ${
                isActive
                  ? 'border-[var(--border-default)] bg-[var(--bg-hover)] shadow-md'
                  : `border-transparent ${borderHover(folder.color)}`
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onSelectFolder(folder.id)}
              aria-label={`Select folder ${folder.name}`}
              aria-selected={isActive}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass(folder.color)}`} />
                <span className={`text-xs font-display truncate ${isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]'}`}>
                  {folder.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded font-bold">
                  {count}
                </span>
                <button
                  onClick={e => onDeleteFolder(folder.id, e)}
                  className="p-0.5 rounded text-[var(--text-muted)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Delete folder ${folder.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
