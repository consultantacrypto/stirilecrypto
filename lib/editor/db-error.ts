type DbErrorLike = {
  message?: string;
  code?: string;
};

/** PostgREST / Postgres "column does not exist" errors for public.stiri. */
export function missingStiriColumn(error: DbErrorLike | null | undefined): string | null {
  const message = error?.message ?? '';
  const postgrest = /could not find the '([a-z0-9_]+)' column/i.exec(message);
  if (postgrest?.[1]) return postgrest[1];

  const postgres = /column "([a-z0-9_]+)"(?: of relation "stiri")? does not exist/i.exec(message);
  if (postgres?.[1]) return postgres[1];

  return null;
}

export function isUniqueSlugViolation(error: DbErrorLike | null | undefined): boolean {
  if (error?.code === '23505') return true;
  return /duplicate key value violates unique constraint/i.test(error?.message ?? '') && /slug/i.test(error?.message ?? '');
}

const PROVENANCE_COLUMNS = new Set(['source', 'tags', 'source_urls']);

export function isProvenanceColumn(name: string): boolean {
  return PROVENANCE_COLUMNS.has(name);
}
