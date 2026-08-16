# Alona Aponchuk — Aponchuk Workflow Systems LLC

Next.js + Tailwind CSS consulting site with a lead-generation workflow assistant and invite-only admin panel.

## Stack

- Next.js (App Router)
- Tailwind CSS v4
- Auth.js (NextAuth v5) credentials
- Neon + Drizzle ORM
- OpenAI SDK
- Mailgun
- Telegram Bot API

## Getting started

```bash
npm install
cp .env.example .env.local
```

Fill in `DATABASE_URL`, `AUTH_SECRET`, Mailgun, OpenAI, and Telegram values. Then:

```bash
npm run db:push
npm run db:seed
npm run telegram:set-webhook
npm run dev
```

`db:seed` creates the first approved admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` and loads the approved knowledge base.

Open [http://localhost:3000](http://localhost:3000). Admin is at `/admin/login`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run db:push` — push Drizzle schema to Neon
- `npm run db:seed` — seed first admin + knowledge base
- `npm run telegram:set-webhook` — register the Telegram webhook
