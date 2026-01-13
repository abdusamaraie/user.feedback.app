import clsx from 'clsx';

const statusColors: Record<string, string> = {
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  planned: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  done: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200'
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={clsx('status-pill', statusColors[status] || 'bg-slate-100 text-slate-600')}>
      {status.replace('_', ' ')}
    </span>
  );
}
