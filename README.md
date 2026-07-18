# ForgePC

An intelligent computer-hardware & PC-components e-commerce platform, built as a final-year
project. Combines a full product catalog, cart/checkout, and reviews with real AI features:
a RAG-grounded shopping assistant, use-case-based build recommendations, a PC Builder
Assistant, and a deterministic hardware-compatibility engine.

See [docs/setup.md](docs/setup.md) for full setup instructions,
[docs/architecture.md](docs/architecture.md) for the system design,
[docs/schema.md](docs/schema.md) for the database schema,
[docs/api.md](docs/api.md) for the full API reference, and
[docs/ai-pipeline.md](docs/ai-pipeline.md) for how the AI features work.

## Quickstart

```bash
cp .env.example .env        # fill in OPENAI_API_KEY to enable the AI features
npm install
npm run docker:up           # starts Postgres (pgvector) via Docker Compose
npm run db:migrate          # applies the Prisma schema
npm run db:seed             # seeds a realistic product catalog
npm run dev                 # http://localhost:3000
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` / `npm run start` | Production build / run |
| `npm run lint` / `npm run format` | ESLint / Prettier |
| `npm run docker:up` / `docker:down` | Start/stop the local Postgres container |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm test` / `test:watch` | Unit tests (pure functions, mocked LLM — no DB) |
| `npm run test:integration` | Integration tests against a real ephemeral Postgres database |
