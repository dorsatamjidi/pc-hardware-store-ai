# API Reference

All endpoints are Next.js App Router route handlers under `src/app/api/`. Request/response
bodies are JSON unless noted. Auth columns: **Public** (no session needed), **Auth**
(401 without a session), **Auth\*** (works for guests via an anonymous cookie identity,
enhanced when logged in).

## Auth

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | `{name, email, password}` → creates a `User` (bcrypt-hashed password). 409 on duplicate email. |
| * | `/api/auth/[...nextauth]` | — | Auth.js (NextAuth v5) Credentials provider: sign-in/out, session, CSRF. |

## Account

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/account/profile` | Auth | Current user's `{id, name, email, createdAt}`. |
| PATCH | `/api/account/profile` | Auth | `{name}` to rename, or `{currentPassword, newPassword}` to change password. |
| GET | `/api/account/addresses` | Auth | List addresses, default first. |
| POST | `/api/account/addresses` | Auth | Create an address; `isDefault: true` unsets any prior default. |
| PATCH | `/api/account/addresses/[id]` | Auth, owner | Partial update — omitted fields are left untouched (including `isDefault`). |
| DELETE | `/api/account/addresses/[id]` | Auth, owner | |

## Catalog

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/categories` | Public | Flat category list with `productCount`. |
| GET | `/api/brands` | Public | `?category=<slug>` restricts to brands with active products in that category. |
| GET | `/api/products` | Public | See query params below. |
| GET | `/api/products/[slug]` | Public | Full detail: images, specs, compatibility, rating breakdown, recent reviews. 404 if inactive/missing. |
| GET | `/api/products/compare?ids=a,b,c,d` | Public | Up to 4 products (by slug) + the union of their spec keys, in the requested order. |
| GET | `/api/search/suggest?q=` | Public | Typeahead (top 8), ranked by `pg_trgm` `similarity()`, not a plain scan. |

**`GET /api/products` query params**: `page`, `pageSize` (default 20, max 60), `category`
(slug), `brand` (comma-separated slugs), `type` (`ProductType`), `minPrice`, `maxPrice`, `q`
(keyword), `sort` (`price_asc | price_desc | newest | rating | popularity | featured`),
`inStockOnly`, plus compatibility filters `socketType`, `ramType`, `formFactor`,
`driveInterface`, `efficiencyRating`.

## Reviews

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/products/[slug]/reviews` | Public | `?page&pageSize` (default 5). |
| POST | `/api/products/[slug]/reviews` | Auth | `{rating, title, body}`. One per user per product (409 on repeat). `isVerifiedPurchase` is computed from order history, not enforced as a gate. |
| PATCH | `/api/reviews/[id]` | Auth, owner | Partial update; recomputes the product's `avgRating`/`reviewCount`. |
| DELETE | `/api/reviews/[id]` | Auth, owner or admin | Recomputes the aggregate afterward. |

## Cart

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/cart` | Auth | Line items priced at the *current* product price (not a stale snapshot), plus `hasIssues` if any item is now out of stock or discontinued. |
| POST | `/api/cart/items` | Auth | `{productId, quantity}`. Clamped to available stock. |
| PATCH | `/api/cart/items/[id]` | Auth, owner | `{quantity}` — `0` removes the item. |
| DELETE | `/api/cart/items/[id]` | Auth, owner | |
| DELETE | `/api/cart` | Auth | Clears the cart. |

## Checkout / Orders

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/checkout` | Auth | `{addressId}`. Validates stock, computes totals (flat 8.25% tax, free shipping ≥ $75 else $9.99), creates the `Order` + snapshotted `OrderItem`s, decrements stock, and clears the cart — all in one transaction. Simulated payment (no gateway). |
| GET | `/api/orders` | Auth | `?page&pageSize` (default 10), newest first. |
| GET | `/api/orders/[id]` | Auth, owner | Full detail incl. shipping-address snapshot. |

## AI

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/ai/chat` | Auth\* | `{message, sessionId?}` → **streams** plain text. Response header `X-Session-Id` carries the session id for follow-up turns. RAG-grounded (see `docs/ai-pipeline.md`). |
| GET | `/api/ai/chat/[sessionId]` | Auth\*, owner | Full message history for a session. |
| POST | `/api/ai/recommend` | Public | `{useCase, budget, preferences?}` → a constructively-compatible build + deterministic `report` + LLM rationale. `useCase` ∈ `gaming, office, ai_workstation, video_editing, programming, home_server`. |
| POST | `/api/ai/compatibility/check` | Public | `{cpu?, motherboard?, ram?, ramQuantity?, gpu?, psu?, case?, cooler?, storage?, storageQuantity?}` (product **ids**) → deterministic `report` (always present, even if the LLM call fails) + `explanation` (nullable). |
| POST | `/api/ai/builder` | Auth\* | `{buildId?, action, componentType?, productId?, quantity?}`, `action` ∈ `add | remove | reset | suggest_next`. First `add` without a `buildId` creates a new `SavedBuild`. One product per component slot (adding a new one replaces the old). `suggest_next` is the only action that calls the LLM. |
| GET | `/api/ai/builder/[buildId]` | Auth\*, owner | Current build state + live-recomputed compatibility report. |
| POST | `/api/ai/explain` | Public | `{term}` for a general hardware-term explanation, or `{productId, field}` to ground the explanation in a specific product's spec value. |

Anonymous ("Auth\*") identity is a random token in an httpOnly cookie
(`forgepc_anon_id`, see `src/lib/anonymous-session.ts`), shared between chat and the builder
so a guest's session/build persists across requests without an account.
