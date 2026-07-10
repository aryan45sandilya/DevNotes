'use client';

// Modal — accessible, animated overlay wrapper.
// Wraps any content in the standard DevOS glass-panel modal shell.
// Uses motion/react for enter/exit animations — consistent with
// the existing stats and help modals in page.tsx.

import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Controls the max-width of the dialog panel. Default: 'md' */
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASS: Record<NonNullable<Props['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full ${SIZE_CLASS[size]} bg-[var(--bg-panel)] border border-[var(--border-default)] rounded-2xl p-6 shadow-2xl z-10 overflow-y-auto max-h-[90vh]`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                id="modal-title"
                className="text-sm font-bold font-display tracking-widest uppercase text-[var(--text-primary)]"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl leading-none transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
