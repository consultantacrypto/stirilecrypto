# Analiză tehnică la comandă

Production can already charge `/analiza-tehnica` when `PAYMENTS_ENABLED` and `STRIPE_SECRET_KEY` are set. This file’s later checkout notes describe that same flow. The promotion and address-check changes do not set Vercel variables and do not call Stripe.

## Where the services appear

`/analiza-tehnica` is linked from the header (`?src=nav`), a strip under the homepage hero (`?src=home`), the footer (`?src=footer`), and a box at the end of news, Market Pulse, and interview pages (`?src=article`). If the text mentions a known coin, the article link is `/analiza-tehnica?asset=BTC&src=article` and the order form starts with that symbol. The `source` field is stored in `product_inquiries.payload` and, on a paid checkout, as Stripe metadata `src`.

`/verificare-portofel` is the public page (nav label „Verificare portofel crypto”, with the shield icon). The page H1 stays „Verifică portofelul înainte să trimiți bani”. `/verifica-adresa` redirects with **301** to that slug, including the `src` query. The page explains, in plain language, how to check a wallet before sending money. Prices shown are 10 USD, 40 USD, and 140 USD. The page does not charge. It stores a notify email as `product = address_check` only after `supabase/product-inquiries-address-check.sql` is applied. Until then the insert fails and the form says so. Set `ADDRESS_CHECK_URL` to an `http(s)` URL when the MistTrack checker is live; the page button then links there and the waitlist form is hidden. This PR does not set that variable. The product id stays `address_check`; the rename does not need a new SQL migration.

## Product

The checkout code stays off unless `PAYMENTS_ENABLED=true` and `STRIPE_SECRET_KEY` are both set. This change does not set them.

`/analiza-tehnica` is the paid product. There are two prices, both for the same delivery (seven timeframes plus **Risc token**, no express option):

- **79 RON** (`major`) for a hardcoded top-30 coin. The list is the CoinMarketCap historical snapshot of 23 October 2026, ranks 1–30 (`https://coinmarketcap.com/historical/20261023/`). `TON` is accepted as `GRAM`.
- **139 RON** (`altcoin`) for every other symbol.

The buyer picks the tier in the form. `?asset=` preselects 79 when the symbol is in that list and 139 otherwise. The server calls `resolveAnalysisTier`. If the symbol is not in the list, the stored tier and the Stripe amount are the altcoin price even when the form posted `major`. A top-30 buyer may still post `altcoin` and pay 139. A posted amount is never read. `TA_PRICE_RON` is no longer read, so a leftover value of 49 cannot keep the old price.

The product id stays `ta_mtf`. `amount_ron` is 79 or 139. The resolved tier, `amountBani` (7900 or 13900), and `forcedAltcoin` are stored on `payload` jsonb. No new column and no new check-constraint value, so this change does not add a SQL file.

It covers one asset on 1h, 4h, 12h, 1D, 3D, 1W and 1M, plus a **Risc token** section: liquidity, major-exchange listings, holder distribution from Arkham and public on-chain data, token unlocks, dump risk, and pump-and-dump signals. The sample uses the fictitious asset Exemplum (XMPL). It is educational. It is not a buy or sell call.

`/raport-risc` redirects with **301** to `/analiza-tehnica`. It is not in the footer, the dashboard, or the sitemap. New orders are stored as `product = ta_mtf`. Older `risk_report` and `bundle` rows stay valid; the table check constraint is unchanged.

The order form asks for the asset symbol, an optional chart question, and optional risk fields (name, network, contract or native flag, why, whether they hold it, horizon, concerns, questions, email or PDF). The OUG 34/2014 art. 16 lit. m consent checkbox is required.

Delivery: a teammate drafts the analysis, Daniel Mihai reviews it, and it is sent by email from `contact@stirilecrypto.ro`, normally within `TA_DELIVERY_LABEL` (default `24 de ore în zilele lucrătoare`).

## How checkout works

This site does **not** send the buyer to mihaidaniel.ro. It already has its own Checkout Session flow.

`lib/flags.ts` turns payments on only when `PAYMENTS_ENABLED` is exactly `true` **and** `STRIPE_SECRET_KEY` is non-empty. Until then the button is „Înscrie-te pe lista de așteptare” and `POST /api/premium/checkout` never calls Stripe.

When both are set, a valid form with intent `pay`:

1. Resolves the tier on the server from the asset and the posted tier. Inserts `product_inquiries` with `status = pending_payment`, `amount_ron` 79 or 139, and the intake JSON including `payload.tier`.
2. `lib/products/stripe.ts` POSTs `https://api.stripe.com/v1/checkout/sessions` with `Authorization: Bearer $STRIPE_SECRET_KEY`. Mode is `payment`, currency `ron`, one line item whose `unit_amount` is the constant **7900** or **13900** bani (never a client number), `customer_email`, product name and description for that tier, and metadata `inquiry_id`, `product`, and `tier`. Checkout refuses any other unit amount. There is no Stripe SDK, no precreated Stripe Price, and no `payment_method_types` list. This does not change Stripe Dashboard settings.
3. The browser is sent to the hosted Checkout URL. Cancel returns to `/comenzi/anulare`. Success returns to `/comenzi/succes?session_id=…`. That page is **not** proof of payment or of delivery.
4. Stripe later POSTs `checkout.session.completed` (and, for delayed methods, `checkout.session.async_payment_succeeded`) to `/api/premium/webhook`. The route checks `Stripe-Signature` with `STRIPE_WEBHOOK_SECRET`. Only a session whose `payment_status` is `paid` marks the row `paid` and notifies.

The Stripe **account** is whichever account owns `STRIPE_SECRET_KEY`. mihaidaniel.ro does the same thing for the course and consultancy: its own `STRIPE_SECRET_KEY` creates a Checkout Session. It does not expose a shared checkout URL for other sites. To land these charges in QuickExit LLC’s Stripe (the account behind mihaidaniel.ro), put a restricted key from **that** Stripe account in this project’s `STRIPE_SECRET_KEY`. A key from a different Stripe account charges that other account instead. Do not paste the key into git.

There is no webhook on the success page. Fulfillment starts from `/api/premium/webhook`.

## What Dani sets to turn payments on

Do this in the Vercel project for stirilecrypto, Production (and Preview only if you want to test there). This PR does not set them.

1. In the Stripe account that should receive the money (QuickExit LLC, if that is the mihaidaniel.ro account), create a **restricted** key that can create Checkout Sessions. Set `STRIPE_SECRET_KEY` to that key.
2. Set `PAYMENTS_ENABLED` to `true`.
3. In Stripe → Developers → Webhooks, add an endpoint:
   `https://www.stirilecrypto.ro/api/premium/webhook`
   Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
   Set `STRIPE_WEBHOOK_SECRET` to that endpoint’s signing secret (`whsec_…`).
4. Apply `supabase/product-inquiries.sql` in the Supabase SQL editor if the table is not there yet. It does not change `stiri`.
5. Optional: `TA_DELIVERY_LABEL` (default `24 de ore în zilele lucrătoare`). `TA_PRICE_RON` is ignored.
6. Optional: `PRODUCT_ORDER_WEBHOOK_URL` (https only) and `PRODUCT_ORDER_WEBHOOK_SECRET`. After a paid webhook, the same JSON is POSTed there (Slack, Make, or an email relay). Waitlist submits use it too.
7. Redeploy so the server sees the variables. Then place a small live or test payment and confirm the row becomes `paid`.

`/admin/comenzi` lists the latest 100 rows for a signed-in admin (the existing authenticated read policy). It does not send the analysis and it does not touch the article editor. If the webhook URL is unset, that list plus the Stripe Dashboard are the notification. The teammate still sends the finished analysis manually from `contact@stirilecrypto.ro`.

Until step 2, nothing is charged.

## Other flags

| Variable | Default | Effect |
| --- | --- | --- |
| `PAYMENTS_ENABLED` | off | Must be `true` together with the secret key. |
| `STRIPE_SECRET_KEY` | unset | Server only. Chooses the Stripe account. |
| `STRIPE_WEBHOOK_SECRET` | unset | Required for `/api/premium/webhook` to accept events. |
| `TA_PRICE_RON` | ignored | No longer read. Prices are 79 and 139 RON in code. |
| `TA_DELIVERY_LABEL` | `24 de ore în zilele lucrătoare` | Shown on the page. |
| `PRODUCT_ORDER_WEBHOOK_URL` | unset | Optional https notification after waitlist or paid. |
| `PRODUCT_ORDER_WEBHOOK_SECRET` | unset | Sent as `Authorization: Bearer …` when the URL is set. |
| `AI_CHAT_ENABLED` | off | `POST /api/chat` stays 404 unless this is `true`. |

`TA_PRICE_RON`, `RISK_REPORT_PRICE_RON`, `RISK_REPORT_PRICE_CONFIRMED`, and `BUNDLE_PRICE_RON` are no longer read. Leave them unset. Do not change them in Vercel for this price change.

`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are the existing server credentials used to insert and update orders.
