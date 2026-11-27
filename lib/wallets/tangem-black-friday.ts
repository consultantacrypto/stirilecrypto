/**
 * Tangem Black Friday on /portofele.
 * The sentence names 29.11, the last day of the public offer.
 * The banner stays up through 2026-11-30T23:59:59Z, then hides with no redeploy.
 * This module is the only place that instant is defined.
 */

export const TANGEM_BLACK_FRIDAY_COPY =
  'Black Friday Tangem: până la 45% reducere cu codul BF2026, până pe 29.11';

export const TANGEM_BLACK_FRIDAY_CODE = 'BF2026';

export const TANGEM_BLACK_FRIDAY_HREF = 'https://www.mihaidaniel.ro/r/tangem?s=sc';

export const TANGEM_BLACK_FRIDAY_REL = 'sponsored noopener noreferrer';

export const TANGEM_BLACK_FRIDAY_CUTOFF_ISO = '2026-11-30T23:59:59Z';

export const TANGEM_BLACK_FRIDAY_CUTOFF_MS = Date.parse(TANGEM_BLACK_FRIDAY_CUTOFF_ISO);

export const TANGEM_BLACK_FRIDAY_SLOT_ID = 'tangem-bf';

/** Set on <html> by the expiry script. The stylesheet then hides the slot. */
export const TANGEM_BLACK_FRIDAY_OFF_ATTR = 'data-tangem-bf-off';

export function tangemBlackFridayHideCss(): string {
  return `html[${TANGEM_BLACK_FRIDAY_OFF_ATTR}] #${TANGEM_BLACK_FRIDAY_SLOT_ID}{display:none!important}`;
}

/** Inclusive of the cutoff instant. A stale static page still needs the client gate. */
export function isTangemBlackFridayVisible(now: number | Date): boolean {
  const ms = now instanceof Date ? now.getTime() : now;
  return Number.isFinite(ms) && ms <= TANGEM_BLACK_FRIDAY_CUTOFF_MS;
}

/**
 * Parser-blocking hide. It runs before first paint, so a cached HTML shell
 * cannot keep the banner on screen after the cutoff. It does not load any URL.
 */
export function tangemBlackFridayExpiryScript(): string {
  const id = JSON.stringify(TANGEM_BLACK_FRIDAY_SLOT_ID);
  const attr = JSON.stringify(TANGEM_BLACK_FRIDAY_OFF_ATTR);
  return `(function(){if(Date.now()>${TANGEM_BLACK_FRIDAY_CUTOFF_MS}){document.documentElement.setAttribute(${attr},"");var el=document.getElementById(${id})||(document.currentScript&&document.currentScript.parentElement);if(el){el.hidden=true;el.style.setProperty("display","none","important");}}})();`;
}
