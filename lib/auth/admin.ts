import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * True only when the signed-in user is listed in private.admins.
 * Uses the user's own JWT via the `public.is_admin()` RPC (migration
 * 20261121150000_stiri_admin_only_writes). Fails closed: any error,
 * missing session or missing RPC returns false.
 */
export async function isAdminSession(supabase: SupabaseClient): Promise<boolean> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return false;

    const { data, error } = await supabase.rpc('is_admin');
    if (error) {
      console.error('[isAdminSession] is_admin rpc failed:', error.message);
      return false;
    }
    return data === true;
  } catch {
    return false;
  }
}
