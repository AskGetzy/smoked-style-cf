# Smoked Style

Next.js on Cloudflare Workers (OpenNext) with D1 and R2. Plan: storefront, admin, boss portal.

## Built so far
- Staff login (Better Auth on D1). First account becomes the boss; everyone else must be invited at /admin/staff.
- Admin product editor: add, edit, delete items with photos (R2) and item controls (show/hide, needs approval, max per order, stock limit, taxable).

## First deploy (one time)
```bash
npm install
npx wrangler login
npx wrangler r2 bucket create smokedstyle-photos
npm run db:migrate                      # applies migrations/0001_init.sql to the smokedstyle D1 database
openssl rand -base64 32 | npx wrangler secret put BETTER_AUTH_SECRET
npm run deploy
```
Then set `BETTER_AUTH_URL` in `wrangler.jsonc` to the deployed address (or your domain), run `npm run deploy` again, and open `/login` to create the boss account.

## Local dev
```bash
cp .dev.vars.example .dev.vars          # then put a real secret in it
npm run db:migrate:local
npm run dev
```
