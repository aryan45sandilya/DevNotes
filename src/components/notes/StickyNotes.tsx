'use client';

import { useState } from 'react';
import { Trash2, Palette, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ClientDate from '@/components/common/ClientDate';
import type { StickyNote } from '@/types';

interface Props {
  stickies: StickyNote[];
  onAdd: (color: StickyNote['color']) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: StickyNote['color']) => void;
}

const COLOR_LIST: StickyNote['color'][] = ['cyan', 'purple', 'lime', 'yellow', 'gray'];

const COLOR_HEX: Record<StickyNote['color'], string> = {
  cyan: '#00E5FF', purple: '#8B5CF6', lime: '#A3FF12', yellow: '#EAB308', gray: '#9CA3AF',
};

function colorClasses(c: StickyNote['color']) {
  switch (c) {
    case 'cyan':   return { bg: 'bg-cyber-cyan/5',   border: 'border-cyber-cyan/30',   badge: 'bg-cyber-cyan/15 text-cyber-cyan'    };
    case 'purple': return { bg: 'bg-cyber-purple/5', border: 'border-cyber-purple/30', badge: 'bg-cyber-purple/15 text-cyber-purple' };
    case 'lime':   return { bg: 'bg-cyber-lime/5',   border: 'border-cyber-lime/30',   badge: 'bg-cyber-lime/15 text-cyber-lime'    };
    case 'yellow': return { bg: 'bg-yellow-500/5',   border: 'border-yellow-500/30',   badge: 'bg-yellow-500/15 text-yellow-400'   };
    default:       return { bg: 'bg-[var(--bg-card)]', border: 'border-[var(--border-default)]', badge: 'bg-[var(--bg-hover)] text-[var(--text-muted)]' };
  }
}

export default function StickyNotes({ stickies, onAdd, onUpdate, onDelete, onColorChange }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-default)] glass-panel">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            <span className="text-xs font-bold font-display tracking-wider uppercase text-[var(--text-primary)]">
              SCRATCHPAD MEMORY
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[var(--text-muted)] font-mono hidden sm:inline">ADD:</span>
            <div className="flex gap-1">
              {COLOR_LIST.map(col => (
                <motion.button
                  key={col}
                  onClick={() => onAdd(col)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-4 h-4 rounded-full border border-white/10"
                  style={{ backgroundColor: COLOR_HEX[col] }}
                  title={`Add ${col} pad`}
                  aria-label={`Add ${col} sticky note`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {stickies.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-[11px] font-mono text-[var(--text-muted)]">SCRATCHPAD EMPTY</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Tap a colour dot above to create a pad.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AnimatePresence mode="popLayout">
              {stickies.map(sticky => {
                const cl = colorClasses(sticky.color);
                return (
                  <motion.div
                    key={sticky.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-xl border flex flex-col gap-3 ${cl.bg} ${cl.border} relative group`}
                  >
                    {/* Card header */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold ${cl.badge}`}>
                        PAD_{sticky.id.slice(-4).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        {/* Colour picker */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === sticky.id ? null : sticky.id)}
                            className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            aria-label="Change color"
                          >
                            <Palette className="w-3.5 h-3.5" />
                          </button>
                          <AnimatePresence>
                            {openMenu === sticky.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1 p-1 bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-lg flex gap-1 z-30 shadow-2xl"
                              >
                                {COLOR_LIST.map(col => (
                                  <motion.button
                                    key={col}
                                    onClick={() => { onColorChange(sticky.id, col); setOpenMenu(null); }}
                                    whileHover={{ scale: 1.25 }}
                                    className="w-3 h-3 rounded-full border border-white/5"
                                    style={{ backgroundColor: COLOR_HEX[col] }}
                                    aria-label={`Set ${col} color`}
                                  />
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {/* Delete */}
                        <button
                          onClick={() => onDelete(sticky.id)}
                          className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                          aria-label="Delete sticky note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={sticky.content}
                      onChange={e => onUpdate(sticky.id, e.target.value)}
                      className="flex-1 bg-transparent border-0 p-0 text-xs text-[var(--text-secondary)] focus:ring-0 leading-relaxed placeholder-[var(--text-muted)] resize-none h-20 outline-none"
                      placeholder="Scribble a code note or system detail here..."
                      aria-label="Sticky note content"
                    />

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-[9px] font-mono text-[var(--text-muted)]">
                      <Clock className="w-3 h-3" />
                      <span>SYNCED: </span>
                      <ClientDate iso={sticky.updatedAt} type="time" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
