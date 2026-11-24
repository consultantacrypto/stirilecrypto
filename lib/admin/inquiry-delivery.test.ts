import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  DELIVERY_COPY,
  INQUIRY_LIST_COLUMNS,
  INQUIRY_LIST_COLUMNS_WITH_DELIVERY,
  applyInquiryDelivery,
  buildDeliveryPatch,
  deliveryColumnText,
  filterInquiriesByDelivery,
  formatDeliveryMoment,
  handleInquiryDeliveryRequest,
  isMissingDeliveryColumn,
  loadAdminInquiries,
  parseDeliveryFilter,
  type DeliveryPatch,
  type DeliveryWriteResult,
} from './inquiry-delivery';

const ORDER_ID = '11111111-1111-4111-8111-111111111111';
const NOW = new Date('2026-01-15T22:00:00.000Z');

function deliveredWrite(
  capture?: { id?: string; patch?: DeliveryPatch; calls: number },
): (id: string, patch: DeliveryPatch) => Promise<DeliveryWriteResult> {
  return async (id, patch) => {
    if (capture) {
      capture.calls += 1;
      capture.id = id;
      capture.patch = patch;
    }
    return {
      data: { id, delivery_status: patch.delivery_status, delivered_at: patch.delivered_at },
      error: null,
    };
  };
}

describe('delivery column tolerance', () => {
  it('recognises a missing delivery column and ignores other missing columns', () => {
    assert.equal(
      isMissingDeliveryColumn({
        code: 'PGRST204',
        message: "Could not find the 'delivery_status' column of 'product_inquiries' in the schema cache",
      }),
      true,
    );
    assert.equal(
      isMissingDeliveryColumn({
        code: '42703',
        message: 'column "delivered_at" of relation "product_inquiries" does not exist',
      }),
      true,
    );
    assert.equal(
      isMissingDeliveryColumn({
        code: '42703',
        message: 'column product_inquiries.delivery_status does not exist',
      }),
      true,
    );
    assert.equal(
      isMissingDeliveryColumn({
        code: 'PGRST204',
        message: "Could not find the 'email' column of 'product_inquiries' in the schema cache",
      }),
      false,
    );
    assert.equal(isMissingDeliveryColumn(null), false);
  });

  it('falls back to the base select and marks delivery unknown', async () => {
    const calls: string[] = [];
    const result = await loadAdminInquiries(async (columns) => {
      calls.push(columns);
      if (columns.includes('delivery_status')) {
        return {
          data: null,
          error: {
            code: 'PGRST204',
            message: "Could not find the 'delivery_status' column of 'product_inquiries' in the schema cache",
          },
        };
      }
      return {
        data: [
          {
            id: ORDER_ID,
            product: 'ta_mtf',
            email: 'ana@example.com',
            asset: 'BTC',
            amount_ron: 79,
            status: 'paid',
            stripe_session_id: null,
            created_at: '2026-01-15T10:00:00.000Z',
            payload: { tier: 'major' },
            delivery_status: 'delivered',
          },
        ],
        error: null,
      };
    });

    assert.deepEqual(calls, [INQUIRY_LIST_COLUMNS_WITH_DELIVERY, INQUIRY_LIST_COLUMNS]);
    assert.equal(result.error, null);
    assert.equal(result.deliveryKnown, false);
    assert.equal(result.rows.length, 1);
    assert.equal(result.rows[0]?.delivery_status, null);
    assert.equal(result.rows[0]?.status, 'paid');
    assert.deepEqual(deliveryColumnText({ known: false, status: null, deliveredAt: null }), {
      label: '—',
      at: null,
    });
  });

  it('does not retry when the select fails for another reason', async () => {
    let calls = 0;
    const result = await loadAdminInquiries(async () => {
      calls += 1;
      return { data: null, error: { code: '42P01', message: 'relation "product_inquiries" does not exist' } };
    });
    assert.equal(calls, 1);
    assert.equal(result.deliveryKnown, false);
    assert.equal(result.rows.length, 0);
    assert.match(result.error?.message ?? '', /does not exist/);
  });

  it('keeps delivery fields when the columns exist', async () => {
    const result = await loadAdminInquiries(async () => ({
      data: [
        {
          id: ORDER_ID,
          product: 'ta_mtf',
          email: 'ana@example.com',
          asset: null,
          amount_ron: '139',
          status: 'paid',
          stripe_session_id: 'cs_test',
          created_at: '2026-01-15T10:00:00.000Z',
          payload: { source: 'homepage', tier: 'altcoin' },
          delivery_status: 'delivered',
          delivered_at: '2026-01-15T22:00:00.000Z',
        },
      ],
      error: null,
    }));
    assert.equal(result.deliveryKnown, true);
    assert.equal(result.rows[0]?.delivery_status, 'delivered');
    assert.equal(result.rows[0]?.delivered_at, '2026-01-15T22:00:00.000Z');
    assert.equal(result.rows[0]?.amount_ron, 139);
    const cell = deliveryColumnText({
      known: true,
      status: result.rows[0]?.delivery_status,
      deliveredAt: result.rows[0]?.delivered_at,
    });
    assert.equal(cell.label, 'Livrat');
    assert.match(cell.at ?? '', /16\.01\.2026/);
    assert.match(cell.at ?? '', /00:00/);
  });
});

describe('delivery labels and filter', () => {
  it('formats a pending row and a Bucharest timestamp', () => {
    assert.deepEqual(
      deliveryColumnText({ known: true, status: 'pending', deliveredAt: null }),
      { label: 'În așteptare', at: null },
    );
    const formatted = formatDeliveryMoment('2026-01-15T22:00:00.000Z');
    assert.match(formatted ?? '', /16\.01\.2026/);
    assert.match(formatted ?? '', /00:00/);
    assert.equal(formatDeliveryMoment('not-a-date'), null);
  });

  it('filters pending and delivered rows', () => {
    const rows = [
      { id: 'a', delivery_status: 'pending' },
      { id: 'b', delivery_status: 'delivered' },
      { id: 'c', delivery_status: null },
    ];
    assert.equal(parseDeliveryFilter('asteptare'), 'pending');
    assert.equal(parseDeliveryFilter(['livrate']), 'delivered');
    assert.equal(parseDeliveryFilter('altceva'), 'all');
    assert.deepEqual(
      filterInquiriesByDelivery(rows, 'pending').map((row) => row.id),
      ['a'],
    );
    assert.deepEqual(
      filterInquiriesByDelivery(rows, 'delivered').map((row) => row.id),
      ['b'],
    );
    assert.equal(filterInquiriesByDelivery(rows, 'all').length, 3);
  });
});

describe('admin delivery action', () => {
  it('returns 403 for a non-admin and does not read or write', async () => {
    let reads = 0;
    let writes = 0;
    const result = await handleInquiryDeliveryRequest({
      isAdmin: async () => false,
      readBody: async () => {
        reads += 1;
        return { id: ORDER_ID, delivery_status: 'delivered' };
      },
      write: async () => {
        writes += 1;
        return { data: null, error: null };
      },
    });
    assert.equal(result.status, 403);
    assert.equal(result.body.success, false);
    assert.equal(result.body.error, 'Neautorizat.');
    assert.equal(reads, 0);
    assert.equal(writes, 0);
  });

  it('fails closed with 403 when the admin check throws', async () => {
    let writes = 0;
    const result = await handleInquiryDeliveryRequest({
      isAdmin: async () => {
        throw new Error('is_admin rpc missing');
      },
      readBody: async () => ({ id: ORDER_ID, delivery_status: 'delivered' }),
      write: async () => {
        writes += 1;
        return { data: null, error: null };
      },
    });
    assert.equal(result.status, 403);
    assert.equal(writes, 0);
  });

  it('rejects a direct call that skips the handler when isAdmin is false', async () => {
    let writes = 0;
    const result = await applyInquiryDelivery({
      isAdmin: false,
      body: { id: ORDER_ID, delivery_status: 'delivered' },
      write: async () => {
        writes += 1;
        return { data: null, error: null };
      },
    });
    assert.equal(result.status, 403);
    assert.equal(writes, 0);
  });

  it('sets delivered and delivered_at to now for an admin', async () => {
    const capture = { calls: 0 } as { calls: number; id?: string; patch?: DeliveryPatch };
    const result = await handleInquiryDeliveryRequest({
      isAdmin: async () => true,
      readBody: async () => ({ id: ORDER_ID, delivery_status: 'delivered' }),
      now: NOW,
      write: deliveredWrite(capture),
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.delivery_status, 'delivered');
    assert.equal(result.body.delivered_at, NOW.toISOString());
    assert.equal(capture.calls, 1);
    assert.equal(capture.id, ORDER_ID);
    assert.deepEqual(capture.patch, {
      delivery_status: 'delivered',
      delivered_at: '2026-01-15T22:00:00.000Z',
    });
    assert.deepEqual(Object.keys(capture.patch ?? {}).sort(), ['delivered_at', 'delivery_status']);
  });

  it('clears delivered_at when an admin undoes to pending', async () => {
    const capture = { calls: 0 } as { calls: number; patch?: DeliveryPatch };
    const result = await handleInquiryDeliveryRequest({
      isAdmin: async () => true,
      readBody: async () => ({ id: `  ${ORDER_ID}  `, delivery_status: 'pending' }),
      now: NOW,
      write: deliveredWrite(capture),
    });
    assert.equal(result.status, 200);
    assert.deepEqual(capture.patch, { delivery_status: 'pending', delivered_at: null });
    assert.equal(buildDeliveryPatch('pending', NOW).delivered_at, null);
  });

  it('returns 400 for a bad id or status and does not write', async () => {
    let writes = 0;
    const write = async () => {
      writes += 1;
      return { data: null, error: null };
    };
    const badId = await handleInquiryDeliveryRequest({
      isAdmin: async () => true,
      readBody: async () => ({ id: 'not-a-uuid', delivery_status: 'delivered' }),
      write,
    });
    const badStatus = await applyInquiryDelivery({
      isAdmin: true,
      body: { id: ORDER_ID, delivery_status: 'paid' },
      write,
    });
    const badJson = await handleInquiryDeliveryRequest({
      isAdmin: async () => true,
      readBody: async () => {
        throw new SyntaxError('bad json');
      },
      write,
    });
    assert.equal(badId.status, 400);
    assert.equal(badStatus.status, 400);
    assert.equal(badJson.status, 400);
    assert.equal(writes, 0);
  });

  it('returns 409 when the delivery columns are absent', async () => {
    const result = await applyInquiryDelivery({
      isAdmin: true,
      body: { id: ORDER_ID, delivery_status: 'delivered' },
      now: NOW,
      write: async () => ({
        data: null,
        error: {
          code: 'PGRST204',
          message: "Could not find the 'delivered_at' column of 'product_inquiries' in the schema cache",
        },
      }),
    });
    assert.equal(result.status, 409);
    assert.match(result.body.error ?? '', /product-inquiries-delivery\.sql/);
  });

  it('returns 404 when the inquiry does not exist', async () => {
    const result = await applyInquiryDelivery({
      isAdmin: true,
      body: { id: ORDER_ID, delivery_status: 'delivered' },
      write: async () => ({ data: null, error: null }),
    });
    assert.equal(result.status, 404);
    assert.equal(result.body.error, 'Comanda nu există.');
  });

  it('hides writer exceptions and does not echo secrets', async () => {
    const result = await applyInquiryDelivery({
      isAdmin: true,
      body: { id: ORDER_ID, delivery_status: 'delivered' },
      write: async () => {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY=secret-value');
      },
    });
    assert.equal(result.status, 500);
    assert.equal(result.body.error, DELIVERY_COPY.saveFailed);
    assert.equal(JSON.stringify(result.body).includes('secret-value'), false);
    assert.equal(JSON.stringify(result.body).includes('SERVICE_ROLE'), false);
  });
});

describe('delivery files stay admin-guarded and unapplied', () => {
  it('the migration is marked NOT APPLIED and does not touch RLS or premium_orders', () => {
    const sql = readFileSync(new URL('../../supabase/product-inquiries-delivery.sql', import.meta.url), 'utf8');
    assert.match(sql, /NOT APPLIED/);
    assert.match(
      sql,
      /add column if not exists delivery_status text not null default 'pending'/,
    );
    assert.match(sql, /check \(delivery_status in \('pending', 'delivered'\)\)/);
    assert.match(sql, /add column if not exists delivered_at timestamptz/);
    const executable = sql
      .split('\n')
      .filter((line) => line.trim() && !line.trim().startsWith('--'))
      .join('\n');
    assert.match(executable, /alter table public\.product_inquiries/);
    assert.doesNotMatch(executable, /premium_orders/i);
    assert.doesNotMatch(executable, /\b(grant|revoke|policy|drop)\b/i);
  });

  it('the route checks isAdminSession and the button asks for confirmation', () => {
    const route = readFileSync(
      new URL('../../app/api/admin/comenzi/livrare/route.ts', import.meta.url),
      'utf8',
    );
    const button = readFileSync(
      new URL('../../components/admin/OrderDeliveryButton.tsx', import.meta.url),
      'utf8',
    );
    assert.match(route, /isAdminSession/);
    assert.match(route, /handleInquiryDeliveryRequest/);
    assert.match(route, /product_inquiries/);
    assert.doesNotMatch(route, /premium_orders/);
    assert.match(button, /window\.confirm/);
    assert.match(button, /DELIVERY_COPY\.confirmDelivered/);
    assert.match(button, /DELIVERY_COPY\.confirmUndo/);
    assert.match(button, /delivery_status: nextStatus/);
    assert.match(button, /delivered \? 'pending' : 'delivered'/);
  });
});
