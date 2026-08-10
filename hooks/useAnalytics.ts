'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export { trackEvent };

/** Fires scroll_90_percent once when the page footer enters view (~end of article). */
export function useScrollTracking() {
  useEffect(() => {
    let triggered = false;
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          trackEvent('scroll_90_percent', { page: window.location.pathname });
          triggered = true;
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
}

/** Fires time_on_page_3min after 3 minutes on the same page. */
export function useTimeOnPageTracking() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      trackEvent('time_on_page_3min', { page: window.location.pathname });
    }, 180_000);

    return () => window.clearTimeout(timer);
  }, []);
}
