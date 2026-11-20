'use client';

import { useEffect, useState } from 'react';

export default function MobileOrderBar({ label }: { label: string }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const target = document.getElementById('comanda');
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHide(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090a0d]/95 p-3 backdrop-blur-xl transition-transform duration-200 lg:hidden ${
        hide ? 'pointer-events-none translate-y-full' : 'translate-y-0'
      }`}
      aria-hidden={hide}
    >
      <a
        href="#comanda"
        tabIndex={hide ? -1 : undefined}
        className="flex h-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {label}
      </a>
    </div>
  );
}
