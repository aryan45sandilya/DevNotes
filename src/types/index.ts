// ============================================================
// DEVOS NOTES — shared type definitions
// All interfaces used across the app live here so any
// component can import from '@/types' without circular deps.
// ============================================================

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  pinned: boolean;
  tags: string[];
}

export interface Folder {
  id: string;
  name: string;
  icon: string; // lucide icon key or emoji
  color: 'cyan' | 'purple' | 'lime' | 'gray';
}

export interface StickyNote {
  id: string;
  content: string;
  color: 'cyan' | 'purple' | 'lime' | 'gray' | 'yellow';
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  noteId: string;
  noteTitle: string;
  type: 'create' | 'edit' | 'favorite' | 'pin';
  timestamp: string;
}

export interface WorkspaceStats {
  notesCount: number;
  tagsCount: number;
  favoritesCount: number;
  foldersCount: number;
  wordsCount: number;
}

export type ToastType = 'success' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}
