import { cn } from '@/lib/cn';

type PillProps = {
  label: string;
  tone?: 'slate' | 'blue' | 'amber' | 'emerald' | 'rose';
};

const tones: Record<string, string> = {
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700'
};

export function Pill({ label, tone = 'slate' }: PillProps) {
  return <span className={cn('badge', tones[tone])}>{label}</span>;
}

export function statusTone(status: string) {
  switch (status) {
    case 'planned':
      return 'amber';
    case 'in_progress':
      return 'blue';
    case 'done':
      return 'emerald';
    case 'closed':
      return 'rose';
    default:
      return 'slate';
  }
}

export function typeTone(type: string) {
  switch (type) {
    case 'bug':
      return 'rose';
    case 'idea':
      return 'blue';
    default:
      return 'emerald';
  }
}
