'use client';

import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import type { ToastMessage } from '@/types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let borderClass = 'border-[var(--border-default)]';
          let Icon = Info;
          let iconColor = 'text-cyber-cyan';

          if (toast.type === 'success') {
            borderClass = 'border-cyber-lime/40 shadow-[0_0_15px_rgba(163,255,18,0.10)]';
            Icon = CheckCircle2;
            iconColor = 'text-cyber-lime';
          } else if (toast.type === 'warning') {
            borderClass = 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.10)]';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
          } else {
            borderClass = 'border-cyber-cyan/40 shadow-[0_0_15px_rgba(0,229,255,0.10)]';
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border glass-panel ${borderClass} select-none`}
            >
              <div className={`p-1 rounded bg-white/5 shrink-0 ${iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="flex-1 text-xs font-medium text-[var(--text-primary)] leading-relaxed pt-0.5">
                {toast.text}
              </p>
              <button
                onClick={() => onClose(toast.id)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 rounded hover:bg-white/5 transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
