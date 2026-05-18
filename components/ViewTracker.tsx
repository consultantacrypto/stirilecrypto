'use client';

import { useEffect, useRef } from 'react';

type ViewTrackerProps = {
  slug: string;
};

export default function ViewTracker({ slug }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!slug || tracked.current) return;
    tracked.current = true;

    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {
      /* silent — never break the page */
    });
  }, [slug]);

  return null;
}
