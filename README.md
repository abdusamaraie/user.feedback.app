# Feedback Board

Anonymous feedback board platform built with Next.js, Payload CMS, and PostgreSQL.

## Features

- Multi-app feedback boards with public browsing and filters.
- Anonymous submissions + upvoting with device fingerprint cookies.
- Payload admin dashboard for triage, tags, statuses, and pinned posts.
- Rate limiting with Upstash Redis (with in-memory fallback for local dev).

## Tech Stack

- Next.js App Router + TypeScript
- Payload CMS (admin at `/admin`)
- PostgreSQL (Neon/Supabase compatible)
- Tailwind CSS

## Local Development

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies and run dev:

```bash
npm install
npm run dev
```

3. Optional seed data:

```bash
npm run seed
```

## Public Endpoints

- `POST /api/public/fingerprint` – ensures fingerprint cookie
- `POST /api/public/posts` – submit feedback
- `POST /api/public/votes` – upvote (one per fingerprint per post)
- `POST /api/public/posts/delete` – delete with token
- `GET /api/public/posts?boardId=...` – list posts

## Vercel Deployment

1. Create a Postgres database (Neon/Supabase).
2. Set environment variables:
   - `DATABASE_URL`
   - `PAYLOAD_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
   - `IP_HASH_SALT`
   - `UPSTASH_REDIS_REST_URL` (optional)
   - `UPSTASH_REDIS_REST_TOKEN` (optional)
3. Deploy to Vercel. Payload routes are configured for the Node runtime.

## Notes

- File uploads are disabled. Posts are stored in PostgreSQL only.
- Votes are unique on `(post, fingerprint)` to prevent duplicates.

