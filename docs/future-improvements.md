# Known Limitations & Future Improvements

Tracked as they come up; expanded further once the AI and polish layers land.

- **Synthetic catalog data**: brand names are real, but model numbers, exact specs, and
  prices are synthetic-but-plausible rather than scraped from real retailers (not feasible
  for an academic project). See `docs/schema.md`.
- **Storage-interface compatibility is simplified** to an interface-type/count check rather
  than full M.2 slot layout modeling.
- **No guest cart/checkout** — cart and checkout require login (scope reduction).
- **Flat-rate tax and shipping tiers**, not real geo-based calculation (checkout is
  simulated, not a real payment gateway, so this is intentionally approximate).
- **Reviews are not purchase-gated** — any authenticated user may review any product (one
  review per product, editable); `isVerifiedPurchase` is cosmetic, not enforced against
  order history.
- **Local embeddings, not a hosted model** — semantic search quality is bounded by
  `all-MiniLM-L6-v2` (384-dim); a hosted embeddings API (e.g. Voyage AI) would likely improve
  retrieval quality at the cost of a second paid API dependency.
- **No Playwright e2e suite** — the plan called this a stretch goal. Given the unit test
  suite (compatibility engine, pricing, budget allocator, RAG context assembly, AI-workflow
  resilience) and the integration suite (real Postgres, service-layer coverage of catalog,
  cart, checkout, reviews, auth constraints) already in place, plus every feature having been
  manually verified against a live running server during development, a browser-automation
  layer was judged lower-value than the effort to stand it up for a project already carrying
  substantial test coverage. Would be the natural next addition for golden-path regression
  coverage of full page flows (browse → cart → checkout, register → login, chat with sourced
  product cards, builder live-updating a compatibility badge).
- **PC Builder is single-product-per-slot** — the builder (and its API) treats each component
  slot as holding one product (with a quantity, e.g. 2x identical RAM kits), not a mix of
  different products of the same type in one build. Matches how most real PC-builder tools
  work and keeps the compatibility engine's input shape simple; mixing, e.g., two different
  storage drives of different models in one build isn't supported.
- **`preferences` only reaches the rationale, not product selection** — `POST
  /api/ai/recommend` accepts an optional free-text `preferences` field; it's surfaced to the
  LLM when writing the rationale (which is told not to claim the build was tailored to it),
  but the deterministic product selector doesn't parse it into concrete constraints (e.g.
  "quiet" → filter by fan-noise spec). Doing so would need a small extraction step similar to
  the chat assistant's query-understanding tool call.
