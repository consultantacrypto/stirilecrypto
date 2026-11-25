import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { registerSubscriber, type SignupDb } from './signup';

function db(partial: Partial<SignupDb> = {}): SignupDb & { clearCalls: string[] } {
  const clearCalls: string[] = [];
  return {
    clearCalls,
    async insert() {
      return { errorCode: null };
    },
    async findByEmail() {
      return { ok: false };
    },
    async clearUnsubscribed(email) {
      clearCalls.push(email);
      return { ok: true };
    },
    ...partial,
  };
}

describe('registerSubscriber', () => {
  it('inserts a new address and does not clear unsubscribe state', async () => {
    const client = db();
    assert.equal(await registerSubscriber(' Reader@Example.com ', client), 'created');
    assert.deepEqual(client.clearCalls, []);
  });

  it('leaves an active subscriber unchanged when the address already exists', async () => {
    let lookups = 0;
    const client = db({
      async insert() {
        return { errorCode: '23505' };
      },
      async findByEmail() {
        lookups += 1;
        return { ok: true, unsubscribedAt: null };
      },
    });
    assert.equal(await registerSubscriber('reader@example.com', client), 'duplicate');
    assert.equal(lookups, 1);
    assert.deepEqual(client.clearCalls, []);
  });

  it('reactivates an unsubscribed address and does nothing when the column cannot be read', async () => {
    const client = db({
      async insert() {
        return { errorCode: '23505' };
      },
      async findByEmail() {
        return { ok: true, unsubscribedAt: '2026-11-01T00:00:00.000Z' };
      },
    });
    assert.equal(await registerSubscriber('reader@example.com', client), 'resubscribed');
    assert.deepEqual(client.clearCalls, ['reader@example.com']);

    const unmigrated = db({
      async insert() {
        return { errorCode: '23505' };
      },
      async findByEmail() {
        return { ok: false };
      },
    });
    assert.equal(await registerSubscriber('reader@example.com', unmigrated), 'duplicate');
    assert.deepEqual(unmigrated.clearCalls, []);
  });

  it('does not treat a failed insert as success', async () => {
    const client = db({
      async insert() {
        return { errorCode: '42P01' };
      },
    });
    assert.equal(await registerSubscriber('reader@example.com', client), 'error');
    assert.deepEqual(client.clearCalls, []);
    assert.equal(await registerSubscriber('not-an-email', client), 'invalid');
  });
});
