import clsx from 'clsx';

export function TagPill({ name, color }: { name: string; color?: string }) {
  return (
    <span
      className={clsx('tag-pill', 'border', color ? 'text-white' : 'bg-slate-100 text-slate-700')}
      style={color ? { backgroundColor: color, borderColor: color } : undefined}
    >
      {name}
    </span>
  );
}
