# Gharana Realty CRM

A real-estate CRM for Indian brokerages, with client and property tracking, deal pipeline, follow-ups, activity history, and a secure inbound lead webhook for social, IVR, website, and portal integrations.

## Lead intake integrations

The CRM exposes `POST /api/integrations/leads` as a normalized inbound webhook. Connect a Meta/Facebook or Instagram lead-form integration, IVR/call provider, website form, WhatsApp automation, or property portal by configuring that provider to send a webhook to this endpoint. Provider credentials and field mapping are configured on the provider side; this repo supplies the receiver and common payload contract, not pre-authorized direct connections to those services.

Configure a long random shared secret in `LEAD_WEBHOOK_SECRET` and require the provider or your integration middleware to send it as a bearer token. Do not expose the secret in browser code or commit it to source control. Example local `.env` entry:

```dotenv
LEAD_WEBHOOK_SECRET="replace-with-a-long-random-secret"
```

Send a normalized payload from your provider adapter:

```json
{
  "externalId": "provider-lead-84921",
  "source": "Instagram",
  "campaign": "Bandra 3BHK enquiries",
  "name": "Ananya Mehta",
  "phone": "+919820144128",
  "email": "ananya@example.in",
  "type": "Buyer",
  "budgetMin": 25000000,
  "budgetMax": 45000000,
  "preferredPropertyType": "Flat / Apartment",
  "preferredLocation": "Bandra West, Mumbai",
  "message": "Looking for a 3 BHK near the sea",
  "consentToContact": true
}
```

Accepted source values are normalized to channels such as Facebook / Meta, Instagram, IVR / Phone, Google Ads, Property Portal, Website, WhatsApp, Referral, Walk-in, and LinkedIn. Supported client types: Buyer, Seller, Tenant, Investor, Other. Property preferences include Kothi, Villa, Flat / Apartment, Plot, Residential Land, Commercial Property, Office, and Shop.

```bash
curl -X POST http://localhost:3000/api/integrations/leads \
  -H 'Authorization: Bearer replace-with-a-long-random-secret' \
  -H 'Content-Type: application/json' \
  -d '{"externalId":"provider-lead-84921","source":"Instagram","name":"Ananya Mehta","phone":"+919820144128","consentToContact":true}'
```

The receiver validates the bearer secret and input, records lead source/campaign and activity history, deduplicates by provider lead ID or contact phone/email, and creates a high-priority first follow-up for new leads. The endpoint does not initiate calls or messages; consent and provider-side communication rules remain your responsibility. Use HTTPS in production and rotate the secret if exposed.

## CRM capabilities

- Lead sources and campaign attribution, contact lifecycle, lead scoring fields, and assignment fields
- Buyer, seller, tenant, and investor profiles with INR budget and property preferences
- Indian property categories: Kothi, Villa, Flat / Apartment, Plot, Residential Land, Commercial Property, Office, and Shop
- Deal pipeline, property inventory, follow-up tasks, and activity history
- Contact, property, deal, and task REST endpoints
- Responsive dashboard with Indian-numbering INR amounts

## Setup

```bash
npm install
cp .env.example .env
# Set DATABASE_URL and LEAD_WEBHOOK_SECRET in .env
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. Apply schema changes with `npm run db:push` after pulling updates.

## Scripts

- `npm run dev` — start the development server
- `npm run db:push` — sync the Prisma schema
- `npm run db:seed` — load Indian-market demo data
- `npm run build` — production build
