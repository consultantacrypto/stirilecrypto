/**
 * Pure admin authorization helpers (no Next/Supabase imports).
 * Used by requireAdminUser and by fixture QA.
 * Never trusts user_metadata / raw_user_meta_data.
 */

export type AdminAuthGateResult =
  | { ok: true; email: string }
  | { ok: false; error: string; reason: AdminAuthDenyReason };

export type AdminAuthDenyReason =
  | 'no_session'
  | 'allowlist_unconfigured'
  | 'email_missing'
  | 'email_unconfirmed'
  | 'not_on_allowlist';

export type AdminAuthCandidate = {
  id?: string | null;
  email?: string | null;
  email_confirmed_at?: string | null;
};

/** Comma-separated emails → normalized list, or null if missing/empty (fail-closed). */
export function parseAdminEmailAllowlist(
  raw: string | undefined | null,
): string[] | null {
  if (raw == null) return null;
  const entries = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return entries.length > 0 ? entries : null;
}

/**
 * Authorize an already-loaded user against ADMIN_EMAIL_ALLOWLIST.
 * Caller is responsible for not creating a service client when ok=false.
 */
export function authorizeAdminCandidate(
  user: AdminAuthCandidate | null | undefined,
  allowlistRaw: string | undefined | null,
  log: (message: string) => void = console.error,
): AdminAuthGateResult {
  const allowlist = parseAdminEmailAllowlist(allowlistRaw);
  if (!allowlist) {
    log('Admin allowlist is not configured');
    return {
      ok: false,
      error: 'Administrarea nu este disponibilă.',
      reason: 'allowlist_unconfigured',
    };
  }

  if (!user) {
    return { ok: false, error: 'Neautorizat.', reason: 'no_session' };
  }

  const email = user.email?.trim().toLowerCase() ?? '';
  if (!email) {
    return { ok: false, error: 'Neautorizat.', reason: 'email_missing' };
  }

  if (!user.email_confirmed_at) {
    return { ok: false, error: 'Neautorizat.', reason: 'email_unconfirmed' };
  }

  if (!allowlist.includes(email)) {
    return { ok: false, error: 'Neautorizat.', reason: 'not_on_allowlist' };
  }

  return { ok: true, email };
}

/**
 * Models privileged action ordering for QA:
 * auth → (optional validate) → createServiceClient only if authorized.
 */
export function privilegedActionGate(options: {
  user: AdminAuthCandidate | null | undefined;
  allowlistRaw: string | undefined | null;
  validate?: () => boolean;
}): {
  authorized: boolean;
  serviceClientCreated: boolean;
  reason?: AdminAuthDenyReason;
} {
  const logs: string[] = [];
  const gate = authorizeAdminCandidate(options.user, options.allowlistRaw, (m) =>
    logs.push(m),
  );
  if (!gate.ok) {
    return {
      authorized: false,
      serviceClientCreated: false,
      reason: gate.reason,
    };
  }
  if (options.validate && !options.validate()) {
    return { authorized: false, serviceClientCreated: false };
  }
  return { authorized: true, serviceClientCreated: true };
}
