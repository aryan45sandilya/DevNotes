'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight, FolderPlus, Plus, Heart, Pin,
  Trash2, Hash, Clock, FilePlus, FileEdit,
  Star, Folder as FolderIcon, SlidersHorizontal, X, Search,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import ClientDate from '@/components/common/ClientDate';
import type { Note, Folder, ActivityLog } from '@/types';

// ── Types ─────────────────────────────────────────────────
interface Props {
  folders: Folder[];
  notes: Note[];
  filteredNotes: Note[];
  activities: ActivityLog[];
  activeNoteId: string;
  activeFolderId: string;
  filterFavorites: boolean;
  onSelectFolder: (id: string) => void;
  onAddFolder: () => void;
  onDeleteFolder: (id: string, e: React.MouseEvent) => void;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onToggleFilter: () => void;
}

// ── Storage key ───────────────────────────────────────────
const STORAGE_KEY = 'devos_sidebar_sections';

type SectionKey = 'folders' | 'files' | 'favorites' | 'activity';

const DEFAULT_STATE: Record<SectionKey, boolean> = {
  folders:   true,
  files:     true,
  favorites: false,
  activity:  true,
};

function loadSectionState(): Record<SectionKey, boolean> {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

// ── Section header component ──────────────────────────────
function SectionHeader({
  label, isOpen, onToggle, action,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 cursor-pointer select-none hover:bg-[var(--bg-hover)] transition-colors group"
      onClick={onToggle}
      role="button"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
        >
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
        </motion.div>
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
          {label}
        </span>
      </div>
      {action && (
        <div onClick={e => e.stopPropagation()}>
          {action}
        </div>
      )}
    </div>
  );
}

// ── Activity log helpers ──────────────────────────────────
function activityInfo(type: ActivityLog['type']): {
  icon: React.ElementType;
  color: string;
  label: string;
} {
  switch (type) {
    case 'create':
      return { icon: FilePlus,   color: 'text-cyber-lime   bg-cyber-lime/10',   label: 'Created'   };
    case 'edit':
      return { icon: FileEdit,   color: 'text-cyber-cyan   bg-cyber-cyan/10',   label: 'Edited'    };
    case 'favorite':
      return { icon: Star,       color: 'text-rose-400     bg-rose-400/10',     label: 'Favorited' };
    case 'pin':
      return { icon: Pin,        color: 'text-cyber-purple bg-cyber-purple/10', label: 'Pinned'    };
    default:
      return { icon: Clock,      color: 'text-[var(--text-muted)] bg-[var(--bg-card)]', label: 'Action' };
  }
}

// ── Folder dot color ──────────────────────────────────────
function dotClass(color: Folder['color']) {
  switch (color) {
    case 'cyan':   return 'bg-cyber-cyan   shadow-[0_0_6px_rgba(0,229,255,0.5)]';
    case 'purple': return 'bg-cyber-purple shadow-[0_0_6px_rgba(139,92,246,0.5)]';
    case 'lime':   return 'bg-cyber-lime   shadow-[0_0_6px_rgba(163,255,18,0.5)]';
    default:       return 'bg-gray-400';
  }
}

// ── Main Component ────────────────────────────────────────
export default function CollapsibleSidebar({
  folders, notes, filteredNotes, activities,
  activeNoteId, activeFolderId, filterFavorites,
  onSelectFolder, onAddFolder, onDeleteFolder,
  onSelectNote, onCreateNote, onDeleteNote,
  onTogglePin, onToggleFavorite, onToggleFilter,
}: Props) {
  const [sections, setSections] = useState<Record<SectionKey, boolean>>(DEFAULT_STATE);
  const [showFolderTooltip, setShowFolderTooltip] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setSections(loadSectionState());
  }, []);

  // Save to localStorage on change
  const toggleSection = useCallback((key: SectionKey) => {
    setSections(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const favoriteNotes = notes.filter(n => n.favorite);

  // ── Filter logic ──────────────────────────────────────────
  const q = filterQuery.toLowerCase().trim();
  const displayedNotes = q
    ? filteredNotes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q)) ||
        n.content.toLowerCase().includes(q)
      )
    : filteredNotes;

  return (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">

      {/* ── SECTION 1: Root Directory (Folders) ──────────── */}
      <SectionHeader
        label="Root Directory"
        isOpen={sections.folders}
        onToggle={() => toggleSection('folders')}
        action={
          <div className="relative">
            <button
              onClick={onAddFolder}
              onMouseEnter={() => setShowFolderTooltip(true)}
              onMouseLeave={() => setShowFolderTooltip(false)}
              className="p-1 rounded hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-cyber-cyan transition-colors"
              aria-label="Add new folder"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {showFolderTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-50 pointer-events-none"
                >
                  <div className="absolute -top-1.5 right-2 w-3 h-3 rotate-45 bg-[var(--bg-panel)] border-l border-t border-[var(--border-default)]" />
                  <div className="relative bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-xl px-3 py-2 shadow-xl min-w-[130px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                      <span className="text-[11px] font-mono font-bold text-[var(--text-primary)] whitespace-nowrap">New Folder</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Create a new directory</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />

      <AnimatePresence initial={false}>
        {sections.folders && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-1">
              {folders.length === 0 ? (
                <p className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-3 text-center">No folders yet</p>
              ) : folders.map(folder => {
                const isActive = folder.id === activeFolderId;
                const count    = notes.filter(n => n.folderId === folder.id).length;
                return (
                  <div
                    key={folder.id}
                    onClick={() => onSelectFolder(folder.id)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer group transition-all duration-150 ${
                      isActive
                        ? 'bg-[var(--bg-hover)] border border-[var(--border-default)]'
                        : 'hover:bg-[var(--bg-card)] border border-transparent'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && onSelectFolder(folder.id)}
                    aria-selected={isActive}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass(folder.color)}`} />
                      <span className={`text-xs truncate ${isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]'}`}>
                        {folder.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-hover)] px-1 py-0.5 rounded">
                        {count}
                      </span>
                      <button
                        onClick={e => onDeleteFolder(folder.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--text-muted)] hover:text-red-400 transition-all"
                        aria-label={`Delete folder ${folder.name}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-[var(--border-subtle)]" />

      {/* ── SECTION 2: Compiled Files (Notes) ────────────── */}
      <SectionHeader
        label="Compiled Files"
        isOpen={sections.files}
        onToggle={() => toggleSection('files')}
        action={
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setShowFilter(p => !p); if (showFilter) setFilterQuery(''); }}
              className={`p-1 rounded transition-colors ${showFilter ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-[var(--text-muted)] hover:text-cyber-cyan hover:bg-[var(--bg-card)]'}`}
              aria-label="Toggle filter"
              title="Filter notes"
            >
              <SlidersHorizontal className="w-3 h-3" />
            </button>
            <button
              onClick={onToggleFilter}
              className={`p-1 rounded transition-colors ${filterFavorites ? 'text-rose-400 bg-rose-400/10' : 'text-[var(--text-muted)] hover:text-rose-400 hover:bg-[var(--bg-card)]'}`}
              aria-label="Toggle favorites filter"
              aria-pressed={filterFavorites}
              title="Filter favorites"
            >
              <Heart className="w-3 h-3" />
            </button>
            <button
              onClick={onCreateNote}
              className="p-1 rounded text-[var(--text-muted)] hover:text-cyber-cyan hover:bg-[var(--bg-card)] transition-colors"
              aria-label="Create new note"
              title="New note"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* Filter search bar */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden px-2 pb-1"
          >
            <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-2 py-1.5 focus-within:border-cyber-cyan/40 transition-colors">
              <Search className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
              <input
                type="text"
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                placeholder="Filter by title, tag..."
                autoFocus
                className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none font-mono"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Clear filter"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {q && (
              <p className="text-[9px] font-mono text-[var(--text-muted)] px-1 mt-1">
                {displayedNotes.length} result{displayedNotes.length !== 1 ? 's' : ''} for &quot;{q}&quot;
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {sections.files && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-1 max-h-[280px] overflow-y-auto">
              {displayedNotes.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-[10px] font-mono text-[var(--text-muted)] mb-2">
                    {q ? 'NO MATCHES FOUND' : 'NO FILES HERE'}
                  </p>
                  {!q && (
                    <button onClick={onCreateNote} className="text-[11px] font-mono text-cyber-cyan hover:underline">
                      + Create Note
                    </button>
                  )}
                </div>
              ) : displayedNotes.map(note => {
                const isActive = note.id === activeNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`px-2.5 py-2 rounded-lg cursor-pointer group transition-all duration-150 flex flex-col gap-1 ${
                      isActive
                        ? 'bg-cyber-purple/8 border border-cyber-purple/25'
                        : 'hover:bg-[var(--bg-card)] border border-transparent'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && onSelectNote(note.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs truncate pr-2 ${isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]'}`}>
                        {note.title}
                      </span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={e => onTogglePin(note.id, e)} className={`p-0.5 rounded transition-colors ${note.pinned ? 'text-cyber-cyan' : 'text-[var(--text-muted)] hover:text-cyber-cyan'}`} aria-label="Pin">
                          <Pin className="w-2.5 h-2.5" />
                        </button>
                        <button onClick={e => onToggleFavorite(note.id, e)} className={`p-0.5 rounded transition-colors ${note.favorite ? 'text-rose-400' : 'text-[var(--text-muted)] hover:text-rose-400'}`} aria-label="Favorite">
                          <Heart className="w-2.5 h-2.5" />
                        </button>
                        <button onClick={e => onDeleteNote(note.id, e)} className="p-0.5 rounded text-[var(--text-muted)] hover:text-red-400 transition-colors" aria-label="Delete">
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {note.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="flex items-center gap-0.5 text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-subtle)] px-1 py-0.5 rounded-full">
                            <Hash className="w-1.5 h-1.5" />{tag}
                          </span>
                        ))}
                        {note.tags.length > 2 && <span className="text-[9px] font-mono text-[var(--text-muted)]">+{note.tags.length - 2}</span>}
                      </div>
                    )}
                    <ClientDate iso={note.updatedAt} type="date" className="text-[9px] font-mono text-[var(--text-muted)]" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-[var(--border-subtle)]" />

      {/* ── SECTION 3: Favorites ─────────────────────────── */}
      <SectionHeader
        label={`Favorites${favoriteNotes.length > 0 ? ` (${favoriteNotes.length})` : ''}`}
        isOpen={sections.favorites}
        onToggle={() => toggleSection('favorites')}
      />

      <AnimatePresence initial={false}>
        {sections.favorites && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-1">
              {favoriteNotes.length === 0 ? (
                <p className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-3 text-center">No favorites yet</p>
              ) : favoriteNotes.map(note => {
                const isActive = note.id === activeNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                      isActive ? 'bg-rose-400/8 border border-rose-400/20' : 'hover:bg-[var(--bg-card)] border border-transparent'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && onSelectNote(note.id)}
                  >
                    <Heart className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                    <span className={`text-xs truncate ${isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]'}`}>
                      {note.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-[var(--border-subtle)]" />

      {/* ── SECTION 4: Activity ──────────────────────────── */}
      <SectionHeader
        label={`Activity${activities.length > 0 ? ` (${Math.min(activities.length, 20)})` : ''}`}
        isOpen={sections.activity}
        onToggle={() => toggleSection('activity')}
      />

      <AnimatePresence initial={false}>
        {sections.activity && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-3 max-h-[220px] overflow-y-auto space-y-0.5">
              {activities.length === 0 ? (
                <p className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-3 text-center">
                  No recent activity
                </p>
              ) : activities.slice(0, 20).map(log => {
                const { icon: Icon, color, label } = activityInfo(log.type);
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-card)] cursor-pointer group transition-colors"
                    title={`${label}: ${log.noteTitle}`}
                  >
                    {/* Icon */}
                    <div className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center ${color}`}>
                      <Icon className="w-2.5 h-2.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[9px] font-mono font-bold tracking-wider uppercase ${color.split(' ')[0]}`}>
                          {label}
                        </span>
                        <ClientDate
                          iso={log.timestamp}
                          type="time"
                          className="text-[9px] font-mono text-[var(--text-muted)] shrink-0"
                        />
                      </div>
                      <p className="text-[10px] text-[var(--text-secondary)] truncate leading-tight mt-0.5">
                        {log.noteTitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
