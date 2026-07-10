// notesStore.ts — re-exports useNotes as the canonical store
// for notes, folders, stickies, and activities.
//
// This indirection means page.tsx and any future consumer only
// needs to update this import if the underlying hook ever
// migrates to Zustand or another state manager.

export { useNotes } from '@/hooks/useNotes';
