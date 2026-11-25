# Real Estate CRM

A modern real-estate CRM for managing leads, contacts, properties, deals, follow-ups, and appointments.

## Features

- Pipeline and lead management
- Contact profiles and lead sources
- Property inventory
- Deal tracking and revenue forecasts
- Follow-up tasks and appointments
- Responsive dashboard

## Local setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Set `DATABASE_URL` to a PostgreSQL connection string.

## Scripts

- `npm run dev` — start the development server
- `npm run db:push` — sync the Prisma schema
- `npm run db:seed` — seed demo data
- `npm run build` — production build
