import type { ReactNode } from 'react';

export const runtime = 'nodejs';

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return children;
}
