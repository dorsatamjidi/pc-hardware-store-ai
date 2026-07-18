# Architecture

Status: Layers 1–8 (scaffold, database schema + seed data, auth + account, product catalog,
cart + checkout + orders, reviews, AI layer, polish) complete.

## Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui.
- **Database**: PostgreSQL 16 with the `pgvector` extension (via Docker Compose), accessed
  through Prisma 6 (`prisma-client-js`, `postgresqlExtensions` preview feature).
- **Auth**: Auth.js (NextAuth) v5 (beta), Credentials provider + bcryptjs, JWT sessions.
  Deliberately **no Prisma Adapter** — the Adapter persists Account/Session/VerificationToken
  records for OAuth providers and database sessions, neither of which this app uses; the
  Credentials provider reads/writes the `User` table directly in `authorize()`
  (`src/lib/auth.ts`). Route protection uses `src/proxy.ts` (Next.js 16 renamed the
  `middleware.ts` convention to `proxy.ts`), guarding `/cart`, `/checkout`, `/orders`, and
  `/account/**`.
- **AI**: An OpenAI-compatible Chat Completions API (official `openai` SDK, pointed at
  `OPENAI_BASE_URL` — a gapgpt.app gateway by default, but swappable for OpenAI itself or any
  other compatible endpoint via env vars only) for generation/explanation, grounded via a RAG
  pipeline over the product catalog. Embeddings are generated locally (transformers.js,
  `Xenova/all-MiniLM-L6-v2`) rather than via a hosted embeddings API, so retrieval keeps
  working regardless of which chat provider/key is configured. The hardware compatibility
  engine is deterministic, hand-written rule code — the chat model only narrates its output
  in plain language, never decides compatibility itself.
- **Testing**: Vitest for both unit and integration tests (see below). No Playwright e2e —
  a deliberate scope call given the unit + integration + manual-verification coverage already
  in place; see `docs/future-improvements.md`.

## Testing

Two separate Vitest configs, run independently:

- **`npm test`** (`vitest.config.mts`) — unit tests only (`tests/unit/`), no I/O: compatibility
  engine rules, cart/order pricing, the budget allocator, the RAG context-builder, the
  embedding source-text builder. Plus `tests/ai/` — AI workflow tests with the OpenAI client
  mocked (`vi.mock`), asserting query-understanding extraction and, critically, that the
  compatibility/recommendation explainers **degrade gracefully and never hallucinate** when
  the LLM call fails or when a report contains only passing rules.
- **`npm run test:integration`** (`vitest.integration.config.mts`) — real Postgres, no mocks.
  A `globalSetup` (`tests/integration/setup/global-setup.ts`) creates a separate `pcstore_test`
  database on the same Docker container, runs the real Prisma migrations against it, and seeds
  a small deterministic fixture set (a couple of CPUs/motherboards/RAM with real compatibility
  data, one out-of-stock and one low-stock product). Tests then exercise the service layer
  directly (`searchProducts`, `addItem`/`placeOrder`, `createReview`, etc.) against that real
  database — filtering/sorting/pagination, stock-clamping, checkout's stock-decrement +
  cart-clear transaction, review rating-aggregate recomputation, and DB-level constraints
  (unique email). Service-layer rather than full HTTP-route tests, because several routes
  depend on Next.js's request-scoped `cookies()`/`auth()`, which isn't available outside an
  actual running server — the HTTP layer itself was exercised extensively via manual `curl`
  verification during each layer's development instead.

## Why Prisma 6, not 7

Prisma 7 requires Node 20.19+/22.12+/24+ and introduces a new required driver-adapter
architecture (`prisma.config.ts`, `@prisma/adapter-pg`, a new `prisma-client` generator).
The development machine runs Node 20.15.1, and Prisma 7's driver-adapter migration engine is
explicitly documented as unstable. Prisma 6.19.3 is mature, fully supports everything this
project needs (raw SQL for the `vector` column and HNSW index, the `postgresqlExtensions`
preview feature), and needs no extra configuration surface — the pragmatic choice for a
project that doesn't depend on any Prisma-7-only capability.

## Folder structure

```
prisma/            Prisma schema, migrations, seed scripts
src/app/           Next.js App Router routes (pages + API route handlers)
src/components/    UI components (ui/ = shadcn primitives; the rest are feature-grouped)
src/lib/           Cross-cutting utilities (env, prisma client, validation schemas)
src/server/        Server-only business logic (compatibility engine, AI/RAG, cart, orders...)
src/types/         Shared TypeScript types (e.g. per-category product spec shapes)
tests/             Vitest unit/integration/AI-workflow tests
docs/              This documentation
```

Further detail on the database schema, API surface, and AI pipeline is added as those
layers are implemented (see `docs/schema.md`, `docs/api.md`, `docs/ai-pipeline.md`).
