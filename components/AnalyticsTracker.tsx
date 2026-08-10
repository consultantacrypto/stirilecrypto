'use client';

import { useScrollTracking, useTimeOnPageTracking } from '@/hooks/useAnalytics';

/** Client-side engagement tracking mounted from the root layout. */
export default function AnalyticsTracker() {
  useScrollTracking();
  useTimeOnPageTracking();
  return null;
}
