'use client';

// ActivityPanel — thin wrapper that composes StatsPanel and
// TimelinePanel into a single "activity overview" section.
// Useful if you ever want to render both stats + timeline
// in one place without duplicating layout in page.tsx.

import StatsPanel from './StatsPanel';
import TimelinePanel from './TimelinePanel';
import type { WorkspaceStats, ActivityLog } from '@/types';

interface Props {
  stats: WorkspaceStats;
  activities: ActivityLog[];
  onSelectNote: (id: string) => void;
}

export default function ActivityPanel({ stats, activities, onSelectNote }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <StatsPanel stats={stats} />
      <TimelinePanel activities={activities} onSelectNote={onSelectNote} />
    </div>
  );
}
