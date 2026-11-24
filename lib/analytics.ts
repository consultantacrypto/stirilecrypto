export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    /** Set from the server layout so Preview and local builds do not emit events. */
    __SC_VERCEL_ENV?: string;
  }
}

/** Vercel sets this at build time. Anything other than production stays quiet. */
export function deploymentEnv(): 'production' | 'preview' | 'development' | '' {
  const value = process.env.VERCEL_ENV;
  if (value === 'production' || value === 'preview' || value === 'development') return value;
  return '';
}

export function shouldSendAnalytics(env: string | undefined | null): boolean {
  return env === 'production';
}

/** Fire a GA4 custom event when gtag is available and this deployment is production. */
export function trackEvent(eventName: string, params?: AnalyticsParams) {
  if (typeof window === 'undefined') return;
  const env = window.__SC_VERCEL_ENV ?? process.env.VERCEL_ENV;
  if (!shouldSendAnalytics(env)) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, params);
}
