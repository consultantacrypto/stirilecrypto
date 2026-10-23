# Produse la comandă și flag-uri

Payments are **off by default**. Nothing in this change charges a card, and the product pages do not render a pay button that calls a failing checkout.

The repo has no Stripe SDK and no `STRIPE_*` variables today. When payments are enabled later, `app/api/premium/checkout` creates a Stripe Checkout Session with the REST API (`https://api.stripe.com/v1/checkout/sessions`). Until then, a valid form joins a waitlist.

## Products

| Product | Path | Price | Chargeable when |
| --- | --- | --- | --- |
| Analiză tehnică multi-timeframe | `/analiza-tehnica` | `TA_PRICE_RON`, default **49 RON** | `PAYMENTS_ENABLED=true` and `STRIPE_SECRET_KEY` is set |
| Raport de risc pentru o monedă crypto | `/raport-risc` | `RISK_REPORT_PRICE_RON`, default **149 RON** | The flag above **and** `RISK_REPORT_PRICE_CONFIRMED=true` |
| Both together | checkbox on either page | `BUNDLE_PRICE_RON` or the sum of the two prices | Both products are chargeable |

**149 RON is a placeholder.** Do not confirm it in the page copy as final, and do not set `RISK_REPORT_PRICE_CONFIRMED` until the price is decided. The page labels it „preț de confirmat”.

The technical analysis covers one asset chosen by the buyer on 1h, 4h, 12h, 1D, 3D, 1W and 1M. The risk report scores any coin (not only BTC/ETH): overall 0–100 plus liquidity, listing quality, holder concentration, tokenomics/unlocks, dump risk, pump-and-dump signals, contract/security flags, team transparency, a watch window, and multi-timeframe context. Both are educational. They are not buy/sell calls and not personalized investment advice.

Samples on the pages use the fictitious asset **XMPL / Exemplum**. They are not market data.

Delivery time is a placeholder from config:

- `TA_DELIVERY_LABEL` — default `24–48 de ore lucrătoare`
- `RISK_DELIVERY_LABEL` — default `2–4 zile lucrătoare`

The order form requires an express checkbox for immediate digital delivery and loss of the 14-day withdrawal right (OUG 34/2014 art. 16 lit. m).

## Environment variables

Do not set these in Vercel as part of this change. They are read at runtime; unset means the safe default.

| Variable | Default | Effect |
| --- | --- | --- |
| `PAYMENTS_ENABLED` | off | Must be `true` before any Stripe session is created. |
| `STRIPE_SECRET_KEY` | unset | Required together with the flag. Never expose it to the client. |
| `TA_PRICE_RON` | `49` | Technical-analysis price. |
| `RISK_REPORT_PRICE_RON` | `149` | Placeholder risk-report price. |
| `RISK_REPORT_PRICE_CONFIRMED` | off | Must be `true` before the risk report (or a bundle) can be charged. |
| `BUNDLE_PRICE_RON` | sum of the two prices | Optional package price. Still not charged until the risk price is confirmed. |
| `TA_DELIVERY_LABEL` | `24–48 de ore lucrătoare` | Shown on the technical-analysis page. |
| `RISK_DELIVERY_LABEL` | `2–4 zile lucrătoare` | Shown on the risk-report page. |
| `PRODUCT_ORDER_WEBHOOK_URL` | unset | Optional `https://` endpoint. Receives the intake JSON after a waitlist submit. |
| `PRODUCT_ORDER_WEBHOOK_SECRET` | unset | Sent as `Authorization: Bearer …` when the webhook URL is set. |
| `AI_CHAT_ENABLED` | off | `POST /api/chat` returns 404 and does not call xAI unless this is `true`. |

`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are existing server credentials. The order API uses them only on the server.

## How an order is delivered

Fulfillment is manual.

1. Apply `supabase/product-inquiries.sql` in the Supabase SQL editor. The table is new; it does not change `stiri` or `/admin`.
2. While payments are off, the form button is **Înscrie-te pe lista de așteptare**. A valid submit inserts a `product_inquiries` row with `status = waitlist` and `amount_ron` null. No card is charged.
3. If the webhook URL is set, the same payload is POSTed there (email, Slack, Make, or similar). A successful webhook still counts as notified if the table insert fails.
4. If neither storage nor the webhook is available, the API returns an error and the page asks the reader to write to `consultantacrypto.ro@gmail.com`. It does not pretend the request was saved.
5. Read new rows in the Supabase table `product_inquiries` (Table Editor, or any SQL client with the service role). There is no new screen under `/admin`.
6. The analyst writes the piece from the stored intake and sends it to the email on the row, as email text or PDF, matching `payload.risk.delivery` when present.
7. Later, set `PAYMENTS_ENABLED=true` and `STRIPE_SECRET_KEY`. The technical-analysis button becomes **Continuă către plată**. The risk report stays on the waitlist until `RISK_REPORT_PRICE_CONFIRMED=true`.
8. A successful Stripe session redirects to `/comenzi/succes`. The row is `pending_payment` and stores `stripe_session_id`. Mark it delivered by hand after the email/PDF is sent. Stripe Dashboard is the payment record. A paid webhook is intentionally not implemented until fulfillment is decided; do not treat the success page as proof of delivery.

Legacy `POST /api/premium/checkout` used to return 503 for every body. Invalid bodies now return 400. A disabled pay button is not rendered, so the page does not invite a 503.

## `/api/chat`

The route has no UI. It calls the xAI API when `XAI_API_KEY` is present. `AI_CHAT_ENABLED` defaults off: the handler returns 404 before it reads the key or calls the provider. Set the flag to `true` only if the chat should run again. The route file is kept.
