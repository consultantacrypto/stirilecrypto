'use client';

import { useSyncExternalStore } from 'react';
import {
  TANGEM_BLACK_FRIDAY_CODE,
  TANGEM_BLACK_FRIDAY_COPY,
  TANGEM_BLACK_FRIDAY_CUTOFF_MS,
  TANGEM_BLACK_FRIDAY_HREF,
  TANGEM_BLACK_FRIDAY_OFF_ATTR,
  TANGEM_BLACK_FRIDAY_REL,
  TANGEM_BLACK_FRIDAY_SLOT_ID,
  isTangemBlackFridayVisible,
} from '@/lib/wallets/tangem-black-friday';

function hideSlot() {
  document.documentElement.setAttribute(TANGEM_BLACK_FRIDAY_OFF_ATTR, '');
  const root = document.getElementById(TANGEM_BLACK_FRIDAY_SLOT_ID);
  if (!root) return;
  root.hidden = true;
  root.style.setProperty('display', 'none', 'important');
}

function subscribe(onChange: () => void) {
  const remaining = TANGEM_BLACK_FRIDAY_CUTOFF_MS - Date.now() + 1;
  if (remaining <= 0) return () => {};
  const id = window.setTimeout(onChange, remaining);
  return () => window.clearTimeout(id);
}

function getSnapshot() {
  return isTangemBlackFridayVisible(Date.now());
}

/** Matches the server render. The server only mounts this while the offer is up. */
function getServerSnapshot() {
  return true;
}

export default function TangemBlackFridayBannerClient() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!visible) {
    if (typeof document !== 'undefined') hideSlot();
    return null;
  }

  return (
    <a
      href={TANGEM_BLACK_FRIDAY_HREF}
      target="_blank"
      rel={TANGEM_BLACK_FRIDAY_REL}
      data-placement="portofele-tangem-bf"
      className="flex min-h-11 w-full flex-col items-start gap-2 rounded-2xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-left text-slate-100 transition-colors hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-row sm:items-center sm:gap-4 sm:px-5"
    >
      <span
        aria-hidden="true"
        data-tangem-bf-code=""
        className="inline-flex w-fit shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white"
      >
        {TANGEM_BLACK_FRIDAY_CODE}
      </span>
      <span className="min-w-0 text-sm leading-snug sm:text-[15px]">
        {TANGEM_BLACK_FRIDAY_COPY}
        <span className="sr-only"> Se deschide într-un tab nou.</span>
      </span>
      <span aria-hidden="true" className="hidden shrink-0 text-slate-400 sm:ml-auto sm:inline">
        ↗
      </span>
    </a>
  );
}
