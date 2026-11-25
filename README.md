# Gharana Realty CRM

A role-based real-estate CRM for Indian brokerages, with dashboards for sales, telecalling, marketing, operations, accounts, documentation, property management, and CRM support.

## Role workspaces

- Super Admin — organization-wide operations, branches, users, roles, integrations, and audit
- Admin — branch performance, inventory, team workload, approvals, and reports
- Sales Manager — sales team, allocation, pipeline, targets, and performance
- Sales Executive — assigned leads, calls, site visits, proposals, and follow-ups
- Telecaller — call queue, IVR and social leads, disposition, and callbacks
- Marketing — campaigns, source attribution, cost, and lead quality
- Back Office — KYC, agreements, documentation, and operational requests
- Accounts — invoices, receipts, brokerage, TDS, refunds, and reconciliation
- Documentation — sale agreements, RERA documents, stamp duty, and registration
- Property Manager — listings, availability, inspections, handovers, and maintenance
- CRM Support — integration health, tickets, data corrections, and audit support

Use `/?role=super-admin`, `/?role=admin`, `/?role=sales-manager`, `/?role=sales-executive`, `/?role=telecaller`, `/?role=marketing`, `/?role=back-office`, `/?role=accounts`, `/?role=documentation`, `/?role=property-manager`, or `/?role=crm-support` to preview roles.

> The role switch is a UI/demo feature. Authentication, password storage, branch isolation, and route/database authorization must be completed before production use.

## Lead integrations

Configure `LEAD_WEBHOOK_SECRET` and send normalized leads to:

`POST /api/integrations/leads`

Supported sources include Facebook / Meta, Instagram, LinkedIn, IVR / Phone, Google Ads, Property Portals, Website, WhatsApp, Referral, and Walk-in.

## Indian property types

Kothi, Villa, Flat / Apartment, Plot, Residential Land, Commercial Property, Office, and Shop.

## Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.
