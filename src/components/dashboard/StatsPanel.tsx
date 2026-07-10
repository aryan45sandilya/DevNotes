'use client';

import { FileText, Folder, Heart, Hash, Sparkles } from 'lucide-react';
import type { WorkspaceStats } from '@/types';

interface Props { stats: WorkspaceStats; }

export default function StatsPanel({ stats }: Props) {
  const items = [
    { label: 'TOTAL NOTES',   value: stats.notesCount,     icon: FileText,  color: 'text-cyber-cyan',   glow: 'bg-cyber-cyan/10',   border: 'border-cyber-cyan/10'   },
    { label: 'FOLDERS',       value: stats.foldersCount,   icon: Folder,    color: 'text-cyber-purple', glow: 'bg-cyber-purple/10', border: 'border-cyber-purple/10' },
    { label: 'FAVORITES',     value: stats.favoritesCount, icon: Heart,     color: 'text-rose-400',     glow: 'bg-rose-400/10',     border: 'border-rose-400/10'     },
    { label: 'UNIQUE TAGS',   value: stats.tagsCount,      icon: Hash,      color: 'text-cyber-lime',   glow: 'bg-cyber-lime/10',   border: 'border-cyber-lime/10'   },
    { label: 'COMPILED WORDS', value: stats.wordsCount >= 1000 ? `${(stats.wordsCount / 1000).toFixed(1)}k` : stats.wordsCount, icon: Sparkles, color: 'text-amber-400', glow: 'bg-amber-400/10', border: 'border-amber-400/10', sub: 'across notes' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className={`p-4 rounded-xl border glass-card ${item.border} relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5`}>
            <div className={`absolute -right-4 -bottom-4 w-12 h-12 rounded-full blur-xl ${item.glow}`} />
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-mono tracking-wider text-[var(--text-muted)] font-bold">{item.label}</span>
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-display text-[var(--text-primary)] tracking-tight">{item.value}</span>
              {'sub' in item && <span className="text-[9px] text-[var(--text-muted)] font-mono hidden lg:inline">{item.sub}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
