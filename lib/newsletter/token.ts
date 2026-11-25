import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * HMAC unsubscribe tokens.
 *
 * The signed payload is `{ v, id, exp? }` where `id` is the subscriber UUID.
 * The email is never part of the payload. A random stored token would need a
 * backfill write on every existing row before a link could be issued; this
 * design only needs the server secret and the id, which is already the primary key.
 */
export const UNSUBSCRIBE_SECRET_ENV = 'NEWSLETTER_UNSUBSCRIBE_SECRET';
export const MIN_UNSUBSCRIBE_SECRET_LENGTH = 32;
export const UNSUBSCRIBE_PAGE_PATH = '/newsletter/dezabonare';
export const UNSUBSCRIBE_API_PATH = '/api/newsletter/unsubscribe';
export const DEFAULT_UNSUBSCRIBE_ORIGIN = 'https://www.stirilecrypto.ro';
export const LIST_UNSUBSCRIBE_POST = 'List-Unsubscribe=One-Click';

const TOKEN_VERSION = 1;
const MAX_TOKEN_LENGTH = 512;
const PURPOSE = 'newsletter-unsubscribe';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type TokenFailure = 'invalid' | 'expired';

type Payload = {
  v: number;
  id: string;
  exp?: number;
};

export function isSubscriberId(value: string): boolean {
  return UUID_RE.test(value);
}

export function readUnsubscribeSecret(env: NodeJS.ProcessEnv = process.env): string | null {
  const value = env[UNSUBSCRIBE_SECRET_ENV]?.trim() ?? '';
  if (value.length < MIN_UNSUBSCRIBE_SECRET_LENGTH) return null;
  return value;
}

function base64urlEncode(bytes: Buffer): string {
  return bytes.toString('base64url');
}

function base64urlDecode(value: string): Buffer | null {
  if (!value || value.length > MAX_TOKEN_LENGTH || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const decoded = Buffer.from(value, 'base64url');
    if (decoded.length === 0) return null;
    if (base64urlEncode(decoded) !== value) return null;
    return decoded;
  } catch {
    return null;
  }
}

function encodePayload(payload: Payload): string {
  const body: Payload = { v: TOKEN_VERSION, id: payload.id };
  if (payload.exp !== undefined) body.exp = payload.exp;
  return base64urlEncode(Buffer.from(JSON.stringify(body), 'utf8'));
}

function sign(encodedPayload: string, secret: string): string {
  const mac = createHmac('sha256', secret).update(`${PURPOSE}.${encodedPayload}`).digest();
  return base64urlEncode(mac);
}

export function createUnsubscribeToken(input: {
  id: string;
  secret: string;
  exp?: number;
}): string {
  const id = input.id.trim().toLowerCase();
  if (!isSubscriberId(id)) {
    throw new Error('Subscriber id must be a UUID.');
  }
  if (input.secret.length < MIN_UNSUBSCRIBE_SECRET_LENGTH) {
    throw new Error(`${UNSUBSCRIBE_SECRET_ENV} must be at least ${MIN_UNSUBSCRIBE_SECRET_LENGTH} characters.`);
  }
  if (input.exp !== undefined && (!Number.isInteger(input.exp) || input.exp < 0)) {
    throw new Error('Token expiry must be a positive unix timestamp.');
  }

  const encoded = encodePayload({ v: TOKEN_VERSION, id, exp: input.exp });
  return `${encoded}.${sign(encoded, input.secret)}`;
}

export function verifyUnsubscribeToken(
  token: string,
  secret: string,
  now: Date = new Date(),
): { ok: true; id: string } | { ok: false; reason: TokenFailure } {
  if (!secret || secret.length < MIN_UNSUBSCRIBE_SECRET_LENGTH) {
    return { ok: false, reason: 'invalid' };
  }
  if (typeof token !== 'string' || token.length < 20 || token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, reason: 'invalid' };
  }

  const dot = token.indexOf('.');
  if (dot <= 0 || token.indexOf('.', dot + 1) !== -1) {
    return { ok: false, reason: 'invalid' };
  }

  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(encoded, secret);
  const providedBytes = base64urlDecode(signature);
  const expectedBytes = base64urlDecode(expected);
  if (!providedBytes || !expectedBytes || providedBytes.length !== expectedBytes.length) {
    return { ok: false, reason: 'invalid' };
  }
  if (!timingSafeEqual(providedBytes, expectedBytes)) {
    return { ok: false, reason: 'invalid' };
  }

  const payloadBytes = base64urlDecode(encoded);
  if (!payloadBytes) return { ok: false, reason: 'invalid' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(payloadBytes.toString('utf8'));
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, reason: 'invalid' };
  }

  const record = parsed as Record<string, unknown>;
  if ('email' in record) return { ok: false, reason: 'invalid' };
  if (record.v !== TOKEN_VERSION || typeof record.id !== 'string' || !isSubscriberId(record.id)) {
    return { ok: false, reason: 'invalid' };
  }
  if ('exp' in record) {
    if (typeof record.exp !== 'number' || !Number.isInteger(record.exp)) {
      return { ok: false, reason: 'invalid' };
    }
    if (record.exp <= Math.floor(now.getTime() / 1000)) {
      return { ok: false, reason: 'expired' };
    }
  }

  return { ok: true, id: record.id.toLowerCase() };
}

export function assertUnsubscribeOrigin(origin: string): string {
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    throw new Error('Origin must be an absolute http(s) origin.');
  }
  if (url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) {
    throw new Error('Origin must not include a path, query, or credentials.');
  }
  if (url.protocol === 'https:') return url.origin;
  if (url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
    return url.origin;
  }
  throw new Error('Plain HTTP is only allowed for localhost.');
}

export function unsubscribeUrls(input: {
  id: string;
  secret: string;
  origin?: string;
  exp?: number;
}): {
  token: string;
  pageUrl: string;
  oneClickUrl: string;
  listUnsubscribeHeader: string;
  listUnsubscribePostHeader: string;
} {
  const origin = assertUnsubscribeOrigin(input.origin ?? DEFAULT_UNSUBSCRIBE_ORIGIN);
  const token = createUnsubscribeToken(input);
  const page = new URL(UNSUBSCRIBE_PAGE_PATH, origin);
  page.searchParams.set('token', token);
  const oneClick = new URL(UNSUBSCRIBE_API_PATH, origin);
  oneClick.searchParams.set('token', token);
  return {
    token,
    pageUrl: page.toString(),
    oneClickUrl: oneClick.toString(),
    listUnsubscribeHeader: `<${oneClick.toString()}>`,
    listUnsubscribePostHeader: LIST_UNSUBSCRIBE_POST,
  };
}
