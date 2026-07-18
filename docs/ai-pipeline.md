# AI Pipeline

Five AI-adjacent features share the same underlying architecture: **deterministic code decides
facts, the LLM only narrates them.** None of the "does this fit" or "which product is best"
decisions are ever handed to the model to freely reason about from scratch — the model's job
is always to phrase an already-computed answer in natural language.

## LLM provider

An OpenAI-compatible Chat Completions API, via the official `openai` npm SDK
(`src/server/ai/openai-client.ts`), configured entirely through env vars:

```
OPENAI_API_KEY=...
OPENAI_BASE_URL=https://api.gapgpt.app/v1   # or api.openai.com, or any compatible gateway
OPENAI_MODEL=gpt-4o-mini
```

Because the abstraction is just "the OpenAI SDK pointed at a base URL," switching providers
(OpenAI itself, Azure OpenAI, a local vLLM/Ollama OpenAI-compatible server, etc.) never
requires touching application code — only these three env vars.

## Embeddings: local, not hosted

Semantic search runs on a **local, in-process model** (`transformers.js`,
`Xenova/all-MiniLM-L6-v2`, 384 dimensions — `src/server/ai/embeddings/embedding-client.ts`),
not a hosted embeddings API. This is deliberate: it keeps retrieval working regardless of
which chat provider/key is configured (or if it's misconfigured entirely), costs nothing, and
requires no network access. The tradeoff is retrieval quality is bounded by a small
384-dimension model rather than a larger hosted one — see `docs/future-improvements.md`.

Vectors are stored in Postgres via `pgvector` (`ProductEmbedding.embedding`,
`Unsupported("vector(384)")`, HNSW cosine index) and are generated once at seed time
(`prisma/seed/embed.ts`) — there's no re-embedding step in the request path.

## RAG shopping assistant (`/api/ai/chat`)

1. **Query understanding** (`src/server/ai/rag/query-understanding.ts`) — one OpenAI
   tool-calling round-trip (`extract_search_filters`) turns "a GPU for AI under $2000" into
   `{semanticQuery, type: "GPU", priceMax: 2000}`. If this call fails, it falls back to plain
   semantic search on the raw message rather than erroring the whole turn.
2. **Retrieval** (`src/server/ai/rag/retrieval.ts`) — embeds `semanticQuery` locally, then a
   single `$queryRaw` joins `ProductEmbedding` + `Product` + `Brand` + `Category`, applies the
   structured filters as real SQL `WHERE` clauses, and orders by cosine distance
   (`embedding <=> $vector`) using the HNSW index — hybrid search in one query, not
   vector-search-then-filter-in-JS.
3. **Generation** (`src/server/ai/rag/context-builder.ts`) — assembles a system prompt +
   formatted retrieved products (name, brand, price, stock, specs) + a sliding window of the
   last 6 turns + the new message, then streams the completion back to the client
   (`stream: true`, chunked as plain text; the client reads it via `ReadableStream`).
4. **Persistence** — both the user message and the full assembled assistant response are
   saved to `ChatMessage`, with the retrieved product ids stored in `metadata` for
   transparency (`{productIds: [...]}`).

Sessions are keyed by `userId` when logged in, or a random httpOnly cookie token when
anonymous (`src/lib/anonymous-session.ts`) — the same identity mechanism the PC Builder uses.

## Compatibility engine — deterministic, never LLM-decided

`src/server/compatibility/engine.ts` runs 11 pure rule functions
(`src/server/compatibility/rules/*.ts`) against whichever components are present in a
partial or complete build, aggregates into `COMPATIBLE | COMPATIBLE_WITH_WARNINGS |
INCOMPATIBLE`, and estimates wattage/total price. This has zero LLM involvement and is fully
unit-tested (`tests/unit/compatibility/`).

`/api/ai/compatibility/check` and the PC Builder's `suggest_next` action both call this
engine first, then optionally ask the LLM to phrase the result in plain language
(`src/server/ai/compat-explainer.ts`, `src/server/ai/builder/suggest-next.ts`). If that call
fails (bad key, network, rate limit), the deterministic `report` is still returned — tested
explicitly in `tests/ai/compat-explainer.test.ts`.

### A real bug this design caught: severity-label hallucination

Early in testing, the recommend endpoint's rationale said a build "has warnings regarding RAM
speed and PSU headroom" — but the actual compatibility report showed every single rule,
including the WARNING-severity ones, with `passed: true`. The model was pattern-matching on
the word "WARNING" in the JSON regardless of whether that rule had actually failed.

The fix wasn't a better prompt — it was **removing the ambiguity from the data itself**
(`src/server/ai/report-summary.ts`): before any report reaches the LLM, passing rules are
stripped out entirely. The model only ever sees an `issues` array containing rules that
*actually failed*; an empty array is unambiguous. This is a general lesson applied throughout
the AI layer: constrain what the model can possibly misread rather than relying solely on
prompt instructions to be followed correctly. Regression tests for this live in
`tests/unit/ai/report-summary.test.ts` and `tests/ai/compat-explainer.test.ts`.

## Recommendation engine (`/api/ai/recommend`)

1. **Budget allocation** (`src/server/ai/recommend/budget-allocator.ts`) — a pure function
   mapping `{useCase, budget}` to a dollar amount per component slot, from a fixed percentage
   table per use case (e.g. gaming skews GPU-heavy, a home server skews storage-heavy, an
   office PC needs almost no GPU budget at all). Fully unit-tested.
2. **Constructive selection** (`src/server/ai/recommend/product-selector.ts`) — picks CPU
   first, then motherboard *filtered by the CPU's socket*, then RAM *filtered by the
   motherboard's RAM type*, then GPU/storage on price alone, then a PSU sized with 20%
   wattage headroom over the CPU+GPU draw, then a case *filtered by the motherboard's form
   factor*, then a cooler *filtered by the CPU's socket*. Each slot is compatible with what
   came before by construction, not by chance — the deterministic engine is then run once
   over the result as a sanity check (and to compute total price/wattage), not to fix
   anything up.
3. **Rationale** — the LLM explains the choice in prose, grounded in the summarized
   (issues-only) compatibility report and the actual selected components/prices; falls back
   to a templated sentence if unconfigured or the call fails.

## PC Builder Assistant (`/api/ai/builder`)

State lives in `SavedBuild`/`BuildItem` (Postgres), not in chat memory — LLMs are unreliable
at maintaining structured state turn-to-turn, so every `add`/`remove`/`reset` action mutates
real rows and reruns the deterministic engine to produce the next state. The LLM is invoked
**only** on the explicit `suggest_next` action (cost control) to suggest which empty slot to
fill next, grounded in the same issues-only report summary as everywhere else.

## Explain endpoint (`/api/ai/explain`)

Two modes: a bare `{term}` (general hardware-term knowledge, e.g. "what is CAS latency?") or
`{productId, field}`, which grounds the explanation in that specific product's actual spec
value rather than answering generically. Used inline as popovers on the product detail page's
spec table.
