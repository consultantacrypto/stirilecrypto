'use client';

import { useEffect, useRef } from 'react';

const ORIGIN = 'https://www.mihaidaniel.ro';

export function CheckerFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== ORIGIN) return;
      const data = event.data as { type?: string; height?: number };
      if (data?.type !== 'verifica-adresa-height' || typeof data.height !== 'number') return;
      if (!ref.current) return;
      ref.current.style.height = `${Math.min(Math.max(data.height, 720), 4000)}px`;
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      style={{ width: '100%', minHeight: '980px', border: 0, background: '#070b14' }}
      allow="payment"
    />
  );
}
