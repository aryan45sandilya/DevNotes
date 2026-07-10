// searchStore.ts — lightweight search state management.
// Currently a thin client-side store; ready to be promoted
// to Zustand if search state needs to be shared across
// deeply nested trees without prop drilling.

'use client';

import { useState, useCallback } from 'react';
import { searchNotes, searchFolders } from '@/utils/search';
import type { Note, Folder } from '@/types';

export function useSearchStore(notes: Note[], folders: Folder[]) {
  const [query, setQuery] = useState('');

  const filteredNotes   = searchNotes(notes, query);
  const filteredFolders = searchFolders(folders, query);

  const clearSearch = useCallback(() => setQuery(''), []);

  return { query, setQuery, filteredNotes, filteredFolders, clearSearch };
}
