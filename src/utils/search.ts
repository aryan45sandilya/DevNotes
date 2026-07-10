// search.ts — fuzzy / keyword search utilities used by
// CommandPalette and any future search surfaces.

import type { Note, Folder } from '@/types';

/**
 * Returns true when `haystack` contains every word in `query`
 * (case-insensitive, space-separated). This gives a "fuzzy"
 * feel without a heavy library dependency.
 */
export function fuzzyMatch(haystack: string, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const words = q.split(/\s+/);
  const h = haystack.toLowerCase();
  return words.every(w => h.includes(w));
}

/**
 * Filters notes whose title, content, or tags contain `query`.
 */
export function searchNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;
  return notes.filter(note =>
    fuzzyMatch(note.title, query) ||
    fuzzyMatch(note.content, query) ||
    note.tags.some(t => fuzzyMatch(t, query))
  );
}

/**
 * Filters folders whose name contains `query`.
 */
export function searchFolders(folders: Folder[], query: string): Folder[] {
  if (!query.trim()) return folders;
  return folders.filter(f => fuzzyMatch(f.name, query));
}
