import type { ReactNode } from 'react';
import './globals.css';
import { FingerprintBootstrap } from '@/components/FingerprintBootstrap';

export const metadata = {
  title: 'Feedback Board',
  description: 'Anonymous feedback boards for your apps.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FingerprintBootstrap />
        {children}
      </body>
    </html>
  );
}
