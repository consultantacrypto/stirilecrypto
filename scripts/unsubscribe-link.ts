/**
 * Print an unsubscribe link for a newsletter subscriber.
 *
 * `--id` does not contact the database.
 * `--email` and `--all` run a SELECT through the service role and never write.
 *
 * Run: npx tsx scripts/unsubscribe-link.ts --help
 * See docs/newsletter-unsubscribe.md.
 */
import { pathToFileURL } from 'node:url';
import { runUnsubscribeLinkCli, linkCommandNeedsDatabase } from '../lib/newsletter/link-cli';
import { createSubscriberDirectory } from '../lib/newsletter/store';
import { createServiceClient } from '../lib/supabase/service';

const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const args = process.argv.slice(2);
  let lookup;
  if (linkCommandNeedsDatabase(args)) {
    try {
      lookup = createSubscriberDirectory(createServiceClient());
    } catch {
      console.error(
        'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. This command only reads.',
      );
      process.exit(1);
    }
  }

  runUnsubscribeLinkCli(args, {
    env: process.env,
    lookup,
    stdout: (line) => console.log(line),
    stderr: (line) => console.error(line),
  }).then((code) => {
    process.exit(code);
  });
}
