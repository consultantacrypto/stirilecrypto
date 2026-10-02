import 'server-only';

import { createClient } from '@/lib/supabase/server';
import {
  authorizeAdminCandidate,
  parseAdminEmailAllowlist,
} from '@/lib/admin/authorize-admin';
import type { User } from '@supabase/supabase-js';

export type AdminAuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

/**
 * Fail-closed server-side admin gate for Crypto Azi privileged ops.
 *
 * Requires ADMIN_EMAIL_ALLOWLIST (comma-separated). Missing/empty → deny all
 * and logs "Admin allowlist is not configured".
 * User must be authenticated, email confirmed, and on the allowlist.
 * Never trusts user_metadata / raw_user_meta_data for authorization.
 */
export async function requireAdminUser(): Promise<AdminAuthResult> {
  if (!parseAdminEmailAllowlist(process.env.ADMIN_EMAIL_ALLOWLIST)) {
    console.error('Admin allowlist is not configured');
    return { ok: false, error: 'Administrarea nu este disponibilă.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, error: 'Neautorizat.' };
  }

  const gate = authorizeAdminCandidate(
    {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
    },
    process.env.ADMIN_EMAIL_ALLOWLIST,
  );

  if (!gate.ok) {
    return { ok: false, error: gate.error };
  }

  return { ok: true, user };
}
