// folderStore.ts — convenience re-export of folder-specific
// state and actions derived from notesStore.
//
// Usage:
//   import { useFolderStore } from '@/store/folderStore';
//   const { folders, handleAddFolder, handleDeleteFolder } = useFolderStore();

import { useNotes } from '@/hooks/useNotes';

export function useFolderStore() {
  const {
    folders,
    activeFolderId,
    handleSelectFolder,
    handleAddFolder,
    handleDeleteFolder,
  } = useNotes();

  return { folders, activeFolderId, handleSelectFolder, handleAddFolder, handleDeleteFolder };
}
