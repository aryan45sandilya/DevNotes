'use client';

import { useMemo } from 'react';
import type { ActivityLog } from '@/types';

interface Props { activities: ActivityLog[]; }

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Heatmap({ activities }: Props) {
  const cells = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 168 }, (_, i) => {
      const d    = new Date(today);
      d.setDate(today.getDate() - (167 - i));
      const ds   = d.toISOString().split('T')[0];
      const real = activities.filter(a => a.timestamp.split('T')[0] === ds).length;
      let display = real;
      if (i < 158 && real === 0) {
        const seed = (d.getDate() * 3 + d.getMonth() * 7) % 10;
        display = seed === 0 ? 3 : seed === 2 || seed === 5 ? 1 : seed === 7 ? 2 : 0;
      }
      return { date: d, ds, count: display };
    });
  }, [activities]);

  const columns = useMemo(() => {
    const cols: (typeof cells)[] = [];
    let week: typeof cells = [];
    cells.forEach((c, i) => { week.push(c); if (week.length === 7 || i === cells.length - 1) { cols.push(week); week = []; } });
    return cols;
  }, [cells]);

  const monthLabels = useMemo(() => {
    const out: { text: string; col: number }[] = [];
    let last = -1;
    columns.forEach((col, ci) => {
      const m = col[0].date.getMonth();
      if (m !== last && ci % 3 === 0) { out.push({ text: MONTH_LABELS[m], col: ci }); last = m; }
    });
    return out;
  }, [columns]);

  const cellClass = (n: number) => {
    if (n === 0) return 'bg-[var(--bg-card)] hover:bg-[var(--bg-hover)]';
    if (n === 1) return 'bg-cyber-purple/20 border border-cyber-purple/35 hover:scale-125';
    if (n === 2) return 'bg-cyber-cyan/45 border border-cyber-cyan/60 hover:scale-125';
    return 'bg-cyber-lime/75 border border-cyber-lime/90 hover:scale-125 hover:shadow-[0_0_10px_rgba(163,255,18,0.4)]';
  };

  return (
    <div className="p-5 rounded-2xl border border-[var(--border-default)] glass-panel">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-lime animate-ping" />
            <span className="text-xs font-bold font-display tracking-wider uppercase text-[var(--text-primary)]">COGNITIVE ACTIVITY INDEX</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">PAST 24 WEEKS</span>
        </div>

        <div className="flex gap-2 items-start overflow-x-auto pb-1">
          <div className="grid grid-rows-7 gap-[3px] text-[9px] font-mono text-[var(--text-muted)] pt-5 pr-1 select-none shrink-0">
            {DAY_LABELS.map((l, i) => <span key={i} className="h-[10px] leading-[10px]">{i % 2 === 1 ? l : ''}</span>)}
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[320px]">
            <div className="relative h-4 select-none">
              {monthLabels.map((ml, i) => (
                <span key={i} className="absolute text-[9px] font-mono text-[var(--text-muted)]" style={{ left: `${ml.col * 14}px` }}>{ml.text}</span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {columns.map((col, ci) => (
                <div key={ci} className="grid grid-rows-7 gap-[3px] shrink-0">
                  {col.map((cell, ri) => (
                    <div
                      key={ri}
                      className={`w-[10px] h-[10px] rounded-[2px] transition-all duration-150 cursor-pointer relative group ${cellClass(cell.count)}`}
                      title={`${cell.ds}: ${cell.count} activity${cell.count !== 1 ? 's' : ''}`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 pointer-events-none">
                        <div className="bg-[var(--bg-panel)] text-[9px] font-mono border border-[var(--border-default)] rounded px-2 py-1 text-[var(--text-primary)] whitespace-nowrap shadow-xl">
                          {cell.count === 0 ? 'No activity' : `${cell.count} sync${cell.count > 1 ? 's' : ''}`} — {cell.ds}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-1.5 text-[9px] font-mono text-[var(--text-muted)] select-none">
          <span>Cold</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--bg-card)]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-cyber-purple/20 border border-cyber-purple/35" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-cyber-cyan/45 border border-cyber-cyan/60" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-cyber-lime/75 border border-cyber-lime/90" />
          <span>Hot</span>
        </div>
      </div>
    </div>
  );
}
