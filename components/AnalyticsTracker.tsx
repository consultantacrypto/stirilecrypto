'use client';

import { useEffect } from 'react';
import { useScrollTracking, useTimeOnPageTracking } from '@/hooks/useAnalytics';
import { trackEvent } from '@/lib/analytics';
import { classifyOutbound, gaParam, outboundPlacement } from '@/lib/outbound-clicks';

/** Client-side engagement tracking mounted from the root layout. */
export default function AnalyticsTracker() {
  useScrollTracking();
  useTimeOnPageTracking();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const kind = classifyOutbound(anchor.href, anchor.getAttribute('rel'));
      if (!kind) return;
      trackEvent(kind === 'consultancy' ? 'consultancy_click' : 'affiliate_click', {
        link: gaParam(anchor.href),
        placement: outboundPlacement(anchor.dataset.placement, anchor.href, window.location.pathname),
      });
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
