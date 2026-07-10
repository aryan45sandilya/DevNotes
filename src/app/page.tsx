'use client';

import { useState, useEffect } from 'react';
import { Cpu, Search, Sparkles, HelpCircle, PanelLeftClose, PanelLeft, Download, Upload, RefreshCw, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { UserButton, useUser } from '@clerk/nextjs';

import { useNotes } from '@/hooks/useNotes';

// ── Feature components ────────────────────────────────────
import Sidebar       from '@/components/sidebar/Sidebar';
import CommandPalette from '@/components/sidebar/CommandPalette';
import DarkModeToggle from '@/components/sidebar/DarkModeToggle';
import NoteList       from '@/components/notes/NoteList';
import StickyNotes    from '@/components/notes/StickyNotes';
import Editor         from '@/components/editor/Editor';
import StatsPanel     from '@/components/dashboard/StatsPanel';
import TimelinePanel  from '@/components/dashboard/TimelinePanel';
import ToastContainer from '@/components/common/Toast';

export default function HomePage() {
  const notes = useNotes();
  const { user } = useUser();

  // ── UI-only toggles (no persistence needed) ───────────────
  const [showSidebar,    setShowSidebar]    = useState(false);
  const [showPreview,    setShowPreview]    = useState(false);
  const [isCommandOpen,  setIsCommandOpen]  = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showHelpModal,  setShowHelpModal]  = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'sticky'>('activity');

  // Open sidebar by default on desktop after mount (avoids SSR mismatch)
  useEffect(() => {
    if (window.innerWidth >= 768) setShowSidebar(true);
  }, []);

  // Global hotkeys
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setIsCommandOpen(p => !p); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); notes.handleCompileSave(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [notes.handleCompileSave]);

  const closeSidebarOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setShowSidebar(false);
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] flex flex-col font-sans text-[var(--text-primary)] overflow-x-hidden theme-transition">
      {/* Ambient decorations (dark mode only) */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
      <div className="dark:block hidden absolute -top-40 -left-40 w-96 h-96 bg-cyber-cyan rounded-full blur-[160px] opacity-10 pointer-events-none" />
      <div className="dark:block hidden absolute -bottom-40 -right-40 w-96 h-96 bg-cyber-purple rounded-full blur-[160px] opacity-10 pointer-events-none" />
      <div className="dark:block hidden absolute top-[20%] left-[30%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full bg-cyber-purple/5 blur-[120px] pointer-events-none animate-float-blob" />
      <div className="dark:block hidden absolute bottom-[25%] right-[20%] w-[30vw] h-[30vw] max-w-[350px] rounded-full bg-cyber-cyan/5 blur-[100px] pointer-events-none animate-float-blob" style={{ animationDelay: '-4s' }} />

      {/* ── Header ───────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--border-default)] bg-[var(--bg-panel)]/80 backdrop-blur-md z-40 select-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => setShowSidebar(p => !p)} className="p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-cyber-cyan transition-colors" aria-label={showSidebar ? 'Close sidebar' : 'Open sidebar'}>
            <span className="md:hidden">{showSidebar ? <PanelLeftClose className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</span>
            <span className="hidden md:block">{showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-[1px] shadow-[0_0_15px_rgba(139,92,246,0.25)]">
              <div className="w-full h-full bg-[var(--bg-panel)] rounded-lg flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyber-cyan" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold font-display text-[var(--text-primary)] tracking-wider leading-none flex items-center gap-1.5">
                DEVOS <span className="text-[9px] font-mono border border-cyber-cyan/30 text-cyber-cyan px-1 py-0.5 rounded hidden xs:inline">NOTES</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--text-muted)] leading-none mt-0.5 hidden sm:block">KNOWLEDGE WORKSPACE</span>
            </div>
          </div>
        </div>

        <button onClick={() => setIsCommandOpen(true)} className="flex-1 max-w-sm mx-3 px-3.5 py-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-all hidden md:flex items-center justify-between text-xs text-[var(--text-muted)]" aria-label="Open command palette">
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
            <span>Search notes...</span>
          </div>
          <span className="font-mono text-[9px] bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5">Ctrl+K</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => setIsCommandOpen(true)} className="p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] md:hidden transition-colors" aria-label="Search"><Search className="w-4 h-4" /></button>
          <button onClick={() => setShowStatsModal(true)} className="p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-cyber-lime transition-colors" title="Workspace stats" aria-label="Open stats"><Sparkles className="w-4 h-4" /></button>
          <button onClick={() => setShowHelpModal(true)} className="hidden sm:flex p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors" title="Keyboard shortcuts" aria-label="Help"><HelpCircle className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-[var(--border-default)]" />
          <DarkModeToggle />
          <label className="hidden sm:flex p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-cyber-cyan transition-colors cursor-pointer" title="Import backup" aria-label="Import workspace">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" className="hidden" onChange={notes.handleImport} aria-label="Import JSON file" />
          </label>
          <button onClick={notes.handleExport} className="hidden sm:flex p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-cyber-cyan transition-colors" title="Export backup" aria-label="Export workspace"><Download className="w-4 h-4" /></button>
          <button onClick={notes.handleReset} className="hidden md:flex p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-amber-400 transition-colors" title="Reset to demo" aria-label="Reset workspace"><RefreshCw className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-[var(--border-default)]" />
          {/* User avatar + logout — Clerk UserButton */}
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              variables: {
                colorPrimary:       '#00E5FF',
                colorBackground:    '#0D0E16',
                colorText:          '#FAFAFA',
                borderRadius:       '10px',
              },
              elements: {
                avatarBox:          'w-8 h-8 ring-2 ring-cyber-cyan/30 hover:ring-cyber-cyan/60 transition-all',
                userButtonPopoverCard: 'bg-[var(--bg-panel)] border border-[var(--border-default)] shadow-2xl',
                userButtonPopoverActionButton: 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                userButtonPopoverActionButtonText: 'text-[var(--text-secondary)]',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
        </div>
      </header>

      {/* ── Main layout ───────────────────────────────────── */}
      <main className="flex-1 flex overflow-x-hidden relative min-h-0">
        {/* Mobile backdrop */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div key="mobile-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm md:hidden" onClick={() => setShowSidebar(false)} aria-hidden="true" />
          )}
        </AnimatePresence>

        {/* Sidebar panel */}
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.div
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col overflow-hidden shrink-0 bg-[var(--bg-panel)] border-r border-[var(--border-default)] fixed md:relative inset-y-0 md:inset-y-auto left-0 h-full md:h-auto z-[70] md:z-auto w-[85vw] max-w-[300px] md:w-[280px]"
            >
              {/* Mobile close header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)] bg-[var(--bg-card)] md:hidden">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--text-muted)] uppercase">Navigation</span>
                <button onClick={() => setShowSidebar(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" aria-label="Close sidebar">
                  <span className="text-lg leading-none">✕</span>
                </button>
              </div>

              <div className="max-h-[40%] border-b border-[var(--border-subtle)] overflow-hidden">
                <Sidebar
                  folders={notes.folders} notes={notes.notes}
                  activeFolderId={notes.activeFolderId}
                  onSelectFolder={(id) => { notes.handleSelectFolder(id); closeSidebarOnMobile(); }}
                  onAddFolder={notes.handleAddFolder}
                  onDeleteFolder={notes.handleDeleteFolder}
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <NoteList
                  notes={notes.filteredNotes} activeNoteId={notes.activeNoteId}
                  filterFavorites={notes.filterFavorites}
                  onSelectNote={(id) => { notes.setActiveNoteId(id); closeSidebarOnMobile(); }}
                  onCreateNote={() => notes.handleCreateNote(notes.activeFolderId)}
                  onDeleteNote={notes.handleDeleteNote}
                  onTogglePin={notes.handleTogglePin}
                  onToggleFavorite={notes.handleToggleFavorite}
                  onToggleFilter={() => notes.setFilterFavorites(p => !p)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor panel */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-full">
          <Editor
            note={notes.activeNote}
            showPreview={showPreview}
            saveStatus={notes.saveStatus}
            onUpdateNote={notes.handleUpdateNote}
            onTogglePreview={() => setShowPreview(p => !p)}
            onExport={notes.handleExport}
          />
        </div>
      </main>

      {/* ── Bottom dashboard ─────────────────────────────── */}
      <section className="shrink-0 border-t border-[var(--border-default)] bg-[var(--bg-panel)]/60 backdrop-blur-sm">
        <div className="flex items-center gap-0 border-b border-[var(--border-subtle)] px-4 overflow-x-auto">
          {(['activity', 'sticky'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-colors border-b-2 shrink-0 ${activeTab === tab ? 'border-cyber-cyan text-cyber-cyan' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
              aria-label={`Switch to ${tab} tab`}
            >
              {tab === 'activity' ? 'ACTIVITY' : 'SCRATCHPADS'}
            </button>
          ))}
        </div>
        <div className="p-3 sm:p-4 max-h-[240px] sm:max-h-[280px] overflow-y-auto">
          {activeTab === 'activity' && (
            <TimelinePanel
              activities={notes.activities}
              onSelectNote={id => {
                notes.setActiveNoteId(id);
                const n = notes.notes.find(x => x.id === id);
                if (n) notes.handleSelectFolder(n.folderId);
              }}
            />
          )}
          {activeTab === 'sticky' && (
            <StickyNotes
              stickies={notes.stickies}
              onAdd={notes.handleAddSticky}
              onUpdate={notes.handleUpdateSticky}
              onDelete={notes.handleDeleteSticky}
              onColorChange={notes.handleStickyColor}
            />
          )}
        </div>
      </section>

      {/* ── Stats modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showStatsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowStatsModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-3xl bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-2xl p-6 shadow-2xl z-10 space-y-4 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold font-display tracking-widest uppercase text-[var(--text-primary)]">WORKSPACE ANALYTICS</h2>
                <button onClick={() => setShowStatsModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl leading-none">✕</button>
              </div>
              <StatsPanel stats={notes.stats} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Help modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowHelpModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-2xl p-6 shadow-2xl z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold font-display tracking-widest uppercase text-[var(--text-primary)]">KEYBOARD SHORTCUTS</h2>
                <button onClick={() => setShowHelpModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl leading-none">✕</button>
              </div>
              <ul className="space-y-3">
                {[
                  ['Ctrl + K', 'Open Command Palette'],
                  ['Ctrl + S', 'Save & Compile Note'],
                  ['↑ ↓',      'Navigate palette items'],
                  ['Enter',    'Select palette item'],
                  ['Escape',   'Close palette / modal'],
                ].map(([key, desc]) => (
                  <li key={key} className="flex justify-between items-center text-xs">
                    <span className="font-mono bg-[var(--bg-card)] border border-[var(--border-default)] px-2 py-1 rounded text-cyber-cyan">{key}</span>
                    <span className="text-[var(--text-secondary)]">{desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Command palette ───────────────────────────────── */}
      <CommandPalette
        isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)}
        notes={notes.notes} folders={notes.folders}
        onSelectNote={id => { notes.setActiveNoteId(id); const n = notes.notes.find(x => x.id === id); if (n) notes.handleSelectFolder(n.folderId); }}
        onCreateNote={notes.handleCreateNote}
        onToggleFavorite={id => notes.handleToggleFavorite(id)}
      />

      {/* ── Toasts ────────────────────────────────────────── */}
      <ToastContainer toasts={notes.toasts} onClose={notes.removeToast} />
    </div>
  );
}
