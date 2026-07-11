'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft, StickyNote, Activity, FolderTree, FileCode2,
  Eye, Heart, Pin, Search, Tag, Moon, Download, Keyboard,
  Cpu,
} from 'lucide-react';

// ── Feature data ──────────────────────────────────────────
const FEATURES = [
  {
    icon: StickyNote,
    color: 'text-cyber-cyan',
    glow:  'bg-cyber-cyan/10 border-cyber-cyan/20',
    title: 'Scratch Pad',
    description: 'Quick ephemeral notes that live outside your folder structure.',
    purpose: 'Capture fleeting thoughts, code snippets, or temporary references without cluttering your main notes.',
    howto: [
      'Open the bottom panel and click the SCRATCHPADS tab.',
      'Click a colour dot in the header to create a new pad.',
      'Type directly inside any pad — it auto-saves instantly.',
      'Change colour via the palette icon, or delete via the trash icon.',
    ],
  },
  {
    icon: Activity,
    color: 'text-cyber-purple',
    glow:  'bg-cyber-purple/10 border-cyber-purple/20',
    title: 'Activity',
    description: 'A real-time log of every action you perform in the workspace.',
    purpose: 'Track what you created, edited, pinned, or favourited so you can jump back to recent work instantly.',
    howto: [
      'Open the bottom panel and click the ACTIVITY tab.',
      'Each entry shows the action type, note title, and timestamp.',
      'The sidebar also has a collapsible Activity section — click any entry to open that note.',
      'The last 40 actions are stored in localStorage automatically.',
    ],
  },
  {
    icon: FolderTree,
    color: 'text-cyber-lime',
    glow:  'bg-cyber-lime/10 border-cyber-lime/20',
    title: 'Folder Tree',
    description: 'VS Code-style collapsible directory explorer on the left sidebar.',
    purpose: 'Organise notes into topic-based folders — e.g. React, DSA, System Design — so you can find things fast.',
    howto: [
      'Click the › arrow next to any section header to collapse or expand it.',
      'Click the + icon next to ROOT DIRECTORY to create a new folder.',
      'Click a folder to switch into it — notes below update immediately.',
      'Hover over a folder row to reveal the delete icon.',
      'Collapsed/expanded state is remembered across page refreshes.',
    ],
  },
  {
    icon: FileCode2,
    color: 'text-cyber-cyan',
    glow:  'bg-cyber-cyan/10 border-cyber-cyan/20',
    title: 'Markdown Editor',
    description: 'A full-featured markdown editor with syntax highlighting and line numbers.',
    purpose: 'Write rich technical notes with headings, code blocks, tables, checkboxes, and inline formatting.',
    howto: [
      'Select or create a note to open it in the editor.',
      'Use the toolbar buttons to insert bold, italic, headings, code blocks, tables, and task items.',
      'Type raw markdown — the editor understands all standard syntax.',
      'Press Ctrl + S to save and log the edit to the activity feed.',
      'Line numbers on the left track your position in long notes.',
    ],
  },
  {
    icon: Eye,
    color: 'text-cyber-purple',
    glow:  'bg-cyber-purple/10 border-cyber-purple/20',
    title: 'Preview',
    description: 'Live rendered markdown preview shown side-by-side with the editor.',
    purpose: 'See exactly how your note will look — with styled headings, code blocks, tables, and callouts — while you type.',
    howto: [
      'Click the ⊞ Show Preview button at the bottom-right of the editor status bar.',
      'The editor splits into two panes — raw markdown on the left, preview on the right.',
      'Click ⊟ Hide Preview to collapse back to full-width editor.',
      'Preview updates live as you type with no delay.',
    ],
  },
  {
    icon: Heart,
    color: 'text-rose-400',
    glow:  'bg-rose-400/10 border-rose-400/20',
    title: 'Favourites',
    description: 'Star any note to mark it as a favourite and find it instantly.',
    purpose: 'Keep your most important or frequently-visited notes just one click away.',
    howto: [
      'Hover over a note in the list and click the ♥ heart icon.',
      'Click the ♥ filter button in the COMPILED FILES header to show only favourites.',
      'The Favourites section in the sidebar also lists all starred notes directly.',
      'Un-favourite by clicking the heart icon again.',
    ],
  },
  {
    icon: Pin,
    color: 'text-cyber-cyan',
    glow:  'bg-cyber-cyan/10 border-cyber-cyan/20',
    title: 'Pinned Notes',
    description: 'Pin notes to the top of the list so they never get buried.',
    purpose: 'Keep work-in-progress or reference notes always visible at the top of any folder.',
    howto: [
      'Hover over a note and click the 📌 pin icon.',
      'Pinned notes always appear above unpinned notes regardless of edit time.',
      'Multiple notes can be pinned simultaneously.',
      'Unpin by clicking the pin icon again.',
    ],
  },
  {
    icon: Search,
    color: 'text-cyber-cyan',
    glow:  'bg-cyber-cyan/10 border-cyber-cyan/20',
    title: 'Search & Command Palette',
    description: 'Instant full-text search across all notes, folders, and actions.',
    purpose: 'Find any note by title, content, or tag in milliseconds without leaving the keyboard.',
    howto: [
      'Press Ctrl + K (or click the search bar in the header) to open the Command Palette.',
      'Start typing — results update live across notes, folders, and system actions.',
      'Use ↑ ↓ arrow keys to navigate results.',
      'Press Enter to open the selected item.',
      'Press Escape to close the palette.',
    ],
  },
  {
    icon: Tag,
    color: 'text-cyber-lime',
    glow:  'bg-cyber-lime/10 border-cyber-lime/20',
    title: 'Tags & Categories',
    description: 'Attach multiple tags to any note for cross-folder categorisation.',
    purpose: 'Tag notes with topics like #React, #Security, or #DSA and find them through search regardless of which folder they live in.',
    howto: [
      'Open a note and click the "+ tag" button below the title.',
      'Type a tag name and press Enter — it attaches immediately.',
      'Tags appear as small chips under the note title in the editor.',
      'Search by tag name in the Command Palette to find all tagged notes.',
    ],
  },
  {
    icon: Moon,
    color: 'text-cyber-purple',
    glow:  'bg-cyber-purple/10 border-cyber-purple/20',
    title: 'Dark Mode',
    description: 'Toggle between a dark cyberpunk theme and a clean light mode.',
    purpose: 'Work comfortably in any lighting — all colours, shadows, and backgrounds switch automatically.',
    howto: [
      'Click the sun/moon icon in the top-right header.',
      'The theme switches instantly with a smooth transition.',
      'Your preference is saved and restored on next visit.',
      'All UI elements — editor, sidebar, modals — adapt to the selected theme.',
    ],
  },
  {
    icon: Download,
    color: 'text-cyber-cyan',
    glow:  'bg-cyber-cyan/10 border-cyber-cyan/20',
    title: 'Export & Import',
    description: 'Back up your entire workspace as a portable JSON file.',
    purpose: 'Never lose your notes — export a full backup anytime and restore it on any device or browser.',
    howto: [
      'Click the ↓ Download icon in the header to export all notes, folders, stickies, and activity.',
      'A file named devos_backup_[timestamp].json downloads automatically.',
      'Click the ↑ Upload icon to import a previous backup.',
      'Import merges or replaces the current workspace with the backup data.',
    ],
  },
  {
    icon: Keyboard,
    color: 'text-cyber-lime',
    glow:  'bg-cyber-lime/10 border-cyber-lime/20',
    title: 'Keyboard Shortcuts',
    description: 'Power-user shortcuts for the most common actions.',
    purpose: 'Stay in the flow — perform every key action without ever reaching for the mouse.',
    howto: [],
    shortcuts: [
      { key: 'Ctrl + K',  action: 'Open Command Palette / Search' },
      { key: 'Ctrl + S',  action: 'Save & log current note to Activity' },
      { key: '↑ / ↓',    action: 'Navigate Command Palette results' },
      { key: 'Enter',     action: 'Select highlighted palette item' },
      { key: 'Escape',    action: 'Close palette, modal, or dropdown' },
    ],
  },
];

// ── Card component ────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`rounded-2xl border p-5 glass-card flex flex-col gap-4 ${feature.glow} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${feature.glow}`}>
          <Icon className={`w-4.5 h-4.5 ${feature.color}`} />
        </div>
        <div>
          <span className={`text-[9px] font-mono font-bold tracking-widest uppercase ${feature.color}`}>
            FEATURE {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-sm font-bold font-display text-[var(--text-primary)] leading-tight">
            {feature.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        {feature.description}
      </p>

      {/* Purpose */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] px-3 py-2.5">
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] block mb-1">
          PURPOSE
        </span>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {feature.purpose}
        </p>
      </div>

      {/* How to use */}
      {feature.howto.length > 0 && (
        <div>
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] block mb-2">
            HOW TO USE
          </span>
          <ol className="space-y-1.5">
            {feature.howto.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-[var(--text-secondary)]">
                <span className={`shrink-0 w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center mt-0.5 ${feature.glow} ${feature.color}`}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Shortcuts table */}
      {'shortcuts' in feature && feature.shortcuts && (
        <div>
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] block mb-2">
            SHORTCUTS
          </span>
          <div className="space-y-1.5">
            {feature.shortcuts.map(({ key, action }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className={`font-mono text-[11px] px-2 py-1 rounded-lg border ${feature.glow} ${feature.color} shrink-0`}>
                  {key}
                </span>
                <span className="text-xs text-[var(--text-secondary)] text-right">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────
export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans">
      {/* Ambient bg */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-30" />
      <div className="dark:block hidden fixed -top-40 -left-40 w-96 h-96 bg-cyber-cyan rounded-full blur-[160px] opacity-8 pointer-events-none" />
      <div className="dark:block hidden fixed -bottom-40 -right-40 w-96 h-96 bg-cyber-purple rounded-full blur-[160px] opacity-8 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-cyber-cyan transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to workspace
        </Link>

        {/* Hero */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-[1.5px] shadow-[0_0_20px_rgba(139,92,246,0.3)] shrink-0">
            <div className="w-full h-full bg-[var(--bg-panel)] rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyber-cyan" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-wider text-[var(--text-primary)]">
              DEVOS <span className="gradient-text">HELP</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Everything you need to know about your knowledge workspace — in plain language.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Features', value: '12' },
            { label: 'Shortcuts', value: '5'  },
            { label: 'Local Storage', value: '∞' },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card rounded-xl border border-[var(--border-subtle)] p-3 text-center">
              <p className="text-xl font-bold font-display text-[var(--text-primary)]">{value}</p>
              <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[var(--text-muted)] font-mono">
            DEVOS NOTES · All data stored locally in your browser · No backend required
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-4 text-xs font-mono text-cyber-cyan hover:underline"
          >
            <ArrowLeft className="w-3 h-3" />
            Return to workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
