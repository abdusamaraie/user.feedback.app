# Feedback Board MVP

A secure, anonymous feedback board for mobile app releases. Built with Next.js 15, Prisma, and Postgres.

## Features
- Public boards per app release with search, sorting, and pagination.
- Anonymous feedback submissions with mood tags.
- Guest upvotes with fingerprint + IP hashing.
- Admin dashboard protected by Basic Auth.
- Rate limiting (Upstash Redis optional fallback).
- Honeypot + minimum form fill time to deter bots.

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set values.
3. Create your database (Neon or Supabase) and update `DATABASE_URL`.
   - For Supabase: use the pooled connection string for `DATABASE_URL` and the direct connection string for `DIRECT_URL`.
4. Run Prisma migrations and seed data:
   ```bash
   npm run prisma:migrate
    npm run prisma:generate
    npm run prisma:seed
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000/b/launch-v1` for the sample board.

## Deploy to Vercel
1. Push the repo to GitHub.
2. Create a new Vercel project and import the repo.
3. Add environment variables from `.env.example`.
4. Use the Vercel Postgres integration or a Neon/Supabase database.
   - Supabase: set `DATABASE_URL` to the pooled connection string and `DIRECT_URL` to the direct connection string.
5. Run migrations in your deployment pipeline:
   ```bash
   npm run prisma:migrate:deploy
   ```

## Admin auth
The `/admin` routes are protected by Basic Auth using the `ADMIN_PASSWORD` env variable.
Use username `admin` and the configured password.

## Database schema
The Prisma schema is in `prisma/schema.prisma`. Migrations live in `prisma/migrations`.

## Tests
Run unit tests:
```bash
npm run test
```

## Notes
- Rate limiting uses Upstash Redis when configured; otherwise it falls back to an in-memory limiter (not recommended for production).
- Feedback content is stored as plain text and rendered safely by React.
