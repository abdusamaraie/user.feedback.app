import { cn } from '@/lib/cn';

const statusStyles: Record<string, string> = {
  idea: 'border-slate-200 bg-slate-50 text-slate-700',
  planned: 'border-amber-200 bg-amber-50 text-amber-700',
  in_progress: 'border-sky-200 bg-sky-50 text-sky-700',
  shipped: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  closed: 'border-rose-200 bg-rose-50 text-rose-700'
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn('badge', statusStyles[status] ?? '')}>{status}</span>;
}
