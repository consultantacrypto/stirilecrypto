import { normalizeEmail } from './email';
import type { SubscriberDirectory } from './store';
import {
  DEFAULT_UNSUBSCRIBE_ORIGIN,
  readUnsubscribeSecret,
  UNSUBSCRIBE_SECRET_ENV,
  unsubscribeUrls,
} from './token';

export type LinkCommand =
  | { ok: true; mode: 'help' }
  | { ok: true; mode: 'id'; id: string; origin: string }
  | { ok: true; mode: 'email'; email: string; origin: string }
  | { ok: true; mode: 'all'; origin: string }
  | { ok: false; message: string };

const HELP = `Generate a newsletter unsubscribe link.

The link is an HMAC of the subscriber id. This command does not insert, update, or delete.

No database:
  ${UNSUBSCRIBE_SECRET_ENV}=... npx tsx scripts/unsubscribe-link.ts --id <uuid>

One SELECT by email (no write). Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
  ${UNSUBSCRIBE_SECRET_ENV}=... npx tsx scripts/unsubscribe-link.ts --email reader@example.com

One SELECT of id and email for every row (no write):
  ${UNSUBSCRIBE_SECRET_ENV}=... npx tsx scripts/unsubscribe-link.ts --all

Options:
  --origin <origin>   Default ${DEFAULT_UNSUBSCRIBE_ORIGIN}. http is allowed only for localhost.

Put page_url in the email body. For one-click unsubscribe (RFC 8058) also set:
  List-Unsubscribe: <one_click_url>
  List-Unsubscribe-Post: List-Unsubscribe=One-Click

Do not commit the secret or the generated list. Clicks do nothing until the server
has ${UNSUBSCRIBE_SECRET_ENV} and supabase/abonati-unsubscribe.sql has been applied.
`;

export function parseUnsubscribeLinkArgs(argv: string[]): LinkCommand {
  if (argv.includes('--help') || argv.includes('-h')) return { ok: true, mode: 'help' };

  let origin = DEFAULT_UNSUBSCRIBE_ORIGIN;
  let id: string | null = null;
  let email: string | null = null;
  let all = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--origin') {
      const value = argv[index + 1];
      if (!value) return { ok: false, message: '--origin needs a value.' };
      origin = value;
      index += 1;
      continue;
    }
    if (arg === '--id') {
      const value = argv[index + 1];
      if (!value) return { ok: false, message: '--id needs a UUID.' };
      id = value;
      index += 1;
      continue;
    }
    if (arg === '--email') {
      const value = argv[index + 1];
      if (!value) return { ok: false, message: '--email needs an address.' };
      email = value;
      index += 1;
      continue;
    }
    if (arg === '--all') {
      all = true;
      continue;
    }
    return { ok: false, message: `Unknown argument: ${arg}` };
  }

  const modes = [id !== null, email !== null, all].filter(Boolean).length;
  if (modes !== 1) {
    return { ok: false, message: 'Choose one of --id, --email, or --all.' };
  }
  if (id !== null) return { ok: true, mode: 'id', id, origin };
  if (email !== null) return { ok: true, mode: 'email', email, origin };
  return { ok: true, mode: 'all', origin };
}

export function linkCommandNeedsDatabase(argv: string[]): boolean {
  const parsed = parseUnsubscribeLinkArgs(argv);
  return parsed.ok && (parsed.mode === 'email' || parsed.mode === 'all');
}

function cell(value: string): string {
  return value.replace(/[\t\r\n]/g, ' ');
}

function formatOne(input: { id: string; secret: string; origin: string }): string[] {
  const links = unsubscribeUrls({ id: input.id, secret: input.secret, origin: input.origin });
  return [
    `page_url\t${links.pageUrl}`,
    `one_click_url\t${links.oneClickUrl}`,
    `List-Unsubscribe\t${links.listUnsubscribeHeader}`,
    `List-Unsubscribe-Post\t${links.listUnsubscribePostHeader}`,
  ];
}

export async function runUnsubscribeLinkCli(
  argv: string[],
  options: {
    env: NodeJS.ProcessEnv;
    lookup?: SubscriberDirectory;
    stdout: (line: string) => void;
    stderr: (line: string) => void;
  },
): Promise<number> {
  const parsed = parseUnsubscribeLinkArgs(argv);
  if (!parsed.ok) {
    options.stderr(parsed.message);
    options.stderr('Run with --help for usage.');
    return 1;
  }
  if (parsed.mode === 'help') {
    options.stdout(HELP.trimEnd());
    return 0;
  }

  const secret = readUnsubscribeSecret(options.env);
  if (!secret) {
    options.stderr(
      `Set ${UNSUBSCRIBE_SECRET_ENV} to a random string of at least 32 characters. The value is not printed.`,
    );
    return 1;
  }

  try {
    if (parsed.mode === 'id') {
      for (const line of formatOne({ id: parsed.id, secret, origin: parsed.origin })) {
        options.stdout(line);
      }
      return 0;
    }

    if (!options.lookup) {
      options.stderr('A database lookup was requested, but no read-only directory was provided.');
      return 1;
    }

    if (parsed.mode === 'email') {
      const email = normalizeEmail(parsed.email);
      if (!email) {
        options.stderr('Introdu o adresă de email validă.');
        return 1;
      }
      const found = await options.lookup.findIdByEmail(email);
      if (!found) {
        options.stderr('No subscriber with that email. Nothing was written.');
        return 1;
      }
      options.stdout(`email\t${cell(email)}`);
      for (const line of formatOne({ id: found.id, secret, origin: parsed.origin })) {
        options.stdout(line);
      }
      return 0;
    }

    const rows = await options.lookup.list();
    options.stdout('email\tpage_url\tone_click_url');
    for (const row of rows) {
      const links = unsubscribeUrls({ id: row.id, secret, origin: parsed.origin });
      options.stdout(`${cell(row.email)}\t${links.pageUrl}\t${links.oneClickUrl}`);
    }
    options.stderr(`Listed ${rows.length} subscriber link(s). Read only; nothing was written.`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not build the unsubscribe link.';
    options.stderr(message);
    return 1;
  }
}
