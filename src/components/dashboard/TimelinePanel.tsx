'use client';

import { Plus, Edit, Heart, Pin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import ClientDate from '@/components/common/ClientDate';
import type { ActivityLog } from '@/types';

interface Props {
  activities: ActivityLog[];
  onSelectNote: (id: string) => void;
}

function logInfo(type: ActivityLog['type']) {
  switch (type) {
    case 'create':   return { Icon: Plus,  color: 'text-cyber-lime  border-cyber-lime/30  bg-cyber-lime/5',    label: 'CREATED'   };
    case 'favorite': return { Icon: Heart, color: 'text-rose-400    border-rose-400/30    bg-rose-400/5',      label: 'FAVORITED' };
    case 'pin':      return { Icon: Pin,   color: 'text-cyber-cyan  border-cyber-cyan/30  bg-cyber-cyan/5',    label: 'PINNED'    };
    default:         return { Icon: Edit,  color: 'text-cyber-purple border-cyber-purple/30 bg-cyber-purple/5', label: 'EDITED'   };
  }
}

export default function TimelinePanel({ activities, onSelectNote }: Props) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-default)] glass-panel">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-purple animate-pulse" />
            <span className="text-xs font-bold font-display tracking-wider uppercase text-[var(--text-primary)]">
              WORKSPACE SYNC STREAM
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">ACTIVITY LOG</span>
        </div>

        {/* Empty */}
        {activities.length === 0 ? (
          <div className="py-6 text-center">
            <Clock className="w-6 h-6 text-[var(--text-muted)] opacity-30 mx-auto mb-2" />
            <p className="text-xs text-[var(--text-muted)]">No recent activity.</p>
          </div>
        ) : (
          <div className="relative pl-4 border-l border-[var(--border-subtle)] space-y-4">
            {activities.map((log, i) => {
              const { Icon, color, label } = logInfo(log.type);
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group relative cursor-pointer"
                  onClick={() => onSelectNote(log.noteId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && onSelectNote(log.noteId)}
                  aria-label={`Open ${log.noteTitle}`}
                >
                  <div className={`absolute -left-[25px] top-[1px] w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg ${color}`}>
                    <Icon className="w-2.5 h-2.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-extrabold tracking-wider text-[var(--text-muted)]">
                        {label}
                      </span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <ClientDate iso={log.timestamp} type="time" />
                      </span>
                    </div>
                    <h4 className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-cyber-cyan transition-colors truncate pr-4">
                      {log.noteTitle}
                    </h4>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
