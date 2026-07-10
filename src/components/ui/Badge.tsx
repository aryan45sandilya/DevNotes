// Badge — small label chip for tags, statuses, and counts.

type Color = 'cyan' | 'purple' | 'lime' | 'rose' | 'amber' | 'gray';

interface Props {
  label: string;
  color?: Color;
  /** Renders a hash prefix — useful for tag chips. */
  isTag?: boolean;
}

const COLOR_CLASS: Record<Color, string> = {
  cyan:   'text-cyber-cyan   bg-cyber-cyan/5   border-cyber-cyan/20',
  purple: 'text-cyber-purple bg-cyber-purple/5 border-cyber-purple/20',
  lime:   'text-cyber-lime   bg-cyber-lime/5   border-cyber-lime/20',
  rose:   'text-rose-400     bg-rose-400/5     border-rose-400/20',
  amber:  'text-amber-400    bg-amber-400/5    border-amber-400/20',
  gray:   'text-[var(--text-muted)] bg-[var(--bg-card)] border-[var(--border-subtle)]',
};

export default function Badge({ label, color = 'gray', isTag = false }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-mono px-2 py-0.5 rounded-full border select-none ${COLOR_CLASS[color]}`}
    >
      {isTag && <span className="opacity-60">#</span>}
      {label}
    </span>
  );
}
