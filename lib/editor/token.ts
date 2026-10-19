import { createHash, timingSafeEqual } from 'crypto';

const MAX_TOKEN_LENGTH = 512;

/** Read the credential from `Authorization: Bearer <token>`. */
export function readBearerToken(header: string | null): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  return match?.[1] ?? null;
}

/**
 * Compare bearer tokens without leaking the expected value through a
 * byte-by-byte early exit. Digests are fixed length, so timingSafeEqual
 * always runs on equal buffers.
 */
export function bearerTokensMatch(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  if (provided.length > MAX_TOKEN_LENGTH || expected.length > MAX_TOKEN_LENGTH) return false;

  const providedHash = createHash('sha256').update(provided, 'utf8').digest();
  const expectedHash = createHash('sha256').update(expected, 'utf8').digest();
  return timingSafeEqual(providedHash, expectedHash);
}
