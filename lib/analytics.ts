export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 custom event when gtag is available (production only). */
export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV === 'development') return;
  if (window.location.hostname === 'localhost') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, params);
}
