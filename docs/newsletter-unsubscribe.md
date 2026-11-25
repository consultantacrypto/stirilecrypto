# Newsletter unsubscribe

Subscribers live in `public.abonati` (`id` uuid, `email` text unique, `created_at`, and `unsubscribed_at` once the migration below is applied). The public form posts to `POST /api/subscribe`. Anonymous visitors can insert. They cannot select or update. Unsubscribe therefore goes through the service role, and only after a signed token checks out.

## Token design

Links are HMAC-signed. The payload is `{ "v": 1, "id": "<uuid>", "exp"?: <unix seconds> }` and the signature is HMAC-SHA256 over `newsletter-unsubscribe.` plus that payload, keyed with `NEWSLETTER_UNSUBSCRIBE_SECRET`. The email is not in the payload.

A random token stored on each row would need an update of every current subscriber before a link could be sent. The signed id does not. `id` is already `gen_random_uuid()`, so it is not enumerable, and a token for any other id fails the signature check. Tokens do not expire unless a generator sets `exp`. Rotating the secret invalidates outstanding links; the page treats a bad signature and a passed `exp` as invalid and expired.

The visible link is:

`https://www.stirilecrypto.ro/newsletter/dezabonare?token=...`

Opening it does not unsubscribe. The subscriber presses **Confirmă dezabonarea**, which POSTs `confirm=1` and the token. Email scanners that only prefetch the URL cannot unsubscribe. `POST /api/newsletter/unsubscribe` also accepts RFC 8058 one-click: body `List-Unsubscribe=One-Click`, token in the query string, response `200`. Any other POST is rejected and does not write.

## Migration (apply manually, not from this repo's deploy)

Run `supabase/abonati-unsubscribe.sql` in the Supabase SQL editor. It adds nullable `unsubscribed_at`. Existing rows stay subscribed. Do not run it against production from the Vercel Preview or from CI. The preview uses the production database.

Until that column exists, the unsubscribe page cannot record a confirmation.

## Secret (set before merge, not from this change)

| Name | Where | Purpose |
| --- | --- | --- |
| `NEWSLETTER_UNSUBSCRIBE_SECRET` | Server only. Production and Preview if the flow should work there. | HMAC key. At least 32 characters. `openssl rand -base64 32`. |

Do not commit the value and do not print it. The link script and the unsubscribe route both refuse a missing or short secret. Existing `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` are reused for the server-side read and the confirmation update. No new service is required.

Set the secret in Vercel, apply the migration, then send mail. A link created before either of those is in place will not be able to complete.

## Generate a link

`--id` does not contact the database. `--email` and `--all` each run a SELECT and never insert, update, or delete.

```bash
# No database. Use the subscriber uuid from public.abonati.id.
export NEWSLETTER_UNSUBSCRIBE_SECRET='...'
npx tsx scripts/unsubscribe-link.ts --id 11111111-1111-4111-8111-111111111111
```

```bash
# One SELECT by email. No write.
export NEWSLETTER_UNSUBSCRIBE_SECRET='...'
export NEXT_PUBLIC_SUPABASE_URL='...'
export SUPABASE_SERVICE_ROLE_KEY='...'
npx tsx scripts/unsubscribe-link.ts --email reader@example.com
```

```bash
# One SELECT of id and email for every row, then a link per subscriber. No write.
npx tsx scripts/unsubscribe-link.ts --all
```

`--origin` defaults to `https://www.stirilecrypto.ro`. `http://localhost:3000` is allowed for local checks. The command prints `page_url` for the email body and the two headers below. Do not commit the output: `--all` includes email addresses.

```text
List-Unsubscribe: <https://www.stirilecrypto.ro/api/newsletter/unsubscribe?token=...>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

Someone who already unsubscribed can sign up again with the same address. That clears `unsubscribed_at`. An address that is still subscribed gets the existing duplicate response, including when the new column is not there yet.
