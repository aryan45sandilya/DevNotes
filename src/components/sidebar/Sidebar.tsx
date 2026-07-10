'use client';

import { FolderPlus, Trash2 } from 'lucide-react';
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
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-card)]">
        <span className="text-[10px] tracking-widest font-mono text-[var(--text-muted)] font-bold">DIRECTORY ROOT</span>
        <button
          onClick={onAddFolder}
          className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-cyber-cyan transition-colors"
          title="New folder"
          aria-label="Add new folder"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
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
                <span className="text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded font-bold">{count}</span>
                <button
                  onClick={e => onDeleteFolder(folder.id, e)}
                  className="p-0.5 rounded text-[var(--text-muted)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete folder"
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
