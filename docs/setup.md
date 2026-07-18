# Setup

## Prerequisites

- Node.js 20.x (see `.nvmrc`)
- Docker Desktop (for the local PostgreSQL + pgvector container)

## Steps

1. `cp .env.example .env` and fill in values (a working `DATABASE_URL` default is already
   provided to match `docker-compose.yml`; `OPENAI_API_KEY` is only needed for the AI
   features — chat assistant, recommendations, compatibility explanations).
2. `npm install`
3. `npm run docker:up` — starts Postgres 16 with the `pgvector` extension available.
4. `npm run db:migrate` — applies the Prisma schema (creates tables + the `vector`/`pg_trgm`
   extensions).
5. `npm run db:seed` — populates a realistic product catalog, reviews, and embeddings.
6. `npm run dev` — starts the app at http://localhost:3000.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Auth.js session config (added in the auth layer) |
| `OPENAI_API_KEY` | API key for the OpenAI-compatible chat endpoint (assistant/recommendations/compatibility explanations) |
| `OPENAI_BASE_URL` | Base URL of the OpenAI-compatible gateway (defaults to a gapgpt.app endpoint) |
| `OPENAI_MODEL` | Chat model name to request from that endpoint |
| `EMBEDDING_MODEL` | Local embedding model id used for pgvector semantic search |
