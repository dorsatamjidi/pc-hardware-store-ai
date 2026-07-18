# Database Schema

Full model definitions live in [`prisma/schema.prisma`](../prisma/schema.prisma) — this
document explains the modeling decisions and the seeded dataset, not every field.

## Specs: JSON vs. typed columns

Two different things both look like "product specs," and they're deliberately stored
differently:

- **`Product.specs` (JSON)** — free-form, category-shaped *display* specs: CPU cache size,
  monitor panel type, keyboard switch type, etc. Shown on the product detail page's spec
  sheet and folded into the RAG embedding source text. Never queried structurally — the
  shape differs per `ProductType`, and `src/types/specs.ts` gives each type a real TS
  interface for the frontend to consume.
- **`ProductCompatibility` (typed 1:1 table)** — only the handful of fields the
  deterministic compatibility engine and structured search filters need to reason about
  *across* categories: socket, RAM type/speed, form factor, wattage, TDP, PCIe generation,
  drive interface, case clearances, etc. These are real typed/indexed columns, not JSON,
  because the compatibility engine and hybrid search need actual SQL predicates and
  enum-level correctness — parsing untyped JSON at runtime for the store's headline feature
  would be fragile.

Rejected alternatives: one Product table with every possible column (hundreds of mostly-null
columns across 16 categories) is unwieldy; a pure EAV model is slow and awkward to query.
Splitting "commerce/display data" from "compatibility contract data" keeps both sides simple.

## Shared enum vocabulary

`ProductType, CpuSocket, RamType, FormFactor, PcieVersion, DriveInterface, PsuEfficiency,
OrderStatus, UserRole, ChatRole` are defined once in `schema.prisma` and imported by the
seed generators, the compatibility engine, and catalog filters alike — there's no way for
the vocabulary used to seed data to drift from what the engine or search filters expect.

`ProductType` (engine-facing) is intentionally separate from `Category` (a browsable
taxonomy table with `slug`/`sortOrder`/optional `parentId` for future subcategories) — the
compatibility engine switches on `ProductType`, the storefront browses by `Category`.

## Embeddings (pgvector)

`ProductEmbedding.embedding` is `Unsupported("vector(384)")` — Prisma's schema DSL has no
native vector type, so this column is written/read exclusively via `$queryRaw`/`$executeRaw`
(see `src/server/ai/embeddings/embedding-client.ts` and `prisma/seed/embed.ts`). An HNSW
index (`vector_cosine_ops`) was added by hand in
`prisma/migrations/20260705195734_product_embedding_hnsw_index/migration.sql`, since Prisma's
schema syntax can't express pgvector index types. A `pg_trgm` GIN index on `Product.name`
*is* expressible directly in `schema.prisma` (`@@index([name(ops: raw("gin_trgm_ops"))], type: Gin)`)
and powers keyword/typeahead search.

Embeddings are generated locally via `transformers.js` (`Xenova/all-MiniLM-L6-v2`, 384
dimensions) rather than a hosted embeddings API — see `docs/ai-pipeline.md` (added in the AI
layer) for the reasoning.

## Why Prisma 6, not 7

See `docs/architecture.md` — in short, Prisma 7 requires Node 20.19+/22.12+/24+ and the
development machine runs 20.15.1, so Prisma 6.19.3 is used instead. It needs no driver
adapters or `prisma.config.ts` and fully supports everything above.

## Seeded dataset

`npm run db:seed` (`prisma/seed/index.ts`) populates:

| Table | Count | Notes |
| --- | --- | --- |
| Category | 16 | one per `ProductType` |
| Brand | 37 | real brand names; model numbers/specs/prices are synthetic-but-plausible (no real-store scraping) |
| User | 51 | 1 demo login (`demo@forgepc.dev` / `Password123!`) + 50 reviewer-only accounts |
| Product | 238 | see per-category counts below |
| Review | ~4,600 | 0–40 per product, rating distribution skewed positive (45% 5★, 33% 4★, 13% 3★, 6% 2★, 3% 1★) |
| ProductEmbedding | 238 | 1:1 with Product |

Per-category product counts: CPU 27, Motherboard 20, RAM 18, GPU 22, Storage 21, PSU 16,
Case 16, Cooler 16, Fan 10, Monitor 14, Keyboard 12, Mouse 12, Headset 10, Network Card 8,
Cable 10, Thermal Paste 6.

**Reproducibility**: the seed uses a seeded PRNG (`prisma/seed/generators/rng.ts`, mulberry32)
so `npm run db:seed` produces byte-identical stock levels, discounts, and review
content every run. The script is also idempotent — products/brands/categories/users are
upserted by their natural key (slug/email), and reviews/images are deleted and
deterministically recreated per product, so re-running the seed never duplicates rows.

**Curated vs. generated**: product names, brands, and base specs (`prisma/seed/data/products/*.ts`)
are hand-curated to be realistic (real brand names, real-pattern model numbers, internally
consistent generation-appropriate specs). Descriptions, stock levels, discounts, and reviews
are generated from that curated data (`prisma/seed/generators/*.ts`) — see
`docs/future-improvements.md` for the stated limitation that this is not scraped real-store
data.
