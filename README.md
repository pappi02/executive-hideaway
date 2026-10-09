# Executive Hideaway

The Executive Hideaway Barber and Spa homepage, built with Next.js and Tailwind CSS.

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

## Environment

See `.env.example` for every variable the app reads.

## Operations

Plan upgrades, dashboard settings and manual steps the code cannot do are tracked in
[`docs/OPERATIONS-CHECKLIST.md`](docs/OPERATIONS-CHECKLIST.md).
