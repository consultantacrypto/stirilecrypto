# Analiză tehnică la comandă

Payments are **off by default**. This change does not charge a card and does not set any Vercel variable.

`/analiza-tehnica` is the only product. Price **49 RON** (`TA_PRICE_RON`). It covers one asset on 1h, 4h, 12h, 1D, 3D, 1W and 1M, plus a **Risc token** section: liquidity, major-exchange listings, holder distribution from Arkham and public on-chain data, token unlocks, dump risk, and pump-and-dump signals. The sample uses the fictitious asset Exemplum (XMPL). It is educational. It is not a buy or sell call.

`/raport-risc` redirects with **301** to `/analiza-tehnica`. It is not in the footer, the dashboard, or the sitemap. New orders are stored as `product = ta_mtf`. Older `risk_report` and `bundle` rows stay valid; the table check constraint is unchanged.

The order form asks for the asset symbol, an optional chart question, and optional risk fields (name, network, contract or native flag, why, whether they hold it, horizon, concerns, questions, email or PDF). The OUG 34/2014 art. 16 lit. m consent checkbox is required.

Delivery: a teammate drafts the analysis, Daniel Mihai reviews it, and it is sent by email from `contact@stirilecrypto.ro`, normally within `TA_DELIVERY_LABEL` (default `24 de ore în zilele lucrătoare`).

## How checkout works

This site does **not** send the buyer to mihaidaniel.ro. It already has its own Checkout Session flow.

`lib/flags.ts` turns payments on only when `PAYMENTS_ENABLED` is exactly `true` **and** `STRIPE_SECRET_KEY` is non-empty. Until then the button is „Înscrie-te pe lista de așteptare” and `POST /api/premium/checkout` never calls Stripe.

When both are set, a valid form with intent `pay`:

1. Inserts `product_inquiries` with `status = pending_payment`, amount 49 RON (or `TA_PRICE_RON`), and the intake JSON.
2. `lib/products/stripe.ts` POSTs `https://api.stripe.com/v1/checkout/sessions` with `Authorization: Bearer $STRIPE_SECRET_KEY`. Mode is `payment`, currency `ron`, one line item, `customer_email`, and metadata `inquiry_id`. There is no Stripe SDK and no `payment_method_types` list.
3. The browser is sent to the hosted Checkout URL. Cancel returns to `/comenzi/anulare`. Success returns to `/comenzi/succes?session_id=…`. That page is **not** proof of payment or of delivery.
4. Stripe later POSTs `checkout.session.completed` (and, for delayed methods, `checkout.session.async_payment_succeeded`) to `/api/premium/webhook`. The route checks `Stripe-Signature` with `STRIPE_WEBHOOK_SECRET`. Only a session whose `payment_status` is `paid` marks the row `paid` and notifies.

The Stripe **account** is whichever account owns `STRIPE_SECRET_KEY`. mihaidaniel.ro does the same thing for the course and consultancy: its own `STRIPE_SECRET_KEY` creates a Checkout Session. It does not expose a shared checkout URL for other sites. To land these 49 RON charges in QuickExit LLC’s Stripe (the account behind mihaidaniel.ro), put a restricted key from **that** Stripe account in this project’s `STRIPE_SECRET_KEY`. A key from a different Stripe account charges that other account instead. Do not paste the key into git.

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
5. Optional: `TA_PRICE_RON` (default 49) and `TA_DELIVERY_LABEL` (default `24 de ore în zilele lucrătoare`).
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
| `TA_PRICE_RON` | `49` | Price in RON. |
| `TA_DELIVERY_LABEL` | `24 de ore în zilele lucrătoare` | Shown on the page. |
| `PRODUCT_ORDER_WEBHOOK_URL` | unset | Optional https notification after waitlist or paid. |
| `PRODUCT_ORDER_WEBHOOK_SECRET` | unset | Sent as `Authorization: Bearer …` when the URL is set. |
| `AI_CHAT_ENABLED` | off | `POST /api/chat` stays 404 unless this is `true`. |

`RISK_REPORT_PRICE_RON`, `RISK_REPORT_PRICE_CONFIRMED`, and `BUNDLE_PRICE_RON` are no longer read. Leave them unset.

`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are the existing server credentials used to insert and update orders.
