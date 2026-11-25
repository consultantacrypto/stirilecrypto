import { normalizeEmail } from './email';

export type SignupStatus = 'created' | 'resubscribed' | 'duplicate' | 'invalid' | 'error';

export type SignupDb = {
  insert(email: string): Promise<{ errorCode: string | null }>;
  findByEmail(email: string): Promise<{ ok: true; unsubscribedAt: string | null } | { ok: false }>;
  clearUnsubscribed(email: string): Promise<{ ok: boolean }>;
};

/**
 * Insert a subscriber. A unique email that already unsubscribed is reactivated
 * by clearing `unsubscribed_at`. A lookup failure (column not migrated yet,
 * missing service key) keeps today's behaviour: the address is already on the list.
 * `clearUnsubscribed` runs only for a row that is currently unsubscribed.
 */
export async function registerSubscriber(email: string, db: SignupDb): Promise<SignupStatus> {
  const normalized = normalizeEmail(email);
  if (!normalized) return 'invalid';

  const inserted = await db.insert(normalized);
  if (!inserted.errorCode) return 'created';
  if (inserted.errorCode !== '23505') return 'error';

  const existing = await db.findByEmail(normalized);
  if (!existing.ok || !existing.unsubscribedAt) return 'duplicate';

  const cleared = await db.clearUnsubscribed(normalized);
  return cleared.ok ? 'resubscribed' : 'error';
}
