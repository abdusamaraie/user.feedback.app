'use client';

import { useEffect } from 'react';

export function FingerprintBootstrap() {
  useEffect(() => {
    void fetch('/api/public/fingerprint', { method: 'POST' });
  }, []);

  return null;
}
