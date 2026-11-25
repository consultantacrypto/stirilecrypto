import type { SupabaseClient } from '@supabase/supabase-js';

export type SubscriberStatus = {
  id: string;
  unsubscribedAt: string | null;
};

export type FindSubscriberResult =
  | { ok: true; row: SubscriberStatus | null }
  | { ok: false };

export type MarkUnsubscribedResult = { ok: true; changed: boolean } | { ok: false };

/**
 * Reads and updates unsubscribe state. Selects id and unsubscribed_at only,
 * so this path never loads the email address.
 */
export function createUnsubscribeStore(client: SupabaseClient) {
  return {
    async findSubscriber(id: string): Promise<FindSubscriberResult> {
      const { data, error } = await client
        .from('abonati')
        .select('id, unsubscribed_at')
        .eq('id', id)
        .maybeSingle();

      if (error) return { ok: false };
      if (!data) return { ok: true, row: null };

      const row = data as { id?: unknown; unsubscribed_at?: unknown };
      if (typeof row.id !== 'string') return { ok: false };
      return {
        ok: true,
        row: {
          id: row.id,
          unsubscribedAt: typeof row.unsubscribed_at === 'string' ? row.unsubscribed_at : null,
        },
      };
    },

    async markUnsubscribed(id: string, atIso: string): Promise<MarkUnsubscribedResult> {
      const { data, error } = await client
        .from('abonati')
        .update({ unsubscribed_at: atIso })
        .eq('id', id)
        .is('unsubscribed_at', null)
        .select('id');

      if (error) return { ok: false };
      return { ok: true, changed: Array.isArray(data) && data.length > 0 };
    },
  };
}

export type DirectorySubscriber = {
  id: string;
  email: string;
  /** Null when the person is still subscribed, or when the column is not available. */
  unsubscribedAt: string | null;
};

export type SubscriberList = {
  rows: DirectorySubscriber[];
  /** False when `unsubscribed_at` is not on the table yet. Those rows are not treated as unsubscribed. */
  unsubscribedColumn: boolean;
};

export type SubscriberDirectory = {
  findIdByEmail(email: string): Promise<{ id: string } | null>;
  list(): Promise<SubscriberList>;
};

function isMissingUnsubscribedColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === '42703' || error.code === 'PGRST204') return true;
  return /unsubscribed_at/i.test(error.message ?? '');
}

function readDirectoryRows(data: unknown, withStatus: boolean): DirectorySubscriber[] {
  const rows = Array.isArray(data) ? data : [];
  return rows.flatMap((row) => {
    const record = row as { id?: unknown; email?: unknown; unsubscribed_at?: unknown };
    if (typeof record.id !== 'string' || typeof record.email !== 'string') return [];
    const unsubscribedAt =
      withStatus && typeof record.unsubscribed_at === 'string' ? record.unsubscribed_at : null;
    return [{ id: record.id, email: record.email, unsubscribedAt }];
  });
}

/**
 * Read-only directory for the link script. There is no insert, update, or delete.
 */
export function createSubscriberDirectory(client: SupabaseClient): SubscriberDirectory {
  return {
    async findIdByEmail(email: string) {
      const { data, error } = await client
        .from('abonati')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (error) {
        throw new Error('Could not read the subscriber. If this is a database error, no row was changed.');
      }
      const id = (data as { id?: unknown } | null)?.id;
      if (typeof id !== 'string') return null;
      return { id };
    },

    async list() {
      const listed = await client
        .from('abonati')
        .select('id, email, unsubscribed_at')
        .order('created_at', { ascending: true });

      if (listed.error && isMissingUnsubscribedColumn(listed.error)) {
        const fallback = await client
          .from('abonati')
          .select('id, email')
          .order('created_at', { ascending: true });
        if (fallback.error) {
          throw new Error('Could not list subscribers. If this is a database error, no row was changed.');
        }
        return { rows: readDirectoryRows(fallback.data, false), unsubscribedColumn: false };
      }

      if (listed.error) {
        throw new Error('Could not list subscribers. If this is a database error, no row was changed.');
      }
      return { rows: readDirectoryRows(listed.data, true), unsubscribedColumn: true };
    },
  };
}
