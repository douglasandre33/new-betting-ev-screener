'use client';

import { useEffect, useState } from 'react';

export function LiveRefreshWarning() {
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      const response = await fetch('/api/refresh', { method: 'POST' });
      if (!response.ok) {
        const body = (await response.json()) as { warning?: string };
        setWarning(body.warning ?? 'refresh failed');
      }
    }, 60000);
    return () => clearInterval(id);
  }, []);

  if (!warning) return null;
  return <div className="mb-3 rounded border border-amber-600 bg-amber-950/30 p-3 text-sm text-amber-300">Warning: {warning}</div>;
}
