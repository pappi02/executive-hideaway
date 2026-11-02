# Executive Hideaway

The Executive Hideaway Resort & Spa website and its admin dashboard: Next.js on Vercel, Prisma with Supabase Postgres, and Vercel Blob for images. Guests send booking requests through WhatsApp, and a copy is saved for the admin at `/admin/bookings`. Everything in the database is reached through Prisma; Supabase's Data API is closed to it.

# Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

The main application lives in `src/app`, with reusable UI in `src/components`.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build   # needs DATABASE_URL / DIRECT_URL
```

The same lint, type and test checks run in GitHub Actions on every push (`.github/workflows/ci.yml`).

## Database changes

Schema changes ship as Prisma migrations in `prisma/migrations`. Apply them to the
production database **before** deploying code that depends on them:

```bash
npm run db:status   # see which migrations are pending
npm run db:deploy   # apply them
```

`npm run db:seed` only creates what is missing, and refuses a hosted database unless given `--allow-remote`. To reset an admin's password, use `npm run admin:reset`; see `scripts/reset-admin-password.ts`.

A production build on Vercel fails if a migration is still pending, which leaves the current site live.

## Environment

See `.env.example` for every variable the app reads.

## Operations

Plan upgrades, dashboard settings and manual steps the code cannot do are tracked in
[`docs/OPERATIONS-CHECKLIST.md`](docs/OPERATIONS-CHECKLIST.md).
