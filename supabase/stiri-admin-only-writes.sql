-- PREPARED ONLY — do not apply to any remote database without explicit GO from Dani
-- in his own words. Project: stirilecrypto-db (ref ndnlhmzrflmtqchdrlbh).
-- NOTE: Vercel Preview and Production share this same database.
-- Prepared 2026-11-21 (Europe/Bucharest). Supersedes the unapplied draft
-- /workspace/review-sc-rls-1119/write-fix/20261119104600_*.sql.
--
-- Live state read on 2026-11-21 (read-only):
--   * public.stiri write policy "Doar adminii pot scrie in stiri"
--       FOR ALL TO public USING (auth.role() = 'authenticated')  -> ANY logged-in user writes.
--   * storage.objects imagini_stiri_auth_insert/update/delete TO authenticated
--       (bucket imagini-stiri)                                    -> ANY logged-in user uploads/deletes.
--   * anon + authenticated hold INSERT/UPDATE/DELETE/TRUNCATE grants on all public tables.
--   * auth.users = 1 (email provider), no app_metadata.role, no private schema.
--
-- Change:
--   1) private.admins allowlist + private.is_admin() (SECURITY DEFINER) and a
--      public.is_admin() RPC wrapper (returns only the caller's own boolean).
--   2) stiri write policy -> private.is_admin() (USING + WITH CHECK).
--   3) imagini-stiri storage write policies -> private.is_admin().
--   4) Revoke anon INSERT/UPDATE/DELETE/TRUNCATE and authenticated TRUNCATE on
--      stiri + editorial tables. NOT touched: abonati (anon insert used by
--      /api/subscribe), premium_orders, product_inquiries (payments).
--   5) Seed the single existing Auth user as admin; abort if count != 1.
-- Unchanged: anon SELECT published-only policy; public read policies; service_role
-- (bypasses RLS: OpenClaw, /api/editor/*, ETF cron, signed uploads).

BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS private.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE private.admins IS 'Auth user ids allowed to write editorial content (stiri, imagini-stiri).';
ALTER TABLE private.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.admins FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.admins FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM private.admins a WHERE a.user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO anon, authenticated, service_role;

-- RPC used by server code (supabase.rpc('is_admin')) with the user's JWT.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.is_admin();
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- 2) stiri writes: admin only
DROP POLICY IF EXISTS "Doar adminii pot scrie in stiri" ON public.stiri;
CREATE POLICY "Doar adminii pot scrie in stiri"
  ON public.stiri AS PERMISSIVE FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- 3) imagini-stiri storage writes: admin only (public read policy unchanged)
DROP POLICY IF EXISTS imagini_stiri_auth_insert ON storage.objects;
DROP POLICY IF EXISTS imagini_stiri_auth_update ON storage.objects;
DROP POLICY IF EXISTS imagini_stiri_auth_delete ON storage.objects;
CREATE POLICY imagini_stiri_auth_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'imagini-stiri' AND private.is_admin());
CREATE POLICY imagini_stiri_auth_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'imagini-stiri' AND private.is_admin())
  WITH CHECK (bucket_id = 'imagini-stiri' AND private.is_admin());
CREATE POLICY imagini_stiri_auth_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'imagini-stiri' AND private.is_admin());

-- 4) Grants (defense in depth; TRUNCATE ignores RLS)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE
  public.stiri, public.airdrop_alerts, public.etf_snapshots, public.interviews,
  public.mica_compliance_items, public.pulse_terminal_snapshots
FROM anon;
REVOKE TRUNCATE ON TABLE
  public.stiri, public.airdrop_alerts, public.etf_snapshots, public.interviews,
  public.mica_compliance_items, public.pulse_terminal_snapshots
FROM authenticated;

-- 5) Seed: only when exactly one Auth user exists (true on 2026-11-21).
DO $$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM auth.users;
  IF n = 1 THEN
    INSERT INTO private.admins (user_id) SELECT id FROM auth.users ON CONFLICT DO NOTHING;
  ELSE
    RAISE EXCEPTION 'private.admins seed refused: auth.users has % rows. Insert the intended admin user_id explicitly.', n;
  END IF;
END
$$;

COMMIT;
