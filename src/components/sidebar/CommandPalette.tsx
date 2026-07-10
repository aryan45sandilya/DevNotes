'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, FileText, CornerDownLeft, Plus, Folder, Heart, Laptop } from 'lucide-react';
import type { Note, Folder as FolderType } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  folders: FolderType[];
  onSelectNote: (id: string) => void;
  onCreateNote: (folderId: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function CommandPalette({ isOpen, onClose, notes, folders, onSelectNote, onCreateNote, onToggleFavorite }: Props) {
  const [query,  setQuery]  = useState('');
  const [selIdx, setSelIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) { setQuery(''); setSelIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (isOpen && e.key === 'Escape') { e.preventDefault(); onClose(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  const items = useMemo(() => {
    const q = query.toLowerCase().trim();
    type Item = { id: string; title: string; sub: string; Icon: React.ElementType; cat: string; colorClass: string; action: () => void; };
    const results: Item[] = [];

    notes
      .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q)))
      .forEach(n => {
        const folder = folders.find(f => f.id === n.folderId);
        results.push({ id: `note-${n.id}`, title: n.title, sub: `${folder?.name || 'Workspace'} • ${n.tags.join(', ')}`, Icon: FileText, cat: 'NOTES', colorClass: 'text-cyber-cyan', action: () => { onSelectNote(n.id); onClose(); } });
      });

    folders.filter(f => f.name.toLowerCase().includes(q)).forEach(f => {
      const colorClass = f.color === 'cyan' ? 'text-cyber-cyan' : f.color === 'purple' ? 'text-cyber-purple' : 'text-cyber-lime';
      results.push({ id: `folder-${f.id}`, title: `Explore: ${f.name}`, sub: `View notes in ${f.name}`, Icon: Folder, cat: 'FOLDERS', colorClass, action: () => { const first = notes.find(n => n.folderId === f.id); if (first) onSelectNote(first.id); onClose(); } });
    });

    if ('create new note'.includes(q) || 'add'.includes(q)) {
      results.push({ id: 'sys-create', title: 'Create New Note', sub: 'Creates an empty markdown file', Icon: Plus, cat: 'SYSTEM ACTIONS', colorClass: 'text-cyber-lime', action: () => { onCreateNote(folders[0]?.id || ''); onClose(); } });
    }
    if ('favorite'.includes(q) || 'like'.includes(q)) {
      results.push({ id: 'sys-fav', title: 'Toggle Favorite on Current Note', sub: 'Bookmark the active note', Icon: Heart, cat: 'SYSTEM ACTIONS', colorClass: 'text-rose-400', action: () => { if (notes[0]) onToggleFavorite(notes[0].id); onClose(); } });
    }
    return results;
  }, [query, notes, folders, onSelectNote, onCreateNote, onToggleFavorite, onClose]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelIdx(p => (p + 1) % Math.max(items.length, 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelIdx(p => (p - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1)); }
      if (e.key === 'Enter')     { e.preventDefault(); items[selIdx]?.action(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, items, selIdx]);

  useEffect(() => {
    document.getElementById(`cp-item-${selIdx}`)?.scrollIntoView({ block: 'nearest' });
  }, [selIdx]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border-default)] bg-[var(--bg-panel)] overflow-hidden z-10 flex flex-col shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <Search className="w-5 h-5 text-cyber-cyan shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelIdx(0); }}
            placeholder="Search notes, folders, or commands..."
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none"
            aria-label="Command palette search"
          />
          <span className="text-[10px] font-mono bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5 text-[var(--text-muted)] select-none hidden sm:inline">ESC</span>
        </div>

        <div ref={listRef} className="max-h-[340px] overflow-y-auto p-2 space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <Laptop className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-xs font-mono text-[var(--text-muted)]">NO RESULTS FOUND</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Try a different keyword or tag.</p>
            </div>
          ) : (() => {
            let lastCat = '';
            return items.map((item, idx) => {
              const showCat = lastCat !== item.cat;
              lastCat = item.cat;
              const isSel = idx === selIdx;
              const Icon = item.Icon;
              return (
                <div key={item.id}>
                  {showCat && <div className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest text-cyber-purple/80 uppercase select-none">{item.cat}</div>}
                  <div
                    id={`cp-item-${idx}`}
                    onClick={() => item.action()}
                    className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 mt-1 ${isSel ? 'bg-[var(--bg-hover)] border-l-4 border-cyber-cyan pl-2' : 'hover:bg-[var(--bg-card)] border-l-4 border-transparent'}`}
                  >
                    <div className={`p-1.5 rounded-lg bg-[var(--bg-card)] ${isSel ? item.colorClass : 'text-[var(--text-muted)]'}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-medium truncate ${isSel ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{item.title}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">{item.sub}</p>
                    </div>
                    {isSel && <CornerDownLeft className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />}
                  </div>
                </div>
              );
            });
          })()}
        </div>

        <div className="flex justify-between items-center px-4 py-2 bg-[var(--bg-card)] border-t border-[var(--border-subtle)] text-[9px] font-mono text-[var(--text-muted)] select-none">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="bg-[var(--bg-hover)] border border-[var(--border-subtle)] px-1 rounded">↑↓</span> navigate</span>
            <span className="flex items-center gap-1"><span className="bg-[var(--bg-hover)] border border-[var(--border-subtle)] px-1 rounded">↵</span> select</span>
          </div>
          <span>COMMAND PALETTE</span>
        </div>
      </div>
    </div>
  );
}
