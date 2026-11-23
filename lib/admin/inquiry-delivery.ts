/**
 * Manual delivery flag for public.product_inquiries.
 * Payment status is a different column and is never written here.
 * The SQL in supabase/product-inquiries-delivery.sql is NOT APPLIED; callers
 * must tolerate a missing delivery_status / delivered_at column.
 */

export const DELIVERY_COPY = {
  column: 'Livrat',
  delivered: 'Livrat',
  pending: 'În așteptare',
  unknown: '—',
  mark: 'Marchează livrat',
  undo: 'Anulează livrarea',
  confirmDelivered:
    'Marchezi comanda ca livrată? Confirmă doar după ce analiza a plecat pe email.',
  confirmUndo: 'Revii comanda în așteptare? Data livrării se șterge.',
  saving: 'Se salvează…',
  saveFailed: 'Livrarea nu a putut fi salvată.',
  unauthorized: 'Neautorizat.',
  invalidRequest: 'Cerere invalidă.',
  invalidOrder: 'Comandă invalidă.',
  invalidStatus: 'Status de livrare invalid.',
  missingOrder: 'Comanda nu există.',
  missingColumns:
    'Coloanele de livrare nu sunt încă în baza de date. Aplică supabase/product-inquiries-delivery.sql.',
} as const;

export const INQUIRY_LIST_COLUMNS =
  'id, product, email, asset, amount_ron, status, stripe_session_id, created_at, payload';

export const INQUIRY_LIST_COLUMNS_WITH_DELIVERY =
  `${INQUIRY_LIST_COLUMNS}, delivery_status, delivered_at`;

const DELIVERY_COLUMN_NAMES = new Set(['delivery_status', 'delivered_at']);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type DeliveryTarget = 'pending' | 'delivered';

export type DeliveryPatch = {
  delivery_status: DeliveryTarget;
  delivered_at: string | null;
};

export type DbErrorLike = {
  message?: string;
  code?: string;
};

export type AdminInquiryRow = {
  id: string;
  product: string;
  email: string;
  asset: string | null;
  amount_ron: number | null;
  status: string;
  stripe_session_id: string | null;
  created_at: string;
  payload: { source?: unknown; tier?: unknown } | null;
  delivery_status: string | null;
  delivered_at: string | null;
};

export type DeliveryFilter = 'all' | 'pending' | 'delivered';

export type DeliveryWriteResult = {
  data: { id: string; delivery_status: string; delivered_at: string | null } | null;
  error: DbErrorLike | null;
};

export type DeliveryHttpResult = {
  status: number;
  body: {
    success: boolean;
    error?: string;
    id?: string;
    delivery_status?: string;
    delivered_at?: string | null;
  };
};

type SelectResult = {
  data: Array<Record<string, unknown>> | null;
  error: DbErrorLike | null;
};

/** PostgREST / Postgres name of a missing column, when the message says so. */
export function missingColumnName(error: DbErrorLike | null | undefined): string | null {
  const message = error?.message ?? '';
  const postgrest = /could not find the '([a-z0-9_]+)' column/i.exec(message);
  if (postgrest?.[1]) return postgrest[1];

  const quoted = /column "([a-z0-9_]+)"(?: of relation "[a-z0-9_]+")? does not exist/i.exec(message);
  if (quoted?.[1]) return quoted[1];

  const qualified = /column [a-z0-9_]+\.([a-z0-9_]+) does not exist/i.exec(message);
  if (qualified?.[1]) return qualified[1];

  return null;
}

export function isMissingDeliveryColumn(error: DbErrorLike | null | undefined): boolean {
  const name = missingColumnName(error);
  return name != null && DELIVERY_COLUMN_NAMES.has(name);
}

export function buildDeliveryPatch(target: DeliveryTarget, now: Date): DeliveryPatch {
  if (target === 'delivered') {
    return { delivery_status: 'delivered', delivered_at: now.toISOString() };
  }
  return { delivery_status: 'pending', delivered_at: null };
}

export function parseDeliveryRequest(
  body: unknown,
): { ok: true; id: string; target: DeliveryTarget } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: DELIVERY_COPY.invalidRequest };
  }
  const record = body as Record<string, unknown>;
  const id = typeof record.id === 'string' ? record.id.trim() : '';
  if (!UUID_PATTERN.test(id)) {
    return { ok: false, error: DELIVERY_COPY.invalidOrder };
  }
  if (record.delivery_status !== 'delivered' && record.delivery_status !== 'pending') {
    return { ok: false, error: DELIVERY_COPY.invalidStatus };
  }
  return { ok: true, id, target: record.delivery_status };
}

export function formatDeliveryMoment(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
}

export function deliveryColumnText(input: {
  known: boolean;
  status: string | null | undefined;
  deliveredAt: string | null | undefined;
}): { label: string; at: string | null } {
  if (!input.known) return { label: DELIVERY_COPY.unknown, at: null };
  if (input.status === 'delivered') {
    return {
      label: DELIVERY_COPY.delivered,
      at: input.deliveredAt ? formatDeliveryMoment(input.deliveredAt) : null,
    };
  }
  if (input.status === 'pending') return { label: DELIVERY_COPY.pending, at: null };
  return { label: DELIVERY_COPY.unknown, at: null };
}

export function parseDeliveryFilter(value: string | string[] | undefined): DeliveryFilter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'asteptare' || raw === 'pending') return 'pending';
  if (raw === 'livrate' || raw === 'delivered') return 'delivered';
  return 'all';
}

export function filterInquiriesByDelivery<T extends { delivery_status: string | null }>(
  rows: T[],
  filter: DeliveryFilter,
): T[] {
  if (filter === 'all') return rows;
  return rows.filter((row) => row.delivery_status === filter);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asPayload(value: unknown): AdminInquiryRow['payload'] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as AdminInquiryRow['payload'];
}

function toInquiryRow(row: Record<string, unknown>, known: boolean): AdminInquiryRow {
  return {
    id: asString(row.id),
    product: asString(row.product),
    email: asString(row.email),
    asset: asNullableString(row.asset),
    amount_ron: asNullableNumber(row.amount_ron),
    status: asString(row.status),
    stripe_session_id: asNullableString(row.stripe_session_id),
    created_at: asString(row.created_at),
    payload: asPayload(row.payload),
    delivery_status: known ? asNullableString(row.delivery_status) : null,
    delivered_at: known ? asNullableString(row.delivered_at) : null,
  };
}

export async function loadAdminInquiries(
  select: (columns: string) => Promise<SelectResult>,
): Promise<{ rows: AdminInquiryRow[]; error: DbErrorLike | null; deliveryKnown: boolean }> {
  const withDelivery = await select(INQUIRY_LIST_COLUMNS_WITH_DELIVERY);
  if (!withDelivery.error) {
    return {
      rows: (withDelivery.data ?? []).map((row) => toInquiryRow(row, true)),
      error: null,
      deliveryKnown: true,
    };
  }

  if (!isMissingDeliveryColumn(withDelivery.error)) {
    return { rows: [], error: withDelivery.error, deliveryKnown: false };
  }

  const plain = await select(INQUIRY_LIST_COLUMNS);
  if (plain.error) {
    return { rows: [], error: plain.error, deliveryKnown: false };
  }

  return {
    rows: (plain.data ?? []).map((row) => toInquiryRow(row, false)),
    error: null,
    deliveryKnown: false,
  };
}

export async function applyInquiryDelivery(input: {
  isAdmin: boolean;
  body: unknown;
  now?: Date;
  write: (id: string, patch: DeliveryPatch) => Promise<DeliveryWriteResult>;
}): Promise<DeliveryHttpResult> {
  if (!input.isAdmin) {
    return { status: 403, body: { success: false, error: DELIVERY_COPY.unauthorized } };
  }

  const parsed = parseDeliveryRequest(input.body);
  if (!parsed.ok) {
    return { status: 400, body: { success: false, error: parsed.error } };
  }

  const patch = buildDeliveryPatch(parsed.target, input.now ?? new Date());
  let written: DeliveryWriteResult;
  try {
    written = await input.write(parsed.id, patch);
  } catch {
    return { status: 500, body: { success: false, error: DELIVERY_COPY.saveFailed } };
  }

  if (written.error) {
    if (isMissingDeliveryColumn(written.error)) {
      return { status: 409, body: { success: false, error: DELIVERY_COPY.missingColumns } };
    }
    return { status: 500, body: { success: false, error: DELIVERY_COPY.saveFailed } };
  }

  if (!written.data) {
    return { status: 404, body: { success: false, error: DELIVERY_COPY.missingOrder } };
  }

  return {
    status: 200,
    body: {
      success: true,
      id: written.data.id,
      delivery_status: written.data.delivery_status,
      delivered_at: written.data.delivered_at,
    },
  };
}

/**
 * Admin check runs before the body is read and before any write.
 * A thrown admin lookup fails closed with 403.
 */
export async function handleInquiryDeliveryRequest(input: {
  isAdmin: () => Promise<boolean>;
  readBody: () => Promise<unknown>;
  write: (id: string, patch: DeliveryPatch) => Promise<DeliveryWriteResult>;
  now?: Date;
}): Promise<DeliveryHttpResult> {
  let admin = false;
  try {
    admin = await input.isAdmin();
  } catch {
    admin = false;
  }

  if (!admin) {
    return { status: 403, body: { success: false, error: DELIVERY_COPY.unauthorized } };
  }

  let body: unknown;
  try {
    body = await input.readBody();
  } catch {
    return { status: 400, body: { success: false, error: DELIVERY_COPY.invalidRequest } };
  }

  return applyInquiryDelivery({
    isAdmin: true,
    body,
    now: input.now,
    write: input.write,
  });
}
