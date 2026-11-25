import {
  readUnsubscribeSecret,
  verifyUnsubscribeToken,
  UNSUBSCRIBE_PAGE_PATH,
} from './token';
import type { FindSubscriberResult, MarkUnsubscribedResult } from './store';

export { readUnsubscribeSecret };

export type ConfirmResult = 'unsubscribed' | 'already' | 'invalid' | 'expired' | 'unavailable';

export type UnsubscribePageState =
  | { kind: 'confirm'; token: string }
  | { kind: Exclude<ConfirmResult, never> };

const PAGE_RESULTS = new Set<ConfirmResult>([
  'unsubscribed',
  'already',
  'invalid',
  'expired',
  'unavailable',
]);

export type UnsubscribeStore = {
  findSubscriber(id: string): Promise<FindSubscriberResult>;
  markUnsubscribed(id: string, atIso: string): Promise<MarkUnsubscribedResult>;
};

/**
 * GET view. Never writes. A `result` from the POST redirect is rendered as-is
 * and does not touch the database. A valid token is only looked up.
 */
export async function resolveUnsubscribePage(input: {
  token?: string | null;
  result?: string | null;
  secret: string | null;
  now?: Date;
  findSubscriber?: (id: string) => Promise<FindSubscriberResult>;
}): Promise<UnsubscribePageState> {
  const result = input.result?.trim() ?? '';
  if (PAGE_RESULTS.has(result as ConfirmResult)) {
    return { kind: result as ConfirmResult };
  }

  const token = input.token?.trim() ?? '';
  if (!token) return { kind: 'invalid' };
  if (!input.secret) return { kind: 'unavailable' };

  const verified = verifyUnsubscribeToken(token, input.secret, input.now);
  if (!verified.ok) return { kind: verified.reason };
  if (!input.findSubscriber) return { kind: 'confirm', token };

  const found = await input.findSubscriber(verified.id);
  if (!found.ok) return { kind: 'unavailable' };
  if (!found.row) return { kind: 'invalid' };
  if (found.row.unsubscribedAt) return { kind: 'already' };
  return { kind: 'confirm', token };
}

/**
 * POST confirmation. Invalid and expired tokens return before `getStore` is called.
 */
export async function confirmUnsubscribe(input: {
  token: string;
  secret: string | null;
  now?: Date;
  getStore: () => UnsubscribeStore | Promise<UnsubscribeStore>;
}): Promise<ConfirmResult> {
  if (!input.secret) return 'unavailable';

  const verified = verifyUnsubscribeToken(input.token, input.secret, input.now ?? new Date());
  if (!verified.ok) return verified.reason;

  let store: UnsubscribeStore;
  try {
    store = await input.getStore();
  } catch {
    return 'unavailable';
  }

  const found = await store.findSubscriber(verified.id);
  if (!found.ok) return 'unavailable';
  if (!found.row) return 'invalid';
  if (found.row.unsubscribedAt) return 'already';

  const marked = await store.markUnsubscribed(verified.id, (input.now ?? new Date()).toISOString());
  if (!marked.ok) return 'unavailable';
  if (!marked.changed) return 'already';
  return 'unsubscribed';
}

const MAX_BODY_LENGTH = 4096;

async function readFormBody(request: Request): Promise<URLSearchParams> {
  const type = (request.headers.get('content-type') ?? '').toLowerCase();
  if (type.includes('application/json') || type.includes('multipart/')) {
    throw new Error('unsupported');
  }
  if (type && !type.includes('application/x-www-form-urlencoded') && type.trim() !== '') {
    throw new Error('unsupported');
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_LENGTH) throw new Error('too-large');
  return new URLSearchParams(raw);
}

function noStore(headers: Record<string, string> = {}): Headers {
  return new Headers({ 'Cache-Control': 'no-store', ...headers });
}

export function methodNotAllowed(): Response {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: noStore({ Allow: 'POST' }),
  });
}

function redirectToResult(result: ConfirmResult): Response {
  return new Response(null, {
    status: 303,
    headers: noStore({
      Location: `${UNSUBSCRIBE_PAGE_PATH}?result=${result}`,
    }),
  });
}

function oneClickResponse(result: ConfirmResult): Response {
  if (result === 'unsubscribed' || result === 'already') {
    return new Response(result, { status: 200, headers: noStore({ 'Content-Type': 'text/plain; charset=utf-8' }) });
  }
  if (result === 'unavailable') {
    return new Response(result, { status: 503, headers: noStore({ 'Content-Type': 'text/plain; charset=utf-8' }) });
  }
  return new Response(result, { status: 400, headers: noStore({ 'Content-Type': 'text/plain; charset=utf-8' }) });
}

/**
 * Browser confirmations redirect. RFC 8058 one-click POSTs
 * (`List-Unsubscribe=One-Click`, token in the query string) unsubscribe and return 200.
 * Any other POST, including a bare prefetch, does not call `perform`.
 */
export async function handleUnsubscribePost(
  request: Request,
  deps: {
    secret: string | null;
    now?: Date;
    perform: (token: string) => Promise<ConfirmResult>;
  },
): Promise<Response> {
  let params: URLSearchParams;
  try {
    params = await readFormBody(request);
  } catch {
    return new Response('invalid', {
      status: 400,
      headers: noStore({ 'Content-Type': 'text/plain; charset=utf-8' }),
    });
  }

  const oneClick = params.get('List-Unsubscribe') === 'One-Click';
  const confirmed = params.get('confirm') === '1';
  if (!oneClick && !confirmed) {
    return new Response('invalid', {
      status: 400,
      headers: noStore({ 'Content-Type': 'text/plain; charset=utf-8' }),
    });
  }

  const url = new URL(request.url);
  const token = (oneClick ? url.searchParams.get('token') : params.get('token'))?.trim() ?? '';
  if (!token) {
    return oneClick ? oneClickResponse('invalid') : redirectToResult('invalid');
  }

  const result = await deps.perform(token);
  return oneClick ? oneClickResponse(result) : redirectToResult(result);
}
