import { cn } from '@/lib/cn';

const moodStyles: Record<string, string> = {
  happy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  sad: 'border-blue-200 bg-blue-50 text-blue-700',
  angry: 'border-rose-200 bg-rose-50 text-rose-700'
};

export function MoodBadge({ mood }: { mood: string }) {
  return <span className={cn('badge', moodStyles[mood] ?? '')}>{mood}</span>;
}
