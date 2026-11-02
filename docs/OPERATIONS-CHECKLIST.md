# Operations checklist

Things the code can't fix by itself: plan upgrades, dashboard settings, and
one-off manual steps. Written 9 October 2026 after the scaling audit. Tick items
off as they're done.

## 1. Releases

- [x] `login_attempts` migration applied (`db:status`: up to date, 9 Oct 2026).
- [x] Security, Prisma 7 and legal-pages release deployed (commit `9693982`). The live site
      serves the CSP header, and every page returns 200.
- [ ] Sign in to the admin again. Sessions issued before that release are no longer accepted.
- [ ] Deploy the scaling fixes (Dublin region, image caching, cached request page, health
      endpoint, smaller menu logos). Afterwards, the `x-vercel-id` header on
      `/api/health` should contain `dub1`, not `iad1`.
- [ ] Spot-check after each deploy: `/api/health` returns `{"status":"ok"}`, and an admin
      save shows a toast.

**Every future schema change:** run `npm run db:deploy` *before* pushing the code that
needs it, and keep migrations additive.

**If `db:*` scripts fail with P1001 on a slow connection:** add `?connect_timeout=30` to
`DIRECT_URL` in `.env.local`.

## 2. Plan upgrades (cost money)

| Item | Why | Cost |
|---|---|---|
| **Vercel Pro** | Hobby is non-commercial only. Hitting any Hobby limit pauses that feature for up to 30 days, with no option to pay for more. Pro adds usage billing with a spend cap, 1 day of logs instead of 1 hour, log drains and alerts. | $20 per seat per month, plus usage |
| **Supabase: confirm the plan** | Daily backups and point-in-time recovery depend on the plan. Free projects have limited backups. | About $25 a month for Pro; point-in-time recovery is an add-on |

## 3. Dashboard settings (free, needs account access)

**Vercel** (project `dream-team-1ca2/executive-hideaway`):
- [ ] Settings → Functions → Function Regions shows **Dublin (`dub1`)** after the next deploy
      (`vercel.json` sets it; the database is in `eu-west-1`).
- [ ] Settings → Environment Variables: confirm **which database `DATABASE_URL` points to**
      in Production. The Neon variables (`POSTGRES_*`) come from an unused integration;
      remove it if nothing uses it.
- [ ] Give Preview deployments their **own** `DATABASE_URL` and `DIRECT_URL`, so previews
      never write to production.
- [ ] Set `NEXT_PUBLIC_SITE_URL` once a custom domain (e.g. executivehideaway.co.ke) is live.
- [ ] Optional: add `DATABASE_CA_CERT` (Supabase → Database → SSL Configuration) so the
      app verifies the database certificate.
- [ ] Firewall: add a rate-limit rule for `POST /admin/login` and `/accommodation/request`
      if your plan allows rate-limit rules.
- [ ] Turn on **Speed Insights** to get real-user LCP and INP from Kenyan phones.
- [ ] Usage tab: note current monthly CDN requests, image transformations and function
      invocations. That baseline is needed before planning for 10× traffic.
- [ ] **Delete or disconnect the duplicate project**
      `david-baraka-nyongesas-projects/executive-hideaway`, which also deploys this repo,
      and rotate any secrets that were stored in it.

**Supabase:**
- [ ] Confirm backups exist, then do one test restore into a scratch project. Note how long
      it took and how much data could be lost.
- [ ] Create a separate development database (or a Supabase branch) and point `.env.local`
      at it. Today local `next dev`, `next build` and every `db:*` script run against
      **production**. The seed script refuses a hosted database without `--allow-remote`.

**GitHub:**
- [ ] Settings → Branches: require the **CI** check (`.github/workflows/ci.yml`) to pass
      on `main`.

## 4. Manual one-off tasks

- [ ] Move the 3 room photos still stored in the database to Blob storage:
      `vercel env pull .env.local`, so `BLOB_READ_WRITE_TOKEN` is present, then
      `npm run images:migrate -- --dry-run`, then `npm run images:migrate`. The home page's
      featured-room photo is one of them; it currently takes 3–4 s on a cache miss.
- [ ] Have someone review the wording of `/privacy` and `/terms`. Check with an adviser
      whether the business must register with the Data Protection Commissioner.
- [ ] Remove `SEED_ADMIN_PASSWORD` and the unused Neon variables from `.env.local`, and change the
      admin password if that seed password is still in use.
- [ ] Turn on two-factor sign-in at `/admin/account`.
- [ ] Set up an uptime monitor (any free service) on `https://<domain>/api/health` and the
      home page, alerting after 2 failed checks in a row.
- [ ] When replacing a photo under `public/images`, **give it a new file name**.
      Optimized images are now cached for 31 days.

## 5. Before a traffic push (validation)

- [ ] Load-test a Preview deployment with its own database, never production:
      cached pages 50 → 500 virtual users; `/accommodation/request` 20 → 100.
      Watch p95 latency, errors and database connections.
- [ ] Rollback drill: promote a preview, then use Vercel Instant Rollback; time it.
- [ ] Keep migrations additive (add columns or tables, never rename or drop in the same
      release) so a code rollback never needs a database rollback.

## Monitoring thresholds to start with

| Signal | Alert when |
|---|---|
| `/api/health` | 2 failures in a row |
| 5xx rate | > 1% over 5 minutes |
| Dynamic-route p95 | > 1.5 s for 10 minutes |
| Field LCP / INP (p75) | > 2.5 s / > 200 ms |
| Vercel usage (each meter) | 70% of the monthly allowance |
| Database connections | > 70% of the plan limit |
| Failed admin logins | > 20 an hour |
| Latest backup age | > 26 hours |
