# Editor API

Programmatic publishing for short breaking-news items on [Știrile Crypto](https://www.stirilecrypto.ro). The admin screens (`/admin/create`, `/admin/edit/[id]`) are unchanged. This API writes the same `public.stiri` rows, with `content_type = news`.

## How articles are stored today

News and Market Pulse share one Supabase table, `public.stiri`.

| Column | Role |
| --- | --- |
| `id` | UUID, `gen_random_uuid()` |
| `title`, `slug` | Slug is unique. The admin form fills it with `slugify(title)` until the editor edits it by hand. |
| `excerpt` | Standfirst. The article page prints it above the body. |
| `content` | HTML from the TipTap admin editor, or Markdown. The public page picks the renderer automatically. |
| `category` | Free text in the database. New admin articles use the eight labels in `lib/stiri-categories.ts`. |
| `content_type` | `news` (homepage, `/stiri`, Google News) or `market_pulse` (separate routes). |
| `status` | `draft` or `published`. Public queries only read `published`. |
| `image_url` | Public cover URL. Empty values fall back to `/placeholder.jpg`. |
| `published_at` | Set when status becomes `published`, cleared when it returns to `draft`. Not bumped on later edits. |
| `created_at` | Insert timestamp. |
| `views` | Public view counter. |
| `meta_title`, `meta_description` | Optional SEO overrides. Empty values fall back to title and excerpt. |
| `x_content` | OpenClaw X/Twitter draft. Not shown on the site. |
| `source`, `tags`, `source_urls` | Added by `supabase/editor-api-schema.sql` for this API. Nullable. Admin rows stay `source = null`. |

There is no author column. Every `/stiri` page already shows the byline **Redacția Știrile Crypto** (`EditorialByline`). Legacy static articles in `lib/articles.ts` are only a fallback when a slug is missing from Supabase; the live byline does not read their old `author` field.

Slug rules live in `lib/slugify.ts`: lowercase, strip diacritics, non-alphanumerics become `-`, trim, max 120 characters. The admin form also requires `^[a-z0-9]+(?:-[a-z0-9]+)*$`.

`/articol-nou` and `/editeaza` are old paths. Creation is `/admin/create`. Editing is `/admin/edit/[id]`. The admin form writes with the logged-in Supabase client (anon key + user session). It does not call `revalidatePath`. Public pages use ISR (`export const revalidate = 60` on `/`, `/stiri`, and `/stiri/[slug]`). `/sitemap.xml` and `/feed.xml` are dynamic. `/news-sitemap.xml` lists published `news` items from the last 48 hours and sends `Cache-Control: s-maxage=300`.

`/stiri?category=` is not the database category. Those chips (`btc`, `eth`, `macro`, `alts`, `edu`) match keywords in the title, excerpt, and category text. A row in `ȘTIRI GENERALE` appears under Bitcoin only if the text mentions bitcoin/btc. Categories containing `MACRO` match the Macro chip.

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables, then redeploy.

| Name | Where | Purpose |
| --- | --- | --- |
| `EDITOR_API_TOKEN` | Server only. New. | Bearer token for this API. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Already used | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Already used by OpenClaw and other server writes. | Service-role key. Bypasses RLS. Never expose it to the browser or commit it. |

If `EDITOR_API_TOKEN` is missing, the API returns `503`. A wrong token returns `401`. Comparison hashes both values and uses `crypto.timingSafeEqual`.

The anon key is not enough for this route. The handler uses `createServiceClient()` from `lib/supabase/service.ts`.

## Migration

Run [`supabase/editor-api-schema.sql`](../supabase/editor-api-schema.sql) once in the Supabase SQL Editor.

It adds nullable `source`, `tags`, and `source_urls`. Existing articles are unchanged (`source` stays null). The API can insert before the migration, but those rows are not marked and `PATCH` will refuse them. Apply the migration before pointing an automated editor at the site.

No other migration is required. `content_type` and the SEO columns are already assumed by the admin.

## Authentication

```http
Authorization: Bearer <EDITOR_API_TOKEN>
Content-Type: application/json
```

Send the token only in that header. Query strings are ignored.

## Endpoints

Base URL: `https://www.stirilecrypto.ro`

### Create — `POST /api/editor/articles`

`status` is required (`draft` or `published`). `content_type` is always `news`.

```bash
export EDITOR_API_TOKEN="paste-the-vercel-value"

curl -sS -X POST "https://www.stirilecrypto.ro/api/editor/articles" \
  -H "Authorization: Bearer $EDITOR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bitcoin trece de 70.000 de dolari după intrări în ETF-uri",
    "excerpt": "Fondurile spot au înregistrat intrări nete, iar lichidările de poziții short s-au accelerat.",
    "content": "Bitcoin a urcat peste 70.000 de dolari în această dimineață, după un val de intrări în ETF-urile spot din Statele Unite.\n\n## Ce s-a întâmplat\n\nDatele de piață arată intrări nete pe fondurile spot și o creștere a volumului pe bursele principale. Mișcarea a venit la câteva ore după publicarea inflației din SUA.\n\n## De ce contează\n\nPentru investitorii locali, pragul este mai puțin important decât lichiditatea. Intrările în ETF-uri arată cerere din partea conturilor reglementate, nu doar a traderilor cu levier.\n\n## Concluzie\n\nUrmărește dacă intrările continuă după deschiderea Wall Street. Fără volum, depășirea nivelului rămâne un spike.",
    "category": "ȘTIRI GENERALE",
    "status": "published",
    "tags": ["Bitcoin", "ETF"],
    "source_urls": ["https://www.example.com/etf-flows"],
    "image_url": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d"
  }'
```

`201` body includes `id`, `slug`, `status`, `source` (`editor_api`), `author` (`Redacția Știrile Crypto`), `url`, `word_count`, `provenance_stored`, and `revalidated`.

Editorial target is **250–400 Romanian words**. The API does not reject other lengths; `word_count` is there so the caller can check. Use `status: "draft"` to save without showing the item on the site.

### Update — `PATCH /api/editor/articles/:id`

`:id` is the UUID from the create response. Only rows with `source = editor_api` can be updated. Admin articles and Market Pulse return `403` or `409`.

```bash
curl -sS -X PATCH "https://www.stirilecrypto.ro/api/editor/articles/ARTICLE_UUID" \
  -H "Authorization: Bearer $EDITOR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "published", "excerpt": "Lead rescris, într-o singură frază." }'
```

Omitted fields stay as they are. The slug stays stable unless you send `slug`. `published_at` is kept on later edits of an already published item. Moving back to `draft` clears `published_at` and removes the article from public pages.

### Read one — `GET /api/editor/articles/:id`

Returns the full body for an editor row.

```bash
curl -sS "https://www.stirilecrypto.ro/api/editor/articles/ARTICLE_UUID" \
  -H "Authorization: Bearer $EDITOR_API_TOKEN"
```

### List recent — `GET /api/editor/articles`

Newest `news` rows first. The default list is published articles (admin and editor) plus drafts created by this API. Drafts written in `/admin` are not returned. The list omits `content`.

| Query | Meaning |
| --- | --- |
| `limit` | 1–50, default 20 |
| `status` | `draft` (editor rows only) or `published` |
| `source` | `editor_api` or `all` (default `all`) |

```bash
curl -sS "https://www.stirilecrypto.ro/api/editor/articles?limit=10&status=published&source=editor_api" \
  -H "Authorization: Bearer $EDITOR_API_TOKEN"
```

### Upload image — `POST /api/editor/images`

Uploads a cover to Supabase Storage (`imagini-stiri/editor-covers/`) with the service role and returns its public URL. Use the URL as `image_url` in create/PATCH. The bearer token is checked before the body is read.

- Body: `multipart/form-data` with a `file` field (optional text `filename` field), **or** the raw bytes with `Content-Type: image/webp|image/png|image/jpeg` (optional `?filename=`). For a raw body, that Content-Type must match the bytes.
- Max 5 MB. A decimal `Content-Length` above the limit is rejected before the body is read. The body stream is capped at the same limit (plus 64 KB for multipart framing) and is not buffered past it. The type is taken from magic bytes — WebP `RIFF`/`WEBP` with a `VP8`, `VP8L`, or `VP8X` chunk, a full PNG signature plus `IHDR`, or JPEG `FF D8 FF` with an end-of-image marker. Anything else returns `415`.
- The stored key is `editor-covers/<slug>-<timestamp>-<random>.<ext>`. The slug keeps only `[a-z0-9-]`. Slashes, backslashes, NUL, and `..` are rejected, so the key cannot leave `editor-covers/`. Existing objects are never overwritten (`upsert: false`).

```bash
curl -sS -X POST "https://www.stirilecrypto.ro/api/editor/images?filename=jpm-coin.webp" \
  -H "Authorization: Bearer $EDITOR_API_TOKEN" \
  -H "Content-Type: image/webp" --data-binary @cover.webp
# 201 {"path":"editor-covers/jpm-coin-1760000000000-a1b2c3d4.webp","bucket":"imagini-stiri","url":"https://…/storage/v1/object/public/imagini-stiri/editor-covers/…","content_type":"image/webp","bytes":29250}
```

There is no delete endpoint; remove objects from `/admin` or the Supabase dashboard.

## Fields

| Field | Required on create | Notes |
| --- | --- | --- |
| `title` | yes | Plain text, 3–200 characters. |
| `content` or `body` | yes | Markdown or HTML, same as the site. Max 60,000 characters. |
| `status` | yes | `draft` or `published`. |
| `category` | yes | One of the labels below, exact spelling. |
| `excerpt` | no | Plain text, max 500 characters. Derived from the body when omitted. |
| `slug` | no | Generated from the title. Explicit slugs that are taken return `409`. |
| `tags` | no | Up to 12 plain-text labels. Stored, not rendered. |
| `source_urls` | no | Up to 8 `https` URLs. Stored, not rendered. Put citations in the body if readers should see them. |
| `image_url` or `cover_image_url` | no | `https` URL or a root-relative path. Upload a cover with `POST /api/editor/images` and store `url`. Omitted covers use `/placeholder.jpg`. |
| `meta_title`, `meta_description` | no | SEO overrides. |

Categories:

- `ANALIZĂ TEHNICĂ & MACRO`
- `ON-CHAIN & ANALIZĂ TEHNICĂ`
- `MACRO & ON-CHAIN`
- `MACRO & MINING`
- `PSIHOLOGIE DE PIAȚĂ`
- `REGLEMENTĂRI`
- `DEFI & WEB3`
- `ȘTIRI GENERALE`

### Body format

Markdown is the better fit for an automated editor:

- Paragraphs separated by a blank line.
- Optional `##` sections.
- A heading `## Concluzie` or `## Sfat practic` is pulled into the green aside at the bottom, same as admin articles.
- Links: `[text](https://...)`.

HTML saved by TipTap (`<p>`, `<h2>`, `<strong>`, `<a>`) is also accepted. If the excerpt is exactly the same text as the first `<p>`, the page shows the excerpt once and removes that paragraph. Markdown is not deduped that way, so keep the excerpt as a one-sentence standfirst and start the body with the news itself.

The API rejects `<script>`, `<iframe>`, inline event handlers, and `javascript:` URLs.

Generated slugs that collide get `-2`, `-3`, and so on. Example: `Bitcoin trece de 70.000` becomes `bitcoin-trece-de-70-000`.

## Cache

On publish, and when a published row is edited or unpublished, the handler calls `revalidatePath` for:

- `/` (root layout, so the homepage and `/stiri` category query variants refresh)
- `/stiri/[slug]`
- `/hub/bitcoin`, `/hub/mica`, `/hub/securitate`
- `/sitemap.xml`, `/news-sitemap.xml`, `/feed.xml`

Draft creates do not flush the public cache. The admin form still does not revalidate; those articles continue to wait for the 60 second ISR window.

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Validation failed. `error` explains the field. |
| `401` | Missing or wrong bearer token. |
| `403` | The id is not an editor-API article. |
| `404` | Unknown id. |
| `409` | Slug taken, the row is Market Pulse, or the cover object name collided (`/images`). |
| `413` | Image larger than 5 MB (`/images`). |
| `415` | Not a WebP/PNG/JPEG image, or the raw Content-Type does not match the bytes (`/images`). |
| `503` | `EDITOR_API_TOKEN` or Supabase service credentials are missing, or the provenance migration is required for this operation. |
| `500` | Save failed. Details are logged on the server, not returned. |

## Risks

- The bearer token can publish news and edit rows this API created. Treat it like a password. Do not commit it. Rotate it in Vercel if it leaks.
- Before `editor-api-schema.sql` is applied, new rows are not flagged with `source = editor_api`, and `PATCH` cannot see them. Run the migration first.
- `PATCH` cannot edit Daniel's admin articles or Market Pulse. Delete stays in `/admin`. Covers can be uploaded with `POST /api/editor/images`.
- There is no rate limit.
- `tags` and `source_urls` are not shown on the public page. Category chips on `/stiri` use keywords, not `tags`.
- A cover URL is stored as given. Production images are unoptimized, so an `https` URL outside the Supabase/Unsplash allow-list still renders. A dead URL shows a broken image.
- Google News only lists items whose `published_at` is inside the last 48 hours. Later edits do not move that timestamp.
- Service-role credentials bypass Row Level Security. They stay in server environment variables only.
