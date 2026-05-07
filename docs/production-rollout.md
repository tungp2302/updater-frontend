# Production Rollout

## Target shape

Run one Next.js service on Render and keep checkout, webhook ingestion, and updater validation inside the same app. Stripe remains the payment source of truth. Supabase stores purchase and entitlement state.

## Required environment variables

Set these in Render and in local `.env.local`:

- `APP_URL` - canonical public app URL used for Stripe success and cancel redirects
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PRICE_ID` - Stripe price for the updater license
- `SUPABASE_URL` - Supabase project base URL, for example `https://civwdqsoqxftvkcfyaic.supabase.co` not `/rest/v1`
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for server routes only

Live values you already have:

- `APP_URL=https://torq-lab.com`
- `STRIPE_PRICE_ID=prod_USOadq0bqrLisf`
- `SUPABASE_URL=https://civwdqsoqxftvkcfyaic.supabase.co`

To find the missing Supabase key:

1. Open the Supabase dashboard for the project.
1. Go to `Project Settings`.
1. Open `API`.
1. Copy the `service_role` key from the API keys section.
1. Put that value into `SUPABASE_SERVICE_ROLE_KEY` in Render and your local `.env.local`.

## API routes added

- `POST /api/checkout` - creates a Stripe Checkout session and returns the redirect URL
- `POST /api/webhooks/stripe` - verifies Stripe signatures and writes purchase state to Supabase
- `POST /api/updater/validate` - checks entitlement status and registers device usage when a device ID is supplied

## Supabase schema

Paste `supabase/schema.sql` into the SQL editor and run it in order.

Tables created:

- `stripe_events` - idempotency log for webhook events
- `purchases` - one row per completed checkout session
- `entitlements` - one row per customer email
- `device_activations` - registered devices for the license cap

## Render settings

- Build command: `npm run build`
- Start command: `npm run start`
- Health check path: `/`
- Add all environment variables above

## Stripe setup

- Create the product and one-time price in Stripe
- Copy the `price_...` value into `STRIPE_PRICE_ID`
- Create a webhook endpoint for `https://<your-render-domain>/api/webhooks/stripe`
- Subscribe it to `checkout.session.completed`
- Copy the signing secret into `STRIPE_WEBHOOK_SECRET`

## Verification checklist

1. Run `npm run build`
1. Open the homepage and confirm the buy button opens Stripe Checkout
1. Complete a Stripe test purchase and confirm a row lands in `stripe_events`
1. Confirm the same checkout session updates `purchases` and `entitlements`
1. Call `/api/updater/validate` with the purchased email and a device ID and confirm it allows access
1. Replay the same webhook event and confirm it stays idempotent
