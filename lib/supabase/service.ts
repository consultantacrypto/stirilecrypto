import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client — server-only (API routes, agents). Bypasses RLS.
 * Never import in Client Components or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url?.trim() || !serviceKey?.trim()) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for server-side writes.'
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
