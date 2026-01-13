# Feedback Board (Payload + Next.js)

A production-ready feedback board with anonymous submissions and upvotes. Built with Next.js App Router, Payload CMS, PostgreSQL, and Tailwind.

## Features
- Anonymous feedback submissions (no login required)
- Anonymous upvotes with fingerprint cookie + IP hash protection
- Payload admin dashboard at `/admin` with RBAC
- Multiple apps + boards with tags, status, and pinned posts
- Rate limiting with Upstash Redis (in-memory fallback for local dev)

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in values.
   - Supabase/Neon: use the Postgres connection string for `DATABASE_URL`.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. In a separate terminal, run migrations and seed data:
   ```bash
   npm run payload:migrate
   npm run payload:seed
   ```

Visit `http://localhost:3000/shuur/general` to view the sample board.

## Admin users
Payload auth is enabled for the `users` collection. Create your first admin user via the Payload Admin UI or seed in the database directly.

Roles:
- `admin`: full access to all collections
- `moderator`: manage apps, boards, tags, and posts

## Environment variables
- `DATABASE_URL`: Postgres connection string (Neon/Supabase supported)
- `PAYLOAD_SECRET`: secret key for Payload
- `NEXT_PUBLIC_SITE_URL`: base site URL (used for delete links)
- `IP_HASH_SALT`: salt for hashing IPs for abuse protection
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`: optional rate limiting store

## Deployment (Vercel)
1. Create a Postgres database (Neon or Supabase) and set `DATABASE_URL`.
2. Add required env vars in Vercel.
3. Ensure Payload routes run on Node runtime (already set in route handlers).
4. Run migrations during deployment:
   ```bash
   npm run payload:migrate
   ```

## Public API routes
- `POST /api/public/fingerprint` – ensures fingerprint cookie
- `POST /api/public/posts` – create a post
- `GET /api/public/posts` – list posts for a board
- `POST /api/public/votes` – add an anonymous vote
- `POST /api/public/posts/delete` – delete a post with token

## Notes
- No filesystem uploads; Payload uses Postgres only.
- Vote dedupe is enforced by a unique index on `(post, fingerprint)`.
