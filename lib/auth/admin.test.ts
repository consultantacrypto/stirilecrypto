import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isAdminSession } from './admin';

function fake(opts: { user?: object | null; userError?: object | null; rpc?: unknown; rpcError?: object | null; throws?: boolean }) {
  return {
    auth: {
      getUser: async () => {
        if (opts.throws) throw new Error('network');
        return { data: { user: opts.user ?? null }, error: opts.userError ?? null };
      },
    },
    rpc: async () => ({ data: opts.rpc ?? null, error: opts.rpcError ?? null }),
  } as unknown as SupabaseClient;
}

describe('isAdminSession', () => {
  it('admin user with rpc true -> true', async () => {
    assert.equal(await isAdminSession(fake({ user: { id: 'a' }, rpc: true })), true);
  });
  it('signed-in non-admin -> false', async () => {
    assert.equal(await isAdminSession(fake({ user: { id: 'b' }, rpc: false })), false);
  });
  it('no session -> false', async () => {
    assert.equal(await isAdminSession(fake({ user: null, rpc: true })), false);
  });
  it('rpc missing (migration not applied) -> false', async () => {
    assert.equal(await isAdminSession(fake({ user: { id: 'a' }, rpcError: { message: 'not found' } })), false);
  });
  it('truthy non-boolean -> false', async () => {
    assert.equal(await isAdminSession(fake({ user: { id: 'a' }, rpc: 'true' })), false);
  });
  it('throws -> false', async () => {
    assert.equal(await isAdminSession(fake({ throws: true })), false);
  });
});
