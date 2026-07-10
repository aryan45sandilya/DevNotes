// ── Workspace export / import helpers ────────────────────────
// Moved from lib/export.ts to utils/export.ts to follow the
// convention: lib/ = low-level infra, utils/ = app-level helpers.

import type { Note, Folder, StickyNote, ActivityLog } from '@/types';

export interface WorkspaceBackup {
  notes:      Note[];
  folders:    Folder[];
  stickies:   StickyNote[];
  activities: ActivityLog[];
  exportedAt: string;
}

/** Triggers a JSON file download in the browser. */
export function exportWorkspace(backup: Omit<WorkspaceBackup, 'exportedAt'>): void {
  const payload: WorkspaceBackup = { ...backup, exportedAt: new Date().toISOString() };
  const json = JSON.stringify(payload, null, 2);
  const url  = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `devos_backup_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Parses a JSON File and returns the backup, or null on failure. */
export async function importWorkspace(file: File): Promise<WorkspaceBackup | null> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as WorkspaceBackup;
        if (parsed.notes && parsed.folders) resolve(parsed);
        else resolve(null);
      } catch {
        resolve(null);
      }
    };
    reader.readAsText(file);
  });
}
