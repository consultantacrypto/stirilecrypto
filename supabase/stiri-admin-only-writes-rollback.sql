-- PREPARED ONLY — rollback for 20261121150000_stiri_admin_only_writes.sql
-- Restores verbatim the policies/grants read live on 2026-11-21 (stirilecrypto-db).
BEGIN;

DROP POLICY IF EXISTS "Doar adminii pot scrie in stiri" ON public.stiri;
CREATE POLICY "Doar adminii pot scrie in stiri"
  ON public.stiri AS PERMISSIVE FOR ALL TO public
  USING (auth.role() = 'authenticated'::text);

DROP POLICY IF EXISTS imagini_stiri_auth_insert ON storage.objects;
DROP POLICY IF EXISTS imagini_stiri_auth_update ON storage.objects;
DROP POLICY IF EXISTS imagini_stiri_auth_delete ON storage.objects;
CREATE POLICY imagini_stiri_auth_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'imagini-stiri'::text);
CREATE POLICY imagini_stiri_auth_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'imagini-stiri'::text) WITH CHECK (bucket_id = 'imagini-stiri'::text);
CREATE POLICY imagini_stiri_auth_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'imagini-stiri'::text);

GRANT INSERT, UPDATE, DELETE, TRUNCATE ON TABLE
  public.stiri, public.airdrop_alerts, public.etf_snapshots, public.interviews,
  public.mica_compliance_items, public.pulse_terminal_snapshots
TO anon;
GRANT TRUNCATE ON TABLE
  public.stiri, public.airdrop_alerts, public.etf_snapshots, public.interviews,
  public.mica_compliance_items, public.pulse_terminal_snapshots
TO authenticated;

DROP FUNCTION IF EXISTS public.is_admin();
DROP SCHEMA IF EXISTS private CASCADE;

COMMIT;
