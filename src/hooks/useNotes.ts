'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Note, Folder, StickyNote, ActivityLog, WorkspaceStats, ToastMessage } from '@/types';
import { INITIAL_FOLDERS, INITIAL_NOTES, INITIAL_STICKIES, INITIAL_ACTIVITIES } from '@/data/initialData';
import { loadFromStorage, saveToStorage, clearStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { exportWorkspace, importWorkspace } from '@/utils/export';

export function useNotes() {
  // ── Persisted state ───────────────────────────────────────
  const [folders,    setFolders]    = useState<Folder[]>(()      => loadFromStorage(STORAGE_KEYS.FOLDERS,    INITIAL_FOLDERS));
  const [notes,      setNotes]      = useState<Note[]>(()        => loadFromStorage(STORAGE_KEYS.NOTES,      INITIAL_NOTES));
  const [stickies,   setStickies]   = useState<StickyNote[]>(()  => loadFromStorage(STORAGE_KEYS.STICKIES,   INITIAL_STICKIES));
  const [activities, setActivities] = useState<ActivityLog[]>(() => loadFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES));

  // ── Selection state ───────────────────────────────────────
  const [activeFolderId, setActiveFolderId] = useState<string>(folders[0]?.id ?? '');
  const [activeNoteId,   setActiveNoteId]   = useState<string>(
    () => notes.find(n => n.folderId === folders[0]?.id)?.id ?? notes[0]?.id ?? ''
  );

  // ── Editor state ──────────────────────────────────────────
  const [saveStatus,      setSaveStatus]      = useState<'idle' | 'saving' | 'saved'>('saved');
  const [filterFavorites, setFilterFavorites] = useState(false);

  // ── Toast state ───────────────────────────────────────────
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ── Sync to localStorage ──────────────────────────────────
  useEffect(() => { saveToStorage(STORAGE_KEYS.FOLDERS,    folders);    }, [folders]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.NOTES,      notes);      }, [notes]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.STICKIES,   stickies);   }, [stickies]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ACTIVITIES, activities); }, [activities]);

  // ── Toast helpers ─────────────────────────────────────────
  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(p => [...p, { id, text, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  // ── Internal helpers ──────────────────────────────────────
  const logActivity = useCallback((noteId: string, noteTitle: string, type: ActivityLog['type']) => {
    setActivities(p =>
      [{ id: `a-${Date.now()}`, noteId, noteTitle, type, timestamp: new Date().toISOString() }, ...p].slice(0, 40)
    );
  }, []);

  // ── Derived values ────────────────────────────────────────
  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId), [notes, activeNoteId]);

  const filteredNotes = useMemo(() => {
    let r = notes.filter(n => n.folderId === activeFolderId);
    if (filterFavorites) r = r.filter(n => n.favorite);
    return r.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, activeFolderId, filterFavorites]);

  const stats: WorkspaceStats = useMemo(() => {
    const allTags = new Set(notes.flatMap(n => n.tags));
    return {
      notesCount:     notes.length,
      tagsCount:      allTags.size,
      favoritesCount: notes.filter(n => n.favorite).length,
      foldersCount:   folders.length,
      wordsCount:     notes.reduce((s, n) => s + n.content.trim().split(/\s+/).filter(Boolean).length, 0),
    };
  }, [notes, folders]);

  // ── Folder actions ────────────────────────────────────────
  const handleSelectFolder = useCallback((id: string) => {
    setActiveFolderId(id);
    setActiveNoteId(() => {
      const first = notes.find(n => n.folderId === id);
      return first?.id ?? '';
    });
  }, [notes]);

  const handleAddFolder = useCallback(() => {
    const name = prompt('Enter folder name:');
    if (!name?.trim()) return;
    const colors: Folder['color'][] = ['cyan', 'purple', 'lime', 'gray'];
    const f: Folder = { id: `f-${Date.now()}`, name: name.trim(), icon: 'Folder', color: colors[folders.length % 4] };
    setFolders(p => [...p, f]);
    setActiveFolderId(f.id);
    addToast(`📁 Folder "${f.name}" created.`, 'info');
  }, [folders.length, addToast]);

  const handleDeleteFolder = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (folders.length <= 1) { addToast('Cannot delete the last folder.', 'warning'); return; }
    if (!confirm('Delete this folder and all its notes?')) return;
    const f = folders.find(x => x.id === id);
    setFolders(p => p.filter(x => x.id !== id));
    setNotes(p => p.filter(n => n.folderId !== id));
    addToast(`Deleted folder "${f?.name}".`, 'warning');
    const fallback = folders.find(x => x.id !== id);
    if (fallback) {
      setActiveFolderId(fallback.id);
      setActiveNoteId(notes.find(n => n.folderId === fallback.id)?.id ?? '');
    }
  }, [folders, notes, addToast]);

  // ── Note actions ──────────────────────────────────────────
  const handleCreateNote = useCallback((folderId: string = activeFolderId) => {
    const note: Note = {
      id: `n-${Date.now()}`, title: 'Untitled Note', folderId,
      content: '# Untitled\n\nStart writing here...',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      favorite: false, pinned: false, tags: [],
    };
    setNotes(p => [note, ...p]);
    setActiveNoteId(note.id);
    setActiveFolderId(folderId);
    logActivity(note.id, note.title, 'create');
    addToast('✨ New note created.');
  }, [activeFolderId, logActivity, addToast]);

  const handleUpdateNote = useCallback((fields: Partial<Note>) => {
    if (!activeNoteId) return;
    setSaveStatus('saving');
    setNotes(p => p.map(n => n.id === activeNoteId ? { ...n, ...fields, updatedAt: new Date().toISOString() } : n));
    setTimeout(() => setSaveStatus('saved'), 600);
  }, [activeNoteId]);

  const handleDeleteNote = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this note?')) return;
    const note = notes.find(n => n.id === id);
    setNotes(p => p.filter(n => n.id !== id));
    addToast(`Deleted "${note?.title}".`, 'warning');
    if (activeNoteId === id) {
      const rem = notes.filter(n => n.folderId === activeFolderId && n.id !== id);
      setActiveNoteId(rem[0]?.id ?? '');
    }
  }, [notes, activeNoteId, activeFolderId, addToast]);

  const handleTogglePin = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    const pinned = !note.pinned;
    setNotes(p => p.map(n => n.id === id ? { ...n, pinned } : n));
    if (pinned) logActivity(id, note.title, 'pin');
    addToast(pinned ? `📌 Pinned "${note.title}".` : `Unpinned "${note.title}".`, 'info');
  }, [notes, logActivity, addToast]);

  const handleToggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    const favorite = !note.favorite;
    setNotes(p => p.map(n => n.id === id ? { ...n, favorite } : n));
    if (favorite) logActivity(id, note.title, 'favorite');
    addToast(favorite ? `💖 Favorited "${note.title}".` : `Removed from favorites.`, 'info');
  }, [notes, logActivity, addToast]);

  const handleCompileSave = useCallback(() => {
    if (!activeNote) return;
    logActivity(activeNote.id, activeNote.title, 'edit');
    addToast(`✨ Saved: ${activeNote.title}`, 'success');
  }, [activeNote, logActivity, addToast]);

  // ── Sticky actions ────────────────────────────────────────
  const handleAddSticky = useCallback((color: StickyNote['color']) => {
    setStickies(p => [{ id: `s-${Date.now()}`, content: '⚡ New scratchpad...', color, updatedAt: new Date().toISOString() }, ...p]);
    addToast('💡 Scratchpad created.', 'info');
  }, [addToast]);

  const handleUpdateSticky = useCallback((id: string, content: string) => {
    setStickies(p => p.map(s => s.id === id ? { ...s, content, updatedAt: new Date().toISOString() } : s));
  }, []);

  const handleDeleteSticky = useCallback((id: string) => {
    setStickies(p => p.filter(s => s.id !== id));
    addToast('Scratchpad deleted.', 'warning');
  }, [addToast]);

  const handleStickyColor = useCallback((id: string, color: StickyNote['color']) => {
    setStickies(p => p.map(s => s.id === id ? { ...s, color } : s));
  }, []);

  // ── Export / Import / Reset ───────────────────────────────
  const handleExport = useCallback(() => {
    exportWorkspace({ notes, folders, stickies, activities });
    addToast('💾 Workspace exported.', 'info');
  }, [notes, folders, stickies, activities, addToast]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const backup = await importWorkspace(file);
    if (backup) {
      setFolders(backup.folders);
      setNotes(backup.notes);
      if (backup.stickies)   setStickies(backup.stickies);
      if (backup.activities) setActivities(backup.activities);
      addToast('💾 Workspace imported!', 'success');
    } else {
      addToast('Invalid or unreadable backup file.', 'warning');
    }
    e.target.value = '';
  }, [addToast]);

  const handleReset = useCallback(() => {
    if (!confirm('Reset to demo data? All custom notes will be lost.')) return;
    setFolders(INITIAL_FOLDERS);
    setNotes(INITIAL_NOTES);
    setStickies(INITIAL_STICKIES);
    setActivities(INITIAL_ACTIVITIES);
    setActiveFolderId(INITIAL_FOLDERS[0].id);
    setActiveNoteId(INITIAL_NOTES[0].id);
    clearStorage();
    addToast('🔄 Workspace reset to demo data.', 'info');
  }, [addToast]);

  return {
    folders, notes, stickies, activities,
    activeFolderId, activeNoteId, setActiveNoteId,
    activeNote, filteredNotes, stats,
    saveStatus, filterFavorites, setFilterFavorites,
    toasts, addToast, removeToast,
    handleSelectFolder, handleAddFolder, handleDeleteFolder,
    handleCreateNote, handleUpdateNote, handleDeleteNote,
    handleTogglePin, handleToggleFavorite, handleCompileSave,
    handleAddSticky, handleUpdateSticky, handleDeleteSticky, handleStickyColor,
    handleExport, handleImport, handleReset,
  };
}
